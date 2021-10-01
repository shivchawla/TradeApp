import React from 'react';
import { View, StyleSheet } from 'react-native';

import { ConfirmButton } from '../../components/common';
import { useTheme, WP, HP, StyledText } from '../../theme';

export const FormView = ({onSubmit, children, buttonTitle="Next", showButton = true, ...props}) => {
	
	const {theme, styles} = useStyles();

	return (
		<>	
			{!!props?.error && <StyledText style={styles.error}>{props?.error} </StyledText>}

			<View style={[styles.formContainer, props.formContainerStyle]}>
				{children}
			</View>
				
			{showButton && 
				<ConfirmButton 
					buttonContainerStyle={[{position: 'absolute', bottom: 10}, styles.buttonContainer, props.submitButtonContainerStyle]} 
					buttonStyle={[{width: '90%'}, props.submitButtonStyle]} 
					title={buttonTitle} 
					onClick={onSubmit} 
				/>
			}
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
		},
		error: {
			color: theme.error,
			fontSize: WP(4.5),
			textAlign: 'center'
		},
		buttonContainer: {
			alignSelf: 'center'
		}		
	});

	return {theme, styles};

}
