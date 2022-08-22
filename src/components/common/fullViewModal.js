import React from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme'; 

import {CloseIcon} from './iconButtons';

export const FullViewModal = React.memo(({isVisible = false, opacity = 1.0, animation="slideInUp", onClose, title, ...props}) => {
	const {theme, styles} = useStyles();
	const {deviceWidth, deviceHeight} = useDimensions();

	return (
		<Modal
			animationIn={animation} 
			animationOut="fadeOut" 
			backdropOpacity={opacity}
			backdropColor={theme.background}
			style={styles.modal}
			{...{isVisible, deviceWidth, deviceHeight}}>
			<View style={[styles.modalContent, props.modalContentStyle]}>
				<View style={[styles.modalContentHeader, props.contentHeaderStyle]}>
					{title && <StyledText style={[styles.headerTitle, props.headerTitleStyle]}>{title}</StyledText>}
					{onClose && <CloseIcon onPress={onClose} containerStyle={styles.closeIconStyle}/>}
				</View>
				{props.children}
			</View>
		</Modal>
	)
})


const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();
	
	
	const styles = StyleSheet.create({
		modal: {
			// backgroundColor: theme.background,
			margin: 0
		},
		modalContent: {
			flex:1, 
			// justifyContent: 'center', 
			alignItems: 'center',
			height: '100%',
			// backgroundColor: theme.background,
		},
		modalContentHeader: {
			width: '100%', 
			marginBottom: WP(5),
			justifyContent: 'center',
			// position:'absolute', ???
			// top:0, ???
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