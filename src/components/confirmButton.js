import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

import { useTheme, StyledText, Typography, WP, HP, Colors, getPnLColor }  from '../theme';

const ConfirmButton = ({title, onClick, ...props}) => {
	return (
		<View style={[styles.buttonContainer, props.buttonContainerStyle]}>
			<Pressable style={[styles.button, props.buttonStyle]} onPressOut={onClick}>
				<StyledText style={[styles.buttonText,props.buttonTextStyle]}>{title}</StyledText>
			</Pressable>
		</View>
	);
}
	
const styles = StyleSheet.create({
	buttonContainer: {
	    width: WP(100),
	    flexDirection:'row',
	    justifyContent:'center'
	},
	button: {
	    backgroundColor:'#FE9901',
	    height: 35,
	    justifyContent:'center',
	    alignItems:'center',
	    width: WP(40)
	  },
	buttonText: {
	    fontFamily: "roboto-700",
	    color: 'white',
	    fontSize: 16,
	    fontWeight:"700"
	},
});

export default ConfirmButton;