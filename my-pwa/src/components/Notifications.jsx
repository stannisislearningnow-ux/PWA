import { useState } from "react";

function Notifications() {
  const [message, setMessage] = useState("");

  const sendNotification = async () => {
  const start = performance.now();

  const logTime = (step) => {
    console.log(
      `${step}: ${(performance.now() - start).toFixed(2)} ms`
    );
  };

  try {
    logTime("Started");

    if (!("Notification" in window)) {
      setMessage("Notifications are not supported.");
      return;
    }

    let permission = Notification.permission;
    logTime("Checked permission");

    if (permission === "default") {
      permission = await Notification.requestPermission();
      logTime("Permission requested");
    }

    if (permission !== "granted") {
      setMessage("Notification permission denied.");
      return;
    }

    const registration =
      await navigator.serviceWorker?.getRegistration();

    logTime("Service worker checked");

    if (registration?.active) {
      await registration.showNotification("Hello Doctor!", {
        body: "Your PWA notification is working!",
      });
    } else {
      new Notification("Hello Doctor!", {
        body: "Your PWA notification is working!",
      });
    }

    logTime("Notification sent");
    setMessage("Notification sent!");
  } catch (error) {
    console.error("Notification error:", error);
    setMessage("Error: " + error.message);
  }
};

  return (
    <div>
      <h2>Notifications</h2>

      <button onClick={sendNotification}>
        Send Notification
      </button>

      <p>{message}</p>
    </div>
  );
}

export default Notifications;