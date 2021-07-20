import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import SingleStock from '../../components/singleStock';
import ScreenName from '../../components/screenName';

const StockDetail = (props) => {
	console.log("Stock Detail");
	console.log(props);
	const {ticker} = props.route.params;
	return (
		<AppView>
			<ScreenName name="Stock Detail Screen" />
			<SingleStock {...{ticker}} detail={true}/>	
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default StockDetail;