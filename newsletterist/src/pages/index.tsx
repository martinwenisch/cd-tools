import { NextPage, GetStaticProps } from "next";
import Editor from "src/components/editor";
import Preview from "src/components/preview";
import { useEffect, useState } from "react";
import { markdownToMJML, renderMJML } from "src/mjml";
import { readFileSync } from "fs";
import { join, resolve } from "path";

interface Props {
  contentStyles: string;
}

const Home: NextPage<Props> = ({ contentStyles }) => {
  const [source, setSource] = useState("");
  const [mjml, setMJML] = useState("");
  const [html, setHTML] = useState("");

  useEffect(() => {
    const toMJML = (source: string) =>
      renderMJML(markdownToMJML(source, contentStyles));
    setMJML(toMJML(source));
  }, [source, contentStyles]);

  useEffect(() => {
    async function updateHTMLPreview() {
      const response = await fetch("/api/mjml", { method: "POST", body: mjml });
      const html = response.ok
        ? await response.text()
        : "MJML conversion failed :(";
      setHTML(html);
    }
    updateHTMLPreview();
  }, [mjml]);

  return (
    <div>
      <Editor onChange={setSource} />
      <Preview html={html} mjml={mjml} />
    </div>
  );
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
