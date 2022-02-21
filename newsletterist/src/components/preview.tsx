import prettier from "prettier";
import parseHtml from "prettier/parser-html";

interface Props {
  html: string;
}

const Preview: React.FC<Props> = ({ html }) => {
  const formatted = prettier.format(html, {
    parser: "html",
    plugins: [parseHtml],
  });
  return <pre className="preview">{formatted}</pre>;
};

export default Preview;
