import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { useStockEODData, useStockRealtimeData } from  '../../helper';
import { useTheme, StyledText }  from '../../theme';

import { TickerDisplay } from './';

const HighLow = ({symbol}) => {
	const {rtData, subscribe} = useStockRealtimeData(symbol);
	const {snapshot} = useStockEODData(symbol);
	const hp = snapshot?.dailyBar?.highPrice; 
	const lp  = snapshot?.dailyBar?.lowPrice;  
	const cp = rtData?.p;

	const high = !!hp ? !!cp ? Math.max(hp, cp).toFixed(2) : hp.toFixed(2) : '--';
	const low = !!lp ? !!cp ? Math.min(lp, cp).toFixed(2) : lp.toFixed(2) : '--';

	// console.log("High: ", high);
	// console.log("Low: ", low);

	const styles = useStyles();
	
	return (
		<View>
			<StyledText style={[styles.price]}>High: {high}</StyledText>
			<StyledText style={[styles.price]}>Low:  {low}</StyledText>
		</View>
	);
}

export const StockDetailTop = ({symbol}) => {
	const styles = useStyles();	
	
	return (
		<View style={styles.stockDetailTopContainer}>
			<TickerDisplay {...{symbol}} />
			<HighLow {...{symbol}}/>
		</View>
	)
}

const useStyles = () => {
	const {theme, HP, WP, Typography} = useTheme();
	

	const styles = StyleSheet.create({
		stockDetailTopContainer: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			width: '100%',
			padding: WP(2)
		},
		price :{
			fontSize: Typography.four
		}
	});

	return styles;
}

