import { useState } from "react";
import Camera from "./components/Camera";
import Notifications from "./components/Notifications";

function App() {
  const [scannedUrl, setScannedUrl] = useState("");

  return (
    <div>
      <h1>QR Attendance</h1>

      <Camera onQrScanned={setScannedUrl} />

      <Notifications scannedUrl={scannedUrl} />

      {scannedUrl && (
        <p>
          Scanned website:{" "}
          <a href={scannedUrl} target="_blank" rel="noreferrer">
            {scannedUrl}
          </a>
        </p>
      )}
    </div>
  );
}

export default App;