import React, {useState} from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet, TouchableOpacity,} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';
import { BarIndicator } from 'react-native-indicators';

import { StyledText, useTheme, WP, defaultIconSize } from '../../theme';
import { GobackIcon } from './iconButtons';

export const AppHeader = ({title, goBack = true, ...props}) => {
	const showHeader = title || goBack;
	const navigation = useNavigation();
	const {theme, styles} = useStyles();

	return (
		<>
		{showHeader &&
			<View style={[styles.headerContainer, props.headerContainerStyle]}>
				{!!props?.headerLeft && <View style={styles.headerLeft}>{props.headerLeft}</View>}
				{goBack && <View style={styles.headerLeft}><GobackIcon {...{goBack}} /></View>}
				{title && <StyledText style={[styles.headerTitle, props.headerTitleStyle]}>{title}</StyledText>}
				{!!props?.headerRight && <View style={styles.headerRight}>{props.headerRight}</View>}
			</View>
		}
		</>
	);
}

export const AppView = ({scroll = true, footer, hasHeader = true, header, isLoading = false, ...props}) => {

	const Component = scroll ? ScrollView : View;
	const {theme, styles} = useStyles();

	//Check for ZERO padding
	const hasPadding = (props?.padding ?? '') !== '';
	
	return (
		<>
		{isLoading ? 
			<BarIndicator color="white" /> : 
		scroll ? 
			<View style={styles.scrollAppContainer}>
				{hasHeader || header ? header ? header : <AppHeader {...props}/> : <></>}
				<ScrollView contentContainerStyle={[styles.scrollView, {...hasPadding && {paddingLeft: WP(props.padding), paddingRight: WP(props.padding)}}]} showsVerticalScrollIndicator={false}>
					{props.children}
				</ScrollView>
				{footer && <View style={[styles.footerContainer, props.footerContainerStyle]}>{footer}</View>}
			</View>	
			:
			<View style={[styles.appContainer, props.appContainerStyle]}>
				{hasHeader || header ? header ? header : <AppHeader {...props}/> : <></>}
				<View style={[styles.staticView, {...hasPadding && {paddingLeft: WP(props.padding), paddingRight: WP(props.padding)}}]}>
					{props.children}
				</View>
				{footer && <View style={[styles.footerContainer, props.footerContainerStyle]}>{footer}</View>}
			</View>
		}
		</>
	);
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		scrollAppContainer: { 
			flex: 1,
	    	// alignItems: 'center',
	    	width: WP(100),
	    	backgroundColor: theme.background,
	    },
	    scrollView: {
	    	backgroundColor: theme.background,
	    	width: WP(100),
	    	paddingLeft:WP(3),
	    	paddingRight:WP(3)
	    },
		appContainer: { 
			flex: 1,
	    	// alignItems: 'center', 
	    	width: WP(100),
	    	backgroundColor: theme.background,
	    },
	    staticView: {
	    	flex:1,
	    	paddingLeft:WP(3),
	    	paddingRight:WP(3),
	    	backgroundColor: theme.background,
	    },
		headerContainer: {
			flexDirection: 'row',
			width: '100%',
			alignItems: 'center',
			justifyContent: 'center',
			height: 50,
			backgroundColor: theme.background,
		},
		footerContainer: {
		    position: 'absolute',
		    bottom:WP(0),
		    width: WP(100),
		    flexDirection:'row',
		    justifyContent:'space-between',
		    alignItems:'center'
		},
		headerRight: {
			position: 'absolute',
			right: 10,
			justifyContent: 'center'
		},
		headerLeft: {
			position: 'absolute',
			left: 10,
			justifyContent: 'center'
		},
		headerTitle:{
			fontSize: 16,
			fontWeight: 'bold',
		}
	});

	return {theme, styles};
}
