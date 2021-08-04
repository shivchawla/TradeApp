import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { priceChangeFromSnapshot } from '../utils';
import { useStockEODData } from  '../helper';
import { useTheme, StyledText, Typography, WP, HP }  from '../theme';

const PriceChange = ({price, changeValue, changePct}) => {
	const theme = useTheme();
	const getColor = (chg) => {
		return chg > 0 ? theme.green : theme.red;
	}

	return (
		<View>
			<StyledText style={[styles.price, Typography.fourPointFive]}>{price}</StyledText>
			<StyledText style={[styles.priceChange, {color: getColor(changeValue)}]}>{changeValue} ({changePct}%)</StyledText>
		</View>
	);
}

const HighLow = ({high, low}) => {
	const theme = useTheme();
	const getColor = (chg) => {
		return chg > 0 ? theme.green : theme.red;
	}

	return (
		<View>
			<StyledText style={[styles.price, Typography.four]}>High: {high}</StyledText>
			<StyledText style={[styles.price, Typography.four]}>Low:  {low}</StyledText>
		</View>
	);
}


const StockDetailTop = ({symbol}) => {
	const {data: snapshot} = useStockEODData(symbol);
	const dailyBar = !!snapshot?.dailyBar && {high : snapshot?.dailyBar?.highPrice, low : snapshot?.dailyBar?.lowPrice};  

	return (
		<View style={styles.stockDetailTopContainer}>
			{snapshot && <PriceChange {...priceChangeFromSnapshot(snapshot)} />}
			{dailyBar && <HighLow {...dailyBar}/>}
		</View>
	)
}

const styles = StyleSheet.create({
	stockDetailTopContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		padding: WP(2)
	},
});

export default StockDetailTop;