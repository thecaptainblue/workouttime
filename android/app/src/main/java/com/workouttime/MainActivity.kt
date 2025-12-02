package com.workouttime

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen // installSplashScreen nin calismasi icin gerekli

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "workouttime"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

    override fun onCreate(savedInstanceState: Bundle?) {
    supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
    // asagidaki kod rn0.73e yukselince calismadi halbuki ayni core surumunu kullaniyordum. bu yuzden bir alttaki satira gectim 
    // androidx.core.splashscreen.SplashScreen.installSplashScreen(this) // native splash screen which will be skipped
    installSplashScreen() // native splash screen which will be skipped
    org.devio.rn.splashscreen.SplashScreen.show(this, true) // custom splash screen from react-native-splash-screen library
    super.onCreate(savedInstanceState)
  }
}
