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

const StockChartIntraday = ({ticker, size}) => {
	const intradayData = useStockIntradayData(ticker);

	return (
		<>
		<Text>StockChartIntraday - {ticker} - {size}</Text>
		<Chart prices={intradayData} {...{size}} />
		</>
	)
}

const StockChartDaily = ({ticker, size}) => {
	console.log("StockChartDaily");
	console.log(ticker);
	console.log(size);

	const dailyData = useStockHistoricalData(ticker);

	// console.log("Daily Data");
	// console.log(dailyData);

	return (
		<>
		<Text>StockChartDaily - {ticker} - {size}</Text>
		<Chart prices={dailyData} {...{size}} />
		</>
	)
}

const StockChart = ({ticker, type, size}) => {
	return (
		<>
	 	{
		 	type == "intraday" ? 
		 		<StockChartIntraday {...{ticker, size}} />
		 	:	
		 		<StockChartDaily {...{ticker, size}} />
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