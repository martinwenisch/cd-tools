import prettier from "prettier";
import parseHtml from "prettier/parser-html";
import { ChangeEvent, useState } from "react";
import Frame from "react-frame-component";

interface Props {
  html: string;
  mjml: string;
}

const tabs = [
  { id: "mjml", label: "MJML" },
  { id: "html", label: "HTML" },
  { id: "render", label: "vizuál" },
];

const Preview: React.FC<Props> = ({ html, mjml }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const handleTabClick = (event: ChangeEvent<HTMLInputElement>) =>
    setActiveTab(event.target.value);

  const format = (source: string) =>
    prettier.format(source, {
      parser: "html",
      plugins: [parseHtml],
    });

  const formattedHtml = format(html);
  const formattedMjml = format(mjml);

  return (
    <div className="preview">
      <div className="preview-controls">
        {tabs.map((tab) => (
          <span key={tab.id}>
            <input
              type="radio"
              value={tab.id}
              id={"tab-" + tab.id}
              checked={tab.id === activeTab}
              onChange={handleTabClick}
            />
            <label htmlFor={"tab-" + tab.id}>{tab.label}</label>
          </span>
        ))}
      </div>

      {activeTab === "html" && (
        <pre className="preview-pane preview-pane-html">{formattedHtml}</pre>
      )}
      {activeTab === "mjml" && (
        <pre className="preview-pane preview-pane-mjml">{formattedMjml}</pre>
      )}
      {activeTab === "render" && (
        <Frame
          className="preview-pane preview-pane-render"
          initialContent={html}
        />
      )}
    </div>
  );
};

export default Preview;
