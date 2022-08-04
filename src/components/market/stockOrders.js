import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { titleCase } from "title-case";

import { ShowJson, Collapsible  } from '../common';
import { DisplayOrder } from '../order';
import { useTheme, StyledText, Typography, WP, HP, Colors, getPnLColor }  from '../../theme';
import { OPEN_ORDER_STATUS } from '../../config';
import { useOrders, useLatestTradingDay, useSymbolActivity } from '../../helper';

const StockOrderHeader = ({orders}) => {
	const {theme, styles} = useStyles();
	
	const countOpenOrders = (orders) => {
		return orders.filter(item => OPEN_ORDER_STATUS.includes(item.status)).length
	}

	return (
		<View style={styles.ordersHeaderContainer}>
			<View style={styles.ordersSummaryContainer}>
				<StyledText style={styles.ordersCount}>{countOpenOrders(orders)}/{orders.length}</StyledText>	
			</View>
		</View>
	)
}

const StockOrderList = ({orders}) => {
	const {theme, styles} = useStyles();

	return ( 
		<View style={styles.orderListContainer}>
			{ orders.map((order, index) => {
					return <DisplayOrder key={index} {...{order}} showSymbol={true} showIcon={true} />	
				})
			}
		</View>
	)
}

const ShowOrders = ({orders}) => {
	const {theme, styles} = useStyles();
	
	return (
		<>
		{!!orders && orders.length > 0 &&
			<View style={styles.ordersContainer}>
				<StockOrderList {...{orders}} />
			</View>
		}
		</>
	)
}

const StockOrdersWithSymbol = ({symbol}) => {
	const {theme, styles} = useStyles();

	const latestTradingOpen = useLatestTradingDay();
	const {activity} = useSymbolActivity(symbol)
	
	const {orders: openOrders, getOrders: getOpenOrders} = useOrders({symbol, status: 'open'});
	const {orders: closedOrders, getOrders: getClosedOrders} = useOrders({symbol, status: 'closed', after: latestTradingOpen}, {enabled: !!latestTradingOpen});
	
	const fetchOrders = () => {
		// console.log("Fetch Orders");
		// console.log("latestTradingOpen");
		// console.log(latestTradingOpen);
		
		if (!!latestTradingOpen) {
			getClosedOrders();
			getOpenOrders();
		}
	}

	useFocusEffect(
		React.useCallback(() => {
			// console.log("Stock Orders focused!!!!");
			fetchOrders();
		}, [latestTradingOpen, activity])
	);


	// console.log("OpenOrders");
	// console.log(openOrders);
	// console.log("closedOrders");
	// console.log(closedOrders);
	const orders = (openOrders || []).concat(closedOrders || []);

	// console.log("Re-render STOCK ORDERS");
	return (
		<>
		{!!orders && orders.length > 0 &&
		<Collapsible		
			title="YOUR ORDERS"
			content={<ShowOrders {...{orders}} />}
			summary={<StockOrderHeader {...{orders}} />}
			summaryInline={true}
		/>
		}
		</>
	)
}


export const StockOrders = ({symbol, orders}) => {

	return (
		<>
			{orders ? <ShowOrders {...{orders}} /> 
				: symbol ? <StockOrdersWithSymbol {...{symbol}} />
				: <></>
			}
		</>
	)	
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		ordersContainer: {
			width: '100%',
			paddingTop: WP(4),
			// flex:1,
		},
		orderListContainer: {
			// width: '100%',
			// flexDirection: 'column',
			// flex: 1
			// justifyContent: 'center',
			// alignItems: 'center'
		},
		ordersHeaderContainer: {
			width: '100%',
			flexDirection: 'row',
			// marginTop: WP(3),
			marginBottom: WP(5),
			justifyContent:'space-between',
			paddingLeft: WP(1),
			backgroundColor: theme.background
		},
		showHideButton: {
			marginRight: WP(2),
			marginLeft: WP(2), 
			justifyContent: 'center'
		},
		ordersHeaderTitle: {
			fontSize: Typography.five,
			color: theme.darkgrey,

			paddingLeft: WP(2),
		},
		ordersSummaryContainer: {
			flexDirection: 'row',
			// paddingRight: WP(2),
			alignItems: 'center'
		},
		ordersSummaryField: {
			marginRight: WP(3),
			flexDirection: 'row'
		},
		ordersSummaryFieldLabel: {
			color: theme.darkgrey
		},
		orderFieldContainer: {
			// flexDirection:'row',
			width: '100%',
			paddingLeft: WP(5),
			paddingRight: WP(5),
			marginBottom: WP(7),
			justifyContent: 'space-between'
		},
		ordersFieldLabel: {
			fontWeight: '400',
			fontSize: Typography.four, 
			color: theme.light
		},
		ordersFieldValue: {
			fontSize: Typography.four, 
			color: theme.verydarkgrey
		}

	});

	return {theme, styles};
};

