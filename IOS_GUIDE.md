# How to Run Serene Tasbeeh on iPhone (Without Xcode)

You can convert this web application into a native-like iPhone app using **Progressive Web App (PWA)** technology. This allows you to install it on your home screen, run it offline, and have it look and feel like a standard iOS app.

## Prerequisites
1.  **Computer**: Windows PC (running this project).
2.  **iPhone**: Connected to the **same Wi-Fi network** as your PC.
3.  **Network**: Ensure your PC's firewall allows Node.js to accept incoming connections.

## Step 1: Start the Development Server
Open your terminal in the project directory and run the following command to expose the app to your local network:

```powershell
npm run dev -- --host
```

## Step 2: Find Your Local IP Address
When the server starts, you will see output similar to this:

```
  VITE v5.4.19  ready in 435 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://192.168.1.15:8080/  <-- Use this URL on your iPhone
```

Note the **Network** URL (e.g., `http://192.168.x.x:8080`).

## Step 3: Open on iPhone
1.  Unlock your iPhone.
2.  Open **Safari**.
3.  Type the **Network URL** from Step 2 into the address bar.
4.  The app should load.

## Step 4: Install as an App ("Convert" to App)
1.  Tap the **Share** button (box with an arrow pointing up) at the bottom of Safari.
2.  Scroll down and tap **Add to Home Screen**.
3.  You will see the App Icon and Name ("Tasbeeh").
4.  Tap **Add** in the top right corner.

## Result
You now have the **Tasbeeh** app on your iPhone home screen!
-   It opens without the Safari address bar (full screen).
-   It works offline (after first load).
-   It looks and feels like a native app.

## Troubleshooting
-   **Can't connect?** Check your Windows Firewall settings. You might need to allow "Node.js JavaScript Runtime" through the firewall.
-   **Icon missing?** Ensure you reloaded the page once before adding to home screen.
