import React from 'react'
import { StyleSheet, Text, View,Button } from 'react-native'

export default function SignupScreen({navigation}) {
    return (
        <View>
             <Text>SignUP Screen</Text>
            <Button
        title="Go to Login"
        onPress={() => navigation.push('Login')}
      />
        </View>
    )
}

const styles = StyleSheet.create({})
