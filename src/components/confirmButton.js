import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

const ConfirmButton = ({title, onClick, ...props}) => {
	return (
		<View style={[styles.buttonContainer, props.buttonContainerStyle]}>
			<Pressable style={[styles.button, props.buttonStyle]} onPressOut={onClick}>
				<Text style={[styles.buttonText,props.buttonTextStyle]}>{title}</Text>
			</Pressable>
		</View>
	);
}
	
const styles = StyleSheet.create({
	buttonContainer: {
	    width: '100%',
	    flexDirection:'row',
	    justifyContent:'center'
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

export default ConfirmButton;