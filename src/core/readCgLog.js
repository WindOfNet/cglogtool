import iconv from "iconv-lite";

const readCgLog = (file) =>
  new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => {
      const buffer = new Uint8Array(fr.result);
      resolve(iconv.decode(buffer, "big5"));
    };
    fr.readAsArrayBuffer(file);
  });

export default readCgLog;
