import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import Market from '../screens/market';
import StockDetail from '../screens/market/stockDetail';
import commonOrderScreens from '../screens/order/common';


const MarketStack = () => {
  const common = commonOrderScreens(Stack);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Market" component={Market} />
      <Stack.Screen name="StockDetail" component={StockDetail} />
      {common}
    </Stack.Navigator>
  );
};


export default MarketStack;