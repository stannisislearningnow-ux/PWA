
import { useRef, useState, useEffect } from "react";
import jsQR from "jsqr";

function Camera({ onQrScanned }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const hasScannedRef = useRef(false);

  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");

  // Stop camera
  const stopCamera = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStream(null);
  };

  // Scan QR codes using the existing camera
  const scanQRCode = () => {
    const video = videoRef.current;

    if (!video || !video.videoWidth || hasScannedRef.current) {
      animationRef.current = requestAnimationFrame(scanQRCode);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(
      0, 0, canvas.width, canvas.height
    );

    const result = jsQR(
      imageData.data,
      imageData.width,
      imageData.height
    );

    if (result) {
      let url;

      try {
        url = new URL(result.data);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid website URL");
        }
      } catch {
        setError("QR code does not contain a valid website URL.");
        animationRef.current = requestAnimationFrame(scanQRCode);
        return;
      }

      hasScannedRef.current = true;

      stopCamera();

      // Return the scanned URL to App.jsx
      onQrScanned?.(url.href);

      return;
    }

    animationRef.current = requestAnimationFrame(scanQRCode);
  };

  // Start camera
  const startCamera = async () => {
    try {
      setError("");
      if ("Notification" in window &&
        Notification.permission === "default") {
        await Notification.requestPermission();
      }
      hasScannedRef.current = false;

      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

      streamRef.current = mediaStream;
      videoRef.current.srcObject = mediaStream;

      await videoRef.current.play();

      setStream(mediaStream);

      scanQRCode();
    } catch (err) {
      setError("Cannot access camera: " + err.message);
      stopCamera();
    }
  };

  // Take photo
  const takePhoto = () => {
    const video = videoRef.current;

    if (!video || !video.videoWidth) return;

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0);

    setPhoto(canvas.toDataURL("image/png"));
  };

  // Clean up when component disappears
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <div>
      <h2>Camera & QR Scanner</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", maxWidth: "500px" }}
      />

      <div>
        <button onClick={startCamera} disabled={!!stream}>
          Start Camera
        </button>

        <button onClick={takePhoto} disabled={!stream}>
          Take Photo
        </button>

        <button onClick={stopCamera} disabled={!stream}>
          Stop Camera
        </button>
      </div>

      {error && <p>{error}</p>}

      {photo && (
        <div>
          <h3>Your Photo</h3>
          <img src={photo} alt="Captured" width="300" />
          <a href={photo} download="my-photo.png">
            Download Photo
          </a>
        </div>
      )}
    </div>
  );
}

export default Camera;
