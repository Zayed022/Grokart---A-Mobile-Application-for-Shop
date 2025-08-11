package com.grokartshop

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen // <-- add this import

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    try {
        SplashScreen.show(this, R.style.SplashTheme, true)
    } catch (e: Exception) {
        e.printStackTrace()
    }
    super.onCreate(null)
}

  override fun getMainComponentName(): String = "grokartshop"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
