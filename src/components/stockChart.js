import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LineChart} from 'react-native-svg-charts';

import { useTheme, WP, HP } from '../theme';

import {useStockHistoricalData, useStockIntradayData} from '../helper';

const Chart = ({prices, size}) => {
	console.log("Chart");
	console.log(prices);
	console.log(size);

	const theme = useTheme();

	const getColor = (prices = []) => {
		// console.log(theme);
		const color = prices.slice(-1).pop() > prices[0] ? theme.green : theme.red;
		console.log(color)
		return color;
	}

	const getSize = (size) => {
		const style = size == 'S' ? styles.tinyChart : size == 'M' ? styles.mediumChart : styles.bigChart 
		console.log(style);
		return {height: HP(9), width: WP(30)}	
	}

	return (
		<LineChart
            style={getSize(size)}
            data={ prices }
            svg={{ stroke: getColor(prices) }}
            contentInset={ { bottom: 20 } }
        />
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

const StockChartDaily = ({symbol, size, timeframe}) => {
	// console.log("StockChartDaily");
	// console.log(symbol);
	// console.log(size);

	const dailyData = useStockHistoricalData(symbol, {timeframe});

	// console.log(dailyData);

	const formatBars = (bars) => {
		return (bars || []).map(item => item.closePrice);
	}
	// console.log("Daily Data");
	// console.log(dailyData);
	// <Text>StockChartDaily - {symbol} - {size}</Text>
	// <Chart prices={dailyData} {...{size}} />

	return (
		<Chart prices={formatBars(dailyData)} {...{size}}/>		
	)
}

const StockChart = ({symbol, type, size, timeframe}) => {
	return (
		<>
	 	{
		 	type == "intraday" ? 
		 		<StockChartIntraday {...{symbol, size, timeframe}} />
		 	:	
		 		<StockChartDaily {...{symbol, size, timeframe}} />
 		}
		</>
	);
}

const styles = StyleSheet.create({
	tinyChart: {
		height: 60,
		width: 100
	},
	mediumChart:{

	},
	bigChart: {

	}

});

export default StockChart;