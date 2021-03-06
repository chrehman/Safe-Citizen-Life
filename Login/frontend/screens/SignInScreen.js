import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Alert,Linking
} from 'react-native';
import * as Animatable from 'react-native-animatable';
// import LinearGradient from 'react-native-linear-gradient';
import firebase from 'firebase/app';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

import { AuthContext } from '../components/context';

import Users from '../model/users';

const SignInScreen = ({ navigation }) => {

    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });

    const { colors } = useTheme();
    const  context  = React.useContext(AuthContext);
    const { authContext } = React.useContext(AuthContext);

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

    const textInputChange = (val) => {
        if (validate(val)) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        if (val.length >= 6) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if (val.length >= 4) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }

    const loginHandle = (username, password) => {

        let foundUser = {};

        console.log("HEllo")
        if (data.username.length == 0) {
            setData({
                ...data,
                isValidUser: false
            })
            return
        }
        if (data.password.length == 0 || data.password.length < 6) {
            setData({
                ...data,
                isValidPassword: false
            })
            return
        }

        // if (data.isValidUser && data.isValidPassword ) {
        //     fetch('http://192.168.1.4:3000/users/login', {
        //         method: 'POST',
        //         headers: {
        //             Accept: 'application/json',
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             username: data.username,
        //             password: data.password,
        //         })
        //     })
        //         .then((res => {
        //             return res.json()
        //         }))
        //         .then((result) => {
        //             if (result.err) {
        //                 console.log(result.err)
        //                 Alert.alert(
        //                     result.err.name,
        //                     result.err.message,
        //                     [
        //                         { text: "OK", onPress: () => console.log("OK Pressed") }
        //                     ]
        //                 );
        //                 return
        //             }
        //             console.log("Result", result)
        //             // const res=JSON.parse(result)
        //             foundUser={token:result.token,user:result.user}
        //             console.log("USEER",foundUser)
        //             Alert.alert(
        //                 "Login",
        //                 "Logged In Successfully",
        //                 [
        //                     {
        //                         text: "OK", onPress: () => {
        //                             console.log("OK Pressed")
        //                             setData({
        //                                 ...data,
        //                                 username: '',
        //                                 password: ''
        //                             })
        //                             console.log("DATA",data)
        //                         }
        //                     }
        //                 ]
        //             );
        //         })
        //         .catch((err) => {
        //             console.log("ERROR", err)
        //         })
        // }
        firebase.auth().signInWithEmailAndPassword(data.username, data.password)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                console.log("USERRRR", user)
                // var uid=user.uid
                // var email=user.email
                // var emailVerified=user.emailVerified
                // var token=user.accessToken

                // console.log("id",uid)
                // console.log("email",email)
                // console.log(emailVerified)
                // console.log(token)
                authContext.signIn(user);
                // ...
            })
            .catch((error) => {
                Alert.alert(error.code,error.message)
            });
        
    }
    // console.log("Context",context)
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#2089dc' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Welcome!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={[styles.footer, {
                    backgroundColor: colors.background
                }]}
            >
                <Text style={[styles.text_footer, {
                    color: colors.text
                }]}>Email</Text>
                <View style={styles.action}>
                    <MaterialCommunityIcons name="email-outline" size={20} color={colors.text} />
                    <TextInput
                        placeholder="Your Email Address"
                        placeholderTextColor="#666666"
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        autoCapitalize="none"
                        value={data.username}
                        keyboardType="email-address"
                        onChangeText={(val) => textInputChange(val)}
                    // onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
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
                        <Text style={styles.errorMsg}>Invalid Email .</Text>
                    </Animatable.View>
                }


                <Text style={[styles.text_footer, {
                    color: colors.text,
                    marginTop: 35
                }]}>Password</Text>
                <View style={styles.action}>
                    <Feather
                        name="lock"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="Your Password"
                        placeholderTextColor="#666666"
                        value={data.password}
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
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
                        <Text style={styles.errorMsg}>Password must be 6 characters long.</Text>
                    </Animatable.View>
                }

                <TouchableOpacity onPress={()=> navigation.navigate('ForgotPasswordScreen')}>
                    <Text style={{ color: '#2089dc', marginTop: 15 }}>Forgot password?</Text>
                </TouchableOpacity>
                <View style={styles.button}>
                  
                     <TouchableOpacity
                            style={styles.signIn}
                            onPress={() => { loginHandle(data.username, data.password) }}
                        >
                            <LinearGradient
                                colors={['#2089dc', '#2089dc']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Sign In</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('SignUpScreen')}
                        style={[styles.signIn, {
                            borderColor: '#2089dc',
                            borderWidth: 1,
                            marginTop: 15
                        }]}
                    >
                        <Text style={[styles.textSign, {
                            color: '#2089dc'
                        }]}>Register</Text>
                    </TouchableOpacity>
                    
                    {/* <Button onPress={() => Linking.openURL() } */}
      {/* title="support@example.com" /> */}
                </View>
            </Animatable.View>
        </View>
    );
};

export default SignInScreen;

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
        flex: 3,
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
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
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
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});
