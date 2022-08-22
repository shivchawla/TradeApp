import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import { useTheme, StyledText }  from '../../theme';

import { CustomIcon} from './iconButtons';
import { SwipeButton } from './swipeButton';

export const ConfirmButton = ({title, afterTitle, onClick, onSwipeSuccess, swipe = false, cancel = false, disabled = false,  ...props}) => {
	const {theme, styles} = useStyles();

	const ProceedIcon = ({size = WP(8)} = {}) => {
		return <CustomIcon iconName={props?.iconName ?? "arrow-forward"} iconSize={size} iconColor="white"/>
	}

	const CancelIcon = ({size = WP(5)} = {}) => {
		return <CustomIcon iconName="close-circle"  iconSize={size} iconColor="white"/>
	}

	const ClickableComponent = disabled ? View : TouchableOpacity;

	const color = cancel ? theme.red : props?.color ??  theme.green;

	return (
		<View style={[styles.buttonContainer, props.buttonContainerStyle]}>
		{swipe ?

			<SwipeButton 
				height={60}
            	onSwipeSuccess={onSwipeSuccess}
            	swipeSuccessThreshold={95}
            	swipeTitle={afterTitle}
            	icon={cancel ? <CancelIcon /> : <ProceedIcon />}
        	    title={title}
        	    containerStyle={{borderColor: color}}
        	    iconContainerStyle={{backgroundColor: color}}
        	    underlayStyle={{borderColor: color, backgroundColor: color}}
        	    swipeTitleStyle={{color: 'white'}}
        	    disabled={disabled}
          	/> 

          	:

				<ClickableComponent style={[styles.button, props.buttonStyle, {...disabled && {backgroundColor: theme.grey9}}]} onPress={disabled ? null : onClick}>
					<StyledText style={[styles.buttonText, props.buttonTextStyle]}>{title}</StyledText>
				</ClickableComponent>
		
		}
		</View>
	);
}
	
const useStyles = () => {

	const {theme, HP, WP, Typography} = useTheme();


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
		    width: '40%'
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
