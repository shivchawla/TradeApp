import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

import { useTheme, WP, HP, StyledText } from '../../theme';
import {deviceWidth, deviceHeight} from '../../utils';

export const AlertBox = ({title, message, component, show = false, onCancel, cancelText='CANCEL', onConfirm, confirmText = 'OK'}) => {
	
	const {theme, styles} = useStyles();

	return (
		<Modal 
			isVisible={show} 
			animationType="slide" 
			backdropOpacity={0.5}
			{...{deviceWidth, deviceHeight}}>
			<View style={styles.modalContent}>
				{title && <StyledText style={styles.title}>{title}</StyledText>}
				{message && <StyledText style={styles.message}>{message}</StyledText>}
				{component && component}
				
				<View style={styles.buttonContainer}>
					{onCancel &&
						<TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
							<StyledText style={styles.cancelText}>{cancelText}</StyledText> 
						</TouchableOpacity>
					}

					{onConfirm && 
						<TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
							<StyledText style={styles.confirmText}>{confirmText}</StyledText> 
						</TouchableOpacity>
					}
				</View>
			</View>
		</Modal>
	)
}


const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		modalContent: {
			backgroundColor: theme.background,
			padding: WP(4)
		},
		title: {
			color: theme.icon,
			fontSize: WP(4),
			marginBottom: WP(5)
		},
		message: {
			marginBottom: WP(10)
		},
		buttonContainer: {
			flexDirection:'row',
			justifyContent: 'space-between',
			// paddingLeft: WP(2),
			// paddingRight: WP(2),
			// marginBottom: WP(0)
			marginTop: HP(2)
		},
		cancelButton: {
			padding: WP(1),
			paddingLeft: WP(4),
			paddingRight: WP(4),
			backgroundColor:theme.grey9,

		},
		cancelText: {

		},
		confirmButton: {
			padding: WP(1),
			paddingLeft: WP(4),
			paddingRight: WP(4),

			backgroundColor:theme.grey9

		},
		confirmText: {

		}
	});

	return {theme, styles};
}