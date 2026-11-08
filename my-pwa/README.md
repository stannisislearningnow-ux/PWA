# QR Attendance PWA

This is the React + Vite QR attendance app. The production build uses a service worker to cache the app files so the installed app can open offline.

## 1. Install dependencies

Open a terminal in this `my-pwa` folder and run:

```bash
npm install
```

## 2. Build the production PWA

```bash
npm run build
```

This creates the `dist` folder. The service worker and web app manifest are generated during this step.

## 3. Preview the production build

```bash
npm run preview -- --host 0.0.0.0
```

Vite preview normally uses port `4173`. Keep this terminal running.

## 4. Open it on your phone for the first installation

On your computer, open a second terminal and run:

```bash
cloudflared tunnel --url http://localhost:4173
```

Open the HTTPS URL printed by Cloudflare on your phone. Keep internet access on for this first visit. Allow camera access when asked, then use the browser menu to install the app or add it to the home screen.

Wait for the page to finish loading. Reload it once while still online so the service worker can finish caching the app.

## 5. Test offline

1. Close the app.
2. Turn on airplane mode (or turn off both Wi-Fi and mobile data).
3. Open the installed app using its home-screen icon.
4. Tap **Start Camera** and allow camera access if asked.
5. Scan a QR code.

The app interface and QR decoding library are cached locally. The camera and QR decoding do not need internet after installation. Opening the website contained in a QR code still requires internet.

## Important notes

- You do not need to publish the app publicly. Cloudflare Tunnel is only used temporarily for the first HTTPS visit and installation.
- Do not use the Vite development server (`npm run dev`) for the offline test. Use the production build and preview server above.
- Keep the same Cloudflare HTTPS URL during the first install. A newly created Quick Tunnel URL is a different app origin.
- Camera access requires a secure context: HTTPS or localhost. The installed PWA keeps its HTTPS origin when opened offline.
- If the app is updated later, reconnect to the internet and open it once so the service worker can download the new version.
