import React, {useState} from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { AppView, FavoriteIcon, Collapsible } from '../../components/common';
import { StockChart, TradeButtons, StockPosition, 
	StockOrders, StockDetailTop, StockMarketData, StockNews } from '../../components/market';

import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';
import {deviceWidth, deviceHeight} from '../../utils';

//WORKS but SA (or google) doesn't allow Google auth in webview 
//Hence, rendering this feature useless.Instead open directly in browser

const ViewNews = (props) => {
	const {symbol, url} = props.route.params;
	const {theme, styles} = useStyles();

	return (
		<AppView title={`NEWS - ${symbol}`} padding={0} scroll={false}>
			<WebView 
				source={{ uri: url }} 
				originWhitelist={['*']}
				width={deviceWidth}
				height={deviceHeight}
				scalesPageToFit={true}
				javascriptEnabled={false}
				domStorageEnabled={false}
				thirdPartyCookiesEnabled={false}
				style={styles.webViewContainer}
			/>
		</AppView>
	);
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		webViewContainer: {
			flexGrow: 1,
			width: '100%'
		}	

	});

	return {theme, styles};
}

export default ViewNews;