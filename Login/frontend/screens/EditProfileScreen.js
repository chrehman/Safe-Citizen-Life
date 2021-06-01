import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet, Platform, ScrollView, ActivityIndicator,Alert
} from 'react-native';

import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import { Fontisto,AntDesign,Entypo } from '@expo/vector-icons';

import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";

// import BottomSheet from 'reanimated-bottom-sheet';
// import Animated from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import PhoneInput from 'react-native-phone-input';
// import ImagePicker from 'react-native-image-crop-picker';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../components/context';
import DropDownPicker from 'react-native-dropdown-picker';
import ActionSheet from 'react-native-actionsheet';

const EditProfileScreen = () => {




  const { authContext, loginState } = React.useContext(AuthContext);
  const [fetchData, setFetchData] = useState(loginState.userData)

  const [data, setData] = React.useState({
    ...fetchData,
    isValidFname: true,
    isValidLname: true,
    isValidCnic: true,
    isValidCountry: true,
    isValidCity: true,
    isValidBloodgroup: true,
    isValidAddress: true,
    isValidPhoneNumber: true,
    isValidImage: true,
    cnicError: '',
    cityError: '',
    countryError: '',
    phoneNumberError: '',
    addressError: '',
    imageError: ''
  });

  const [phoneNumber, setPhoneNumber] = useState(Number(data.phoneNumber))
  const phoneRef = useRef(undefined);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([

    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
  ]);

  let actionSheet = useRef();

  var optionArray = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const showActionSheet = () => {
    //To show the Bottom ActionSheet
    actionSheet.current.show();
  };




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
  let actionSheetPic = useRef();

  var optionArrayPic = ['Take Picture', 'Upload from gallery', 'Cancel'];


  const showActionSheetPic = () => {
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


  const validateCnic = (text) => {
    // console.log(text);
    let reg = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
    if (reg.test(text) === false) {

      return false;
    }
    else {

      return true
    }
  }
  const validateCity = (text) => {
    // console.log(text);
    let reg = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
    if (reg.test(text) === false) {

      return false;
    }
    else {

      return true
    }
  }

  const validateCountry = (text) => {
    // console.log(text);
    let reg = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
    if (reg.test(text) === false) {

      return false;
    }
    else {

      return true
    }
  }


  const handleLNameChange = (val) => {
    if (val.length != 0) {
      setData({
        ...data,
        lname: val,
        isValidLname: true
      });
    } else {
      setData({
        ...data,
        lname: val,
        isValidLname: false
      });
    }
  }

  const handleFNameChange = (val) => {
    if (val.length != 0) {
      setData({
        ...data,
        fname: val,
        isValidFname: true
      });
    } else {
      setData({
        ...data,
        fname: val,
        isValidFname: false
      });
    }
  }


  const handleCnicChange = (val) => {
    if (val.length == 0) {
      setData({
        ...data,
        isValidCnic: false,
        cnic: val,
        cnicError: "Cnic number is required"
      });
    } else {

      if (validateCnic(val)) {
        setData({
          ...data,
          cnic: val,
          isValidCnic: true,
          cnicError: ''
        });
      } else {
        setData({
          ...data,
          cnic: val,
          isValidCnic: false,
          cnicError: 'CNIC No must follow the XXXXX-XXXXXXX-X format!'
        });
      }
    }
  }


  const handleCityChange = (val) => {
    if (val.length == 0) {
      setData({
        ...data,
        isValidCity: false,
        city: val,
        cityError: "City name is required"
      });
    } else {

      if (validateCity(val)) {
        setData({
          ...data,
          city: val,
          isValidCity: true,
          cityError: ''
        });
      } else {
        setData({
          ...data,
          city: val,
          isValidCity: false,
          cityError: 'City name is incorret or incorrect Format ex (Islamabad,Rawalpindi)  '
        });
      }
    }
  }

  const handleCountryChange = (val) => {
    if (val.length != 0) {
      setData({
        ...data,
        country: val,
        isValidCountry: true,
        countryError: ''
      });
    } else {
      setData({
        ...data,
        country: val,
        isValidCountry: false,
        countryError: "Country name is required"
      });
    }
  }
  const handlePhoneNumberChange = (val) => {
    // console.log("Phone number",phoneRef.current)
    if (phoneRef.current.isValidNumber(val)) {
      setData({
        ...data,
        phoneNumber: val,
        isValidPhoneNumber: true,
        phoneNumberError: ''
      })
    }
    else {
      setData({
        ...data,
        phoneNumber: val,
        isValidPhoneNumber: false,
        phoneNumberError: 'Please enter valid phone number'
      })
    }
    // console.log(val)
  }

  const handleAddressChange = (val) => {
    if (val.length == 0) {
      setData({
        ...data,
        isValidAddress: false,
        address: val,
        addressError: "Address is required"
      });
    } else {
      setData({
        ...data,
        isValidAddress: true,
        address: val,
        addressError: ''
      })
    }

  }


  const update = () => {

    console.log("HEllo")
    if (data.email.length == 0) {
      setData({
        ...data,
        isValidUser: false,
        emailError: 'Email is required'
      })
      return
    }

   
    if (data.fname.length == 0) {
      setData({
        ...data,
        isValidFname: false,
      })
      return
    }
    if (data.lname.length == 0) {
      setData({
        ...data,
        isValidLname: false,
      })
      return
    }
    if (data.cnic.length == 0) {
      setData({
        ...data,
        isValidCnic: false,
        cnicError: "Cnic number is required"
      })
      return
    }
    if (data.address.length == 0) {
      setData({
        ...data,
        isValidCnic: false,
        addressError: "Address is required"
      })
      return
    }
    if (data.bloodGroup.length == 0) {
      setData({
        ...data,
        isValidBloodgroup: false,
      })
      return
    }

    if (data.phoneNumber.length == 0) {
      setData({
        ...data,
        isValidPhoneNumber: false,
        phoneNumberError: 'Phone number is required'
      })
      return
    }
    if (data.city.length == 0) {
      setData({
        ...data,
        isValidCity: false,
        cityError: "City is required"
      })
      return
    }
    if (data.country.length == 0) {
      setData({
        ...data,
        isValidCountry: false,
        cityError: "Country is required"
      })
      return
    }
    if (image === null) {
      setData({
        ...data,
        isValidImage: false,
        imageError: "Please upload profile picture"
      })
      return
    }
    if (data.isValidUser && data.isValidFname && data.isValidLname && data.isValidCnic
      && data.isValidAddress && data.isValidBloodgroup && data.isValidPhoneNumber && data.isValidCity && data.isValidCountry && data.isValidImage && !uploading) {

      console.log("Update")
      console.log(data.userId)
      firebase.firestore().collection("citizens").doc(loginState.userId)
      .update({
          fname: data.fname,
          lname: data.lname,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address:data.address,
          city: data.city,
          country: data.country,
          bloodGroup: data.bloodGroup,
          cnic: data.cnic,
          createdAt: data.createdAt,
          userImg: data.userImg,
      })
      .then(() => {
          console.log("Document successfully updated!");
          Alert.alert("Document successfully updated!")
      })
      .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
          Alert.alert(error.code,error.message)
});
      // firebase.firestore().collection('apply')
      //   .add({
      //     fname: data.fname,
      //     lname: data.lname,
      //     email: data.email,
      //     password: data.password,
      //     address: data.address,
      //     phoneNumber: data.phoneNumber,
      //     city: data.city,
      //     country: data.country,
      //     bloodGroup: data.bloodGroup,
      //     cnic: data.cnic,
      //     userImg: downloadUrl,
      //     createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
      //   })
      //   .then(() => {
      //     console.log("Document successfully written!");
      //     setData({

      //       email: '',
      //       password: '',
      //       fname: '',
      //       lname: '',
      //       cnic: '',
      //       country: '',
      //       city: '',
      //       bloodGroup: '',
      //       address: '',
      //       phoneNumber: '',
      //       check_textInputChange: false,
      //       secureTextEntry: true,
      //       confirm_secureTextEntry: true,
      //       isValidUser: true,
      //       isValidPassword: true,
      //       isValidFname: true,
      //       isValidLname: true,
      //       isValidCnic: true,
      //       isValidCountry: true,
      //       isValidCity: true,
      //       isValidBloodgroup: true,
      //       isValidAddress: true,
      //       isValidPhoneNumber: true,
      //       isValidImage: true,
      //       cnicError: '',
      //       cityError: '',
      //       countryError: '',
      //       phoneNumberError: '',
      //       addressError: '',
      //       emailError: '',
      //       passwordError: '',
      //       imageError: ''
      //     })
      //     setImage(null)
      //     setDownloadUrl(null)
      //     Alert.alert(
      //       "Registration",
      //       "Account for registration applied successfully. You will received a verification email after admin approved your account registration request. After email verification you will able to login to your account"
      //     );
      //   })
      //   .catch((error) => {
      //     console.error("Error writing document: ", error);
      //     ALert.alert(error.code, error.message)
      //   });
    }
  }


  return (
    <View style={styles.container}>
      <ActionSheet
        ref={actionSheet}
        // Title of the Bottom Sheet
        title={'Please select your blood group type...!'}
        // Options Array to show in bottom sheet
        options={optionArray}
        // Define cancel button index in the option array
        // This will take the cancel option in bottom
        // and will highlight it
        // cancelButtonIndex={7}
        // Highlight any specific option
        destructiveButtonIndex={0}
        onPress={(index) => {
          // Clicking on the option will give you alert
          console.log(index)

          setData({
            ...data,
            bloodGroup: optionArray[index]
          })
        }}
      />

      <ActionSheet
        ref={actionSheetPic}
        // Title of the Bottom Sheet
        title={'Upload picture..!'}
        // Options Array to show in bottom sheet
        options={optionArrayPic}
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
      <Animatable.View
          animation="fadeInUpBig"
        >
          <ScrollView nestedScrollEnabled={true} >
            
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
                  uri: data.userImg,
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
                    color="#d3d3d3"
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

            <Text style={[styles.text_footer, {
              marginTop: 35
            }]}>First Name</Text>
            <View style={styles.action}>
              <AntDesign 
                        name="user"
                         size={20} 
                         color="#05375a"
                          />
              <TextInput
                placeholder="Enter your first name"

                style={styles.textInput}
                autoCapitalize="none"
                value={data.fname}
                onChangeText={(val) => handleFNameChange(val)}
              />

            </View>
            {data.isValidFname ? null :
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>First name is required</Text>
              </Animatable.View>
            }
            <Text style={[styles.text_footer, {
              marginTop: 35
            }]}>Last Name</Text>
            <View style={styles.action}>
              <AntDesign 
                        name="user"
                         size={20} 
                         color="#05375a"
                          />
              <TextInput
                placeholder="Enter your last name"
                style={styles.textInput}
                autoCapitalize="none"
                value={data.lname}
                onChangeText={(val) => handleLNameChange(val)}
              />

            </View>
            {data.isValidLname ? null :
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>Last name is required</Text>
              </Animatable.View>
            }
            <Text style={[styles.text_footer, {
              marginTop: 35
            }]}>Cnic Number</Text>
            <View style={styles.action}>
             <AntDesign 
                        name="idcard"
                         size={20} 
                         color="#05375a"
                          />
              <TextInput
                placeholder="Ex cnic 12345-1234567-7 "
                style={styles.textInput}
                autoCapitalize="none"
                value={data.cnic}
                onChangeText={(val) => handleCnicChange(val)}
              />

            </View>
            {data.isValidCnic ? null :
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>{data.cnicError}</Text>
              </Animatable.View>
            }
            <Text style={[styles.text_footer, {
              marginTop: 35
            }]}>Address</Text>
            <View style={styles.action}>
               <Entypo
                            name="address"
                            color="#05375a"
                            size={20}
                        />
              <TextInput
                placeholder="Enter your address here"
                style={styles.textInput}
                autoCapitalize="none"
                value={data.address}
                onChangeText={(val) => handleAddressChange(val)}
              />

            </View>
            {data.isValidConfirmPassword ? null :
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>{data.addressError}</Text>
              </Animatable.View>
            }
            <Text style={[styles.text_footer, {
              marginTop: 35
            }]}>Blood Group</Text>
            <View style={styles.action}>
              <Fontisto
                            name="blood-drop"
                            color="#05375a"
                            size={20}
                        />
              <Text style={{ marginLeft: 20 }}>{data.bloodGroup}</Text>
              <Button
                onPress={showActionSheet}
                buttonStyle={{ marginLeft: 20, backgroundColor: "#2089dc" }}
                icon={
                  <Fontisto name="blood-drop" size={20} color={"white"} />
                }
                title="  Choose Blood Group"
              />

            </View>
            <Text>{value}</Text>
            {data.isValidBloodgroup ? null :
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>Please select blood group</Text>
              </Animatable.View>
            }
            <Text style={[styles.text_footer, {
              marginTop: 35
            }]}>Phone Number {data.phoneNumber}</Text>
            
            <View style={styles.action}>
                    <AntDesign
                     name="phone"
                      size={20} 
                      color="#05375a" 
                      />
            <PhoneInput
              style={styles.phoneInput}
              ref={phoneRef}
              value={phoneNumber}
              onChangePhoneNumber={setPhoneNumber}
              initialCountry={'pk'}
              onChangePhoneNumber={handlePhoneNumberChange}
            />
            </View>
            {data.isValidPhoneNumber ? null :
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>{data.phoneNumberError}</Text>
              </Animatable.View>
            }
            <Text style={[styles.text_footer, {
              marginTop: 35
            }]}>City</Text>
            <View style={styles.action}>
              <MaterialCommunityIcons
                            name="city-variant-outline"
                            color="#05375a"
                            size={20}
                        />
              <TextInput
                placeholder="Enter your city name here"
                style={styles.textInput}
                autoCapitalize="none"
                value={data.city}
                onChangeText={(val) => handleCityChange(val)}
              />

            </View>
            {data.isValidCity ? null :
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>{data.cityError}</Text>
              </Animatable.View>
            }
            <Text style={[styles.text_footer, {
              marginTop: 35
            }]}>Country</Text>
            <View style={styles.action}>
              <Feather
                            name="flag"
                            color="#05375a"
                            size={20}
                        />
              <TextInput
                placeholder="Enter your country name here"
                style={styles.textInput}
                autoCapitalize="none"
                value={data.country}
                onChangeText={(val) => handleCountryChange(val)}
              />

            </View>
            {data.isValidCountry ? null :
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>{data.countryError}</Text>
              </Animatable.View>
            }
            
            
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => { update() }}
              >
                <LinearGradient
                  colors={['#2089dc', '#2089dc']}
                  style={styles.signIn}
                >
                  <Text style={[styles.textSign, {
                    color: '#fff'
                  }]}>Update</Text>
                </LinearGradient>
              </TouchableOpacity>


            </View>
            
          </ScrollView>

      </Animatable.View>
      </View>
      
      </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
        flex: 1,
        // backgroundColor: '#009387'
    },
    container2: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
  //       container: {
  //       flex: 1,
  // },
  // container2: {
  //       flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center'
  // },
  // commandButton: {
  //       padding: 15,
  //   borderRadius: 10,
  //   backgroundColor: '#009387',
  //   alignItems: 'center',
  //   marginTop: 10,
  // },
  // panel: {
  //       padding: 20,
  //   backgroundColor: '#FFFFFF',
  //   paddingTop: 20,
  //   // borderTopLeftRadius: 20,
  //   // borderTopRightRadius: 20,
  //   // shadowColor: '#000000',
  //   // shadowOffset: {width: 0, height: 0},
  //   // shadowRadius: 5,
  //   // shadowOpacity: 0.4,
  // },
  // header: {
  //       backgroundColor: '#FFFFFF',
  //   shadowColor: '#333333',
  //   shadowOffset: { width: -1, height: -3 },
  //   shadowRadius: 2,
  //   shadowOpacity: 0.4,
  //   // elevation: 5,
  //   paddingTop: 20,
  //   borderTopLeftRadius: 20,
  //   borderTopRightRadius: 20,
  // },
  // panelHeader: {
  //       alignItems: 'center',
  // },
  // panelHandle: {
  //       width: 40,
  //   height: 8,
  //   borderRadius: 4,
  //   backgroundColor: '#00000040',
  //   marginBottom: 10,
  // },
  // panelTitle: {
  //       fontSize: 27,
  //   height: 35,
  // },
  // panelSubtitle: {
  //       fontSize: 14,
  //   color: 'gray',
  //   height: 30,
  //   marginBottom: 10,
  // },
  // panelButton: {
  //       padding: 13,
  //   borderRadius: 10,
  //   backgroundColor: '#009387',
  //   alignItems: 'center',
  //   marginVertical: 7,
  // },
  // panelButtonTitle: {
  //       fontSize: 17,
  //   fontWeight: 'bold',
  //   color: 'white',
  // },
  // // action: {
  // //       flexDirection: 'row',
  // //   marginTop: 10,
  // //   marginBottom: 10,
  // //   borderBottomWidth: 1,
  // //   borderBottomColor: '#f2f2f2',
  // //   paddingBottom: 5,
  // //   justifyContent: 'center'
  // // },
  
  //   action: {
  //       flexDirection: 'row',
  //       marginTop: 10,
  //       borderBottomWidth: 1,
  //       borderBottomColor: '#f2f2f2',
  //       paddingBottom: 5
  //   },
  // actionError: {
  //       flexDirection: 'row',
  //   marginTop: 10,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#FF0000',
  //   paddingBottom: 5,
  // },
  // textInput: {
  //       flex: 1,
  //   marginTop: Platform.OS === 'ios' ? 0 : -12,
  //   paddingLeft: 10,
  //   color: '#05375a',
  // },
  // // footer: {
  // //       flex: 3,
  // //   backgroundColor: '#fff',
  // //   borderTopLeftRadius: 30,
  // //   borderTopRightRadius: 30,
  // //   paddingHorizontal: 20,
  // // }
  // footer: {
  //       flex: Platform.OS === 'ios' ? 3 : 5,
  //       backgroundColor: '#fff',
  //       borderTopLeftRadius: 30,
  //       borderTopRightRadius: 30,
  //       paddingHorizontal: 20,
  //       paddingVertical: 30
  //   }
  //   // text_header: {
  //   //     color: '#fff',
  //   //     fontWeight: 'bold',
  //   //     fontSize: 30
  //   // },
  //   // text_footer: {
  //   //     color: '#05375a',
  //   //     fontSize: 18
  //   // },
  //   // textInput: {
  //   //     flex: 1,
  //   //     marginTop: Platform.OS === 'ios' ? 0 : -12,
  //   //     paddingLeft: 10,
  //   //     color: '#05375a',
  //   // },
  //   // button: {
  //   //     alignItems: 'center',
  //   //     marginTop: 50
  //   // },
  //   // signIn: {
  //   //     width: '100%',
  //   //     height: 50,
  //   //     justifyContent: 'center',
  //   //     alignItems: 'center',
  //   //     borderRadius: 10
  //   // },
  //   // errorMsg: {
  //   //     color: '#FF0000',
  //   //     fontSize: 14,
  //   // },
  //   // textSign: {
  //   //     fontSize: 18,
  //   //     fontWeight: 'bold'
  //   // },
  //   // textPrivate: {
  //   //     flexDirection: 'row',
  //   //     flexWrap: 'wrap',
  //   //     marginTop: 20
  //   // },
  //   // color_textPrivate: {
  //   //     color: 'grey'
  //   // }
});
