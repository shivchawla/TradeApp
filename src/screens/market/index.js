
import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useQuery} from 'react-query';
import {BarIndicator} from 'react-native-indicators';

import { AppView, ScreenName } from '../../components/common';
import SingleStock from '../../components/singleStock';

import {defaultStocks} from '../../config';

const Market = (props) => {

	const toStockDetail = (symbol) => {
		// console.log("Navigating to Stock Detail");
		const {navigation} = props;
		navigation.navigate('StockDetail', {symbol});
	}
	
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