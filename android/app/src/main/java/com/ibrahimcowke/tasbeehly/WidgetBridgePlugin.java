package com.ibrahimcowke.tasbeehly;

import android.content.Context;
import android.content.SharedPreferences;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WidgetBridge")
public class WidgetBridgePlugin extends Plugin {

    @PluginMethod
    public void updateWidgetCount(PluginCall call) {
        Integer count = call.getInt("count", 0);
        String dhikr = call.getString("dhikr", "SubhanAllah");

        Context context = getContext();
        if (context != null) {
            SharedPreferences sharedPref = context.getSharedPreferences("TasbeehWidgetPref", Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();
            editor.putInt("currentCount", count);
            editor.putString("currentDhikr", dhikr);
            editor.apply();

            // Notify widget to update layout
            TasbeehWidgetProvider.updateWidget(context, count, dhikr);
            call.resolve();
        } else {
            call.reject("Android Context is null");
        }
    }
}
