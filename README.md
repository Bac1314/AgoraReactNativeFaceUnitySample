# Agora Video Call with FaceUnity Integration

A React Native application demonstrating real-time video calling using Agora SDK with FaceUnity beauty filters and AR effects.

## Demo

🎥 **[Watch Demo Video](https://youtube.com/shorts/O-12ZylsbDs?feature=share)**

## Features

- **Real-time Video Calling**: Powered by Agora RTC Engine
- **Beauty Filters**: FaceUnity beauty effects (skin smoothing, whitening, face thinning)
- **AR Stickers**: Interactive AR stickers and effects
- **Cross-platform**: Supports both iOS and Android
- **Permission Management**: Camera and microphone permissions handling

## Prerequisites

Before running this project, ensure you have:

1. **Node.js** (>= 20.0.0)
2. **React Native CLI** or **Expo CLI**
3. **Android Studio** (for Android development)
4. **Xcode** (for iOS development, macOS only)
5. **CocoaPods** (for iOS dependencies)

## Installation

### 1. Clone and Setup

```bash
git clone <repository-url>
cd AgoraVideoCall
npm install
```

### 2. iOS Setup

```bash
# Install CocoaPods dependencies
cd ios
pod install
cd ..
```

## Configuration

### 1. Agora Configuration

1. Sign up at [Agora Console](https://console.agora.io/)
2. Create a new project and get your App ID
3. Update `App.tsx`:

```typescript
const appId = 'YOUR_AGORA_APP_ID'; // Replace with your Agora App ID
const channelName = 'your_channel_name'; // Set your channel name
const token = 'YOUR_TOKEN'; // Optional: Add token for production
```

### 2. FaceUnity Configuration

The project includes FaceUnity SDK integration:

- **iOS**: FaceUnity frameworks are located in `ios/FaceUnityFiles/` (If you are adding your own FaceUnity resources and frameworks, make sure to add it directly to Xcode > xcworkspace )
- **Android**: FaceUnity resources are in `android/app/src/main/assets/` and the native library AAR in `android/libs/`
- **Authentication**: Update the `FACEUNITY_AUTHPACK` array in `App.tsx` with your FaceUnity license

#### Android-Specific Requirements

**CRITICAL**: For Android, the FaceUnity extension must be explicitly loaded:

```typescript
// In App.tsx - Required for Android only
if (Platform.OS === 'android') {
  const result = await agoraEngine.loadExtensionProvider('AgoraFaceUnityExtension');
  console.log('Android FaceUnity extension load result:', result);
}
```

This step is essential - without `loadExtensionProvider()`, Android will return error code -3 (extension not found).

> **⚠️ IMPORTANT**: 
> - FaceUnity licenses are tied to specific package names/bundle IDs. You MUST update your app's package/bundle ID to match your FaceUnity license before the SDK will work.
> - Android requires the `android/libs/` folder with the FaceUnity AAR file
> - Android requires explicit `loadExtensionProvider()` call before using FaceUnity features

### 3. Update Package Name/Bundle ID

**For Android:**
1. Open `android/app/build.gradle`
2. Update the `applicationId` and `namespace`:
```gradle
android {
    namespace "com.yourcompany.yourapp"  // Change this
    defaultConfig {
        applicationId "com.yourcompany.yourapp"  // Change this
        // ... other configs
    }
}
```

**For iOS:**
1. Open `ios/AgoraVideoCall.xcworkspace` in Xcode
2. Select your project target
3. Under "Signing & Capabilities", update the Bundle Identifier
4. Or update directly in `ios/AgoraVideoCall.xcodeproj/project.pbxproj`

**For React Native:**
1. Update `package.json` name field (optional but recommended)
2. Update `app.json` name field if you're using it

> **Note**: You need a valid FaceUnity license to use the beauty and AR features. Contact FaceUnity for licensing information and ensure your license matches your app's package/bundle ID.

## File Structure

```
├── App.tsx                 # Main application component
├── utils/                  # Utility functions
│   ├── index.ts           # Resource path utilities & asset copying for Android
│   ├── log.ts             # (not used) Logging utilities
│   └── permissions.ts     # (not used)Permission handling
├── ios/
│   └── FaceUnityFiles/    # FaceUnity iOS frameworks and resources (If you are adding your own FaceUnity resources and frameworks, make sure to add it directly to Xcode > xcworkspace)
├── android/
│   ├── libs/              # FaceUnity AAR library (extension_aar-release.aar)
│   └── app/src/main/assets/ # FaceUnity Android resources (bundles, models, etc.)
```

## Running the Application

### Start Metro Bundle

```bash
npm start
```

### Run on iOS

```bash
# Method 1: CLI
npm run ios

# Method 2: Xcode
# Open ios/AgoraVideoCall.xcworkspace in Xcode and build
```

### Run on Android

```bash
# Method 1: CLI  
npm run android

# Method 2: Android Studio
# Open android/ folder in Android Studio and build
```

## Usage

1. **Join Channel**: Tap "Join" to connect to the video call
2. **Beauty Effects**: Toggle beauty filters on/off
3. **AR Stickers**: Enable/disable AR stickers
4. **Leave Channel**: Tap "Leave" to disconnect

## Key Components

### App.tsx Features

- **Video Engine Setup**: Initializes Agora RTC engine
- **FaceUnity Integration**: Loads and manages FaceUnity resources
- **Permission Handling**: Requests camera/microphone permissions
- **UI Controls**: Beauty and sticker toggle buttons

### FaceUnity Resources

- **Beauty Effects**: `face_beautification.bundle`
- **AR Models**: AI face/hand/human processing bundles
- **Stickers**: Various AR sticker effects
- **Makeup**: Comprehensive makeup filter system

## Troubleshooting

### Common Issues

**1. FaceUnity Not Loading (Android)**
- **Error -3**: Extension not found
  - Ensure `extension_aar-release.aar` is in `android/libs/` folder
  - Verify `loadExtensionProvider('AgoraFaceUnityExtension')` is called before using FaceUnity
  - Check that your FaceUnity license matches the app's `applicationId`
- **Error -1**: AI model loading failed
  - Check that FaceUnity assets are properly copied from APK to device storage
  - Verify the `getAbsolutePath()` function in `utils/index.ts` is working correctly

**2. FaceUnity Not Loading (General)**
- Verify your FaceUnity license is valid and not expired
- Check that all bundle files are properly included in your app bundle
- Ensure package/bundle ID matches your FaceUnity license
- Review console logs for specific error messages

**3. Video Not Showing**
- Ensure camera permissions are granted
- Check if Agora App ID is correctly configured
- Verify network connectivity

**4. iOS Build Errors**
- Run `cd ios && pod install` to update dependencies
- Clean build folder: `cd ios && xcodebuild clean`

**5. Android Build Errors**
- **AAR not found**: Ensure `android/libs/` folder exists with the FaceUnity AAR
- **Gradle sync issues**: Check `android/build.gradle` has correct `flatDir` repository configuration
- Clean gradle cache: `cd android && ./gradlew clean`
- Ensure Android SDK tools are up to date

### Android-Specific Troubleshooting

**Missing FaceUnity AAR Library**:
```bash
# Verify the AAR file exists
ls -la android/libs/extension_aar-release.aar
```

**Gradle Configuration Issues**:
Check these files have correct configuration:
- `android/build.gradle` - should have `flatDir` repository pointing to `rootProject.file('libs')`
- `android/app/build.gradle` - should have the AAR dependency declared

**Asset Copying Issues**:
FaceUnity requires assets to be copied from APK to device storage on Android. Check logs for:
```
Copying asset: model/ai_face_processor.bundle to /storage/...
Successfully copied: model/ai_face_processor.bundle
```

### Debugging

Enable debug logs by checking console output. The app uses prefixed logging:
- `Bacs` prefix for general app logs
- Look for FaceUnity-specific errors in native logs
- Success logs show: `Bacs FaceUnity Ready!` when all components load successfully
- Android logs: Use `adb logcat | grep ReactNativeJS` to see React Native console logs

## Dependencies

### Core Dependencies
- `react-native-agora`: Agora RTC SDK
- `react-native-safe-area-context`: Safe area handling
- `react-native-fs`: File system access
- `react-native-permissions`: Permission management

### Native Dependencies
- **iOS**: FaceUnity frameworks, Agora iOS SDK
- **Android**: FaceUnity libraries, Agora Android SDK

## Development

### Code Structure
- **State Management**: Uses React hooks (useState, useRef, useEffect)
- **Resource Management**: Utility functions for cross-platform file paths
- **Error Handling**: Comprehensive error handling for both Agora and FaceUnity

### Adding New Effects

1. Add effect bundles to appropriate platform folders
2. Update resource loading logic in `loadFaceUnityResources`
3. Add UI controls for new effects

## License

This project is for demonstration purposes. Please ensure you have proper licenses for:
- Agora SDK (check Agora pricing)
- FaceUnity SDK (contact FaceUnity for licensing)

## Support

- **Agora Documentation**: https://docs.agora.io/
- **FaceUnity Documentation**: Contact FaceUnity support
- **React Native**: https://reactnative.dev/docs/

## Important Integration Notes

### Android Integration Summary
1. **Required Files**:
   - `android/libs/extension_aar-release.aar` - FaceUnity native libraries
   - Assets in `android/app/src/main/assets/` - FaceUnity resources
   
2. **Required Code**:
   - `loadExtensionProvider('AgoraFaceUnityExtension')` - Must call on Android before using FaceUnity
   - Asset copying via `getAbsolutePath()` - Converts APK assets to absolute paths for FaceUnity

3. **Gradle Configuration**:
   - `flatDir` repository in `android/build.gradle`
   - AAR dependency in `android/app/build.gradle`


## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both iOS and Android (especially Android FaceUnity integration)
5. Submit a pull request

---

**Note**: You need a valid FaceUnity license to use the beauty and AR features. Contact FaceUnity for licensing information and ensure your license matches your app's package/bundle ID.
 