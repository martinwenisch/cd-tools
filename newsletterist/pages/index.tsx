import { NextPage, GetStaticProps } from "next";
import { markdownToMJML, renderMJML } from "src/mjml";
import { readFileSync } from "fs";
import { join, resolve } from "path";
import Newsletterist from "src/newsletterist";

interface Props {
  contentStyles: string;
}

const Home: NextPage<Props> = ({ contentStyles }) => {
  const markdownToMjml = (markdown: string) =>
    renderMJML(markdownToMJML(markdown, contentStyles));
  return (
    <Newsletterist markdownToMjml={markdownToMjml} mjmlToHtml={mjmlToHtml} />
  );
};

async function mjmlToHtml(mjml: string): Promise<string> {
  const response = await fetch("/api/mjml", { method: "POST", body: mjml });
  return response.ok ? await response.text() : "MJML conversion failed :(";
}

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
