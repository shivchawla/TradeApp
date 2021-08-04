import React, {useState} from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Image, useColorScheme } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { StyledText, useTheme, WP } from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

// const backIconBlack = require("../assets/icon-back-black.png");
// const backIconYellow = require("../assets/icon-back-yellow.png");

const AppHeader = ({title, goBack = true, ...props}) => {
	const showHeader = title || goBack;
	const navigation = useNavigation();
	const theme = useTheme();

	return (
		<>
		{showHeader &&
			<View style={[styles.headerContainer, props.headerContainerStyle]}>
				{goBack && 
					<Pressable style={styles.backIconContainer} onPressOut={() => {typeof goBack === 'function' ? goBack() : navigation.goBack()}}>
						<Ionicons name="chevron-back" color={theme.backArrow} size={WP(7)} />
					</Pressable>}
				{title && <StyledText style={[styles.headerTitle, props.headerTitleStyle]}>{title}</StyledText>}
			</View>
		}
		</>
	);
}

const AppView = ({scroll = true, footer, hasHeader = true, header, ...props}) => {

	const Component = scroll ? ScrollView : View;
	const theme = useTheme();

	// console.log("Theme");
	// console.log(theme);

	return (
		<>
		{scroll ? 
			<ScrollView contentContainerStyle={[styles.appContainer, props.appContainerStyle, {backgroundColor: theme.background}]}>
				{hasHeader || header ? header ? header : <AppHeader {...props}/> : <></>}
				{props.children}
				{footer && <View style={[styles.footerContainer, props.footerContainerStyle]}>{footer}</View>}
			</ScrollView>	
			:
			<View style={[styles.appContainer, props.appContainerStyle, {backgroundColor: theme.background}]}>
				{hasHeader || header ? header ? header : <AppHeader {...props}/> : <></>}
				{props.children}
				{footer && <View style={[styles.footerContainer, props.footerContainerStyle]}>{footer}</View>}
			</View>
		}
		</>
	);
}

const styles = StyleSheet.create({
	appContainer: { 
		flex: 1,
    	alignItems: 'center',
    	// backgroundColor:'black',
    },
	headerContainer: {
		flexDirection: 'row',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		height: 50
	},
	backIconContainer: {
		position: 'absolute',
		left: 10
	},
	footerContainer: {
	    position: 'absolute',
	    bottom:20,
	    width: '90%',
	    flexDirection:'row',
	    justifyContent:'space-between',
	    alignItems:'center',
	    // textAlign: 'center'
	},
	headerTitle:{
		fontSize: 16,
		fontWeight: 'bold',
	},
	iconImage:{
		height:40
	}
});

export default AppView;