
import { useRef, useState, useEffect } from "react";

function Camera() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");

  // Start camera
  const startCamera = async () => {
    try {
      setError("");

      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      setError("Cannot access camera: " + err.message);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      videoRef.current.srcObject = null;
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

  // Stop camera when component disappears
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <h2>Camera</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "100%", maxWidth: "500px" }}
      />

      <div>
        <button onClick={startCamera}>Start Camera</button>
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
          <img
            src={photo}
            alt="Captured"
            style={{ width: "100%", maxWidth: "500px" }}
          />
          <a href={photo} download="my-photo.png">
            Download Photo
          </a>
        </div>
      )}
    </div>
  );
}

export default Camera;
