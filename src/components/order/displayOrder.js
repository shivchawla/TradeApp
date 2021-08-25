import React, {useState} from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { titleCase } from "title-case";

import { ShowJson, Clickable } from '../common';
import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';
import { CANCEL_ORDER_STATUS } from '../../config';

export const DisplayOrder = ({order, showSymbol = false, showIcon = false, showOrderType = true, showStatus = true, pastTense = false,  ...props}) => {
	const {theme, styles} = useStyles();
	const navigation = useNavigation();

	const getShareQty = (qty) => {
		return qty ? qty > 1 ? `${qty} Shares` : '1 Share' : '';
	}

	const getNotional = (notional) => {
		return notional ? (`USD ` + notional) : '';
	}

	const getOrderLimitPrice = (order) => {
		return order.type == "limit" ? '@ USD ' + order.limit_price : '';
	}

	const displayOrderType = (order) => {
		return order.type.toUpperCase() + getOrderLimitPrice(order);
	}

	const getOrderSide = (order) => {
		const side = order.side.toUpperCase();

		if (pastTense && !CANCEL_ORDER_STATUS.includes(order.status)) {
			return side == "BUY" ? 'BOUGHT' : 'SOLD'
		} 

		return side;
	}

	const displayOrderQuantity = (order) => {
		return getOrderSide(order) + ' ' + (getShareQty(order.qty) || getNotional(order.notional));
	}

	const isCanceled = CANCEL_ORDER_STATUS.includes(order.status);

	return (
		<Clickable style={styles.container} onPress={() => navigation.navigate('OrderStatus', {order})}>
			
			{showSymbol &&
				<View style={styles.symbolContainer}>
					<StyledText style={[styles.symbol, props.symbolStyle]}>{order.symbol}</StyledText>
				</View>
			}

			<View style={styles.descriptionContainer}>
				<View style={{flexDirection: 'row', alignItems: 'center'}}> 
					<StyledText style={[styles.description, props.descriptionStyle]}>{displayOrderQuantity(order)}</StyledText>
					{showOrderType && <StyledText style={[styles.description, {marginLeft:WP(2)}, props.descriptionStyle]}>{displayOrderType(order)}</StyledText>}
				</View>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					{showStatus && <StyledText style={[styles.status, {marginRight: WP(2)}, {...isCanceled && {color: theme.grey8}}]}>{titleCase(order.status)}</StyledText>}
					{showIcon && <Ionicons name="chevron-forward" color={theme.grey5} size={WP(4)} />}
				</View>
			</View>
			
		</Clickable>
	);
}

export const DisplayOrderList = ({orders, ...props}) => {
	const {theme, styles} = useStyles();

	return (
		<View style={[styles.orderList, props.containerStyle]}>
			{orders && orders.map((order, index) => {
				return <DisplayOrder key={item.id} order={item} />
			})}
		</View>
	)
}


const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		container :{
			width: '100%', 
			paddingRight: WP(2),
			paddingLeft: WP(2),
			alignItems: 'center',
			marginBottom: HP(2),
		},
		symbolContainer: {
			flexDirection: 'row', 
			width:'100%', 
			justifyContent: 'space-between'
		},
		descriptionContainer: {
			flexDirection: 'row', 
			width: '100%', 
			justifyContent: 'space-between'
		},
		description: {
			fontWeight: '400',
			color: theme.grey5
		},
		status: {
			fontSize: WP(3.5), 
			color: theme.grey5,
		},
		orderList: {
			flex:1,
		},
		symbol :{
			fontSize: WP(4.5)
		}

	});

	return {theme, styles};
};
