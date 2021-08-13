import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarIndicator } from 'react-native-indicators';
import { TouchableOpacity } from 'react-native-gesture-handler'

import { StockChart } from './stockChart'; 
import { TickerDisplay } from '../common';

import { useAssetData } from  '../../helper';
import {useTheme, StyledText, WP,} from '../../theme';

const StockName = ({symbol}) => {
	const {asset} = useAssetData(symbol);

	const formatName = (name) => {
		const RSTRING = ['Common Stock', 'Class C Capital Stock', 'Series 1', ',','oration', 'Class A', 'Class B', 'Class C']

		var output = name 
		RSTRING.forEach(rStr => {
			output = output.replace(rStr, '').trim();
		})

		return output
	}

	const styles = useStyles();

	return (
		<View style={styles.stockNameContainer}>
			<StyledText style={styles.stockSymbol}>{!!asset ? asset.symbol : '---'}</StyledText>
			<StyledText style={styles.stockName}>{!!asset ? formatName(asset.name): '---'}</StyledText>
		</View>
	);
}

export const SingleStock = ({symbol, onClick, detail = false}) => {
	const styles = useStyles();
	
	const PlainView = () => {
		return (
			<View style={styles.singleStockRow}>
				<StockName {...{symbol}} />
				<StockChart {...{symbol, size: "S", timeframe: "5Day"}}/>
				<TickerDisplay {...{symbol}} priceStyle={{textAlign: 'right'}} priceChangeStyle={{textAlign: 'right'}} />
			</View>
		); 
	}

	return (
		<>
		{onClick ? 
			<>
			<TouchableOpacity onPress={onClick}><PlainView /></TouchableOpacity>
			{detail && <StockChart {...{symbol}} />}
			</>
		:    
			<>
			<PlainView />
			{detail && <StockChart {...{symbol}} size="full" type="historical"/>}
			</>
		}
		</> 
	);
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		singleStockRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			width: WP(100),
			padding: WP(3),
		},
		stockNameContainer:{

		},
		stockName: {

		},
		stockSymbol:{

		},
		priceChangeContainer:{

		}
	}); 

	return styles;	
}
