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

import {getResourcePath } from './utils';

const appId = 'd5af82b4b85e4838b2caec2a84e71cf3'; 
const channelName = 'channel_bac';
const token = ''; 
const FACEUNITY_AUTHPACK = [10,13,-98,-100,126,66,-4,45,-109,39,89,69,-75,-45,66,-52,44,-34,-14,-3,107,-53,-8,67,-28,5,-22,-24,-20,89,-58,86,-93,-11,-109,4,-9,70,15,-43,44,74,-113,-72,-98,-81,-37,51,-33,42,-23,-19,-73,-24,84,27,-30,-78,87,-79,72,32,39,-79,-3,-116,12,-128,-63,-39,-96,-52,122,-51,50,-95,-106,-90,63,32,-56,110,107,-36,-59,38,79,43,96,-89,-97,73,22,83,-85,118,-47,63,-38,-66,122,-115,-108,28,66,58,-103,-111,26,-74,0,-42,-43,50,6,113,13,-13,-11,110,21,72,-119,-19,-66,127,-59,-50,87,-1,84,-69,111,-81,28,98,49,-79,119,46,8,44,20,96,10,27,-126,-23,-55,2,114,78,-102,118,-40,-100,-124,30,77,-119,44,-5,55,-5,49,75,-128,-121,3,121,-124,96,-30,-91,-127,-4,53,49,-100,-50,-95,-15,-74,-77,-98,-57,59,118,126,62,120,90,-62,101,-77,-86,74,-121,83,73,84,-4,110,-103,109,-67,85,-63,41,-126,123,15,45,59,-84,99,-107,-113,-6,-111,21,5,91,67,-27,-97,121,96,94,-84,-56,-108,119,-51,56,-110,-22,85,-55,40,-41,62,52,15,119,-1,-31,14,9,15,36,125,14,4,-66,-116,-29,-85,106,-29,35,-107,-38,6,29,51,55,3,33,-19,-78,-29,97,-8,25,-6,70,98,-59,12,35,-40,85,112,-14,28,16,60,-102,120,-27,-117,22,121,-81,-73,126,17,56,77,57,-63,-30,-13,125,-31,-119,114,-80,-127,127,120,-77,90,-2,107,57,-124,-76,-63,-118,94,76,-53,-64,87,-28,7,26,45,-23,-103,-55,61,-59,-97,-72,-18,-107,122,22,-32,-106,65,-10,-121,-72,-127,105,13,119,-31,-116,110,46,-95,-66,-4,37,-36,51,7,-82,2,-83,-38,-64,54,34,-13,71,35,-77,-33,112,95,-124,34,-20,-58,-17,-30,-118,37,84,-14,122,65,-26,-1,5,51,3,-116,-48,-12,47,121,-83,31,-83,127,-118,-98,-15,121,-14,-12,60,19,-18,-14,34,-100,-25,91,-59,-102,-16,-118,58,-73,104,-44,-72,-3,84,-78,-126,14,85,23,-54,-5,-78,87,-94,-60,12,36,-50,5,-67,-74,79,-57,7,17,-61,-9,-20,-121,58,59,-56,-41,-70,45,90,29,107,72,51,116,-120,-98,107,31,-38,62,-59,-57,87,-46,44,11,107,-90,-59,116,53,41,48,-113,-52,-36,66,-96,127,125,-20,-36,-80,28,4,77,88,15,74,43,-99,103,3,-3,79,-83,-116,-67,76,9,-119,123,5,-37,-92,88,32,95,87,-109,94,16,118,-66,-78,50,-29,85,117,-65,-67,84,-25,-127,-88,92,-56,54,15,96,6,104,-113,-100,66,-57,-84,-43,-43,-34,-47,-9,-3,60,60,-4,67,-40,-53,-53,85,-103,75,98,-115,92,107,120,40,-92,53,-14,92,-96,82,-21,79,-108,-104,-74,21,19,-45,112,74,33,-1,-40,-21,-18,83,-6,-81,-66,-2,72,126,-61,10,-6,-43,-84,-45,-63,22,-98,-103,16,-50,-60,16,82,-83,26,-119,115,-21,-32,-67,-125,8,-61,-90,41,-82,69,-31,-46,33,18,-82,-74,-78,-96,46,18,-53,-58,-87,-115,58,112,-116,69,-58,42,91,13,112,-3,-76,35,17,-57,-35,-119,38,-53,-13,-61,-15,123,-11,62,-122,-86,-57,97,25,8,-83,-52,97,39,106,-57,69,-123,98,13,-68,26,32,-8,-114,76,-92,-126,-86,-23,-22,107,-108,28,47,15,-76,63,-70,-88,-87,89,-2,45,41,87,-67,5,74,-109,13,-90,-72,-122,17,91,-18,2,-49,-75,25,104,24,37,30,17,97,-108,41,-96,-98,-24,48,-14,-69,-98,127,61,126,64,-100,42,-1,-41,-124,5,-10,-98,-36,29,-114,-89,-91,16,40,-103,-40,12,66,-7,-104,117,-30,-120,104,39,87,14,13,-47,83,22,-28,-59,-85,109,124,108,87,90,-103,56,106,-83,-74,34,-14,-16,-66,-24,-96,-49,100,-91,9,104,-50,-12,-121,55,-10,83,13,90,-57,-111,110,44,66,-120,3,-88,-32,48,-95,-96,-53,-40,68,111,99,-3,-19,-93,121,102,116,-15,114,16,-87,2,-40,33,-115,-62,75,61,30,-29,65,-18,-55,-59,-27,-81,62,-107,-84,-82,-22,-81,-26,-55,67,35,78,-88,87,-68,33,22,-83,-106,105,-43,11,-106,28,14,14,-73,56,74,112,-91,-83,90,25,-83,-53,-25,36,65,-2,-69,-89,1,66,51,11,-71,32,119,112,-112,-114,-36,48,38,21,-123,111,29,-79,58,-21,54,88,-67,-20,92,17,84,-88,72,35,-10,-33,-84,-46,113,32,-104,48,46,-94,-50,-44,71,127,36,63,-6,99,-21,94,-48,-93,40,-76,57,-58,-86,45,18,102,120,-102,15,-22,125,55,-109,-49,5,-111,23,9,59,16,98,117,66,32,47,-103,-108,-32,-5,-71,-93,11,42,42,-65,82,42,-59,-17,121,0,48,-10,-97,-57,112,-110,79,-20,-35,97,-27,-107,-107,-94,-95,-40,-19,-41,-39,32,6,123,10,95,20,-27,-19,-69,-62,6,113,5,49,-82,29,4,-113,-73,-22,73,-126,-74,46,-62,113,-98,-78,2,-122,-15,-103,61,-28,-121,-26,-112,100,-117,104,-50,108,88,37,-118,66,-70,114,41,-60,29,42,51,30,-118,102,-48,61,-52,84,-15,-4,67,-81,56,-12,88,65,-23,-77,-83,95,-126,107,-42,18,49,50,-42,-64,-118,-57,106,-128,78,38,-42,59,0,32,93,-42,53,7,-88,-51,-9,31,7,80,43,72,-81,-50,-74,-17,96,-119,-42,29,-114,-5,125,-36,103,-44,-3,-33,106,-21,28,-98,1,-93,124,66,-119,60,105,-66,-31,-77,69,46,-34,48,53,-86,-126,81,-84,-20,109,-41,-89,-14,-90];

const App = () => {
  const agoraEngineRef = useRef<IRtcEngine | null>(null);
  const faceUnityInitializedRef = useRef(false);
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [message, setMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  
  // FaceUnity State
  const [faceUnityEnabled, setFaceUnityEnabled] = useState(false);
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
      console.log('Bacs Loading FaceUnity Resources...');

      // 1. Setup Auth
      const setupResult = await engine.setExtensionProperty('FaceUnity', 'Effect', 'fuSetup', 
        JSON.stringify({ authdata: FACEUNITY_AUTHPACK })
      );

      if (setupResult !== 0) {
        console.error('Bacs FaceUnity setup failed with code:', setupResult);
        faceUnityInitializedRef.current = false;
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
        const path = getResourcePath(model.name); /// : `model/${model.name}`;
        const loadResult = await engine.setExtensionProperty('FaceUnity', 'Effect', 'fuLoadAIModelFromPackage',
          JSON.stringify({ data: path, type: model.type })
        );

        if (loadResult !== 0) {
          console.error('Bacs FaceUnity fuLoadAIModelFromPackage ${model.name} failed with code:', loadResult);
          faceUnityInitializedRef.current = false;
          return;
        }else { 
          console.log('Bacs FaceUnity fuLoadAIModelFromPackage ${model.name} success result:', loadResult);
        }
      }

      // 3. Create AI Type
      const aiTypePath =  Platform.OS === 'ios' ? getResourcePath('aitype.bundle') : getResourcePath('others/aitype.bundle');// getResourcePath('aitype.bundle'); 
      const aiTypePathResult = await engine.setExtensionProperty('FaceUnity', 'Effect', 'fuCreateItemFromPackage',
        JSON.stringify({ data: aiTypePath })
      );
      if (aiTypePathResult !== 0) {
        console.error('Bacs FaceUnity load aitype failed with code:', aiTypePathResult);
        faceUnityInitializedRef.current = false;
        return;
      }else { 
        console.log('Bacs FaceUnity load aitype success result:', aiTypePathResult);
      }

      // 4. Load Beauty Item
      const beautyPath = Platform.OS === 'ios' ? getResourcePath('face_beautification.bundle') : getResourcePath('graphics/face_beautification.bundle'); //getResourcePath('face_beautification.bundle');
      const beautyPathResult = await engine.setExtensionProperty('FaceUnity', 'Effect', 'fuCreateItemFromPackage',
        JSON.stringify({ data: beautyPath })
      );

      if (beautyPathResult !== 0) {
        console.error('Bacs FaceUnity load beautyPathResult failed with code:', beautyPathResult);
        faceUnityInitializedRef.current = false;
        return;
      }else { 
        console.log('Bacs FaceUnity load beautyPathResult success result:', beautyPathResult);
      }

      // // 5. Check if sticker exists ( no need to load, it will be loaded then you enable it)
      const stickerPath = Platform.OS === 'ios' ? getResourcePath('cat_sparks.bundle') : getResourcePath('effect/normal/cat_sparks.bundle');; // Using cat_sparks sticker from resources

      setFaceUnityEnabled(true);
      setBeautyHandle(beautyPath);
      setStickerHandle(stickerPath);
      console.log('Bacs FaceUnity Ready!');
      

    } catch (e) {
      console.error('Bacs Failed to load FaceUnity resources', e);
      faceUnityInitializedRef.current = false;
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
      const result = await engine.setExtensionProperty('FaceUnity', 'Effect', 'fuCreateItemFromPackage',
        JSON.stringify({
          data: stickerHandle
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

      //     setStickerHandle(stickerPath);
      // setStickerItemHandle(stickerResult);
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
    console.log("Bacs join Channel is faceUnityInitialized loaded:", faceUnityInitializedRef.current);
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