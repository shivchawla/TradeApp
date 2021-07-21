import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LineChart} from 'react-native-svg-charts';

import {useStockHistoricalData, useStockIntradayData} from '../helper';

const Chart = ({prices, size}) => {
	// console.log("Chart");
	// console.log(prices);
	return (
		<View>
			<Text>Length: {(prices || []).length}</Text>
		</View>
	);
}

const StockChartIntraday = ({symbol, size}) => {
	const intradayData = useStockIntradayData(symbol);

	return (
		<>
		<Text>StockChartIntraday - {symbol} - {size}</Text>
		<Chart prices={intradayData} {...{size}} />
		</>
	)
}

const StockChartDaily = ({symbol, size}) => {
	console.log("StockChartDaily");
	console.log(symbol);
	console.log(size);

	const dailyData = useStockHistoricalData(symbol);

	// console.log("Daily Data");
	// console.log(dailyData);

	return (
		<>
		<Text>StockChartDaily - {symbol} - {size}</Text>
		<Chart prices={dailyData} {...{size}} />
		</>
	)
}

const StockChart = ({symbol, type, size}) => {
	return (
		<>
	 	{
		 	type == "intraday" ? 
		 		<StockChartIntraday {...{symbol, size}} />
		 	:	
		 		<StockChartDaily {...{symbol, size}} />
 		}
		</>
	);
}

const styles = StyleSheet.create({
	tinyChart: {
		height: 100,
		width: 100
	},
	bigChart: {

	}

});

export default StockChart;