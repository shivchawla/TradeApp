import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import Market from '../screens/market';
import StockDetail from '../screens/stockDetail';

const MarketStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Market" component={Market} />
      <Stack.Screen name="StockDetail" component={StockDetail} />
      <Stack.Screen name="PlaceOrder" component={PlaceOrder} />
      <Stack.Screen name="OrderStatus" component={OrderStatus} />
    </Stack.Navigator>
  );
};


export default MarketStack;