import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LineChart} from './common';

import * as Theme  from '../theme';
const { useTheme, StyledText} = Theme;

import {useStockHistoricalData, useStockIntradayData} from '../helper';

const StockChartIntraday = ({symbol, size, ...props}) => {
	const {intradayBars} = useStockIntradayData(symbol);

	return (
		<>
		<StyledText>StockChartIntraday - {symbol} - {size}</StyledText>
		<LineChart values={intradayBars} {...{size}} />
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
	// <StyledText>StockChartDaily - {symbol} - {size}</StyledText>
	// <Chart prices={dailyData} {...{size}} />

	return (
		<LineChart values={formatBars(bars)} {...props}/>		
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

export default StockChart;