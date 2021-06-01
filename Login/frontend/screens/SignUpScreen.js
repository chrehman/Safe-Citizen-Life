import React, { useState, useEffect, useRef } from 'react';
import {
    Alert,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    ImageBackground,

} from 'react-native';
import { Button } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import PhoneInput from 'react-native-phone-input';
// import auth from '@react-native-firebase/auth';
import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";
// import LinearGradient from 'react-native-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import ActionSheet from 'react-native-actionsheet';
import * as ImagePicker from 'expo-image-picker';

const SignUpScreen = ({ navigation }) => {

    const [phoneNumber, setPhoneNumber] = useState(false)
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

    var optionArray = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Cancel'];

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

    const [image, setImage] = useState(null);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [uploading, setUploading] = useState(false)
    const [transfered, setTransfered] = useState(0)
    let actionSheetPic = useRef();

    var imageArray = ['Take Picture', 'Upload from gallery', 'Cancel'];


    const showImageActionSheet = () => {
        //To show the Bottom ActionSheet
        actionSheetPic.current.show();
    };

    const uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        //console.log("BLOB",blob)
        var ref = firebase.storage().ref(imageName);
        console.log("Hello")
        // console.log(ref)

        let uploadTask = ref.put(blob);
        uploadTask.on('state_changed',
            (snapshot) => {
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
            },
            () => {
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
            aspect: [4, 4],
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
            console.log("a")
            uploadImage(result.uri, fileName)
                .then(() => {
                    setImage(result.uri)
                    setUploading(false)
                    console.log("Success")
                    setData({
                        ...data,
                        isValidImage: true,
                        imageError: ''
                    })
                    setTransfered(0)
                })
                .catch((err) => {
                    console.log("BBBBBB")
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
                    setData({
                        ...data,
                        isValidImage: true,
                        imageError: ''
                    })
                    setTransfered(0)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }


    const [data, setData] = React.useState({
        username: '',
        password: '',
        confirm_password: '',
        fname: '',
        lname: '',
        cnic: '',
        country: '',
        city: '',
        bloodGroup: '',
        address: '',
        phoneNumber: '',
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        isValidConfirmPassword: true,
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
        emailError: '',
        passwordError: '',
        confirmPasswordError: '',
        imageError: ''
    });

    const validate = (text) => {
        // console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(text) === false) {
            // console.log("Email is Not Correct");
            return false;
        }
        else {
            // console.log("Email is Correct");
            return true
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

    // const validateAddress = (text) => {
    //     // console.log(text);
    //     let reg = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
    //     if (reg.test(text) === false) {

    //         return false;
    //     }
    //     else {

    //         return true
    //     }
    // }
    const textInputChange = (val) => {

        if (validate(val)) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true,
                emailError: ''
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false,
                emailError: 'Invalid email'
            });
        }
    }

    const handlePasswordChange = (val) => {
        if (val.trim().length >= 6) {
            setData({
                ...data,
                password: val,
                isValidPassword: true,
                passwordError: ''
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false,
                passwordError: 'Password must be 6 characters long'
            });
        }
    }


    const handleConfirmPasswordChange = (val) => {
        if (val === data.password) {
            setData({
                ...data,
                confirm_password: val,
                isValidConfirmPassword: true,
                confirmPasswordError: ''
            });
        } else {
            setData({
                ...data,
                confirm_password: val,
                isValidConfirmPassword: false,
                confirmPasswordError: 'Password did not match'
            });
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



    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }

    const signUp = () => {

        console.log("HEllo")
        if (data.username.length == 0) {
            setData({
                ...data,
                isValidUser: false,
                emailError: 'Email is required'
            })
            return
        }


        if (data.password.length == 0 || data.password.length < 6) {
            setData({
                ...data,
                isValidPassword: false,
                passwordError: 'Password is required'
            })
            return
        }
        if (data.confirm_password.length == 0 || data.confirm_password !== data.password) {
            setData({
                ...data,
                isValidConfirmPassword: false,
                confirmPasswordError: 'Confirm Password is required'
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
        if (data.isValidUser && data.isValidPassword && data.isValidConfirmPassword && data.isValidFname && data.isValidLname && data.isValidCnic
            && data.isValidAddress && data.isValidBloodgroup && data.isValidPhoneNumber && data.isValidCity && data.isValidCountry && data.isValidImage && !uploading) {

            console.log("SIGN UP")
            // firebase.auth()
            //     .createUserWithEmailAndPassword(data.username, data.password)
            //     .then(() => {
            //         var user = firebase.auth().currentUser;
            //         user.sendEmailVerification().then(function () {
            //             // Email sent.
            //             console.log("Email Sent")
            //         }).catch(function (error) {
            //             // An error happened.
            //         });
            //         console.log("USerID ", user.uid)
            //         firebase.firestore().collection('apply').doc(user.uid)
            //             .set({
            //                 fname: "Abdul",
            //                 lname: "Rahman",
            //                 email: data.username,
            //                 phoneNumber: "123456789",
            //                 city: "RWP",
            //                 country: "Pakistan",
            //                 bloodGroup: "A+",
            //                 cnic: "374051234567",
            //                 createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
            //                 userImg: null,
            //             })
            //             .then(() => {
            //                 console.log("Document successfully written!");


            //                 firebase.auth()
            //                     .signOut()
            //                     .then(() => {
            //                         console.log('User signed out!')

            //                     });
            //                 console.log('User account created & signed in!');
            //                 setData({
            //                     ...data,
            //                     username: '',
            //                     password: '',
            //                     confirm_password: ' '
            //                 })
            //                 Alert.alert(
            //                     "Registration",
            //                     "Registered Successfully",
            //                     [
            //                         {
            //                             text: "OK", onPress: () => {
            //                                 console.log("OK Pressed")

            //                             }
            //                         }
            //                     ]
            //                 );
            //             })
            //             .catch((error) => {
            //                 console.error("Error writing document: ", error);
            //             });
            //     })
            //     .catch(error => {
            //         if (error.code === 'auth/email-already-in-use') {
            //             console.log('That email address is already in use!');
            //             Alert.alert(
            //                 "Error",
            //                 "Email Address is already in use",
            //                 [
            //                     {
            //                         text: "OK", onPress: () => {
            //                             console.log("OK Pressed")

            //                         }
            //                     }
            //                 ]
            //             );
            //         }
            //         if (error.code === 'auth/invalid-email') {
            //             Alert.alert(
            //                 "Error",
            //                 "Invalid Email Address",
            //                 [
            //                     {
            //                         text: "OK", onPress: () => {
            //                             console.log("OK Pressed")

            //                         }
            //                     }
            //                 ]
            //             );
            //         }
            //         console.log(error)
            //     });

            firebase.firestore().collection('apply')
                .add({
                    fname: data.fname,
                    lname: data.lname,
                    email: data.username,
                    password: data.password,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    city: data.city,
                    country: data.country,
                    bloodGroup: data.bloodGroup,
                    cnic: data.cnic,
                    userImg: downloadUrl,
                    createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
                })
                .then(() => {
                    console.log("Document successfully written!");
                    setData({
                        
                        username: '',
        password: '',
        confirm_password: '',
        fname: '',
        lname: '',
        cnic: '',
        country: '',
        city: '',
        bloodGroup: '',
        address: '',
        phoneNumber: '',
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        isValidConfirmPassword: true,
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
        emailError: '',
        passwordError: '',
        confirmPasswordError: '',
        imageError: ''
                    })
                    setImage(null)
                    setDownloadUrl(null)
                    Alert.alert(
                        "Registration",
                        "Account for registration applied successfully. You will received a verification email after admin approved your account registration request. After email verification you will able to login to your account"
                    );
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                    ALert.alert(error.code, error.message)
                });
        }
    }

    return (
        <View style={styles.container}>
            <ActionSheet
                ref={actionSheet}
                // Title of the Bottom Sheet
                title={'Please select your blood group type'}
                // Options Array to show in bottom sheet
                options={optionArray}
                // Define cancel button index in the option array
                // This will take the cancel option in bottom
                // and will highlight it
                cancelButtonIndex={8}
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
                title={'Upload Picture...! '}
                // Options Array to show in bottom sheet
                options={imageArray}
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

            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Apply for registeration now!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <ScrollView nestedScrollEnabled={true} contentContainerStyle={{ flexGrow: 1 }}>

                    <Text style={styles.text_footer}>Email</Text>
                    <View style={styles.action}>
                        {/* <FontAwesome
                            name="user-o"
                            color="#05375a"
                            size={20}
                        /> */}
                        <MaterialCommunityIcons name="email-outline" size={20} color="#05375a" />
                        <TextInput
                            placeholder="Your Email Address"
                            style={styles.textInput}
                            value={data.username}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={(val) => textInputChange(val)}
                        />
                        {data.check_textInputChange ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            : null}

                    </View>
                    {data.isValidUser ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>{data.emailError}</Text>
                        </Animatable.View>
                    }


                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Password"
                            secureTextEntry={data.secureTextEntry ? true : false}
                            style={styles.textInput}
                            value={data.password}
                            autoCapitalize="none"
                            onChangeText={(val) => handlePasswordChange(val)}
                        />
                        <TouchableOpacity
                            onPress={updateSecureTextEntry}
                        >
                            {data.secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="grey"
                                    size={20}
                                />
                                :
                                <Feather
                                    name="eye"
                                    color="grey"
                                    size={20}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    {data.isValidPassword ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>{data.passwordError}</Text>
                        </Animatable.View>
                    }

                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Confirm Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Confirm Your Password"
                            secureTextEntry={data.confirm_secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            value={data.confirm_password}
                            onChangeText={(val) => handleConfirmPasswordChange(val)}
                        />
                        <TouchableOpacity
                            onPress={updateConfirmSecureTextEntry}
                        >
                            {data.confirm_secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="grey"
                                    size={20}
                                />
                                :
                                <Feather
                                    name="eye"
                                    color="grey"
                                    size={20}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    {data.isValidConfirmPassword ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>{data.confirmPasswordError}</Text>
                        </Animatable.View>
                    }
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>First Name</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20}
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
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20}
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
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20}
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
                        <Feather
                            name="lock"
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
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                        <Text style={{ marginLeft: 20 }}>{data.bloodGroup}</Text>
                        <Button
                            onPress={showActionSheet}
                            buttonStyle={{ marginLeft: 20, backgroundColor: "#009387" }}
                            icon={
                                <Fontisto name="blood-drop" size={20} color={"white"} />
                            }
                            title="Choose Blood Group"
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
                    }]}>Phone Number</Text>
                    <PhoneInput
                        style={styles.phoneInput}
                        ref={phoneRef}
                        value={phoneNumber}
                        onChangePhoneNumber={setPhoneNumber}
                        initialCountry={'pk'}
                        onChangePhoneNumber={handlePhoneNumberChange}
                    />
                    {data.isValidPhoneNumber ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>{data.phoneNumberError}</Text>
                        </Animatable.View>
                    }
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>City</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
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
                            name="lock"
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
                    <Text style={[styles.text_footer, {
                        marginTop: 15, marginBottom: 15
                    }]}>Upload Profile Picture</Text>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => showImageActionSheet()}>
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
                                        uri: image,
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
                        {data.isValidImage || uploading ? null :
                            <Animatable.View animation="fadeInLeft" duration={500}>
                                <Text style={styles.errorMsg}>{data.imageError}</Text>
                            </Animatable.View>
                        }
                    </View>
                    {uploading ?
                        <View style={styles.container2}>
                            <ActivityIndicator size="small" color="#009387" />
                            <Text style={{ color: "#d3d3d3" }}>Upload is {transfered}% done</Text>
                        </View>
                        : null}

                    <View style={styles.textPrivate}>
                        <Text style={styles.color_textPrivate}>
                            By signing up you agree to our
                </Text>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Terms of service</Text>
                        <Text style={styles.color_textPrivate}>{" "}and</Text>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Privacy policy</Text>
                    </View>

                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={() => { signUp() }}
                        >
                            <LinearGradient
                                colors={['#08d4c4', '#01ab9d']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Register</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={[styles.signIn, {
                                borderColor: '#009387',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#009387'
                            }]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animatable.View>
        </View>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
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
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
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
});
