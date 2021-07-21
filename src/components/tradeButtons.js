import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

const SingleButton = ({title, onClick, ...props}) => {
	return (
		<Pressable style={[styles.button, props.buttonStyle]} onPressOut={onClick}>
			<Text style={[styles.buttonText,props.buttonTextStyle]}>{title}</Text>
		</Pressable>
	);
}
	

const TradeButtons = ({ticker, onBuy, onSell, ...props}) => {
	
	return (
		<View style={[styles.buttonContainer, props.buttonContainerStyle]}>
			<SingleButton title="BUY" onClick={onBuy} {...props} />
			<SingleButton title="SELL" onClick={onSell} {...props} />
		</View>
		)
}

const styles = StyleSheet.create({
	buttonContainer: {
	    position: 'absolute',
	    bottom:20,
	    width: '90%',
	    flexDirection:'row',
	    justifyContent:'space-between',
	    // alignItems:'center'
	},
	button: {
	    backgroundColor:'#FE9901',
	    height: 35,
	    justifyContent:'center',
	    alignItems:'center',
	    width:'40%'
	  },
	buttonText: {
	    fontFamily: "roboto-700",
	    color: 'white',
	    fontSize: 16,
	    fontWeight:"700"
	},
});

export default TradeButtons;