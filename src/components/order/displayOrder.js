import React, {useState} from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { titleCase } from "title-case";

import { ShowJson, Clickable } from '../common';
import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';

export const DisplayOrder = ({order, showSymbol = false, showIcon = false, showOrderType = true, pastTense = false,  ...props}) => {
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
		return order.side == "buy" ? pastTense ? 'BOUGHT' : 'BUY' : pastTense ? 'SOLD' : 'SELL'; 
	}

	const displayOrderQuantity = (order) => {
		return getOrderSide(order) + ' ' + (getShareQty(order.qty) || getNotional(order.notional));
	}

	return (
		<Clickable style={styles.outerContainer} onPress={() => navigation.navigate('OrderStatus', {order})}>
			<View style={styles.container}>
				{showSymbol && <StyledText style={[styles.symbol, props.symbolStyle]}>{order.symbol}</StyledText>}
				<View style={{flexDirection: 'row'}}>
					<StyledText style={[styles.description, props.descriptionStyle]}>{displayOrderQuantity(order)}</StyledText>
					{showOrderType && <StyledText style={[styles.description, {marginLeft: WP(2)}, props.descriptionStyle]}>{displayOrderType(order)}</StyledText>}
				</View>
				<StyledText style={styles.value}>{titleCase(order.status)}</StyledText>
			</View>
			{showIcon && <Ionicons name="chevron-forward" color={theme.grey5} size={WP(4)} />}
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
		outerContainer :{
			flexDirection: 'row', 
			justifyContent: 'space-between', 
			width: '100%', 
			paddingRight: WP(5),
			paddingLeft: WP(2),
			alignItems: 'center',
			marginBottom: HP(1)
		},
		container: {
			width: '100%',
			justifyContent: 'space-between'
		},
		description: {
			fontWeight: '400',
			fontSize: Typography.four, 
			color: theme.light
		},
		value: {
			fontSize: Typography.four, 
			color: theme.verydarkgrey
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
