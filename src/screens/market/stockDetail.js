import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import SingleStock from '../../components/singleStock';
import ScreenName from '../../components/screenName';

const StockDetail = (props) => {
	return (
		<AppView>
			<ScreenName name="Stock Detail Screen" />	
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default StockDetail;