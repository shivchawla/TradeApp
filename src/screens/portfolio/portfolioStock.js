import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {AppView} from '../../components/common';
import StockPosition from '../../components/stockPosition' 
import SingleStock from '../../components/singleStock' 
import { TradeHistory, OpenOrders } from '../../components/stockActivity';

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