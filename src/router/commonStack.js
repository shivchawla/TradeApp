import React, {useEffect} from 'react';

import PlaceOrder from '../screens/order/placeOrder';
import UpdateOrder from '../screens/order/updateOrder';
import OrderStatus from '../screens/order/orderStatus';
import OrderDetail from '../screens/order/orderDetail';
import ChooseStock from '../screens/order/chooseStock';
import CompletedOrders from '../screens/order/completedOrders';
import PendingOrders from '../screens/order/pendingOrders';
import StockDetail from '../screens/market/stockDetail';
import PortfolioStock from '../screens/portfolio/portfolioStock';

//Where to show canceled orders?

const innerScreens = (Stack) => {
  return [
      <Stack.Screen key="StockDetail" name="StockDetail" component={StockDetail} />,
      <Stack.Screen key="ChooseStock" name="ChooseStock" component={ChooseStock} />,
      <Stack.Screen key="PlaceOrder" name="PlaceOrder" component={PlaceOrder} />,
      <Stack.Screen key="UpdateOrder" name="UpdateOrder" component={UpdateOrder} /> ,
      <Stack.Screen key="OrderStatus" name="OrderStatus" component={OrderStatus} />,
      <Stack.Screen key="OrderDetail" name="OrderDetail" component={OrderDetail} />,
      <Stack.Screen key="TradeDetail" name="TradeDetail" component={TradeDetail} />,
      <Stack.Screen key="OrdersTrades" name="OrdersTrades" component={OrdersTrades} />,
      <Stack.Screen key="PortfolioStock" name="PortfolioStock" component={PortfolioStock} />
  ];
};

export default innerScreens;
