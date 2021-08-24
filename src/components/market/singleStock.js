import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler'

import { StockChart, TickerDisplay, StockName } from './'; 

import { useAssetData } from  '../../helper';
import {useTheme, StyledText, WP} from '../../theme';

import {formatName} from '../../utils';

export const SingleStock = ({symbol, onClick, detail = false}) => {
	const styles = useStyles();
	
	const PlainView = () => {
		return (
			<View style={styles.singleStockRow}>
				<StockName {...{symbol}} containerStyle={{width: WP(30)}}/>
				<StockChart {...{symbol, size: "S", timeframe: "5Day"}}/>
				<TickerDisplay {...{symbol}} style={{width: WP(30)}} priceStyle={{textAlign: 'right'}} priceChangeStyle={{textAlign: 'right'}} />
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
			width: '100%',
			alignItems: 'center',
			marginTop: WP(5)
		},
		priceChangeContainer:{

		}
	}); 

	return styles;	
}
