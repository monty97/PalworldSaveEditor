import {useState} from "react";
import VanillaJSONEditor from "./components/VanillaJSONEditor";
import {Dropper} from "./components/Dropper";
import { faSave } from '@fortawesome/free-regular-svg-icons'
import {writeFile} from "./libs/save";

function App() {
  const [content, setContent] = useState({
    json: {},
    text: undefined
  });
  const [data, setData] = useState({});
  const [fileName, setFileName] = useState("");
  // const [version, setVersion] = useState(0);
  // const [timestamp, setTimestamp] = useState(0);


  const separator = {
    type: 'separator'
  }

  const customCopyButton = {
    type: 'button',
    onClick: async () => {
      const gvas = data.gvas;
      if (gvas && gvas.root) {
        if (content.json) {
          gvas.root.properties = {
            ...gvas.root.properties,
            ...content.json
          };
        } else if (content.text) {
          try {
            gvas.root.properties = {
              ...gvas.root.properties,
              ...JSON.parse(content.text)
            };
          } catch {
            alert("Invalid Content");
            return;
          }
        }
        await writeFile({
          magic: data.magic,
          saveType: data.saveType,
          gvas,
        }, data.fileName);
      } else {
        alert("Invalid Content")
      }
    },
    icon: faSave,
    title: 'Export Savefile',
  }

  const space = {
    type: 'space'
  }

  return (
    <Dropper
      setFile={
        (data) => {
          const {
            fileName,
            lenDecompressed,
            lenCompressed,
            magic,
            saveType,
            gvas
          } = data;

          const rootProps = {...gvas.root.properties};

          // setVersion(rootProps.Version.Int.value);
          // setTimestamp(rootProps.Timestamp.Struct.value);
          // delete rootProps.Version;
          // delete rootProps.Timestamp;


          setContent({ json: rootProps });
          setData(data);
          setFileName(fileName);
        }
      }
    >
      <div className="fullpage">
        <div className={`status-bar ${fileName? "" : " error"}`}>
          {
            fileName ? (
              <>
                <div>Palworld.TF: Editing {fileName}</div>
                <div className="space"></div>
                <div>{((data.lenDecompressed) / 1024).toFixed(1)}k decompressed, {((data.lenCompressed) / 1024).toFixed(1)}k compressed</div>
              </>
            ) : (
              <span>Palworld.TF: Drag a Palworld .sav file first</span>
            )
          }
        </div>
        <VanillaJSONEditor
          content={content}
          onChange={setContent}
          onRenderMenu={(items, context) => {
            return [customCopyButton, separator, ...items, space]
          }}
        />
        <div className={`status-bar small`}>
          made by ieb, based on uesave-rs
        </div>
      </div>
    </Dropper>
  );
}

export default App;
