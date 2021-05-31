import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
// import InputText from '../components/InputText.js'

import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
export default function LoginScreen({ navigation }) {
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")

  return (
    <View>
      <View style={{ alignItems: "center", padding: 50 }}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>Citizen Login</Text>
      </View>


      <Input
        placeholder='Enter Email '
        leftIcon={
          <MaterialCommunityIcons name="email-outline" size={24} color="black" />
        }
        errorMessage=" "
      />
      <Input
        placeholder='Enter Password '
        leftIcon={
          <MaterialIcons name="lock-outline" size={24} color="black" />
        }
        secureTextEntry={true}
        errorMessage=""
      />
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.2}
        >
          <Text style={{ fontSize: 15, color: "blue" }}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <Button
        buttonStyle={{ backgroundColor: 'red', marginTop: 10, marginBottom: 10 }}
        icon={
          <FontAwesome name="sign-in" size={24} color="white" />
        }
        title="  Sign In"
        onPress={() => navigation.push('Signup')}
      />

      <Button
        icon={
          <Feather name="user-plus" size={24} color="white" />
        }
        title="  Sign Up"
        onPress={() => navigation.push('Signup')}
      />
    </View>
  )
}

const styles = StyleSheet.create({})
