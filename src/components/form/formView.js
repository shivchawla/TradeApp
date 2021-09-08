import React from 'react';
import { View, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { ConfirmButton } from '../../components/common';
import { useTheme, WP, HP } from '../../theme';

export const FormView = ({onSubmit, children, ...props}) => {
	
	const {theme, styles} = useStyles();

	return (
		<>	
			<View style={[styles.formContainer, props.formContainerStyle]}>
				{children}
			</View>
			<View style={{position: 'absolute', bottom: 10}} >
				<ConfirmButton buttonContainerStyle={styles.buttonContainer} buttonStyle={{width: '90%'}} title="Next" onClick={onSubmit} />
			</View>
		</>
	)
} 

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		formContainer: {
			alignItems: 'center',
			width: '100%',
			marginTop: HP(5),
			flex: 1,
			marginBottom: HP(10)
		}		
	});

	return {theme, styles};

}
