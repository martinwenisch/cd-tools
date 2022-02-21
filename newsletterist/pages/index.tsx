import { NextPage, GetStaticProps } from "next";
import Editor from "components/editor";
import Preview from "components/preview";
import { useState } from "react";
import { markdownToMJML, renderMJML } from "src/mjml";
import { readFileSync } from "fs";
import { join, resolve } from "path";

interface Props {
  contentStyles: string;
}

const Home: NextPage<Props> = ({ contentStyles }) => {
  const [source, setSource] = useState("");
  const toMJML = (source: string) =>
    renderMJML(markdownToMJML(source, contentStyles));
  return (
    <div>
      <Editor onChange={setSource} />
      <Preview html={toMJML(source)} />
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const stylePath = join(resolve(process.cwd()), "components/content.css");
  const contentStyles = readFileSync(stylePath, { encoding: "utf-8" });
  return {
    props: {
      contentStyles,
    },
  };
};

export default Home;
