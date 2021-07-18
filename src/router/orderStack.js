import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import ChooseStock from '../screens/chooseStock';
import commonOrderScreens from '../screens/order/common';

const OrderStack = () => {
  
  const common = commonOrderScreens(Stack);

  return (
    <Stack.Navigator>
      <Stack.Screen name="ChooseStock" component={ChooseStock} />
      {common}
    </Stack.Navigator>
  );
};


export default OrderStack;