import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useQuery} from 'react-query';
import {BarIndicator} from 'react-native-indicators';

import AppView from '../../components/appView';
import SingleStock from '../../components/singleStock';
import ScreenName from '../../components/screenName';

import {defaultStocks} from '../../config';

const Market = (props) => {

	const toStockDetail = (symbol) => {
		// console.log("Navigating to Stock Detail");
		const {navigation} = props;
		navigation.navigate('StockDetail', {symbol});
	}

	// React.useEffect(() => { //This is running many times, but only once at upload
 //    	console.log("Running Use Effect of Market ----- $$$$$$$$$$$");
 //  	})

	return (
		<AppView title="Market" goBack={false}>
			{/*{isLoading && <BarIndicator color='black' />}*/}
			{defaultStocks && defaultStocks.length > 0 &&
				defaultStocks.map((symbol, index) => {	
					return <SingleStock key={symbol} {...{symbol}} onClick={() => toStockDetail(symbol)}/>
				})
			}
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Market;