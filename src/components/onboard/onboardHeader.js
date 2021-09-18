import React from 'react';
import { View, StyleSheet } from 'react-native';
import {useTheme, HP, WP, StyledText} from '../../theme';

const formHeaderInfo = {
	'identity': {title: 'Identity', subTitle: "Share your basic idenity"},
	'taxInfo': {title: 'Tax Info', subTitle: "Share your basic tax details" },
	'contact': {title: 'Contact', subTitle: "Share your contact information"  },
	'disclosure': {title: 'Disclosure', subTitle: "Some important disclosures"},
	'employment': {title: 'Employment', subTitle:  "What's your employment status?"},
	'trustedContact': {title: 'Trusted Contact', subTitle: "Share one emergency/trusted contact"},
	'customer_agreement': {title: 'Customer Agreement', subTitle: ""},
	'account_agreement': {title: 'Account Agreement', subTitle: ""},
	'margin_agreement': {title: 'Margin Agreement', subTitle: ""}
}; 

export const OnboardHeader = ({step, ...props}) => {

	console.log(Object.keys(formHeaderInfo));
	console.log("Step: ", step);
	console.log(Object.keys(formHeaderInfo).findIndex(item => item == step));

	const stepNumber = Object.keys(formHeaderInfo).findIndex(item => item == step) + 1;
	console.log("Step Number: ", stepNumber);

	const {theme, styles} = useStyles();

	return (
		<View style={[styles.headerContainer, props.style]}>
			<View style={styles.stepNumberContainer}>
				<StyledText style={styles.stepNumber}>{stepNumber}</StyledText>
			</View>
			<View style={{justifyContent: 'center'}}>
				<StyledText style={styles.title}>{formHeaderInfo[step]['title']}</StyledText>
				<StyledText style={styles.subTitle}>{formHeaderInfo[step]['subTitle']}</StyledText>
			</View>
		</View>
	)
}


const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		headerContainer: {
			flexDirection: 'row', 
			alignItems: 'center', 
			marginLeft: WP(0),
		},
		stepNumberContainer: {
			height: HP(6),
			width: HP(6),
			borderRadius: HP(3),
			backgroundColor: theme.grey7,
			justifyContent: 'center',
			alignItems: 'center', 
			marginLeft: WP(5),
			marginRight: WP(5),
		},
		stepNumber: {
			color: theme.icon,
			fontSize: WP(6)
		},
		title: {
			fontSize: WP(6),
			color: theme.grey5
		},
		subTitle: {
			fontSize: WP(4),
			color: theme.grey5
		}

	});

	return {theme, styles} 
}