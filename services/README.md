## Ukázková serverless funkce

Jednoduchá prezentace serverless funkcí ve Vercelu, viz https://tools.cesko.dev/api/hello.

## Seznam uživatelů ve Slacku

Občas se nám hodí uložit seznam uživatelů v nějakém slackovém kanálu. Je na to funkce přímo ve Slacku (`/who` nebo Details → Members), ale výstupy z ní nejdou snadno uložit. Skript [list-users](https://tools.cesko.dev/list-users) tedy zobrazí seznam uživatelů ve vybraném kanálu ve formátu CSV, který lze pak snadno importovat třeba do Google Sheets nebo Excelu.

## Api.store proxy

Proxy pro https://www.api.store/, využito z www.nedluzimstatu.cz pro překlad adres na kontaktní údaje orgánů veřejné moci. Povolené dotazy jsou pro API `/spadovost` vč. povinného query string `kod_obce=123456` nebo `kod_momc=123456` a `/ovm/{id}` pro získání detailu úřadu.