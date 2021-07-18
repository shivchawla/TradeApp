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
	const  {footer, footerContainerStyle} = props;

	return (
		<View style={[styles.appContainer, props.appContainerStyle]}>
			<AppHeader {...props}/> 
			{props.children}
			{footer && <View style={[styles.footerContainer, footerContainerStyle]}>{footer}</View>}
		</View>	
	);
}

const styles = StyleSheet.create({
	appContainer: {},
	headerContainer: {},
	footerContainer: {},
	headerTitle:{}
});

export default AppView;