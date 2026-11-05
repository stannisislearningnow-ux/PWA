
import Camera from "./components/Camera.jsx";
import Notification from "./components/Notifications.jsx";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>My PWA Application</h1>

      <hr />

      <Camera />

      <hr />

      <Notification />
    </div>
  );
}

export default App;
