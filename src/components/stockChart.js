import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LineChart} from 'react-native-svg-charts';

import { useTheme, WP, HP } from '../theme';

import {useStockHistoricalData, useStockIntradayData} from '../helper';

const Chart = ({prices, size, style}) => {
	// console.log("Chart");
	// console.log(prices);
	// console.log(size);

	const theme = useTheme();

	const getColor = (prices = []) => {
		// console.log(theme);
		const color = prices.slice(-1).pop() > prices[0] ? theme.green : theme.red;
		// console.log(color)
		return color;
	}

	const getSize = (size) => {
		const style = size == 'S' ? styles.tinyChart : size == 'M' ? styles.mediumChart : styles.bigChart 
		return style;
		// return {height: HP(9), width: WP(30)}	
	}

	return (
		<LineChart
            style={[getSize(size), style]}
            data={ prices }
            svg={{ stroke: getColor(prices) }}
            contentInset={ { bottom: 20 } }
        />
	);
}

const StockChartIntraday = ({symbol, size, ...props}) => {
	const {intradayBars} = useStockIntradayData(symbol);

	return (
		<>
		<Text>StockChartIntraday - {symbol} - {size}</Text>
		<Chart prices={intradayBars} {...{size}} />
		</>
	)
}

const StockChartDaily = ({symbol, timeframe, ...props}) => {
	// console.log("StockChartDaily");
	// console.log(symbol);
	// console.log(size);

	const {bars} = useStockHistoricalData(symbol, {timeframe});

	// console.log(dailyData);

	const formatBars = (bars) => {
		return (bars || []).map(item => item.closePrice);
	}
	// console.log("Daily Data");
	// console.log(dailyData);
	// <Text>StockChartDaily - {symbol} - {size}</Text>
	// <Chart prices={dailyData} {...{size}} />

	return (
		<Chart prices={formatBars(bars)} {...props}/>		
	)
}

const StockChart = ({type, ...props}) => {
	return (
		<>
	 	{
		 	type == "intraday" ? 
		 		<StockChartIntraday {...props} />
		 	:	
		 		<StockChartDaily {...props} />
 		}
		</>
	);
}

const styles = StyleSheet.create({
	tinyChart: {
		height: HP(9), width: WP(30)	
	},
	mediumChart:{
		height: HP(20), width: WP(50)
	},
	bigChart: {
		height: HP(30), width: WP(80)
	}

});

export default StockChart;