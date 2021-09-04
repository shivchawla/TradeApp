import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import { useTheme, StyledText, Typography, WP, HP, Colors, getPnLColor }  from '../../theme';

import SwipeButton from 'jt-swipe-button';

import Ionicons from 'react-native-vector-icons/Ionicons';

export const ConfirmButton = ({title, onClick, swipe = false, cancel = false, disabled = false,  ...props}) => {
	const {theme, styles} = useStyles();

	const proceedIcon = ({size = WP(10), color = theme.success} = {}) => {
		return <Ionicons name="chevron-forward" {...{color, size}} />
	}

	const cancelIcon = ({size = WP(5), color = theme.error} = {}) => {
		return <Ionicons name="close-circle" {...{color, size}} />
	}


	const ClickableComponent = disabled ? View : TouchableOpacity;

	return (
		<>
		{swipe ?
			<SwipeButton 
				containerStyles={{borderRadius: 20, width: WP(95), borderWidth:0}}
            	height={50}
            	onSwipeSuccess={onClick}
            	swipeSuccessThreshold={100}
            	railBackgroundColor={theme.dark}
            	railBorderColor={cancel ? theme.error : theme.success}
            	railFillBorderColor={cancel ? theme.error : theme.success}
            	railStyles={{borderWidth:0, backgroundColor: theme.success, color: theme.text}}
            	titleColor={theme.text}
            	screenReaderEnabled={true}
            	thumbIconComponent={cancel ? cancelIcon : proceedIcon}
        	    thumbIconBorderColor={cancel ? theme.error : theme.success}
        	    title={title}
          	/> 

          	:

			<View style={[styles.buttonContainer, props.buttonContainerStyle]}>
				<ClickableComponent style={[styles.button, props.buttonStyle, {...disabled && {backgroundColor: theme.grey9}}]} onPress={onClick}>
					<StyledText style={[styles.buttonText,props.buttonTextStyle]}>{title}</StyledText>
				</ClickableComponent>
			</View>
		}
		</>
	);
}
	
const useStyles = () => {

	const {theme} = useTheme();

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

	return {theme, styles};
}
