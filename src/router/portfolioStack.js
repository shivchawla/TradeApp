import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import Portfolio from '../screens/portfolio';
import PortfolioStockDetail from '../screens/portfolioStockDetail';
import commonOrderScreens from '../screens/order/common';

const PortfolioStack = () => {
  const common = commonOrderScreens(Stack);
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Portfoio" component={Portfolio} />
      <Stack.Screen name="PortfolioStockDetail" component={PortfolioStockDetail} />
      {common}
    </Stack.Navigator>
  );
};


export default MarketStack;