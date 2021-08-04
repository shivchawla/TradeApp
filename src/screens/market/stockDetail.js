import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import StockChart from '../../components/stockChart';
import TradeButtons from '../../components/tradeButtons';
import StockPosition from '../../components/stockPosition';
import OrderList from '../../components/orderList';
import StockDetailTop from '../../components/stockDetailTop';

import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';

const StockDetail = (props) => {
	const {symbol} = props.route.params;
	const {navigation} = props;
	const onBuy = () => {
		navigation.navigate('PlaceOrder', {symbol, action: "BUY"});
	}

	const onSell = () => {
		navigation.navigate('PlaceOrder', {symbol, action: "SELL"});		
	}

	return (
		<AppView footer={<TradeButtons {...{onBuy, onSell}}/>} title={symbol}>
			<StockDetailTop {...{symbol}} />
			<StockChart {...{symbol, size: 'L', timeframe: '5Day'}} style={styles.chartContainer} />
			<StockPosition {...{symbol}} />
			<OrderList {...{symbol}} />
		</AppView>
	);
}

const styles = StyleSheet.create({
	chartContainer: {
		paddingTop: HP(5)
	}

});

export default StockDetail;