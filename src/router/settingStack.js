import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import Contact from '../screens/account/Contact';
import Identity from '../screens/account/Identity';
import Document from '../screens/account/Document';
import Agreement from '../screens/account/Agreement';
import Disclosure from '../screens/account/Disclosure';
import TrustedContact from '../screens/account/TrustedContact';


const SettingStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Contact" component={Contact} />
      <Stack.Screen name="Identity" component={Identity} />
      <Stack.Screen name="Document" component={Document} />
      <Stack.Screen name="Agreement" component={Agreement} />
      <Stack.Screen name="Disclosure" component={Disclosure} />
      <Stack.Screen name="TrustedContact" component={TrustedContact} />
    </Stack.Navigator>
  );
};


export default SettingStack;