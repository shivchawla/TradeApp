import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppIcon, ConfirmButton } from '../common';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme';

export const Welcome = ({onNext}) => {
	
	const {theme, styles} = useStyles();

	return (
		<View style={{alignItems: 'center', flex: 1}}>
			<AppIcon logoStyle={{height: 70}} logoContainerStyle={{marginTop:50}}/>
			<StyledText style={styles.title}>WELCOME</StyledText>
			<StyledText style={styles.subTitle}>Thanks for signing up!!</StyledText>

			<View style={styles.instructionContainer}>
				<StyledText style={styles.instructionText}>We need a little more information to create your account.</StyledText>
				<StyledText style={styles.instructionText}>Click START to proceed</StyledText>
			</View>

			<ConfirmButton 
				title="START" 
				onClick={onNext} 
				buttonContainerStyle={{position: 'absolute', bottom: 20}}
				buttonStyle={{width: '70%'}}
			/> 
		</View>
	)
}

const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();


	const styles = StyleSheet.create({
		title: {
			color: theme.icon,
			fontSize: WP(7),
			marginTop: HP(5)
		},
		subTitle: {
			fontSize: WP(5),
			marginTop: HP(1)	
		},
		instructionContainer: {
			alignItems: 'center', 
			justifyContent: 'center', 
			marginTop: HP(15),
			width: '80%',
		},
		instructionText: {
			textAlign: 'center',
			fontSize: WP(4.5),
			marginTop: HP(5)
		}
	})

	return {theme, styles};
}