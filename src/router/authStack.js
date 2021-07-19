import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import SignIn from '../screens/auth/signIn';
import ForgotPassword from '../screens/auth/forgotPassword';
import OnboardStack from './onboardStack';

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="SignUp" component={onBoardStack} />
    </Stack.Navigator>
  );
};


export default AuthStack;