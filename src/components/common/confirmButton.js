import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import { useTheme, useDimensions, useTypography, StyledText }  from '../../theme';

import { CustomIcon} from './iconButtons';
import { SwipeButton } from './swipeButton';
import { SimpleButton } from './simpleButton';

export const ConfirmButton = ({title, afterTitle, onClick, onSwipeSuccess, swipe = false, cancel = false, disabled = false,  ...props}) => {
	const {theme, styles} = useStyles();
	const { HP, WP } = useDimensions();

	const ProceedIcon = ({size = WP(8)} = {}) => {
		return <CustomIcon iconName={props?.iconName ?? "arrow-forward"} iconSize={size} iconColor="white"/>
	}

	const CancelIcon = ({size = WP(5)} = {}) => {
		return <CustomIcon iconName="close-circle"  iconSize={size} iconColor="white"/>
	}

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

      		<SimpleButton 
      			{...{title, disabled, onClick}} 
      			buttonTextStyle={props.buttonTextStyle} 
      			buttonStyle={[props.buttonStyle, {width: '40%'}]}
  			/>
		}
		</View>
	);
}
	
const useStyles = () => {

	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();

	const styles = StyleSheet.create({
		buttonContainer: {
		    width: '100%',
		    flexDirection:'row',
		    justifyContent:'center'
		}
	});

	return {theme, styles};
}
