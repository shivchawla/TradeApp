import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { NDaysAgoISODate, NWeeksAgoISODate } from '../utils';
import { useStockEODData, useStockHistoricalData } from  '../helper';
import { useTheme, StyledText, Typography, WP, HP, getPnLColor }  from '../theme';
import { MARKET_DATA_FIELDS } from '../config';


const DisplayMarketData = ({data}) => {
	const styles = useStyles();

	const FieldContainer = ({field, value}) => {
		return (
			<View style={styles.marketDataFieldContainer}> 
				<StyledText style={styles.fieldLabel}>{field}: </StyledText>
				<StyledText style={[styles.fieldValue, {...field.includes("Return") && {color: getPnLColor(value)}} ]}>{!!value ? field.includes("Return") ? value.toFixed(2) +'%' : value : '-'} </StyledText>
			</View>
		);
	}

	return (
		<View style={styles.marketDataContainer}>
			<StyledText style={styles.marketDataTitle}>Market Data</StyledText>
			<View style={styles.marketDataFieldsContainer}>
				<View style={styles.marketDataFieldsColumn}>

					{Object.keys(MARKET_DATA_FIELDS).map((key, index) => {
						if (index < 5) {
							return <FieldContainer {...{key}} {...{field: MARKET_DATA_FIELDS[key], value: data[key]}} />
						}
					})}
				</View>
				<View style={styles.marketDataFieldsColumn}>
					{Object.keys(MARKET_DATA_FIELDS).map((key, index) => {
						if (index >= 5) {
							return <FieldContainer {...{key}} {...{field: MARKET_DATA_FIELDS[key], value: data[key]}} />
						}
					})}
				</View>
			</View>
		</View>
	);
}


const StockMarketData = ({symbol}) => {
	const {snapshot} = useStockEODData(symbol);
	const {bars: monthlyBars52W} = useStockHistoricalData(symbol, {start:NWeeksAgoISODate(52), timeframe: '31Day'});
	const {bars: monthlyBarsYtd} = useStockHistoricalData(symbol, {timeframe: '31Day'});
	
	const isLoading = !!!snapshot?.dailyBar || !!!monthlyBars52W || !!!monthlyBarsYtd;

	const computeReturn = (pN, pO) => {
		try {
			// console.log("Price New: ", pN);
			// console.log("Price Old: ", pO);
			return !!pO ? (((pN/pO) - 1)*100) : 0;
		} catch{
			return 0;
		}
	}

	const combineData = (snapshot, monthlyBars52W, monthlyBarsYtd) => {
		const yHigh = Math.max(...monthlyBars52W.map(item => item.highPrice));
		const yLow = Math.max(...monthlyBars52W.map(item => item.lowPrice));
		const yOpen = monthlyBars52W[0].closePrice;

		const ytdOpen = monthlyBarsYtd[0].closePrice;

		const ytdReturn = computeReturn(snapshot?.dailyBar?.closePrice, ytdOpen); 
		const yReturn = computeReturn(snapshot?.dailyBar?.closePrice, yOpen);
		
		return {...snapshot.dailyBar, closePrice: snapshot.prevDailyBar.closePrice, ...{yHigh, yLow, ytdReturn, yReturn}};
	}

	// console.log("isLoading - StockMarketData: ", symbol);
	// console.log(snapshot);
	// console.log(monthlyBars52W);
	// console.log(monthlyBarsYtd);

	// console	.log(isLoading);

	return (
		<>
		{!isLoading && <DisplayMarketData data={combineData(snapshot, monthlyBars52W, monthlyBarsYtd)} />}
		</>
	)
}

const useStyles = () => {
	
	const theme = useTheme();

	const styles = StyleSheet.create({
		marketDataContainer: {
			// flexDirection: 'row',
			// justifyContent: 'space-between',
			width: WP(100),
			paddingTop: WP(2),
			borderColor: theme.darkgrey,
			borderTopWidth: 1,
		},
		marketDataTitle: {
			fontSize: Typography.five,
			color: theme.darkgrey,
			paddingLeft: WP(2),
		},
		marketDataFieldsContainer: {
			flex: 1,
			flexDirection: 'row',
			marginTop: WP(5)
		},

		marketDataFieldsColumn: {
			width: WP(50),
			paddingLeft: WP(2),
			paddingRight: WP(2),			
		},
		marketDataFieldContainer: {
			flex:1,
			flexDirection: 'row',
			marginBottom: WP(1),
			justifyContent:'space-between'
		},
		fieldLabel: {
			fontSize: Typography.four, 
			color: theme.positionLabel,
			textAlign: 'left' 		
		},
		fieldValue: {
			color: theme.positionValue, 
			textAlign: 'right'			
		}
	});

	return styles;
}

export default StockMarketData;