#Author: Česko.Digital Contact: davidneudecker@gmail.com

# for install Request-HTML use command: pip install requests-html
from requests_html import HTMLSession
import json
import csv
import pathlib

# set Google cloud Api_key. For C.D. api_key contact @karmi
api_key = ""
# set names of places which should be searched
places_names = ["charita", "červený kříž", "armáda spásy", "materiální sbírka", "humanitární pomoc"]
file_name = "outcome.csv"
# Set parameters for detail of the places to be recorded,
# for more info: https://developers.google.com/maps/documentation/places/web-service/details
parameters = ["name", "formatted_phone_number", "website", "formatted_address", "opening_hours"]

# places where to search. Current list Czechia divison + Prague admin areas (1-22)
# Current list source:   https://cs.wikipedia.org/wiki/Administrativn%C3%AD_dělen%C3%AD_Prahy
# Disclaimer: google places Api returns only 20 result per request, this should be consider when defining places granularity
places = ["Okres Benešov", "Okres Beroun", "Okres Blansko", "Okres Brno-město", "Okres Brno-venkov", "Okres Bruntál",
          "Okres Břeclav", "Okres Česká Lípa", "Okres České Budějovice", "Okres Český Krumlov", "Okres Děčín",
          "Okres Domažlice", "Okres Frýdek-Místek", "Okres Havlíčkův Brod", "Okres Hodonín", "Okres Hradec Králové",
          "Okres Cheb", "Okres Chomutov", "Okres Chrudim", "Okres Jablonec nad Nisou", "Okres Jeseník", "Okres Jičín",
          "Okres Jihlava", "Okres Jindřichův Hradec", "Okres Karlovy Vary", "Okres Karviná", "Okres Kladno",
          "Okres Klatovy", "Okres Kolín", "Okres Kroměříž", "Okres Kutná Hora", "Okres Liberec", "Okres Litoměřice",
          "Okres Louny", "Okres Mělník", "Okres Mladá Boleslav", "Okres Most", "Okres Náchod", "Okres Nový Jičín",
          "Okres Nymburk", "Okres Olomouc", "Okres Opava", "Okres Ostrava-město", "Okres Pardubice", "Okres Pelhřimov",
          "Okres Písek", "Okres Plzeň-jih", "Okres Plzeň-město", "Okres Plzeň-sever", "Hlavní město Praha",
          "Okres Praha-východ", "Okres Praha-západ", "Okres Prachatice", "Okres Prostějov", "Okres Přerov",
          "Okres Příbram", "Okres Rakovník", "Okres Rokycany", "Okres Rychnov nad Kněžnou", "Okres Semily",
          "Okres Sokolov", "Okres Strakonice", "Okres Svitavy", "Okres Šumperk", "Okres Tábor", "Okres Tachov",
          "Okres Teplice", "Okres Trutnov", "Okres Třebíč", "Okres Uherské Hradiště", "Okres Ústí nad Labem",
          "Okres Ústí nad Orlicí", "Okres Vsetín", "Okres Vyškov", "Okres Zlín", "Okres Znojmo",
          "Okres Ždář nad sázavou", "Praha 1", "Praha 2", "Praha 3", "Praha 4", "Praha 5", "Praha 6",
          "Praha 7", "Praha 8", "Praha 9", "Praha 10", "Praha 11", "Praha 12", "Praha 13", "Praha 14", "Praha 15",
          "Praha 16",
          "Praha 17", "Praha 18", "Praha 19", "Praha 20", "Praha 21", "Praha 22"]


def get_request_data(request):
    session = HTMLSession()
    request = session.get(request)
    return request.content

def get_place_details(ids):
    # init list of stored details
    details_list = []
    # prepare request url with all given parameters
    request_url = "https://maps.googleapis.com/maps/api/place/details/json?fields=name"
    for parameter in parameters:
        request_url = request_url + "%2C" + parameter
    # iterate through all id and get details of the place
    for unique_id in ids:
        request_url_full = request_url + "&place_id=" + unique_id + "&key=" + api_key
        try:
            data = get_request_data(request_url_full)
            json_data = json.loads(data)
            result = json_data["result"]
            record_dict = {}
            # iterate through all parameter and get value with relevant manipulation
            for parameter in parameters:
                if parameter in result:
                    if parameter == "name":
                        record_dict[parameter] = result["name"]
                        print("Requesting details of " + result["name"])
                    elif parameter == "opening_hours":
                        opening_hours = result[parameter]
                        days = ""
                        for day in opening_hours["weekday_text"]:
                            days = days + day + " , "
                        record_dict[parameter] = days
                    elif parameter == "formatted_address":
                        record_dict["formatted_address"] = result[parameter]
                        # HACK - hardcoded distribution of "formatted_address" to street , city and zipcode
                        address_list = result[parameter].split(',')
                        record_dict["street"] = address_list[0]
                        record_dict["zipcode"] = address_list[len(address_list)-2][0:7]
                        record_dict["city"] = address_list[len(address_list)-2][7:len(address_list[len(address_list)-2])]
                    else:
                        record_dict[parameter] = result[parameter]
                else:
                    record_dict[parameter] = "n/a"
            details_list.append(record_dict)

        except get_request_data.exceptions.RequestException as e:
            print("error:" + e)

    return details_list


def write_csv(details, parameters_in):
    # writing to csv file
    with open(file_name, 'w') as csvfile:
        # creating a csv writer object
        csv_writer = csv.writer(csvfile)
        # HACK - hardcoded distribution of "formatted_address" to street , city and zipcode
        if "formatted_address" in parameters_in:
            parameters_in.insert(parameters_in.index("formatted_address")+ 1, "zipcode")
            parameters_in.insert(parameters_in.index("formatted_address")+ 1, "city")
            parameters_in.insert(parameters_in.index("formatted_address")+ 1, "street")

        csv_writer.writerow(parameters_in)
        #itirate through all detais and create list for each row
        for detail in details:
            row = []
            for parameter in parameters_in:
               row.append(detail[parameter])
            csv_writer.writerow(row)
        csvfile.close()
        print("Saved  in " + file_name + " in " + str(pathlib.Path().absolute()))


def search_all(places_in, names_in):
    # int hashset to store unique id places (to avoid duplication)
    set_ids = set()
    # iterate through all names and all places to get complete list
    for name in names_in:
        for place in places_in:
            print("Searching name " + name + " in " + place)
            # create request and get data in json format (dirty)
            request_string = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="
            request_string = request_string + name + "+in+" + place + "&key=" + api_key
            data = get_request_data(request_string)
            json_data = json.loads(data)
            # iterate results and saves only which are not duplicated
            for result in json_data["results"]:
                if not result['place_id'] in set_ids:
                    set_ids.add(result['place_id'])
                    print(" Adding id of " + result['name'])
    return set_ids

if __name__ == '__main__':
    # get non duplicated ids for each place based on search through all place_names and places
    ids = search_all(places, places_names)
    # get details for each place id
    details = get_place_details(ids)
    # save details to csv
    write_csv(details, parameters)
