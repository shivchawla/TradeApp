import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { priceChangeFromSnapshot, priceChangeFromRealtime } from '../utils';
import { useStockEODData, useStockRealtimeData } from  '../helper';
import { useTheme, StyledText, Typography, WP, HP }  from '../theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const PriceChange = ({price, changeValue, changePct, ...props}) => {
	// console.log(price);
	// console.log(changeValue);
	// console.log(changePct);

	const theme = useTheme();
	const getColor = (chg) => {
		return chg > 0 ? theme.green : theme.red;
	}

	const styles = useStyles();

	return (
		<View style={[styles.priceChangeContainer, props.style]}>
			<StyledText style={[styles.price, props.priceStyle]}>{!!price ? price.toFixed(2) : '--'}</StyledText>
			<StyledText style={[styles.priceChange, props.priceChangeStyle, {color: getColor(changeValue)}]}>{!!changeValue ? changeValue.toFixed(2) : '--'} ({!!changePct ? changePct.toFixed(2)+'%' : '--'})</StyledText>
		</View>
	);
}

const TickerDisplay = ({symbol, unsubscribeOnBlur = true, ...props}) => {
	const {rtData, subscribe, unsubscribe} = useStockRealtimeData(symbol);
	const {snapshot} = useStockEODData(symbol);

	const navigation = useNavigation();

	useFocusEffect(
		React.useCallback(() => {
			console.log("Subscribe on Focus: ", symbol);
			subscribe();

			// //cleanup -- PROBLEM!!! It's running 
			// return () => {		
			// 	if(unsubscribeOnBlur) {	
			// 		console.log("Subscribe on unfocus");
			// 		unsubscribe();
			// 	}
			// }

		}, [])
	);

	// React.useEffect(() => {
	// 	navigation.addListener('focus', () => {
	// 		console.log("Subscribe on Focus: ", symbol);
	// 		subscribe();
	//     });
	// }, [navigation])
	

	React.useEffect(() => {
		console.log(rtData);
	}, [rtData])
	
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
	const theme = useTheme();

	const styles = StyleSheet.create({
		price: {
			fontSize: Typography.fourPointFive,
			textAlign: 'left'
		},
		priceChange: {
			textAlign: 'left'
		}
	});

	return styles;
}


export default TickerDisplay;