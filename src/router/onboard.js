import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import Onboard from '../screens/onboard';
import StartKyc from '../screens/onboard/kyc';

const OnboardStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Onboard" component={Onboard} />
      <Stack.Screen name="StartKyc" component={StartKyc} />
    </Stack.Navigator>
  );
};

export default OnboardStack;
