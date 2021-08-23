import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { titleCase } from "title-case";

import { AppView, ShowJson } from '../../components/common';
import { useOrderDetail,  } from '../../helper';
import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';
import { ORDER_MORE_FIELDS, AVAILABLE_TO_CANCEL_ORDER_STATUS } from '../../config';
import { toTimeZoneDate } from '../../utils';

const OrderStatusTop = ({orderDetail}) => {
	const {symbol, type, side} = orderDetail;
	const styles = useStyles();
	
	return (
		<View style={styles.topContainerStyle}>
			<StyledText style={styles.topSymbol}>{symbol}</StyledText>
			<StyledText style={styles.topOrderType}>{side.toUpperCase()} {type.toUpperCase()}</StyledText>	
		</View>
	)
}

const OrderStatusSummary = ({orderDetail}) => {
	const {qty, status, limit_price, type, notional, id: orderId} = orderDetail;
	const styles = useStyles();
	
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
	const styles = useStyles();

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
	const styles = useStyles();
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
	const styles = useStyles();
	
	return (
		<TouchableOpacity onPress={onClick} style={styles.button}>
			<StyledText>{title}</StyledText>
		</TouchableOpacity>
	)
}

const OrderStatusButton = ({orderDetail}) => {
	const styles = useStyles();
	const {status, id} = orderDetail;
	const navigation = useNavigation();

	const onCancel = (id) => {
		return navigation.navigate('UpdateOrder', {action: 'cancel', id})
	}

	// const onModify = (id) => {
	// 	return navigation.navigate('UpdateOrder', {action: 'update', id}) 
	// }

	return (
		<>
		{AVAILABLE_TO_CANCEL_ORDER_STATUS.includes(status) &&
			<View style={styles.orderButtonContainer}>
				<OrderButton title="CANCEL" onClick={() => onCancel(id)}/>
				<OrderButton title="MODIFY" onClick={() => onModify(id)}/>
			</View>
		}
		</>
	)
}

const HeaderRight = ({symbol}) => {
	const navigation = useNavigation();
	const styles = useStyles();

	return (
		<TouchableOpacity onPress={() => navigation.navigate('StockDetail', {symbol})}>
			<StyledText style={styles.viewSymbol}>View {symbol}</StyledText>
		</TouchableOpacity>
	)
}

const OrderStatus = (props) => {
	const {order, goBack} = props?.route?.params ?? {};

	const [orderDetail, setDetail] = useState(null);
	//Get Order Id and refetch the order (in case the status has changed)
	const {isError, getOrderDetail} = useOrderDetail(order?.id, {enabled: false})

	React.useEffect(() => {
		const fetchOrderDetail = async() => {
			if (order?.status == "new" || order?.type == "market") {
				const orderDetail = await getOrderDetail();
				if (!!orderDetail) {
					setDetail(orderDetail);
				}
			} else if(!!order) {
				setDetail(order);
			}
		}

		fetchOrderDetail();

	}, []);


	const {symbol} = orderDetail ?? {};
	
	return (
		<>
		{!!orderDetail &&
			<AppView goBack={goBack || true} headerRight={<HeaderRight {...{symbol}}/>}>
				<OrderStatusTop {...{orderDetail}} />
				<OrderStatusSummary {...{orderDetail}} />
				<OrderStatusMore {...{orderDetail}} />
				<OrderStatusButton {...{orderDetail}} />
			</AppView>
		}
		</>
	);
}

const useStyles = () => {
	const theme = useTheme();

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
			marginTop: WP(30),
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
		orderButtonContainer: {

		},
		viewSymbol: {
			fontSize: Typography.four,
			color: theme.green
		}
	});

	return styles
}

export default OrderStatus;
