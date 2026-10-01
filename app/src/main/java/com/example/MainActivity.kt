package com.example

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.print.PrintAttributes
import android.print.PrintManager
import android.view.ViewGroup
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {

  private var fileChooserCallback: ValueCallback<Array<Uri>>? = null

  private val fileChooserLauncher =
    registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
      val callback = fileChooserCallback ?: return@registerForActivityResult
      val data = result.data
      var results: Array<Uri>? = null

      if (result.resultCode == RESULT_OK && data != null) {
        val dataString = data.dataString
        val clipData = data.clipData

        if (clipData != null) {
          results = Array(clipData.itemCount) { i -> clipData.getItemAt(i).uri }
        } else if (dataString != null) {
          results = arrayOf(Uri.parse(dataString))
        }
      }

      callback.onReceiveValue(results)
      fileChooserCallback = null
    }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()

    setContent {
      MyApplicationTheme {
        Surface(
          modifier = Modifier
            .fillMaxSize()
            .statusBarsPadding()
            .navigationBarsPadding(),
          color = Color(0xFF0F172A)
        ) {
          DocMasterWebViewScreen()
        }
      }
    }
  }

  @SuppressLint("SetJavaScriptEnabled")
  @Composable
  fun DocMasterWebViewScreen() {
    var webViewInstance by remember { mutableStateOf<WebView?>(null) }

    BackHandler(enabled = webViewInstance?.canGoBack() == true) {
      webViewInstance?.goBack()
    }

    AndroidView(
      modifier = Modifier.fillMaxSize(),
      factory = { ctx ->
        WebView(ctx).apply {
          layoutParams = ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
          )

          settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            loadWithOverviewMode = true
            useWideViewPort = true
            setSupportZoom(true)
            builtInZoomControls = true
            displayZoomControls = false
            cacheMode = WebSettings.LOAD_DEFAULT
          }

          webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
              return false
            }
          }

          webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
              webView: WebView?,
              filePathCallback: ValueCallback<Array<Uri>>?,
              fileChooserParams: FileChooserParams?
            ): Boolean {
              fileChooserCallback?.onReceiveValue(null)
              fileChooserCallback = filePathCallback

              val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                type = "*/*"
                addCategory(Intent.CATEGORY_OPENABLE)
              }

              try {
                fileChooserLauncher.launch(intent)
              } catch (e: Exception) {
                fileChooserCallback = null
                return false
              }
              return true
            }
          }

          addJavascriptInterface(
            DocMasterBridge(this@MainActivity, this),
            "AndroidBridge"
          )

          loadUrl("file:///android_asset/www/index.html")
          webViewInstance = this
        }
      },
      update = { webViewInstance = it }
    )
  }

  inner class DocMasterBridge(
    private val context: Context,
    private val webView: WebView
  ) {
    @JavascriptInterface
    fun printDocument(title: String, html: String) {
      runOnUiThread {
        val printManager = context.getSystemService(Context.PRINT_SERVICE) as? PrintManager
        val jobName = "DocMaster - $title"
        val printAdapter = webView.createPrintDocumentAdapter(jobName)
        printManager?.print(jobName, printAdapter, PrintAttributes.Builder().build())
      }
    }
  }
}
