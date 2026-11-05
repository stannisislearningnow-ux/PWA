
const sendNotification = async () => {
  const start = performance.now();

  try {
    console.log("1. Button clicked");

    if (window.Notification.permission !== "granted") {
      setMessage("Notification permission is not granted.");
      return;
    }

    console.log("2. Getting Service Worker...");

    const registration =
      await navigator.serviceWorker.getRegistration();

    console.log(
      "3. Service Worker found:",
      performance.now() - start,
      "ms"
    );

    if (!registration?.active) {
      throw new Error("No active Service Worker!");
    }

    console.log("4. Showing notification...");

    await registration.showNotification("Hello Doctor!", {
      body: "Your PWA notification is working!",
      requireInteraction: false,
    });

    console.log(
      "5. Notification request completed:",
      performance.now() - start,
      "ms"
    );

    setMessage("Notification sent!");
  } catch (error) {
    console.error("Notification error:", error);
    setMessage("Error: " + error.message);
  }
};
