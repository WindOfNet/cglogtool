import { useState } from "react";
import { Form } from "react-bootstrap";
import readCgLog from "../core/readCgLog";

const CgLogUploader = (props) => {
  const { onLoaded } = props;
  const [analysing, setAnalysing] = useState(false);

  return (
    <Form>
      <Form.Group>
        <Form.Label>上傳魔力寶貝 LOG (可多選)</Form.Label>
        <Form.Control
          id="upload"
          type="file"
          multiple
          accept=".txt"
          onChange={async (e) => {
            const result = [];
            try {
              setAnalysing(true);

              for (const file of e.target.files) {
                const text = await readCgLog(file);
                const resultInFile = [];

                for (const line of text.split("\n")) {
                  if (resultInFile.at(-1) === line) {
                    continue;
                  }
                  resultInFile.push(line);
                }
                result.push({ file: file.name, data: resultInFile });
              }

              onLoaded(result);
            } catch {
              alert("error ...");
            } finally {
              setAnalysing(false);
            }
          }}
        />
        {analysing && <Form.Text muted>檔案解析中 ...</Form.Text>}
      </Form.Group>
    </Form>
  );
};

export default CgLogUploader;
