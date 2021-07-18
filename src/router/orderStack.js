import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import ChooseStock from '../screens/chooseStock';
import PlaceOrder from '../screens/placeOrder';
import OrderStatus from '../screens/orderStatus';

const OrderStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChooseStock" component={ChooseStock} />
      <Stack.Screen name="PlaceOrder" component={PlaceOrder} />
      <Stack.Screen name="OrderStatus" component={OrderStatus} />
    </Stack.Navigator>
  );
};


export default OrderStack;