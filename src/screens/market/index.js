import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useQuery} from 'react-query';
import {BarIndicator} from 'react-native-indicators';

import AppView from '../../components/appView';
import SingleStock from '../../components/singleStock';
import ScreenName from '../../components/screenName';

import {defaultStocks} from '../../config';
import {getClock} from '../../helper';

// console.log(defaultStocks);

const Market = (props) => {
	// const {stocks} = props;

	const { isLoading, isError, data, error } = useQuery('clock', getClock);

	console.log(data);
	console.log(isLoading);
	console.log(error);

	const toStockDetail = (symbol) => {
		console.log("Navigating to Stock Detail");
		const {navigation} = props;
		navigation.navigate('StockDetail', {symbol});
	}

	return (
		<AppView hasHeader={false}>
			<ScreenName name="Market Screen" />
			{isLoading && <BarIndicator color='black' />}
			{data && defaultStocks && defaultStocks.length > 0 &&
				defaultStocks.map((symbol, index) => {	
					return <SingleStock key={symbol} realtime={data.is_open} {...{symbol}} onClick={() => toStockDetail(symbol)}/>
				})
			}
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Market;