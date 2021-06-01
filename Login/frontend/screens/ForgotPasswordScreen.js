import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Alert, Linking
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

const ForgotPasswordScreen = ({ navigation }) => {

    const [data, setData] = React.useState({
        username: '',
        check_textInputChange: false,
        isValidUser: true,
    });

    const { colors } = useTheme();

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

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }



    const loginHandle = (username, password) => {


        console.log("HEllo")
        if (data.username.length == 0) {
            setData({
                ...data,
                isValidUser: false
            })
            return
        }
        var auth = firebase.auth();

        auth.sendPasswordResetEmail(data.username).then(function () {
            // Email sent.
            Alert.alert('Email Sent',"Password recovery link has been sent to your email address")
        }).catch(function (error) {
            // An error happened.
            console.log(error)
            Alert.alert(error.code,error.message)
        });

    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#2089dc' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Recover Password Now!</Text>
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
                        <Text style={styles.errorMsg}>Invalid Email </Text>
                    </Animatable.View>
                }


                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => { loginHandle(data.username) }}
                    >
                        <LinearGradient
                            colors={['#2089dc', '#2089dc']}
                            style={styles.signIn}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Send Recovery Link</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={styles.button}>
                   
                     <TouchableOpacity
                            onPress={() => navigation.navigate('SignInScreen')}
                            style={[styles.signIn, {
                                borderColor: '#2089dc',
                                borderWidth: 1,
                                
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#2089dc'
                            }]}>Back To Sig In</Text>
                        </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default ForgotPasswordScreen;

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
