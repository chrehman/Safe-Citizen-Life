import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet, Platform, ScrollView,ActivityIndicator
} from 'react-native';

import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { AntDesign } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";

// import BottomSheet from 'reanimated-bottom-sheet';
// import Animated from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';

// import ImagePicker from 'react-native-image-crop-picker';
import * as ImagePicker from 'expo-image-picker';
import ActionSheet from 'react-native-actionsheet';
import { AuthContext } from '../components/context';

const EditProfileScreen = () => {


  const { authContext,loginState } = React.useContext(AuthContext);
  const [data, setData] = useState(loginState.userData)

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera  permissions to make this work!');
        }
      }
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);


  const [image, setImage] = useState('https://api.adorable.io/avatars/80/abott@adorable.png');
  const { colors } = useTheme();
  const [userData, setUserData] = useState('')
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [uploading, setUploading] = useState(false)
  const [transfered, setTransfered] = useState(0)
  let actionSheet = useRef();

  var optionArray = ['Take Picture', 'Upload from gallery', 'Cancel'];


  const showActionSheet = () => {
    //To show the Bottom ActionSheet
    actionSheet.current.show();
  };

  const uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    //console.log("BLOB",blob)
    var ref = firebase.storage().ref(imageName);
    // console.log(ref)

    let uploadTask = ref.put(blob);
    uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setTransfered(progress)
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL);
          setDownloadUrl(downloadURL)
        });
      }
    );
    return uploadTask
  }


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });


    if (!result.cancelled) {
      let fileName = result.uri.substring(result.uri.lastIndexOf('/') + 1)
      // console.log("FileName",fileName)
      const extension = fileName.split('.').pop()
      const name = fileName.split('.').slice(0, -1).join('.')
      fileName = name + Date.now() + '.' + extension
      // console.log(result.uri)

      setUploading(true)
      uploadImage(result.uri, fileName)
        .then(() => {
          setImage(result.uri)
          setUploading(false)
          console.log("Success")
          setTransfered(0)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }


  const captureImage = async () => {
    const options = { quality: 0.7, base64: true }
    let result = await ImagePicker.launchCameraAsync(options);

    console.log(result.uri);
    if (!result.cancelled) {
      let fileName = result.uri.substring(result.uri.lastIndexOf('/') + 1)
      console.log("FileName", fileName)
      const extension = fileName.split('.').pop()
      const name = fileName.split('.').slice(0, -1).join('.')
      fileName = name + Date.now() + '.' + extension
      console.log(result.uri)

      setUploading(true)
      uploadImage(result.uri, fileName)
        .then(() => {
          setImage(result.uri)
          setUploading(false)
          console.log("Success")
          setTransfered(0)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }


  const getUser = () => {
    var user = firebase.auth().currentUser
    firebase.firestore().collection('users')
      .doc(user.uid)
      .get()
      .then((userDetail) => {
        if (userDetail.exists) {
          console.log("User Data ", userDetail.data())
          setUserData(userDetail.data())
        }
      }).catch((error) => {
        console.log("Error", error)
      })
  }
  useEffect(() => {
    getUser()
  }, [])
  
  return (
    <View style={styles.container}>
      <ActionSheet
        ref={actionSheet}
        // Title of the Bottom Sheet
        title={'Which one do you like ?'}
        // Options Array to show in bottom sheet
        options={optionArray}
        // Define cancel button index in the option array
        // This will take the cancel option in bottom
        // and will highlight it
        cancelButtonIndex={2}
        // Highlight any specific option
        destructiveButtonIndex={0}
        onPress={(index) => {
          // Clicking on the option will give you alert
          console.log(index)
          if (index === 0) {
            // console.log("Op")
            captureImage()
          }
          else if (index === 1) {
            // console.log("1p")
            pickImage()
          }
          else {
            alert(optionArray[index]);
          }
        }}
      />
      <View style={{
        margin: 20
      }}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={() => showActionSheet()}>
            <View
              style={{
                height: 100,
                width: 100,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ImageBackground
                source={{
                  uri: data.imgUrl,
                }}
                style={{ height: 100, width: 100 }}
                imageStyle={{ borderRadius: 15 }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="camera"
                    size={35}
                    color="black"
                    style={{
                      opacity: 0.7,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: '#fff',
                      borderRadius: 10,
                    }}
                  />
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
          
          <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
            {data.fname} {data.lname}
          </Text>
        </View>
        {uploading ?
        <View style={styles.container2}>
          <ActivityIndicator size="small" color="#009387" />
          <Text style={{ color: "#d3d3d3" }}>Upload is {transfered}% done</Text>
        </View>
        : null}
        <Animatable.View
          animation="fadeInUpBig"
          >
          <ScrollView>
            <View style={styles.action}>
              <FontAwesome name="user-o" color={colors.text} size={20} />
              {/* <Text style={{color:colors.text,fontSize:10}}> First Name</Text> */}
              <TextInput
                placeholder="First Name"
                placeholderTextColor="#666666"
                autoCorrect={false}
                value={data.fname}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
              />
            </View>
            <View style={styles.action}>
              <FontAwesome name="user-o" color={colors.text} size={20} />
              <TextInput
                placeholder="Last Name"
                value={data.lname}
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
              />
            </View>
            <View style={styles.action}>
              <AntDesign name="idcard" size={24} color={colors.text} />
              <TextInput
                placeholder="Cnic"
                value={data.cnic}
                placeholderTextColor="#666666"
                keyboardType="number-pad"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
              />
            </View>
            <View style={styles.action}>
              <Fontisto name="blood-drop" size={20} color={colors.text} />
              <TextInput
                placeholder="Blood Group"
                value={data.bloodGroup}
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
              />
            </View>
            <View style={styles.action}>
              <Feather name="phone" color={colors.text} size={20} />
              <TextInput
                placeholder="Phone"
                value={data.phoneNumber}
                placeholderTextColor="#666666"
                keyboardType="number-pad"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
              />
            </View>
            <View style={styles.action}>
              <FontAwesome name="envelope-o" color={colors.text} size={20} />
              <TextInput
                placeholder="Email"
                value={data.email}
                placeholderTextColor="#666666"
                keyboardType="email-address"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
              />
            </View>
            <View style={styles.action}>
              <Icon name="map-marker-outline" color={colors.text} size={20} />
              <TextInput
                placeholder="City"
                value={data.city}
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
              />
            </View>
            <View style={styles.action}>
              <FontAwesome name="globe" color={colors.text} size={20} />
              <TextInput
                placeholder="Country"
                value={data.country}
                placeholderTextColor="#666666"
                autoCorrect={false}
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
              />
            </View>

          </ScrollView>
        </Animatable.View>
        
        <TouchableOpacity style={styles.commandButton} onPress={() => { handleUpdate }}>
          <Text style={styles.panelButtonTitle}>Update</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#009387',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
    justifyContent: 'center'
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
  }
});
