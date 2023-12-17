import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity } from 'react-native';
// import { useDeviceOrientation } from "@react-native-community/hooks";
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from './src/components/Button';
import * as FileSystem from 'expo-file-system';
export default function App() {
  // console.log(useDeviceOrientation());
  const [count, setcount] = useState(0);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, [])
  const handlepress = () => {
    setcount(count + 1);
    console.log("count=" + count);
  }
  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch (e) {
        console.log(e);
      }
    }
  }
  const saveImage = async () => {
    if (image) {
      try {
        const base64String = await convertImageToBase64(image);
        // console.log('Base64 String:', base64String);
        const apiUrl = '';
        const response = await fetch(apiUrl, {
          method: "POST",
          body: `base64Data=${encodeURIComponent(image)}`,
        });
        if (response.ok) {

          alert('iamge uploaded successfully!');
        }
        else {
          alert("image upload failed");
        }
        setImage(null);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const convertImageToBase64 = async (imageUri) => {
    try {
      const base64Data = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64Data;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };
  if (hasCameraPermission == false) {
    return <Text>No access to camera</Text>
  }
  return (
    // <SafeAreaView style={styles.container}>
    //   <Text>Hello this is sumanth</Text>
    //   {/* <Image source={require("./assets/favicon.png")} /> */}
    //   <TouchableOpacity onPress={handlepress}>
    //     <Image source={{ width: 200, height: 200, uri: "https://picsum.photos/200/300" }} />
    //   </TouchableOpacity>
    //   <Button title='click me' color="red" onPress={() => alert("you clicked")} />
    // </SafeAreaView>
    <View style={styles.container}>
      {!image ?
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 30,
          }}>
            <Button icon={'retweet'} onPress={() => {
              setType(type === CameraType.back ? CameraType.front : CameraType.back)
            }} />
            <Button icon={'flash'}
              color={flash == Camera.Constants.FlashMode.off ? 'gray' : '#f1f1f1'}
              onPress={() => {
                setFlash(flash === Camera.Constants.FlashMode.off
                  ? Camera.Constants.FlashMode.on
                  : Camera.Constants.FlashMode.off
                )
              }} />
          </View>
        </Camera>
        :
        <Image source={{ uri: image }} style={styles.camera} />


      }
      <View>
        {image ?
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 50
          }}>
            <Button title={"Re-take"} icon="retweet" onPress={() => setImage(null)} />
            <Button title={"Save"} icon="check" onPress={saveImage} />
          </View>
          :
          <Button title={'Take a picture'} icon="camera" onPress={takePicture} />
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingBottom: 20
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  }
});