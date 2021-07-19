import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName'

const PortfolioStock = (props) => {

	return (
		<AppView>
			<ScreenName name="Portfolio Stock Screen" />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default PortfolioStock;