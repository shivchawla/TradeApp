import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

const AppHeader = (props) => {

	const {title, goBack, headerContainerStyle, headerTitleStyle} = props;
	
	return (
		<View style={[styles.headerContainer, headerContainerStyle]}>
			<Text style={[styles.headerTitle, headerTitleStyle]}>{title}</Text>
		</View>
	);
}

const AppView = (props) => {
	return (
		<View style={[styles.appContainer, props.appContainerStyle]}>
			<AppHeader {...props}/> 
			{props.children}
		</View>	
	);
}

const styles = StyleSheet.create({
	appContainer: {},
	headerContainer: {},
	headerTitle:{}
});

export default AppView;