import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, StatusBar, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useTheme } from '@react-navigation/native';
// import ImagePicker from 'react-native-image-picker';
// import * as ImagePicker from "react-native-image-picker"
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase/app';
import "firebase/storage";
import { AuthContext } from '../components/context';
// import {  Button } from 'native-base';
const HomeScreen = ({ navigation }) => {

const [data, setData] = useState({})
const [loading, setLoading] = useState(false)
  const { colors } = useTheme();
const  context  = React.useContext(AuthContext);
const { authContext } = React.useContext(AuthContext);

  useEffect(() => {
    console.log("Hi")
    
      firebase.firestore().collection('citizens')
      .doc(context.loginState.userId)
      .onSnapshot((doc) => {
        console.log("Current data: ", doc.data());
        authContext.setUserData(doc.data())
    })

  }, [])
  const theme = useTheme();
  console.log("Context",context)
  return (
    <View style={styles.container}>
      {/* <StatusBar barStyle= { theme.dark ? "light-content" : "dark-content" }/> */}
      <StatusBar animated={true} barStyle='light-content' />
      <Text style={{ color: colors.text }}>Home Screen</Text>
      <Button
        title="Go to details screen"
        onPress={() => navigation.navigate("Details")}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});




///////////////////////////////////////////////////////////////////


// import React, { useState, useRef, useEffect } from 'react';
// import {
//   StyleSheet,
//   Dimensions,
//   View,
//   Text,
//   TouchableOpacity,Alert
// } from 'react-native';
// import { Camera } from 'expo-camera';
// import { AntDesign, MaterialIcons } from '@expo/vector-icons';
// import firebase from 'firebase/app';
// import "firebase/firestore";
// import "firebase/firestorage";

// const WINDOW_HEIGHT = Dimensions.get('window').height;
// const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08);

// export default function HomeScreen() {
//   const cameraRef = useRef();
//   const [hasPermission, setHasPermission] = useState(null);
//   const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
//   const [isPreview, setIsPreview] = useState(false);
//   const [isCameraReady, setIsCameraReady] = useState(false);
//   const [uploading,setUploading]=useState(false)
//   const [transfered,setTransfered]=useState(0)
//   const [uploadUri,setUploadUri]=useState('')

//   useEffect(() => {
//     onHandlePermission();
//   }, []);


//   const onHandlePermission = async () => {
//     const { status } = await Camera.requestPermissionsAsync();
//     setHasPermission(status === 'granted');
//   };

//   const onCameraReady = () => {
//     setIsCameraReady(true);
//   };

//   const switchCamera = () => {
//     if (isPreview) {
//       return;
//     }
//     setCameraType(prevCameraType =>
//       prevCameraType === Camera.Constants.Type.back
//         ? Camera.Constants.Type.front
//         : Camera.Constants.Type.back
//     );
//   };
//    const uploadImage=async()=>{
//     let fileName=uploadUri.substring(uploadUri.lastIndexOf('/')+1)
//       console.log("FileName",fileName)
//       setUploading(true)
//       try{
//         await firebase.storage().ref(fileName).putFile(uploadUri)
//         setUploading(false)
//         Alert.alert(
//           'Image Uploaded',
//           'Your image has been uploaded to firebase'
//         )
//       }
//       catch(e){
//           console.log(e)
//       }
//       setUploadUri(null)
//   }

//   const onSnap = async () => {
//     if (cameraRef.current) {
//       const options = { quality: 0.7, base64: true };
//       const data = await cameraRef.current.takePictureAsync(options);
//       setUploadUri(data.uri)
//       let uri=data.uri
//       // console.log(uploadUri)

//       const source = data.base64;
//       console.log(cameraRef.current.getSupportedRatiosAsync())
//       if (source) {
//         // await cameraRef.current.pausePreview();
//         await cameraRef.current.resumePreview();
//         setIsPreview(true);
//         let fileName=uri.substring(uri.lastIndexOf('/')+1)
//       console.log("FileName",fileName)
//       setUploading(true)
//       try{
//         await firebase.storage().ref(fileName).putFile(uri)
//         setUploading(false)
//         Alert.alert(
//           'Image Uploaded',
//           'Your image has been uploaded to firebase'
//         )
//       }
//       catch(e){
//           console.log(e)
//       }
//         let base64Img = `data:image/jpg;base64,${source}`;
//         // console.log(source)
//         // console.log(base64Img)
//       //   let apiUrl =
//       //     'https://api.cloudinary.com/v1_1/<your-cloud-name>/image/upload';
//       //   let data = {
//       //     file: base64Img,
//       //     upload_preset: '<your-upload-preset>'
//       //   };

//       //   fetch(apiUrl, {
//       //     body: JSON.stringify(data),
//       //     headers: {
//       //       'content-type': 'application/json'
//       //     },
//       //     method: 'POST'
//       //   })
//       //     .then(async response => {
//       //       let data = await response.json();
//       //       if (data.secure_url) {
//       //         alert('Upload successful');
//       //       }
//       //     })
//       //     .catch(err => {
//       //       alert('Cannot upload');
//       //       console.log(err);
//       //     });
//       }
//     }
//   };



//   const cancelPreview = async () => {
//     await cameraRef.current.resumePreview();
//     setIsPreview(false);
//   };
//   const uploadPreview = async () => {
//     await cameraRef.current.resumePreview();
//     setIsPreview(false);
//   };

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return <Text style={styles.text}>No access to camera</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <Camera
//         ref={cameraRef}
//         style={styles.container}
//         type={cameraType}
//         onCameraReady={onCameraReady}
//         useCamera2Api={true}
//       />
//       <View style={styles.container}>
//         {isPreview && (
//          <View>
//           <TouchableOpacity
//             onPress={cancelPreview}
//             style={styles.closeButton}
//             activeOpacity={0.7}
//           >
//             <AntDesign name='close' size={32} color='#fff' />
//           </TouchableOpacity>
//            <TouchableOpacity
//             onPress={uploadPreview}
//             style={styles.closeButton}
//             activeOpacity={0.7}
//           >
//             <AntDesign name='close' size={32} color='#fff' />
//           </TouchableOpacity>
//          </View>

//         )}
//         {!isPreview && (
//           <View style={styles.bottomButtonsContainer}>
//             <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
//               <MaterialIcons name='flip-camera-ios' size={28} color='white' />
//             </TouchableOpacity>
//             <TouchableOpacity
//               activeOpacity={0.7}
//               disabled={!isCameraReady}
//               onPress={onSnap}
//               style={styles.capture}
//             />
//           </View>
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject
//   },
//   text: {
//     color: '#fff'
//   },
//   bottomButtonsContainer: {
//     position: 'absolute',
//     flexDirection: 'row',
//     bottom: 28,
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 35,
//     right: 20,
//     height: 50,
//     width: 50,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#5A45FF',
//     opacity: 0.7
//   },
//   capture: {
//     backgroundColor: '#5A45FF',
//     borderRadius: 5,
//     height: CAPTURE_SIZE,
//     width: CAPTURE_SIZE,
//     borderRadius: Math.floor(CAPTURE_SIZE / 2),
//     marginBottom: 28,
//     marginHorizontal: 30
//   }
// });
