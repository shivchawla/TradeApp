import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import Contact from '../screens/account/contact';
import Identity from '../screens/account/identity';
import Document from '../screens/account/document';
import Agreement from '../screens/account/agreement';
import Disclosure from '../screens/account/disclosure';
import TrustedContact from '../screens/account/trustedContact';


const SettingStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
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