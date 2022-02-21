interface Props {
  onChange: (text: string) => void;
}

const Editor: React.FC<Props> = ({ onChange }) => {
  return (
    <textarea
      className="editor"
      onChange={(event) => onChange(event.target.value)}
      placeholder="Sem napiš nebo vlož Markdown."
    />
  );
};

export default Editor;
