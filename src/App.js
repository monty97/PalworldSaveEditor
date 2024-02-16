import {useState} from "react";
import {Dropper} from "./components/libs/Dropper";
import {formatSize} from "./libs/formatSize";
import {RawEditor} from "./components/RawEditor";

function App() {
  const [content, setContent] = useState({
    json: {},
    text: undefined
  });
  const [data, setData] = useState({});
  const [fileName, setFileName] = useState("");

  return (
    <Dropper
      setFile={
        (data) => {
          const {
            fileName,
            gvas
          } = data;
          const rootProps = {...gvas.root.properties};
          setContent({ json: rootProps });
          setData(data);
          setFileName(fileName);
        }
      }
    >
      <div className="fullpage">
        <div className={`status-bar ${fileName ? "" : " error"}`}>
          <div>Palworld.TF</div>
          {
            fileName ? (
              <>
                <div>Editing {fileName}</div>
                <div className="space"></div>
                <div>{formatSize(data.lenDecompressed)} decompressed, {formatSize(data.lenCompressed)} compressed</div>
              </>
            ) : (
              <>
                <div>Drag a Palworld .sav file first</div>
              </>
            )
          }
        </div>
        <RawEditor
          data={data}
          content={content}
          setContent={setContent}
        />
        
      </div>
    </Dropper>
  );
}

export default App;
