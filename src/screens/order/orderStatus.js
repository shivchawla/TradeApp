import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { titleCase } from "title-case";

import { AppView, ConfirmButton, ShowJson, Icon, TinyTextButton} from '../../components/common';
import { useOrderDetail, getLatestTradingDay, getNextTradingDay } from '../../helper';
import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';
import { ORDER_MORE_FIELDS, AVAILABLE_TO_CANCEL_ORDER_STATUS, OPEN_ORDER_STATUS } from '../../config';
import { toTimeZoneDate, durationBetweenDates } from '../../utils';

const OrderStatusTop = ({orderDetail}) => {
	const {symbol, type, side} = orderDetail;
	const {theme, styles} = useStyles();
	
	return (
		<View style={styles.topContainerStyle}>
			<StyledText style={styles.topSymbol}>{symbol}</StyledText>
			<StyledText style={styles.topOrderType}>{side.toUpperCase()} {type.toUpperCase()}</StyledText>	
		</View>
	)
}

const OrderStatusSummary = ({orderDetail}) => {
	const {qty, status, limit_price, type, notional, id: orderId} = orderDetail;
	const {theme, styles} = useStyles();
	
	return (
		<View style={styles.summaryContainerStyle}>
			<StyledText style={styles.summaryStatus}>Order {titleCase(status)}</StyledText>
			<View style={styles.qtyContainer}>
				{!!qty && <StyledText style={styles.qty}>{qty.toUpperCase()} Shares </StyledText>}	
				{!!notional && <StyledText style={styles.qty}>{notional} USD</StyledText>}
				{type == "limit" && <StyledText style={styles.qty}>@ USD {limit_price}</StyledText>}
			</View>
			<StyledText style={styles.orderId}>Order# {orderId}</StyledText>		
		</View>
	)
}

const HorizontalWideField = ({label, value, value2}) => {
	const {theme, styles} = useStyles();

	return (
		<View style={styles.horizontalWideField}>
			<StyledText style={styles.horizontalFieldLabel}>{label}</StyledText>
			{!!value2 ?
				<View style={styles.horizontalFieldRightContainer}>
					<StyledText style={styles.horizontalFieldValue}>{value}</StyledText>
					<StyledText style={styles.horizontalFieldValue}>{value2}</StyledText>
				</View>
				:
				<StyledText style={styles.horizontalFieldValue}>{value}</StyledText>
			}
		</View>
	)
}

const OrderStatusMore = ({orderDetail}) => {
	const {theme, styles} = useStyles();
	return (
		<View style={styles.moreFieldsContainer}>
		{Object.keys(ORDER_MORE_FIELDS).map((key, index) => {
				if(!!orderDetail?.[key]){
					const isTime = key.includes("_at");
					const value = isTime ? toTimeZoneDate(orderDetail[key], "MMMM Do YYYY") : orderDetail[key].toUpperCase();
					const value2 = isTime ? toTimeZoneDate(orderDetail[key], "hh:mm:ss A" ) : null

					return <HorizontalWideField {...{key}} {...{label:ORDER_MORE_FIELDS[key], value, value2}} />
				}  
			})
		}
		</View>
	)
}

const OrderButton = ({title, onClick}) => {
	const {theme, styles} = useStyles();
	
	return (
		<TouchableOpacity onPress={onClick} activeOpacity={0.8} style={styles.orderButton}>
			<StyledText style={{color: theme.red, fontSize: WP(4.5)}}>{title}</StyledText>
		</TouchableOpacity>
	)
}

const OrderStatusButton = ({orderDetail}) => {
	const {theme, styles} = useStyles();
	const {status, id} = orderDetail;
	const navigation = useNavigation();

	const onCancel = (id) => {
		return navigation.navigate('UpdateOrder', {action: 'cancel', id})
	}

	return (
		<>
		{AVAILABLE_TO_CANCEL_ORDER_STATUS.includes(status) &&
			<OrderButton title="CANCEL" onClick={() => onCancel(id)}/>
		}
		</>
	)
}

const DisplayOutRTH = ({orderDetail}) => {
	const {theme, styles} = useStyles();

	const isOpen = OPEN_ORDER_STATUS.includes(orderDetail?.status);
	const [isAfterMarket, setAfterMarket] = useState(null);
	const [nextMarketOpen, setMarketOpen] = useState(null);
	
	React.useEffect(() => {
		const computeAfterMarket = async() => {
			const latestTradingDay = await getLatestTradingDay();
			const nextTradingDay = await getNextTradingDay();
			;
			const dayClose = toTimeZoneDate(latestTradingDay.date + ' ' + latestTradingDay.close);
			const dayOpen = toTimeZoneDate(latestTradingDay.date + ' ' + latestTradingDay.open);
			
			const orderTime = toTimeZoneDate(orderDetail?.submitted_at || orderDetail?.created_at);
			const durationClose = durationBetweenDates(dayClose, orderTime);
			const durationOpen = durationBetweenDates(orderTime, dayOpen);

			if (durationClose > 0 || durationOpen > 0) {
				setAfterMarket(true);
			}

			const nextOpen = toTimeZoneDate(nextTradingDay.date + ' ' + nextTradingDay.open, "Do MMM YYYY hh:mm A");
			
			if (durationOpen > 0) {
				setMarketOpen(dayOpen);
			} else {
				setMarketOpen(nextOpen);
			}
		}

		computeAfterMarket();

	}, []) 

	console.log("isOpen: ", isOpen);
	console.log("isAfterMarket: ", isAfterMarket);

	return (
		<>
		{(isOpen && isAfterMarket) &&
			<View style={styles.alertMessageContainer}>
				<StyledText style={styles.alertMessageTitle}>Order is placed after regular market hours.</StyledText>
				<StyledText style={styles.alertMessage}>It will be submitted at next market open on {nextMarketOpen} local time</StyledText>
			</View>
		}
		</>
	)	
}

const HeaderRight = ({symbol}) => {
	const navigation = useNavigation();
	const {theme, styles} = useStyles();

	return (
		<TouchableOpacity onPress={() => navigation.navigate('StockDetail', {symbol})}>
			<StyledText style={styles.viewSymbol}>View {symbol}</StyledText>
		</TouchableOpacity>
	)
}

const OrderStatus = (props) => {
	const {order, message, goBack} = props?.route?.params ?? {};

	const [orderDetail, setDetail] = useState(null);
	//Get Order Id and refetch the order (in case the status has changed)
	const {isError, getOrderDetail} = useOrderDetail(order?.id, {enabled: false})

	React.useEffect(() => {
		(async() => {
			if (order?.status == "new" || order?.type == "market") {
				const orderDetail = await getOrderDetail();
				if (!!orderDetail) {
					setDetail(orderDetail);
				}
			} else if(!!order) {
				setDetail(order);
			}
		})();

	}, []);


	const {symbol} = orderDetail ?? {};
	const {theme, styles} = useStyles();

	return (
		<AppView isLoading={!!!orderDetail && message == ''} scroll={false} goBack={goBack || true} headerRight={symbol && <HeaderRight {...{symbol}}/>} >
			{!!orderDetail &&
				<> 
				<OrderStatusTop {...{orderDetail}} />
				<OrderStatusSummary {...{orderDetail}} />
				<OrderStatusMore {...{orderDetail}} />
				<DisplayOutRTH {...{orderDetail}} />
				<OrderStatusButton {...{orderDetail}} />
				</>
			}
			{message && 
				<View style={{flex:1, alignItems: 'center'}}>
					<Icon iconName="close-circle-outline" iconColor={theme.error} iconSize={WP(15)} />
					<StyledText style={[styles.errorTitle, {marginTop: HP(1)}]}>ERROR</StyledText>
					<StyledText style={[styles.errorText, {marginTop: HP(30)}]}>{message}</StyledText>
					<TinyTextButton title="GO BACK" onPress={goBack} buttonStyle={{position: 'absolute', bottom: 20}} buttonTextStyle={{fontSize: WP(5)}}/>
				</View>
			}
		</AppView>
		
	);
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		topContainerStyle: {
			width: WP(90),
			marginTop: WP(5)
		},
		topSymbol: {
			fontSize: Typography.six
		},
		topOrderType: {
			fontSize: Typography.fourPointFive,
			color: theme.light,
		},
		summaryContainerStyle: {
			marginTop: WP(25),
			justifyContent: 'center',
			alignItems: 'center',
		},
		summaryStatus: {
			fontSize: WP(5.5)
		},
		qtyContainer: {
			flexDirection: 'row',
			marginTop: WP(2)
		},
		qty: {
			fontSize: Typography.fourPointFive,
			color: theme.light
		},
		orderId: {
			fontSize: Typography.threePointFive,
			color:theme.darkgrey,
			marginTop: WP(2)
		},
		moreFieldsContainer: {
			marginTop: WP(20)
		},
		horizontalWideField: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginTop: WP(3),
			alignItems: 'center'
		},
		horizontalFieldLabel: {
			fontSize: Typography.four,
			color: theme.light,
			justifyContent: 'center'
		},
		horizontalFieldRightContainer: {

		},
		horizontalFieldValue: {
			fontSize: Typography.four,
			color: theme.light,
			width: WP(35),
			textAlign: 'right'
		},
		viewSymbol: {
			fontSize: Typography.four,
			color: theme.green
		},
		orderButton :{
			position: 'absolute',
			bottom: HP(6),
			alignSelf: 'center'
		},
		alertMessageContainer: {
			backgroundColor: theme.grey9,
			padding: WP(5),
			// paddingLeft: WP(3),
			// paddingRight: WP(3),
			marginTop: WP(10),
		},
		alertMessageTitle: {
			fontSize: WP(4),
			color: theme.grey2
		},
		alertMessage: {
			marginTop: WP(1),
			color: theme.grey2
		},
		errorText: {
			color: theme.text,
			fontSize: WP(4.5)
		},
		errorTitle: {
			color: theme.error,
			fontSize: WP(6)
		}

	});

	return {theme, styles};
}

export default OrderStatus;
