import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme'; 

import {CloseIcon} from './iconButtons';

export const FullViewModal = React.memo(({isVisible = false, opacity = 1.0, animationIn="slideInUp", animationOut="fadeOut", onClose, onHide, title, hasHeader=true, ...props}) => {
	const {theme, styles} = useStyles();
	const {deviceWidth, deviceHeight} = useDimensions();

	return (
		<Modal
			animationIn={animationIn} 
			animationOut={animationOut} 
			backdropOpacity={opacity}
			backdropColor={theme.background}
			onBackdropPress={onHide}
        	onSwipeComplete={onHide} 
			style={[styles.modal, props.modalStyle]}
			{...{isVisible, deviceWidth, deviceHeight}}>
			<View style={[styles.modalContent, props.modalContentStyle]}>
				{hasHeader && 
					<View style={[styles.modalContentHeader, props.contentHeaderStyle]}>
						{title && <StyledText style={[styles.headerTitle, props.headerTitleStyle]}>{title}</StyledText>}
						{onClose && <CloseIcon onPress={onClose} containerStyle={styles.closeIconStyle}/>}
					</View>
				}
				{props.children}
			</View>
		</Modal>
	)
})


const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();	
	
	const styles = StyleSheet.create({
		modal: {
			margin: 0
		},
		modalContent: {
			flex:1, 
			justifyContent: 'center',
			alignItems: 'center',
			height: '100%',
			backgroundColor: theme.background
		},
		modalContentHeader: {
			width: '100%', 
			marginBottom: WP(5),
			justifyContent: 'center',
			padding: WP(5),
			backgroundColor: theme.background,
		},
		closeIconStyle: {
			position: 'absolute', 
			right: 10
		},
		headerTitle: {
			textAlign: 'center',
			fontSize: WP(4.5),
			color: theme.icon
		},
	})

	return {theme, styles};
}