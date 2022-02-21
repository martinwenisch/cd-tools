interface Props {
  onChange?: (text: string) => void;
}

const Editor: React.FC<Props> = ({ onChange }) => {
  return (
    <textarea
      className="editor"
      onChange={(event) => onChange && onChange(event.target.value)}
    />
  );
};

export default Editor;
