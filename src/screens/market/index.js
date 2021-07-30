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
		console.log("Navigating to Stock Detail");
		const {navigation} = props;
		navigation.navigate('StockDetail', {symbol});
	}

	return (
		<AppView hasHeader={false}>
			<ScreenName name="Market Screen" />
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