import React from 'react';
import { View, Text } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../containers/LoginScreen'
import SignupScreen from '../containers/SignupScreen'

const Stack = createStackNavigator();
export default function AuthStack() {
  return (
    
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>

  );
}