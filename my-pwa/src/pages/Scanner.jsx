
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

function Scanner() {
  const scannerRef = useRef(null);
  const hasScannedRef = useRef(false);

  const [scanning, setScanning] = useState(false);
  const [scannedUrl, setScannedUrl] = useState("");
  const [message, setMessage] = useState("");

  const startScanner = async () => {
    try {
      setMessage("");
      setScannedUrl("");
      hasScannedRef.current = false;

      // Request notification permission first
      if ("Notification" in window) {
        if (Notification.permission === "default") {
          await Notification.requestPermission();
        }
      }

      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          if (hasScannedRef.current) return;

          let url;

          try {
            url = new URL(decodedText);

            if (!["http:", "https:"].includes(url.protocol)) {
              throw new Error("Invalid URL");
            }
          } catch {
            setMessage("This QR code does not contain a valid website URL.");
            return;
          }

          hasScannedRef.current = true;
          setScannedUrl(url.href);

          await scanner.stop();
          setScanning(false);

          if (Notification.permission === "granted") {
            const notification = new window.Notification(
              "QR code scanned successfully!",
              {
                body: url.href,
              }
            );

            notification.onclick = () => {
              window.open(url.href, "_blank");
              notification.close();
            };
          }

          setMessage("QR code scanned successfully!");
        }
      );

      setScanning(true);
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Could not start camera.");
    }
  };

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;

      if (scanner?.isScanning) {
        scanner.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div>
      <h1>QR Attendance Scanner</h1>

      <div
        id="qr-reader"
        style={{ width: "100%", maxWidth: "500px" }}
      />

      <button onClick={startScanner} disabled={scanning}>
        Start Scanner
      </button>

      {message && <p>{message}</p>}

      {scannedUrl && (
        <div>
          <h2>Scanned Website</h2>
          <a href={scannedUrl} target="_blank" rel="noreferrer">
            {scannedUrl}
          </a>
        </div>
      )}
    </div>
  );
}

export default Scanner;
