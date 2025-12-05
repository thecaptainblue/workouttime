package com.workouttime

import android.content.ContentResolver
import android.content.ContentValues
import android.net.Uri
import android.os.Build
import android.provider.DocumentsContract
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.IOException
import java.io.OutputStream
import java.io.InputStream
import java.io.BufferedReader
import java.io.InputStreamReader
// import android.provider.MediaStore
import org.apache.commons.io.FileUtils
import java.io.File
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableNativeArray

class FileModule(reactContext:ReactApplicationContext):ReactContextBaseJavaModule(reactContext){

    private var MODULE_NAME: String = "FileModule"

    override fun getName():String{
        return MODULE_NAME
    }

    @ReactMethod
    fun writeToFile(contentUriString: String, fileName: String, content: String, promise: Promise) {
        try {
            // Parse the tree URI (directory URI) from the string
            val treeUri: Uri = Uri.parse(contentUriString)

            // Get the content resolver
            val resolver: ContentResolver = reactApplicationContext.contentResolver

            // Create a new file (document) inside the selected directory
            val documentUri: Uri? = createFile(resolver, treeUri, fileName)

            if (documentUri != null) {
                // Open an output stream to the new document URI and write the content
                resolver.openOutputStream(documentUri)?.use { outputStream ->
                    outputStream.write(content.toByteArray())
                    promise.resolve("File written successfully to $fileName!")
                } ?: run {
                    promise.reject("Error", "Failed to open output stream.")
                }
            } else {
                promise.reject("Error", "Failed to create document.")
            }
        } catch (e: IOException) {
            promise.reject("Error", "File write error: ${e.message}")
        } catch (e: Exception) {
            promise.reject("Error", e.toString())
        }
    }

        // Helper function to create a file (document) inside the selected directory
    private fun createFile(resolver: ContentResolver, treeUri: Uri, fileName: String): Uri? {
        val docUri = DocumentsContract.buildDocumentUriUsingTree(
            treeUri, DocumentsContract.getTreeDocumentId(treeUri)
        )

        val contentValues = ContentValues().apply {
            put(DocumentsContract.Document.COLUMN_DISPLAY_NAME, fileName)
            put(DocumentsContract.Document.COLUMN_MIME_TYPE, "text/plain") // You can change MIME type if needed
            // put(DocumentsContract.Document.COLUMN_MIME_TYPE, "application/octet-stream") // You can change MIME type if needed
        }

        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            DocumentsContract.createDocument(resolver, docUri, "text/plain", fileName)
        } else {
            null
        }
    }

    @ReactMethod
    fun readFromFile(contentUri: String, promise: Promise) {
        try {
            // Convert string to URI
            val uri = Uri.parse(contentUri)

            // Get content resolver
            val contentResolver: ContentResolver = reactApplicationContext.contentResolver

            // Open input stream from the content URI
            val inputStream: InputStream? = contentResolver.openInputStream(uri)

            if (inputStream != null) {
                // Read the input stream
                val reader = BufferedReader(InputStreamReader(inputStream))
                val stringBuilder = StringBuilder()
                var line: String?

                // Read the file line by line and append to the string builder
                while (reader.readLine().also { line = it } != null) {
                    stringBuilder.append(line)
                }

                reader.close()
                inputStream.close()

                // Resolve the promise with the content of the file
                promise.resolve(stringBuilder.toString())
            } else {
                promise.reject("FILE_NOT_FOUND", "The file could not be opened using the content URI")
            }

        } catch (e: Exception) {
            promise.reject("ERROR_READING_FILE", "Error while reading the file: ${e.message}")
        }
    }

    // @ReactMethod
    // fun getDownloadsDirectoryUri(promise: Promise) {
    //     try {
    //         // bu calismiyor
    //         // Use MediaStore API to get the content URI for the Downloads directory
    //         // val downloadsUri: Uri = MediaStore.Downloads.EXTERNAL_CONTENT_URI
    //         // Resolve the URI as a string to send it back to JavaScript
    //         // promise.resolve(downloadsUri.toString())

    //         //Storage Access Framework (SAF) uzerinden verildiginde kullanici izni gerekiyor
    //         val downloadsTreeUri: Uri = DocumentsContract.buildTreeDocumentUri(
    //             "com.android.externalstorage.documents", // Authority for external storage documents
    //             "primary:Download/Fer" // Path to the Downloads directory
    //         )
    //         // Resolve the URI as a string to send it back to JavaScript
    //         promise.resolve(downloadsTreeUri.toString())

    //     } catch (e: Exception) {
    //         // Handle any exceptions and reject the promise
    //         promise.reject("ERROR_GETTING_URI", "Failed to get Downloads directory URI", e)
    //     }
    // }
    
  @ReactMethod(isBlockingSynchronousMethod = true)
    fun copyFileSync(sourcePath: String, destPath: String): String {
        return try {
            val source = File(sourcePath)
            val destination = File(destPath)

            if (!source.exists()) {
                return "Source file does not exist"
            }

            FileUtils.copyFile(source, destination)
            "File copied successfully"
        } catch (e: Exception) {
            Log.e("FileCopy", "Error copying file", e)
            "Failed to copy file: ${e.message}"
        }
    }
    
    // test etmedim henuz
    // @ReactMethod(isBlockingSynchronousMethod = true)
    // fun readFileSync(filePath: String): String {
    //     return try {
    //         val file = File(filePath)

    //         if (!file.exists()) {
    //             "File does not exist"
    //         } else {
    //             file.readText(Charsets.UTF_8)
    //         }
    //     } catch (e: Exception) {
    //         Log.e("FileOperations", "Error reading file", e)
    //         "Error reading file: ${e.message}"
    //     }
    // }

    // @ReactMethod(isBlockingSynchronousMethod = true)
    // fun writeFileSync(filePath: String, content: String): String {
    //     return try {
    //         val file = File(filePath)

    //         // Create file and directories if they don't exist
    //         file.parentFile?.mkdirs()
    //         file.writeText(content, Charsets.UTF_8)

    //         "File written successfully"
    //     } catch (e: Exception) {
    //         Log.e("FileOperations", "Error writing file", e)
    //         "Error writing file: ${e.message}"
    //     }
    // }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun deleteFileSync(filePath: String): String {
        return try {
            val file = File(filePath)
            if (!file.exists()) {
                "File does not exist"
            } else {
                if (file.delete()) {
                    "File deleted successfully"
                } else {
                    "Failed to delete file"
                }
            }
        } catch (e: Exception) {
            Log.e("FileOperations", "Error deleting file", e)
            "Error deleting file: ${e.message}"
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun listFilesSync(directoryPath: String): WritableArray {
        val fileNamesArray = WritableNativeArray()
        return try {
            val directory = File(directoryPath)

            if (!directory.exists() || !directory.isDirectory) {
                // fileNamesArray.pushString("Invalid directory path")
            } else {
                directory.listFiles()?.forEach { file ->
                    if (file.isFile) {
                        fileNamesArray.pushString(file.name)
                    }
                }
            }
            fileNamesArray
        } catch (e: Exception) {
            Log.e("FileOperations", "Error listing files", e)
            fileNamesArray.pushString("Error: ${e.message}")
            fileNamesArray
        }
    }
}