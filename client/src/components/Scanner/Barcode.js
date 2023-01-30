import React,{useState} from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

function App() {
  const [data, setData] = useState("Not Found");

  return (
    <>
      <BarcodeScannerComponent
        width={500}
        height={500}
        stopStream={false}
        onUpdate={(err, result) => {
          if (result) setData(result.text);
          else setData("Not Found");
        }}
      />
      <p>{data}</p>
    </>
  );
}

export default App;