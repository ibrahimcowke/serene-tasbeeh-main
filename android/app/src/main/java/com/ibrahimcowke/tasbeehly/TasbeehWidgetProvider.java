package com.ibrahimcowke.tasbeehly;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class TasbeehWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        SharedPreferences sharedPref = context.getSharedPreferences("TasbeehWidgetPref", Context.MODE_PRIVATE);
        int count = sharedPref.getInt("currentCount", 0);
        String dhikr = sharedPref.getString("currentDhikr", "SubhanAllah");

        for (int appWidgetId : appWidgetIds) {
            updateWidgetInstance(context, appWidgetManager, appWidgetId, count, dhikr);
        }
    }

    public static void updateWidget(Context context, int count, String dhikr) {
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        ComponentName widgetComponent = new ComponentName(context, TasbeehWidgetProvider.class);
        int[] appWidgetIds = appWidgetManager.getAppWidgetIds(widgetComponent);
        
        for (int appWidgetId : appWidgetIds) {
            updateWidgetInstance(context, appWidgetManager, appWidgetId, count, dhikr);
        }
    }

    private static void updateWidgetInstance(Context context, AppWidgetManager appWidgetManager, int appWidgetId, int count, String dhikr) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.tasbeeh_widget);
        
        views.setTextViewText(R.id.widget_dhikr_title, dhikr);
        views.setTextViewText(R.id.widget_counter_text, String.valueOf(count));

        // Launch main activity when tapping the widget
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            context, 
            0, 
            intent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        
        views.setOnClickPendingIntent(R.id.widget_counter_text, pendingIntent);
        views.setOnClickPendingIntent(R.id.widget_dhikr_title, pendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
