import Editor from "components/editor";

export default function Home() {
  return (
    <div>
      <Editor onChange={console.log} />
    </div>
  );
}
