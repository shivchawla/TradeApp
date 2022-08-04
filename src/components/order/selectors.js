import React, {useState} from 'react';
import {View, StyleSheet } from 'react-native';

import { Picker, HorizontalPickField, TextInputWithIcon } from '../../components/common';
	
import { useTheme, Typography, WP, HP, StyledText }  from '../../theme';

export const QuantitySelector = ({quantity, isNotional, onChangeQuantity, onChangeType, notionalAllowed = true}) => {
	const {theme, styles} = useStyles();

	const items = [{key: 'notional', title: 'USD'}, {key:'shares', title:'Shares'}];
	
	const [selectedValue, setValue] = useState(isNotional && notionalAllowed ? items[0] : items[1]);

	const onSelect = (v) => {
		setValue(v); 
		onChangeType(v.key);
		onChangeQuantity(v.key == 'notional' ? 100 : 1);
	}

	return (
		<View style={styles.quantitySelectContainer}>
			{notionalAllowed ? 
				<Picker {...{items, onSelect, selectedValue}} />
				: <StyledText style={styles.selectedValue}>{selectedValue.title}</StyledText>
			} 

			<TextInputWithIcon
				textStyle={styles.quantity}
		        onChange={(v) => onChangeQuantity(v)}
		        value={quantity}
	      	/>
		</View>
	)
}

export const OrderTypeSelector = ({orderType, onSelect}) => {
	const items = [{key: 'market', title: 'MARKET'}, {key: 'limit', title: 'LIMIT'}, {key:'stop', title: 'STOP MARKET'}, {stop: 'stop_limit', title: 'STOP LIMIT'}];
	const selectedValue = items.find(item => item.key == orderType);
	return (
		<HorizontalPickField label="Order Type" {...{items, selectedValue, onSelect}} />
	)
}

export const TifSelector = ({tif, onSelect}) => {
	const items = [{key: 'day', title: 'DAY'}, {key: 'gtc', title: 'GTC'}];
	const selectedValue = items.find(item => item.key == tif);
	return (
		<HorizontalPickField label="Time in Force" {...{items, selectedValue, onSelect}} />
	)
}

export const NotionalSelector = ({isNotional, onSelect}) => {
	const items = [{key: 'notional', title: 'USD'}, {key:'shares', title:'Shares'}];
	const selectedValue = isNotional ? items[0] : items[1]
	return (
		<HorizontalPickField label="Quantity Type" {...{items, selectedValue, onSelect}} />
	)
}


const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		quantitySelectContainer: {
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'row',
			width: WP(100),
			marginTop: HP(5)
		},
		
		quantity: {
			color: theme.grey3,
			fontSize: WP(15),
			marginLeft: WP(3),
			marginRight: WP(1)
		},
		selectedValue: {
			fontSize: WP(6),
			marginRight: WP(2)
		},
	})

	return {theme, styles};
}