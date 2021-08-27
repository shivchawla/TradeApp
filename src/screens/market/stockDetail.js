import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';

import { AppView, FavoriteIcon, Collapsible } from '../../components/common';
import { StockChart, TradeButtons, StockPosition, 
	StockOrders, StockDetailTop, StockMarketData, StockNews } from '../../components/market';

import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';
import { useAssetData } from  '../../helper';

const StockDetail = (props) => {
	const {symbol} = props.route.params;
	const {navigation} = props;

	const {asset} = useAssetData(symbol);

	const onBuy = () => {
		navigation.navigate('PlaceOrder', {symbol, action: "BUY", fractionable: asset?.fractionable});
	}

	const onSell = () => {
		navigation.navigate('PlaceOrder', {symbol, action: "SELL", fractionable: asset?.fractionable});		
	}

	const styles = useStyles();

	return (
		<AppView 
			title={symbol} 
			headerRight={<FavoriteIcon />} 
			footer={<TradeButtons {...{onBuy, onSell}} />} 
			footerContainerStyle={styles.footer}
		>	
			<StockDetailTop {...{symbol}} />
			<Collapsible 
				title="PRICE CHART" 
				containerStyle={{marginBottom: HP(3)}}
				content={<StockChart {...{symbol, size: 'L', timeframe: '5Day'}} style={styles.chartContainer} />}
			/>
			<StockMarketData {...{symbol}} />
			
			<StockPosition {...{symbol}} />
			<StockOrders {...{symbol}} />
			<StockNews {...{symbol}} />

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