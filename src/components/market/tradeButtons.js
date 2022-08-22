import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import { useTheme, useDimensions, useTypography, StyledText }  from '../../theme';

const SingleButton = ({title, onClick, ...props}) => {
	const styles = useStyles();
	
	return (
		<TouchableOpacity style={[styles.button, props.buttonStyle, title=="BUY" ? styles.buyButton : styles.sellButton ]} onPressOut={onClick}>
			<StyledText style={[styles.buttonText,props.buttonTextStyle]}>{title}</StyledText>
		</TouchableOpacity>
	);
}	

export const TradeButtons = ({ticker, onBuy, onSell, ...props}) => {
	const styles = useStyles();
	
	return (
		<View style={[styles.buttonContainer, props.buttonContainerStyle]}>
			<SingleButton title="BUY" onClick={onBuy} {...props}/>
			<SingleButton title="SELL" onClick={onSell} {...props} />
		</View>
	)
}

const useStyles = () => {

	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();
	
	const styles = StyleSheet.create({
		buttonContainer: {
		    width: '100%',
		    flexDirection:'row',
		    justifyContent:'space-between',
		},
		button: {
		    backgroundColor:'#FE9901',
		    height: 35,
		    justifyContent:'center',
		    alignItems:'center',
		    width:'50%'
	 	},

	 	buyButton: {
	 		backgroundColor: theme.green,
	 	},
	 	sellButton: {
	 		backgroundColor: theme.red
	 	},
		buttonText: {
		    fontFamily: "roboto-700",
		    color: 'white',
		    fontSize: 16,
		    fontWeight:"700"
		},
	});

	return styles;
}
