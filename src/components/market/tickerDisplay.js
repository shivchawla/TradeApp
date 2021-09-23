import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { priceChangeFromSnapshot, priceChangeFromRealtime } from '../../utils';
import { useStockEODData, useStockRealtimeData, useClock } from  '../../helper';
import { useTheme, StyledText, WP, HP }  from '../../theme';
import { useFocusEffect } from '@react-navigation/native';

const PriceChange = ({price, changeValue, changePct, ...props}) => {
	const {theme, styles} = useStyles();

	const getColor = (chg) => {
		return chg > 0 ? theme.green : theme.red;
	}

	return (
		<View style={[styles.priceChangeContainer, props.style]}>
			<StyledText style={[styles.price, props.priceStyle]}>{!!price ? price.toFixed(2) : '--'}</StyledText>
			<StyledText style={[styles.priceChange, props.priceChangeStyle, {color: getColor(changeValue)}]}>{!!changeValue ? changeValue.toFixed(2) : '--'} ({!!changePct ? changePct.toFixed(2)+'%' : '--'})</StyledText>
		</View>
	);
}

export const TickerDisplay = ({symbol, ...props}) => {
	const {getClock} = useClock({enabled: false});
	const {rtData, subscribe, unsubscribe} = useStockRealtimeData(symbol);
	const {snapshot} = useStockEODData(symbol);

	useFocusEffect(
		React.useCallback(() => {
			console.log("Subscribe on Focus: ", symbol);
			getClock().then(clock => {if(clock?.is_open) {subscribe(symbol)}});
			// subscribe(symbol);
			
			//On unFocus
			return () => {		
				console.log("Unsubscribe on unfocus");
				unsubscribe(symbol);
			}

		}, [])
	);

	React.useEffect(() => {
		console.log("Rt Data changed: ", symbol);
		console.log(rtData);
	}, [rtData])

	// console.log("RT DATA");
	// console.log(rtData);

	// console.log("Snapshot");
	// console.log(snapshot);

	return (
		<>
		{!!rtData ? 
			<PriceChange {...props} {...priceChangeFromRealtime(rtData, snapshot)}/>
			:
			<PriceChange {...props} {...priceChangeFromSnapshot(snapshot)} />
		}
		</>
	)
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		price: {
			fontSize: WP(4.5),
			textAlign: 'left'
		},
		priceChange: {
			textAlign: 'left'
		},
		priceChangeContainer: {
		}
	});

	return {theme, styles};
}
