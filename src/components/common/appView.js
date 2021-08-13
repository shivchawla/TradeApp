import React, {useState} from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, useColorScheme } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { StyledText, useTheme, WP } from '../../theme';
import { GobackIcon } from './navIcons';

export const AppHeader = ({title, goBack = true, ...props}) => {
	const showHeader = title || goBack;
	const navigation = useNavigation();
	const theme = useTheme();
	const styles = useStyles();

	return (
		<>
		{showHeader &&
			<View style={[styles.headerContainer, props.headerContainerStyle]}>
				{!!props?.headerLeft && <View style={styles.headerLeft}>{props.headerLeft}</View>}
				{goBack && <GobackIcon {...{goBack}} />}
				{title && <StyledText style={[styles.headerTitle, props.headerTitleStyle]}>{title}</StyledText>}
				{!!props?.headerRight && <View style={styles.headerRight}>{props.headerRight}</View>}
			</View>
		}
		</>
	);
}

export const AppView = ({scroll = true, footer, hasHeader = true, header, ...props}) => {

	const Component = scroll ? ScrollView : View;
	const styles = useStyles();

	return (
		<>
		{scroll ? 
			<View style={styles.appContainer}>
				{hasHeader || header ? header ? header : <AppHeader {...props}/> : <></>}
				<ScrollView contentContainerStyle={[{width: '100%'}, props.appContainerStyle]}>
					{props.children}
				</ScrollView>
				{footer && <View style={[styles.footerContainer, props.footerContainerStyle]}>{footer}</View>}
			</View>	
			:
			<View style={[styles.appContainer, props.appContainerStyle]}>
				{hasHeader || header ? header ? header : <AppHeader {...props}/> : <></>}
				{props.children}
				{footer && <View style={[styles.footerContainer, props.footerContainerStyle]}>{footer}</View>}
			</View>
		}
		</>
	);
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		appContainer: { 
			flex: 1,
	    	alignItems: 'center',
	    	backgroundColor: theme.background,
	    	width: WP(100)
	    },
		headerContainer: {
			flexDirection: 'row',
			width: '100%',
			alignItems: 'center',
			justifyContent: 'center',
			height: 50,
			backgroundColor: theme.background
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
		},
		iconImage:{
			height:40
		}
	});

	return styles;
}
