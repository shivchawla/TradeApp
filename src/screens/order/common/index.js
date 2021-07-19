import React, {useEffect} from 'react';
import PlaceOrder from '../placeOrder';
import OrderStatus from '../orderStatus';

const commonOrderScreens = (Stack) => {
  return [
      <Stack.Screen name="PlaceOrder" component={PlaceOrder} /> ,
      <Stack.Screen name="OrderStatus" component={OrderStatus} />
  ];
};


export default commonOrderScreens;