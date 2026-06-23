# How to Run Tasbeehly on Android Mobile

You can run this application on your Android mobile device using two different methods:

---

## Method 1: Progressive Web App (PWA) over Wi-Fi (Recommended - Fastest & Easiest)

This method lets you run the application on your phone in full-screen mode without compiling native code or using Android Studio.

### Step 1: Start the Development Server
Open your terminal in the project directory and run the following command to expose the app to your local network:
```sh
npm run dev -- --host
```

### Step 2: Find Your Local IP Address
When the server starts, it will display a local network URL:
```text
  VITE v5.4.19  ready in 435 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://192.168.1.15:8080/  <-- Use your specific Network URL
```

### Step 3: Open on Your Android Device
1. Connect your Android device to the **same Wi-Fi network** as your computer.
2. Open **Google Chrome** (or your preferred browser) on your phone.
3. Type the **Network URL** (e.g., `http://192.168.1.15:8080/`) into the address bar.
4. The application should load.

### Step 4: Install as an App
1. In Chrome, tap the **three dots menu** (top right).
2. Tap **Add to Home screen** (or **Install app**).
3. Confirm by tapping **Add**.

🎉 **Result**: You now have a full-screen, offline-enabled app launcher icon for **Tasbeehly** on your home screen!

---

## Method 2: Native Android App (Capacitor)

If you want to build and run the actual native Android package (`.apk`) on your physical device or an emulator:

### Prerequisites
1. **Android Studio**: Ensure you have Android Studio installed.
2. **USB Debugging**: If using a physical device:
   - Go to **Settings > About phone** and tap **Build number** 7 times to enable Developer Options.
   - Go to **Settings > System > Developer options** and enable **USB debugging**.
   - Connect your device to your computer via USB.
3. **JDK 21**: The project requires Java 21 to build. Gradle is configured to use Android Studio's built-in Java package (`C:/Program Files/Android/Android Studio/jbr`).

### Step 1: Build the Web Assets
Ensure the web app has been built and the distribution files are ready:
```sh
npm run build
```

### Step 2: Sync Assets to the Android Project
Sync the web build and native plugins with the Android wrapper:
```sh
npx cap sync android
```

### Step 3: Open and Run via Android Studio
1. Open the project in Android Studio by running:
   ```sh
   npx cap open android
   ```
2. Android Studio will launch and open the `android` folder.
3. Wait for Gradle sync to complete.
4. In the top toolbar, select your connected Android device or emulator from the device dropdown list.
5. Click the green **Run** (Play) button to build and launch the app on your mobile device!

---

## Troubleshooting

### Java Compiler Initialisation Error (`invalid source release: 21`)
This occurs when the Gradle build uses an older version of Java (e.g., JDK 17). We have configured the project (`android/gradle.properties`) to use the built-in JDK 21 from Android Studio:
```properties
org.gradle.java.home=C:/Program Files/Android/Android Studio/jbr
```
Make sure your system environment variable `JAVA_HOME` is also set to a valid JDK 21 folder (such as the path above).

### App Can't Connect to Dev Server (PWA Method)
- Make sure both your PC and your phone are on the **exact same Wi-Fi network**.
- Check your Windows Firewall settings; you may need to allow "Node.js JavaScript Runtime" to receive incoming public/private connections.
