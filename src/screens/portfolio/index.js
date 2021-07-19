import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName'

const Portfolio = (props) => {
	const {stocks} = props;

	return (
		<AppView>
			<ScreenName name="Portfolio Home Screen" />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Portfolio;