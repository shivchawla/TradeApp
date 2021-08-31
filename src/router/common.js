import React, {useEffect} from 'react';

import PlaceOrder from '../screens/order/placeOrder';
import UpdateOrder from '../screens/order/updateOrder';
import OrderStatus from '../screens/order/orderStatus';
import OrderDetail from '../screens/order/orderDetail';
import TradeDetail from '../screens/order/tradeDetail';
import ChooseStock from '../screens/order/chooseStock';
// import CompletedOrders from '../screens/order/completedOrders';
// import PendingOrders from '../screens/order/pendingOrders';
import OrdersTrades from '../screens/order/ordersTrades';
import StockDetail from '../screens/market/stockDetail';
import SearchStock from '../screens/market/searchStock';

import AddWatchlist from '../screens/watchlist/addWatchlist';
import ManageWatchlist from '../screens/watchlist/manageWatchlist';
import EditWatchlist from '../screens/watchlist/editWatchlist';

import History from '../screens/history';

import SelectLanguage from '../screens/settings/language';
import DownloadDocument from '../screens/settings/documents';
import UserSettings from '../screens/settings/user';


const innerScreens = (Stack) => {
  return [
      <Stack.Screen key="StockDetail" name="StockDetail" component={StockDetail} />,
      <Stack.Screen key="SearchStock" name="SearchStock" component={SearchStock} />,
      
      <Stack.Screen key="AddWatchlist" name="AddWatchlist" component={AddWatchlist} />,
      <Stack.Screen key="ManageWatchlist" name="ManageWatchlist" component={ManageWatchlist} />,
      <Stack.Screen key="EditWatchlist" name="EditWatchlist" component={EditWatchlist} />,
      
      <Stack.Screen key="ChooseStock" name="ChooseStock" component={ChooseStock} />,
      <Stack.Screen key="PlaceOrder" name="PlaceOrder" component={PlaceOrder} />,
      <Stack.Screen key="UpdateOrder" name="UpdateOrder" component={UpdateOrder} /> ,
      <Stack.Screen key="OrderStatus" name="OrderStatus" component={OrderStatus} />,
      <Stack.Screen key="OrderDetail" name="OrderDetail" component={OrderDetail} />,
      <Stack.Screen key="TradeDetail" name="TradeDetail" component={TradeDetail} />,
      <Stack.Screen key="OrdersTrades" name="OrdersTrades" component={OrdersTrades} />,

      <Stack.Screen key="History" name="History" component={History} />,

      <Stack.Screen key="SelectLanguage" name="SelectLanguage" component={SelectLanguage} />,
      <Stack.Screen key="DownloadDocument" name="DownloadDocument" component={DownloadDocument} />,
      <Stack.Screen key="UserSettings" name="UserSettings" component={UserSettings} />,
  
  ];
};

export default innerScreens;
