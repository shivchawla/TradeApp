import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarIndicator } from 'react-native-indicators';
import { TouchableOpacity } from 'react-native-gesture-handler'
// import { useTheme } from '@react-navigation/native';
import { useTheme } from '../theme'

import StockChart from './stockChart'; 
import { useStockRealtimeData, useStockEODData, useClock, useAssetData } from  '../helper';
import ShowJson from './showJson';

import { StyledText, WP, HP, Typography, AppDarkTheme, AppDefaultTheme } from '../theme';

const StockName = (props) => {
	// console.log(props);

	const formatName = (name) => {
		const RSTRING = ['Common Stock', 'Class C Capital Stock', 'Series 1', ',','oration', 'Class A', 'Class B', 'Class C']

		var output = name 
		RSTRING.forEach(rStr => {
			output = output.replace(rStr, '').trim();
		})

		return output
		
	}

	return (
		<View style={styles.stockNameContainer}>
			<StyledText style={styles.stockSymbol}>{props.symbol}</StyledText>
			<StyledText style={styles.stockName}>{formatName(props.name)}</StyledText>
		</View>
	);
}

const PriceChange = ({price, changeValue, changePct}) => {
	const theme = useTheme();
	const getColor = (chg) => {
		return chg > 0 ? theme.green : theme.red;
	}

	return (
		<View style={styles.priceChangeContainer}>
			<StyledText style={[styles.price, Typography.fourPointFive]}>{price}</StyledText>
			<StyledText style={[styles.priceChange, {color: getColor(changeValue)}]}>{changeValue} ({changePct}%)</StyledText>
		</View>
	);
}

const SingleStockRealTime = ({symbol}) => {
	const marketData = useStockRealtimeData(symbol);
	return (
		<View>
			{marketData && <ShowJson json={marketData} /> }
		</View>
	);
}

const SingleStockEOD = ({symbol}) => {
	// console.log("SingleStockEOD");
	// console.log(symbol);
	const {asset} = useAssetData(symbol);
	// console.log(asset);
	const {data: snapshot} = useStockEODData(symbol);
	// console.log(data);
	
	// React.useEffect(() => { //This is mounted many times
	// 	console.log("Running Use Effect of SingleStockEOD - ************************");
	// }, [])

	const isLoading = !!!snapshot || !!!asset;

	const formatPriceChange = ({dailyBar, prevDailyBar}) => {
		const {closePrice: prevClose} = prevDailyBar;
		const {closePrice: currentClose} = dailyBar;

		return {price: currentClose, changeValue: (currentClose - prevClose).toFixed(2), changePct: (!!prevClose ? (currentClose/prevClose - 1)*100 : 0).toFixed(2)}
	}

	return (
		<View>
			{isLoading && <BarIndicator color="white" />} 
			<View style={styles.singleStockRow}>
				{asset && <StockName {...asset} />}
				<StockChart {...{symbol, size: "S", timeframe: "5Day"}}/>
				{snapshot && <PriceChange {...formatPriceChange(snapshot)} />}
			</View>

			{/*{data && <ShowJson json={data} /> }*/}
		</View>
	);
}

const SingleStock = ({symbol, onClick, detail = false}) => {
	const clock = useClock();

	React.useEffect(() => { //This is running many times, but only once at upload
    	console.log("Running Use Effect of SingleStock ----- $$$$$$$$$$$");
	    console.log(clock);
  	})

	const PlainView = () => {
		return (
			<View style={styles.container}>
				{clock?.is_open ? <SingleStockRealTime {...{symbol}} /> : <SingleStockEOD {...{symbol}} />}
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


const styles = StyleSheet.create({
	container: {
		// flexDirection: 'column',
		// justifyContent: 'space-between',
		// alignItems: 'center'
		width: WP(100)
	},
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

	},
	price: {
		textAlign: 'right'
	},
	priceChange: {
		textAlign: 'right'
	}
}); 

export default SingleStock;
