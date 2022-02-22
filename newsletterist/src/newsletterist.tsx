import Editor from "src/editor";
import Preview from "src/preview";
import { markdownToMJML, renderMJML } from "src/mjml";
import { useEffect, useRef, useState } from "react";

interface Props {
  contentStyles?: string;
}

const Newsletterist: React.FC<Props> = ({ contentStyles }) => {
  const [markdown, setMarkdown] = useState("");
  const [mjml, setMjml] = useState("");
  const [html, setHtml] = useState("");

  // Since converting MJML to HTML has to be done through an API, it’s quite slow
  // and we can’t do it on the UI thread as it would get blocked and jerky. Here we
  // spawn a web worker to do the conversion in a background thread.
  const workerRef = useRef<Worker>();
  useEffect(() => {
    workerRef.current = new Worker(new URL("worker.js", import.meta.url));
    workerRef.current.onmessage = (event) => setHtml(event.data);
    // Don’t forger to clean up the worker when the component disappears
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    const markdownToMjml = (markdown: string) =>
      renderMJML(markdownToMJML(markdown, contentStyles));
    setMjml(markdownToMjml(markdown));
  }, [markdown, contentStyles]);

  useEffect(() => {
    workerRef.current?.postMessage(mjml);
  }, [mjml]);

  return (
    <div>
      <Editor onChange={setMarkdown} />
      <Preview html={html} mjml={mjml} />
    </div>
  );
};

export default Newsletterist;
