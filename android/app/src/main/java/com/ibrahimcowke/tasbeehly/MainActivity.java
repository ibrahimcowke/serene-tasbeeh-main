package com.ibrahimcowke.tasbeehly;

import android.os.Bundle;
import android.webkit.JavascriptInterface;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private boolean volumeButtonCounting = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Enable edge-to-edge display (drawing behind status bar and navigation bar)
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        // Add a Javascript interface to allow WebView to set the volumeButtonCounting flag
        getBridge().getWebView().post(new Runnable() {
            @Override
            public void run() {
                getBridge().getWebView().addJavascriptInterface(new Object() {
                    @JavascriptInterface
                    public void setVolumeButtonCounting(boolean enabled) {
                        volumeButtonCounting = enabled;
                    }
                }, "AndroidVolumeButtons");
            }
        });
    }

    @Override
    public boolean onKeyDown(int keyCode, android.view.KeyEvent event) {
        if (volumeButtonCounting) {
            if (keyCode == android.view.KeyEvent.KEYCODE_VOLUME_UP) {
                getBridge().triggerJSEvent("volumeUp", "window");
                return true; // intercept and prevent default (no system volume change)
            } else if (keyCode == android.view.KeyEvent.KEYCODE_VOLUME_DOWN) {
                getBridge().triggerJSEvent("volumeDown", "window");
                return true; // intercept and prevent default (no system volume change)
            }
        }
        return super.onKeyDown(keyCode, event);
    }
}
