import React from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

import {deviceHeight, deviceWidth} from '../../utils';
import {useTheme, WP, StyledText} from '../../theme'; 

import {CloseIcon} from './navIcons';

export const FullViewModal = ({isVisible = false, onClose, title, ...props}) => {
	
	const {theme, styles} = useStyles();

	return (
		<Modal 
			animationType="slide" 
			backdropOpacity={1.0}
			style={styles.modal}
			{...{isVisible, deviceWidth, deviceHeight}}>
			<View style={[styles.modalContent, props.modalContentStyle]}>
				<View style={[styles.modalContentHeader, props.contentHeaderStyle]}>
					{title && <StyledText style={[styles.headerTitle, props.headerTitleStyle]}>{title}</StyledText>}
					<CloseIcon onPress={onClose} containerStyle={styles.closeIconStyle}/>
				</View>
				{props.children}
			</View>
		</Modal>
	)
}


const useStyles = () => {
	const theme = useTheme();
	
	const styles = StyleSheet.create({
		modal: {
			backgroundColor: theme.background,
			margin: 0
		},
		modalContent: {
			flex:1, 
			// justifyContent: 'center', 
			alignItems: 'center',
			height: '100%'
		},
		modalContentHeader: {
			width: '100%', 
			marginBottom: WP(5),
			justifyContent: 'center',
			position:'absolute',
			top:0,
			padding: WP(5)
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