import { NextPage, GetStaticProps } from "next";
import { readFileSync } from "fs";
import { join, resolve } from "path";
import Newsletterist from "src/newsletterist";

interface Props {
  contentStyles: string;
}

const Home: NextPage<Props> = ({ contentStyles }) => {
  return <Newsletterist contentStyles={contentStyles} />;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const stylePath = join(resolve(process.cwd()), "src/content.css");
  const contentStyles = readFileSync(stylePath, { encoding: "utf-8" });
  return {
    props: {
      contentStyles,
    },
  };
};

export default Home;
