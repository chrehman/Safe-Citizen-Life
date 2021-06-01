import React,{useState} from 'react';
import { Alert,
    View,
    Text,
    Button,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Input} from 'react-native-elements'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import { useTheme } from 'react-native-paper';

import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";


const ResetEmailScreen = () => {
    
    const { colors } = useTheme();
      const [data, setData] = React.useState({
        password: '',
        newEmail: '',
        secureTextEntry: true,
        new_secureTextEntry: true,
        isValidPassword: true,
        check_textInputChange: false,
        isValidNewEmail: true,
        passwordError:'',
        newEmailError:''
    });




    const handlePasswordChange = (val) => {
        if (val.trim().length >= 6) {
            setData({
                ...data,
                password: val,
                isValidPassword: true,
                passwordError:''
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false,
                passwordError:'Password must be 6 character long'
            });
        }
    }

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

    const handleNewEmailChange = (val) => {
        if (validate(val)) {
            setData({
                ...data,
                newEmail: val,
                check_textInputChange: true,
                isValidNewEmail: true,
                newEmailError:''
            })}
             else {
            setData({
                ...data,
                newEmail: val,
                check_textInputChange: false,
                isValidNewEmail: false,
                newEmailError:'Invalid Email'
                 })
             
            }
    }
    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const reset=()=>{
        if(data.password.length===0 ){
            setData({
                ...data,
                passwordError:"Password required",
                isValidPassword:false
            })
            return
        }
        if(data.newEmail.length===0 ){
            setData({
                ...data,
                newEmailError:"New Email Required",
                isValidNewEmail:false
            })
       }

        if(data.isValidPassword===true && data.isValidNewEmail===true ){
           console.log("HEllo")
            var user = firebase.auth().currentUser;
            // console.log(data.username)
            // console.log(data.password)
            var cred=firebase.auth.EmailAuthProvider.credential(user.email,data.password)
            user.reauthenticateWithCredential(cred).then(function() {
                // User re-authenticated.
                console.log("Re-authenticated")
                user.updateEmail(data.newEmail).then(function() {
                // Update successful.
                 
                 console.log("Email was changed successfully")
                 user.sendEmailVerification().then(function () {
                        // Email sent.
                        console.log("Verification Email Send")
                    }).catch(function (error) {
                        // An error happened.
                        console.log(error)
                    });   
                     firebase.firestore().collection('users')
                        .doc(user.uid)
                        .get()
                        .then((userDetail)=>{
                            if(userDetail.exists){
                                console.log("User Data ",userDetail.data())
                                var detail=userDetail.data()
                                firebase.firestore()
                                .collection('users')
                                .doc(user.uid)
                                .update({
                                    ...detail,
                                    email:data.newEmail
                                })
                                .then(()=>{
                                    console.log("FireStore Email Update")
                                    Alert.alert("Email Changed","Email was changed successfully")
                                    setData({
                                        ...data,
                                        password:'',
                                        newEmail:''
                                    })
                                })
                                .catch((err)=>{
                                    console.log(err)
                                    Alert.alert(err.code,err.message)
                                })                                
                            }
                        }).catch((error)=>{
                          console.log("Error",error)
                          Alert.alert(error.code,error.message)
                        })
                }).catch(function(error) {
                console.log(error)
                Alert.alert("Error",error)
                });
            }).catch(function(error) {
                // An error happened.
                console.log("Erorrr",error)
                Alert.alert("Error",error)
             });
        }
    }

     return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#009387' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Change Your Email Address Now!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <ScrollView>
                    <Text style={[styles.text_footer, {
                        marginTop: 35
                    }]}>Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                          
                        <Input
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
                    }]}>New Emaill Address</Text>
                    <View style={styles.action}>
                       <MaterialCommunityIcons name="email-outline" size={20} color={colors.text} />
                        <Input
                            placeholder=" Enter New Email Address"
                            style={styles.textInput}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={data.newEmail}
                            onChangeText={(val) => handleNewEmailChange(val)}
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
                    {data.isValidNewEmail ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>{data.newEmailError}</Text>
                        </Animatable.View>
                    }
                    
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={() => { reset() }}
                        >
                            <LinearGradient
                                colors={['#08d4c4', '#01ab9d']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Change Email</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animatable.View>
        </View>
    );
};

export default ResetEmailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
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
