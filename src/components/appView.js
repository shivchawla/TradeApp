import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';

import { useNavigation } from '@react-navigation/native';

const backIcon = require("../assets/icon-back-black.png");

const AppHeader = ({title, goBack = true, ...props}) => {
	const showHeader = title || goBack;
	const navigation = useNavigation();

	return (
		<>
		{showHeader &&
			<View style={[styles.headerContainer, props.headerContainerStyle]}>
				{goBack && 
					<Pressable style={styles.backIconContainer} onPressOut={() => navigation.goBack()}>
						<Image source={backIcon} resizeMode="contain" style={styles.iconImage}/>
					</Pressable>}
				{title && <Text style={[styles.headerTitle, props.headerTitleStyle]}>{title}</Text>}
			</View>
		}
		</>
	);
}

const AppView = ({footer, hasHeader = true, header, ...props}) => {

	return (
		<View style={[styles.appContainer, props.appContainerStyle]}>
			{hasHeader || header ? header ? header : <AppHeader {...props}/> : <></>}
			{props.children}
			{footer && <View style={[styles.footerContainer, props.footerContainerStyle]}>{footer}</View>}
		</View>	
	);
}

const styles = StyleSheet.create({
	appContainer: { 
		flex: 1,
    	alignItems: 'center',
    	backgroundColor:'white'
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
	    // alignItems:'center'
	},
	headerTitle:{
		fontSize: 16,
		fontWeight: 'bold'
	},
	iconImage:{
		height:40
	}
});

export default AppView;