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

import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";


const ResetPasswordScreen = () => {
    
      const [data, setData] = React.useState({
        password: '',
        new_password: '',
        secureTextEntry: true,
        new_secureTextEntry: true,
        isValidPassword: true,
        isValidNewPassword: true,
        passwordError:'',
        newPasswordError:''
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


    const handleNewPasswordChange = (val) => {
        if (val.trim().length >= 6) {
            setData({
                ...data,
                new_password: val,
                isValidNewPassword: true,
                newPasswordError:''
            });
        } else {
            setData({
                ...data,
                new_password: val,
                isValidNewPassword: false,
                newPasswordError:'Password must be 6 character long'
            });
        }
    }
    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateNewSecureTextEntry = () => {
        setData({
            ...data,
            New_secureTextEntry: !data.New_secureTextEntry
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
        if(data.new_password.length===0 ){
            setData({
                ...data,
                newPasswordError:"New Password Required",
                isValidNewPassword:false
            })
            return
        }

        if(data.isValidPassword===true && data.isValidNewPassword===true ){
           console.log("HEllo")
            var user = firebase.auth().currentUser;
            // console.log(data.username)
            // console.log(data.password)
            var cred=firebase.auth.EmailAuthProvider.credential(user.email,data.password)
            user.reauthenticateWithCredential(cred).then(function() {
                // User re-authenticated.
                console.log("Re-authenticated")
                user.updatePassword(data.new_password).then(function() {
                // Update successful.
                 console.log("Password was changed succesfully")
                  Alert.alert("Password Changed","Password was changed succesfully")   
                 setData({
                     ...data,
                     password:'',
                     new_password:''
                 })
                }).catch(function(error) {
                // An error happened.
                console.log(error)
                 Alert.alert("Error",error.message)
                });
            }).catch(function(error) {
                // An error happened.
                console.log("Erorrr",error)
                Alert.alert("Error",error.message)
             });
        }
    }
    
     return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#2089dc' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Change Your Password Now!</Text>
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
                    }]}>New Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                        <Input
                            placeholder=" Enter New Password"
                            secureTextEntry={data.new_secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            value={data.new_password}
                            onChangeText={(val) => handleNewPasswordChange(val)}
                        />
                        <TouchableOpacity
                            onPress={updateNewSecureTextEntry}
                        >
                            {data.new_secureTextEntry ?
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
                    {data.isValidNewPassword ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>{data.newPasswordError}</Text>
                        </Animatable.View>
                    }
                    
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={() => { reset() }}
                        >
                            <LinearGradient
                                colors={['#2089dc', '#2089dc']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Change Password</Text>
                            </LinearGradient>
                        </TouchableOpacity>
{/* 
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={[styles.signIn, {
                                borderColor: '#2089dc',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#2089dc'
                            }]}>Sign In</Text>
                        </TouchableOpacity> */}
                    </View>
                </ScrollView>
            </Animatable.View>
        </View>
    );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2089dc'
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
