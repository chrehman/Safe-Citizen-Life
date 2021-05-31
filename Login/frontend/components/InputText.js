import React from 'react'
import { View, Text } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';


export default function InputText() {
    return (
        <View>
           
            <Input
                 placeholder='INPUT WITH ICON'
                leftIcon={{ type: 'font-awesome', name: 'chevron-right' }}
            />
            <Input
                placeholder='INPUT WITH CUSTOM ICON'
                leftIcon={
                    <Icon
                        name='user'
                        size={24}
                        color='black'
                    />
                }
            />
        </View>
    )
}
