import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const AppHeader = (props) => {

	const {title, goBack, headerContainerStyle, headerTitleStyle} = props;
	
	return (
		<>
		{title && <View style={[styles.headerContainer, headerContainerStyle]}>
			<Text style={[styles.headerTitle, headerTitleStyle]}>{title}</Text>
		</View>
		}
		</>
	);
}

const AppView = (props) => {
	const  {footer, footerContainerStyle} = props;

	return (
		<View style={[styles.appContainer, props.appContainerStyle]}>
			{props.children}
			{footer && <View style={[styles.footerContainer, footerContainerStyle]}>{footer}</View>}
		</View>	
	);
}

const styles = StyleSheet.create({
	appContainer: { 
		flex: 1,
    	alignItems: 'center',
    	backgroundColor:'white'
    },
	headerContainer: {},
	footerContainer: {},
	headerTitle:{}
});

export default AppView;