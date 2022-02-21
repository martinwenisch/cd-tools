import Editor from "src/editor";
import Preview from "src/preview";
import { useEffect, useState } from "react";

interface Props {
  markdownToMjml: (markdown: string) => string;
  mjmlToHtml: (mjml: string) => Promise<string>;
}

const Newsletterist: React.FC<Props> = ({ mjmlToHtml, markdownToMjml }) => {
  const [markdown, setMarkdown] = useState("");
  const [mjml, setMJML] = useState("");
  const [html, setHTML] = useState("");

  useEffect(() => {
    setMJML(markdownToMjml(markdown));
  }, [markdown, markdownToMjml]);

  useEffect(() => {
    mjmlToHtml(mjml).then(setHTML);
  }, [mjml, mjmlToHtml]);

  return (
    <div>
      <Editor onChange={setMarkdown} />
      <Preview html={html} mjml={mjml} />
    </div>
  );
};

export default Newsletterist;
