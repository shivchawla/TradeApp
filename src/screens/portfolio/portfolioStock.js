import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {AppView} from '../../components/common';
import { SingleStock, StockPosition, 
	TradeHistory, OpenOrders } from '../../components/market' 

const PortfolioStock = ({symbol, position}) => {

	return (
		<AppView title="Portfolio Stock Screen">
			<SingleStock {...{symbol}} />
			<StockPosition {...{symbol, position}} />
			<TradeHistory {...{symbol}} />
			<OpenOrders {...{symbol}} />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default PortfolioStock;