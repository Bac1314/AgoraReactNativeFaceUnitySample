import React, { useRef, useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcSurfaceView,
  RtcConnection,
  ExtensionContext,
} from 'react-native-agora';

import {getAbsolutePath } from './utils';

const appId = ''; 
const channelName = 'channel_bac';
const token = ''; 
const FACEUNITY_AUTHPACK = [10,13];

const App = () => {
  const agoraEngineRef = useRef<IRtcEngine | null>(null);
  const faceUnityInitializedRef = useRef(false);
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [message, setMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  
  // FaceUnity State
  const [faceUnityEnabled, setFaceUnityEnabled] = useState(false);
  const [faceUnityInitialized, setFaceUnityInitialized] = useState(false);
  const [isBeautyOn, setIsBeautyOn] = useState(false);
  const [beautyHandle, setBeautyHandle] = useState<string | undefined>();
  const [isStickerOn, setIsStickerOn] = useState(false);
  const [stickerHandle, setStickerHandle] = useState<string | undefined>();
  // const [stickerItemHandle, setStickerItemHandle] = useState<number | undefined>();

  useEffect(() => {
    setupVideoSDKEngine();
    return () => {

      console.log('Bacs Cleaning up Agora Engine...');
      // Clean up FaceUnity on unmount
      if (agoraEngineRef.current && faceUnityEnabled) {
        // Destroy sticker item if it exists
        if (stickerHandle) {
          agoraEngineRef.current.setExtensionProperty('FaceUnity', 'Effect', 'fuDestroyItem', 
            JSON.stringify({ item: stickerHandle }));
        }
        agoraEngineRef.current.setExtensionProperty('FaceUnity', 'Effect', 'fuDestroyLibData', '{}');
      }
      agoraEngineRef.current?.leaveChannel();
      agoraEngineRef.current?.release();
    };
  }, []);

  const setupVideoSDKEngine = async () => {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
      }

      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;

      // 1. Register Event Handlers
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: (_connection: RtcConnection, uid: number) => {
          setMessage(`✅ Successfully joined channel: ${channelName}`);
          setConnectionStatus('connected');
          setIsJoined(true);
        },
        onUserJoined: (_connection: RtcConnection, uid: number) => {
          setMessage(`👤 Remote user joined: ${uid}`);
          setRemoteUid(uid);
        },
        onUserOffline: (_connection: RtcConnection, uid: number) => {
          setMessage(`👋 Remote user left: ${uid}`);
          setRemoteUid(0);
        },
        // 2. FACEUNITY: Listen for extension start
        onExtensionStartedWithContext: (context: ExtensionContext) => {
          console.log('Bacs Extension Started:', context.providerName);
          if (context.providerName === 'FaceUnity' && context.extensionName === 'Effect') {
            console.log('Bacs FaceUnity extension started, initialized:', faceUnityInitializedRef.current);
            if (!faceUnityInitializedRef.current) {
              loadFaceUnityResources(agoraEngine);
            }
          }
        },
        onExtensionErrorWithContext: (context, error, msg) => {
           console.error('Bacs Extension Error:', error, msg);
        }
      });

      // 3. Initialize Engine
      agoraEngine.initialize({
        appId: appId,
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
      });


      if (Platform.OS === 'android') {
        // Load FaceUnity Extension Provider on Android 
        const result = await agoraEngine.loadExtensionProvider('AgoraFaceUnityExtension');
        console.log('Bacs Android FaceUnity extension loadExtension result:', result);
      }

      // 4. FACEUNITY: Enable Extension BEFORE enabling video
      console.log('Bacs Enabling FaceUnity...');
      const result = await agoraEngine.enableExtension('FaceUnity', 'Effect', true);

      if (result === 0) {
        console.log('Bacs FaceUnity extension enable request sent successfully');
        // Initialization will continue in onExtensionStarted callback
      } else {
        console.error('Bacs Failed to enable FaceUnity extension, error code:', result);
      }

      // 5. Enable Video and Start Preview
      agoraEngine.enableVideo();
      agoraEngine.startPreview();

    } catch (e) {
      console.error(e);
    }
  };

  const loadFaceUnityResources = async (engine: IRtcEngine) => {
    if (faceUnityInitializedRef.current) {
      console.log('Bacs FaceUnity resources already loaded, skipping...');
      return;
    }
    
    try {
      faceUnityInitializedRef.current = true;
      setFaceUnityInitialized(true);
      console.log('Bacs Loading FaceUnity Resources...');

      // 1. Setup Auth
      const setupResult = await engine.setExtensionProperty('FaceUnity', 'Effect', 'fuSetup', 
        JSON.stringify({ authdata: FACEUNITY_AUTHPACK })
      );

      if (setupResult !== 0) {
        console.error('Bacs FaceUnity setup failed with code:', setupResult);
        faceUnityInitializedRef.current = false;
        setFaceUnityInitialized(false);
        return;
      }else { 
        console.log('Bacs FaceUnity setup success with result:', setupResult);
      }

      // 2. Load AI Models
      // Note: Ensure these paths exist in your assets/model folder
      const models = [
        { name: 'ai_face_processor.bundle', type: 1 << 8 },
        { name: 'ai_hand_processor.bundle', type: 1 << 3 },
        { name: 'ai_human_processor.bundle', type: 1 << 9 },
      ];

      for (const model of models) {
        const absolutePath = Platform.OS === 'ios' ? await getAbsolutePath(model.name) : await getAbsolutePath(`model/${model.name}`);
        const loadResult = await engine.setExtensionProperty('FaceUnity', 'Effect', 'fuLoadAIModelFromPackage',
          JSON.stringify({ data: absolutePath, type: model.type })
        );

        if (loadResult !== 0) {
          console.error('Bacs FaceUnity fuLoadAIModelFromPackage ' + model.name + ' failed with code:', loadResult);
          faceUnityInitializedRef.current = false;
          setFaceUnityInitialized(false);
          return;
        }else { 
          console.log('Bacs FaceUnity fuLoadAIModelFromPackage ${model.name} success result:', loadResult);
        }
      }

      // 3. Create AI Type
      const aiTypePath = Platform.OS === 'ios' ? await getAbsolutePath('aitype.bundle') : await getAbsolutePath('others/aitype.bundle'); 
      const aiTypeResult = await engine.setExtensionProperty('FaceUnity', 'Effect', 'fuCreateItemFromPackage',
        JSON.stringify({ data: aiTypePath })
      );
      if (aiTypeResult !== 0) {
        console.error('Bacs FaceUnity load aitype failed with code:', aiTypeResult);
        faceUnityInitializedRef.current = false;
        setFaceUnityInitialized(false);
        return;
      }else { 
        console.log('Bacs FaceUnity load aitype success result:', aiTypeResult);
      }

      // 4. Load Beauty Item
      const beautyAbsolutePath = Platform.OS === 'ios' ? await getAbsolutePath('face_beautification.bundle') : await getAbsolutePath('graphics/face_beautification.bundle');
      const beautyResult = await engine.setExtensionProperty('FaceUnity', 'Effect', 'fuCreateItemFromPackage',
        JSON.stringify({ data: beautyAbsolutePath })
      );

      if (beautyResult !== 0) {
        console.error('Bacs FaceUnity load beauty failed with code:', beautyResult);
        faceUnityInitializedRef.current = false;
        setFaceUnityInitialized(false);
        return;
      }else { 
        console.log('Bacs FaceUnity load beauty success result:', beautyResult);
      }

      // // 5. Check if sticker exists ( no need to load, it will be loaded then you enable it)
      // const stickerFileName = Platform.OS === 'ios' ? 'cat_sparks.bundle' : 'effect/normal/cat_sparks.bundle'; // Using cat_sparks sticker from resources
      const stickerPath = Platform.OS === 'ios' ? await getAbsolutePath('cat_sparks.bundle') : await getAbsolutePath('effect/normal/cat_sparks.bundle'); // Using cat_sparks sticker from resources
      //await getAbsolutePath(stickerPath); // Pre-copy the asset to ensure it exists

      setFaceUnityEnabled(true);
      setBeautyHandle(beautyAbsolutePath);
      setStickerHandle(stickerPath);
      console.log('Bacs FaceUnity Ready!');
      

    } catch (e) {
      console.error('Bacs Failed to load FaceUnity resources', e);
      faceUnityInitializedRef.current = false;
      setFaceUnityInitialized(false);
    }
  };

  const toggleBeauty = async () => {
    if (!beautyHandle || !agoraEngineRef.current) return;
    
    const nextState = !isBeautyOn;
    const engine = agoraEngineRef.current;
    
    // Based on your file: Blur, Color, Cheek Thinning
    // Defaulting to "Level 5" settings
    const level = 5; 

    // 1. Blur (Skin Smoothing)
    engine.setExtensionProperty('FaceUnity', 'Effect', 'fuItemSetParam',
      JSON.stringify({
        obj_handle: beautyHandle,
        name: 'blur_level',
        value: nextState ? level : 0
      })
    );

    // 2. Color (Whitening)
    engine.setExtensionProperty('FaceUnity', 'Effect', 'fuItemSetParam',
        JSON.stringify({
          obj_handle: beautyHandle,
          name: 'color_level',
          value: nextState ? level * 0.3 : 0
        })
      );
    
    // 3. Cheek Thinning
    engine.setExtensionProperty('FaceUnity', 'Effect', 'fuItemSetParam',
        JSON.stringify({
          obj_handle: beautyHandle,
          name: 'cheek_thinning',
          value: nextState ? level * 0.2 : 0
        })
      );

    setIsBeautyOn(nextState);
  };

  const toggleSticker = async () => {
    if (!stickerHandle || !agoraEngineRef.current) return;
    
    const nextState = !isStickerOn;
    const engine = agoraEngineRef.current;
    
    if (nextState) {
      // Enable sticker 
      const stickerAbsolutePath = await getAbsolutePath(stickerHandle);
      const result = await engine.setExtensionProperty('FaceUnity', 'Effect', 'fuCreateItemFromPackage',
        JSON.stringify({
          data: stickerAbsolutePath
        })
      );
      console.log('Bacs Sticker enabled, result:', result);
    } else {
      // Disable sticker 
      const result = await engine.setExtensionProperty('FaceUnity', 'Effect', 'fuDestroyItem',
        JSON.stringify({
          item: stickerHandle
        })
      );
      console.log('Bacs Sticker disabled, result:', result);
    }

    setIsStickerOn(nextState);
  };

  const getStatusColor = (status: 'disconnected' | 'connecting' | 'connected') => {
    switch (status) {
      case 'disconnected': return '#ff4444';
      case 'connecting': return '#ffaa00';
      case 'connected': return '#44ff44';
      default: return '#888';
    }
  };

  const join = async () => {
    console.log("Bacs join Channel is faceUnityInitialized loaded:", faceUnityInitialized);
    if (isJoined) return;
    try {
      setConnectionStatus('connecting');
      setMessage('🔄 Connecting to channel...');
      agoraEngineRef.current?.setClientRole(ClientRoleType.ClientRoleBroadcaster);
      agoraEngineRef.current?.joinChannel(token, channelName, 0, {});
    } catch (e) {
      console.error(e);
      setConnectionStatus('disconnected');
      setMessage('❌ Failed to join channel');
    }
  };

  const leave = () => {
    try {
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      setConnectionStatus('disconnected');
      setMessage('👋 Left the channel');
    } catch (e) {
      console.error(e);
      setMessage('❌ Error leaving channel');
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.main} edges={['top', 'left', 'right']}>
        <Text style={styles.head}>Agora + FaceUnity</Text>
        
        {/* Connection Status Indicator */}
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(connectionStatus) }]}>
          <Text style={styles.statusText}>
            {connectionStatus === 'disconnected' && '🔴 Disconnected'}
            {connectionStatus === 'connecting' && '🟡 Connecting...'}
            {connectionStatus === 'connected' && '🟢 Connected'}
          </Text>
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity 
            onPress={join} 
            disabled={connectionStatus === 'connecting' || isJoined}
            style={[styles.button, { 
              backgroundColor: isJoined ? '#888' : '#0055cc',
              opacity: (connectionStatus === 'connecting' || isJoined) ? 0.6 : 1 
            }]}>
            <Text style={styles.btnText}>
              {connectionStatus === 'connecting' ? 'Joining...' : (isJoined ? 'Joined' : 'Join')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={leave} 
            disabled={!isJoined}
            style={[styles.button, { 
              backgroundColor: !isJoined ? '#888' : '#cc5500',
              opacity: !isJoined ? 0.6 : 1 
            }]}>
            <Text style={styles.btnText}>Leave</Text>
          </TouchableOpacity>
        </View>

        {/* Beauty Toggle Button */}
        <View style={styles.btnContainer}>
             <TouchableOpacity 
                onPress={toggleBeauty} 
                disabled={!faceUnityEnabled}
                style={[styles.button, { backgroundColor: isBeautyOn ? '#ff007f' : '#555' }]}
              >
            <Text style={styles.btnText}>
                {faceUnityEnabled ? (isBeautyOn ? "Beauty: ON" : "Beauty: OFF") : "Loading FU..."}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sticker Toggle Button */}
        <View style={styles.btnContainer}>
             <TouchableOpacity 
                onPress={toggleSticker} 
                disabled={!faceUnityEnabled}
                style={[styles.button, { backgroundColor: isStickerOn ? '#00ff7f' : '#555' }]}
              >
            <Text style={styles.btnText}>
                {faceUnityEnabled ? (isStickerOn ? "Sticker: ON" : "Sticker: OFF") : "Loading FU..."}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContainer}>
          {isJoined || true ? (
            <React.Fragment>
              <RtcSurfaceView canvas={{ uid: 0 }} style={styles.videoView} />
              <Text>Local User</Text>
              {remoteUid !== 0 ? (
                  <React.Fragment>
                    <RtcSurfaceView canvas={{ uid: remoteUid }} style={styles.videoView} />
                    <Text>Remote User</Text>
                  </React.Fragment>
              ) : null}
            </React.Fragment>
          ) : (
              <Text>Click 'Join' to start</Text>
          )}
          <View style={styles.messageContainer}>
            <Text style={[styles.info, { fontWeight: 'bold', fontSize: 16 }]}>{message}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, alignItems: 'center' },
  head: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  statusContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
    marginBottom: 15,
    minWidth: 150,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0055cc',
    margin: 5,
    borderRadius: 5,
  },
  btnText: { color: 'white', fontWeight: 'bold' },
  scroll: { width: '100%', flex: 1 },
  scrollContainer: { alignItems: 'center', paddingBottom: 20 },
  videoView: { width: 300, height: 300, borderWidth: 1, borderColor: 'gray' },
  messageContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    minWidth: 250,
    alignItems: 'center',
  },
  info: { color: '#333', textAlign: 'center' },
});

export default App;