import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { priceChangeFromSnapshot, priceChangeFromRealtime } from '../../utils';
import { useStockEODData, useStockRealtimeData, useClock } from  '../../helper';
import { useTheme, useDimensions, useTypography, StyledText }  from '../../theme';
import { useFocusEffect } from '@react-navigation/native';

const PriceChange = ({price, changeValue, changePct, ...props}) => {
	const {theme, styles} = useStyles();
	const {WP, HP} = useDimensions();

	const getColor = React.useCallback((chg) => {
		return chg > 0 ? theme.green : theme.red;
	}, [])

	let changeText = '';

	if(props.showPctOnly) {
		changeText = !!changePct ? changePct.toFixed(2)+'%' : '--'
	} else {
		changeText = (!!changeValue ? changeValue.toFixed(2) : '--') + ` (${(!!changePct ? changePct.toFixed(2)+'%' : '--')})`;
	}

	return (
		<View style={[styles.priceChangeContainer, props.style, {...props.vertical && {flexDirection: 'column'}}]}>
			<StyledText isNumber={true} style={[styles.price, props.priceStyle]}>{!!price ? price.toFixed(2) : '--'}</StyledText>
			<StyledText isNumber={true} style={[styles.priceChange, props.priceChangeStyle, {color: getColor(changeValue)}, {...!props.vertical && {marginLeft: WP(2)}}]}>{changeText}</StyledText>
		</View>
	);
}

export const TickerDisplay = ({symbol, ...props}) => {
	const {getClock} = useClock({enabled: false});
	const {rtData, subscribe, unsubscribe} = useStockRealtimeData(symbol);
	const {snapshot} = useStockEODData(symbol);

	useFocusEffect(
		React.useCallback(() => {
			(async() => {
				await getClock().then(clock => {if(clock?.is_open) {subscribe(symbol)}});
			})()
			
			//On unFocus
			return () => {		
				// console.log("Unsubscribe on unfocus");
				unsubscribe(symbol);
			}

		}, [])
	);

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
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();

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
