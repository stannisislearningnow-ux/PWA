import { useEffect, useState } from "react";

function Notifications({ scannedUrl }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!scannedUrl) return;

    const sendNotification = () => {
      if (!("Notification" in window)) {
        setMessage("Notifications are not supported.");
        return;
      }

      if (Notification.permission !== "granted") {
        setMessage("Please allow notifications to receive scan alerts.");
        return;
      }

      const notification = new Notification(
        "QR code scanned successfully!",
        {
          body: `Website: ${scannedUrl}`,
        }
      );

      // Open the scanned website when notification is clicked
      notification.onclick = () => {
        window.open(scannedUrl, "_blank");
        notification.close();
      };

      setMessage("Notification sent!");
    };

    sendNotification();
  }, [scannedUrl]);

  return (
    <div>
      <h2>Notifications</h2>
      <p>{message}</p>
    </div>
  );
}

export default Notifications;