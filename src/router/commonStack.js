import React, {useEffect} from 'react';

import PlaceOrder from '../screens/order/placeOrder';
import UpdateOrder from '../screens/order/updateOrder';
import OrderPreview from '../screens/order/orderPreview';
import OrderStatus from '../screens/order/orderStatus';
import ChooseStock from '../screens/order/chooseStock';
import CompletedOrders from '../screens/order/completedOrders';
import PendingOrders from '../screens/order/pendingOrders';
import StockDetail from '../screens/market/stockDetail';
import PortfolioStock from '../screens/portfolio/portfolioStock';

const innerScreens = (Stack) => {
  return [
      <Stack.Screen key="StockDetail" name="StockDetail" component={StockDetail} />,
      <Stack.Screen key="ChooseStock" name="ChooseStock" component={ChooseStock} />,
      <Stack.Screen key="PlaceOrder" name="PlaceOrder" component={PlaceOrder} />,
      <Stack.Screen key="UpdateOrder" name="UpdateOrder" component={UpdateOrder} /> ,
      <Stack.Screen key="OrderStatus" name="OrderStatus" component={OrderStatus} />,
      <Stack.Screen key="CompletedOrders" name="CompletedOrders" component={CompletedOrders} />,
      <Stack.Screen key="PendingOrders" name="PendingOrders" component={PendingOrders} />,
      <Stack.Screen key="PortfolioStock" name="PortfolioStock" component={PortfolioStock} />
  ];
};

export default innerScreens;
