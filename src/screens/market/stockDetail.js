import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';

import { AppView, FavoriteIcon } from '../../components/common';
import { StockChart, TradeButtons, StockPosition, 
	StockOrders, StockDetailTop, StockMarketData } from '../../components/market';

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

	const styles = useStyles();

	return (
		<AppView headerRight={<FavoriteIcon />} footer={<TradeButtons {...{onBuy, onSell}} />} title={symbol} footerContainerStyle={styles.footer}>
			<StockDetailTop {...{symbol}} />
			<StockChart {...{symbol, size: 'L', timeframe: '5Day'}} style={styles.chartContainer} />
			<StockPosition {...{symbol}} />
			<StockOrders {...{symbol}} />
			<StockMarketData {...{symbol}} />
			<View style={styles.empty}></View>
		</AppView>
	);
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		chartContainer: {
			paddingTop: HP(5)
		},
		empty: {
			height: HP(20)
		},
		footer: {
			backgroundColor: theme.grey10
		}

	});

	return styles;
}

export default StockDetail;