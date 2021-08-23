import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { titleCase } from "title-case";

import { ShowJson } from '../common';
import { useTheme, StyledText, Typography, WP, HP, Colors, getPnLColor }  from '../../theme';

export const DisplayOrderInList = ({order}) => {
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

	const displayOrderQuantity = (order) => {
		return order.side.toUpperCase() + ' ' + (getShareQty(order.qty) || getNotional(order.notional));
	}

	return (
		<TouchableOpacity onPress={() => navigation.navigate('OrderStatus', {order})}>
			<View style={styles.container}>
				<View style={{flexDirection: 'row'}}>
					<StyledText style={styles.label}>{displayOrderQuantity(order)}</StyledText>
					<StyledText style={[styles.label, {marginLeft: WP(2)}]}>{displayOrderType(order)}</StyledText>
				</View>
				<StyledText style={styles.value}>{titleCase(order.status)}</StyledText>
			</View>
		</TouchableOpacity>
	);
}


const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		container: {
			width: '100%',
			paddingLeft: WP(2),
			paddingRight: WP(2),
			marginBottom: WP(7),
			justifyContent: 'space-between'
		},
		label: {
			fontWeight: '400',
			fontSize: Typography.four, 
			color: theme.light
		},
		value: {
			fontSize: Typography.four, 
			color: theme.verydarkgrey
		}

	});

	return {theme, styles};
};
