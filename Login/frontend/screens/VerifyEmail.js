import React from 'react';
import { View, Text, Button, StyleSheet,Linking } from 'react-native';

const VerifyEmail = () => {
    
    return (
      <View style={styles.container}>
        <Text>Please Verify Email Address</Text>
      <Button onPress={() => Linking.openURL(
          'mailto:abc@xyz.com'
      ) }
      title="Verify Email Address" />
      </View>
    );
};

export default VerifyEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
