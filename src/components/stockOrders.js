import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import ShowJson from './showJson';
import { useTheme, StyledText, Typography, WP, HP, Colors, getPnLColor }  from '../theme';
import { OPEN_ORDER_STATUS } from '../config';
import { useOrders, useLatestTradingDay, useSymbolActivity } from '../helper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

const OrderField = ({order}) => {
	const theme = useTheme();
	const styles = useStyles();

	return (
		<View style={styles.orderFieldContainer}>
			<View style={{flexDirection: 'row'}}>
				<StyledText style={styles.ordersFieldLabel}>{order.side.toUpperCase()} {order.qty || `USD ` + order.notional}</StyledText>
				<StyledText style={[styles.ordersFieldLabel, {marginLeft: WP(2)}]}>{order.type.toUpperCase()} {order.type == "limit" ? `@ ` + order.limit_price : ''}</StyledText>
			</View>
			<StyledText style={styles.ordersFieldLabel}>{order.status.toUpperCase()}</StyledText>
		</View>
	);
}


const ShowHideButton = ({showDetail, onToggle}) => {
	const styles = useStyles();
	const theme = useTheme();
	return(
		<TouchableOpacity onPress={onToggle} style={styles.showHideButton}>
			<Ionicons name={showDetail ? "chevron-up" : "chevron-down"} color={theme.backArrow} size={WP(5)} />
		</TouchableOpacity>
	)
}

const StockOrderHeader = ({orders, onToggle, showDetail}) => {
	const styles = useStyles();
	
	const countOpenOrders = (orders) => {
		return orders.filter(item => OPEN_ORDER_STATUS.includes(item.status)).length
	}

	return (
		<View style={styles.ordersHeaderContainer}>
			<StyledText style={styles.ordersHeaderTitle}>Your Orders</StyledText>
			<View style={styles.ordersSummaryContainer}>
				<StyledText style={styles.ordersCount}>{countOpenOrders(orders)}/{orders.length}</StyledText>	
			 	<ShowHideButton {...{onToggle, showDetail}}/>
			</View>
		</View>
	)
}

const StockOrderList = ({orders}) => {
	const styles = useStyles();

	return ( 
		<View style={styles.orderListContainer}>
			{ orders.map((order, index) => {
					return <OrderField key={index} {...{order}} />	
				})
			}
		</View>
	)
}

const ShowOrders = (orders) => <ShowJson json={orders || {}} />

const StockOrdersWithSymbol = ({symbol}) => {
	const latestTradingOpen = useLatestTradingDay();
	const {activity} = useSymbolActivity(symbol)
	
	const {getOrders: getOpenOrders} = useOrders({symbol, status: 'open'}, {enabled: false});
	const {getOrders: getClosedOrders} = useOrders({symbol, status: 'closed', after: latestTradingOpen}, {enabled: false});
	
	const [showDetail, setShow] = useState(true);
	const [orders, setOrders] = useState(null);

	const styles = useStyles();

	// const navigation = useNavigation();

	// React.useEffect(() => {
	// 	const refetchOnFocus = navigation.addListener('focus', () => {
	// 	    if (refetch) {
	// 	      refetch();
	// 	    }
	// 	});

	// 	return refetchOnFocus;
	// }, [navigation]); // Run Effect only on changing Nav (to prevent re-renders)

	const fetchOrders = async() => {
		console.log("Fetch Orders");
		console.log("latestTradingOpen");
		console.log(latestTradingOpen);
		
		if (!!latestTradingOpen) {
			const closedOrders = await getClosedOrders();
			const openOrders = await getOpenOrders();
			setOrders((openOrders || []).concat(closedOrders || []));
		}
	}

	//This is cool -- run on focus
	useFocusEffect(
		React.useCallback(() => {
			console.log("Stock Orders focused!!!!");
			fetchOrders();
		}, [latestTradingOpen, activity])
	);

	// React.useEffect(() => {
	// 	console.log("Stock Orders - Symbol activity changed");
	// }, [activity])

	// React.useEffect(() => {
	// 	console.log("Stock Orders - latestTradingOpen changed ", latestTradingOpen);
	// }, [latestTradingOpen])


	// React.useEffect(() => {
	// 	console.log("Use Effect for StockOrdersWithSymbol")
	// 	console.log("latestTradingOpen");
	// 	console.log(latestTradingOpen);

	// 	if (!!latestTradingOpen) {
	// 		fetchOrders();
	// 	}
	
	// }, [latestTradingOpen]);

	
	return (
		<>
		{!!orders && orders.length > 0 &&
			<View style={styles.ordersContainer}>
				<StockOrderHeader {...{orders, showDetail}} onToggle={() => setShow(!showDetail)}/> 
				{showDetail && <StockOrderList {...{orders}} />}
			</View>
		}
		</>
	);	
}

const StockOrders = ({symbol, orders}) => {

	return (
		<>
			{orders ? <ShowOrder json={orders} /> 
				: symbol ? <StockOrdersWithSymbol {...{symbol}} />
				: <ShowJson json = {{error: "No orders found"}} />
			}
		</>
	)	
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		ordersContainer: {
			width: WP(100),
			borderTopWidth:1,
			borderColor: theme.darkgrey,
			paddingTop: WP(4),
			flex:1,
		},
		orderListContainer: {
			width: WP(100),
			flexDirection: 'column',
			flex: 1
		},
		ordersHeaderContainer: {
			width: WP(100),
			flexDirection: 'row',
			// marginTop: WP(3),
			marginBottom: WP(5),
			justifyContent:'space-between'
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
			flexDirection:'row',
			width: '100%',
			paddingLeft: WP(5),
			paddingRight: WP(5),
			marginBottom: WP(2),
			justifyContent: 'space-between'
		},
		ordersFieldLabel: {
			fontWeight: '400',
			fontSize: Typography.four, 
			color: theme.light, 
		},
		ordersFieldValue: {
			fontSize: Typography.fourPointFive, 
			color: theme.ordersValue
		}

	});

	return styles;
};

export default StockOrders;