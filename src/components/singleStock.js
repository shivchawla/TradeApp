import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

// import TinyChart from './tinyChart'; 
import { useTickerRealtimeData, useTickerEODData } from  '../helper';
import ShowJson from './showJson';
import {BarIndicator} from 'react-native-indicators';


const StockName = (props) => {
	return (
		<View>
			<Text style={styles.stockSymbol}>{props.symbol}</Text>
			<Text style={styles.stockName}>{props.name}</Text>
		</View>
	);
}

const PriceChange = ({lastPrice}) => {
	console.log(lastPrice);
	return (
		<ShowJson json={lastPrice} />
	);
}

const SingleStockRealTime = ({ticker}) => {
	const tickerData = useTickerRealtimeData(ticker);
	return (
		<View>{tickerData && <ShowJson json={tickerData} /> }</View>
	);
}

const SingleStockEOD = ({ticker}) => {
	// console.log("SingleStockEOD");
	// console.log(ticker);
	const [isLoading, error, data] = useTickerEODData(ticker);
	
	// console.log(data);
	// console.log(isLoading);
	// console.log(error);

	return (
		<View>
			{isLoading && <BarIndicator color="black" />} 
			{data && <ShowJson json={data} /> }
		</View>
	);
}

const SingleStock = ({ticker, realtime}) => {
	// console.log("Single Stock");
	// console.log(ticker);

	return (
		<View style={styles.container}>
			{realtime ? <SingleStockRealTime {...{ticker}} /> : <SingleStockEOD {...{ticker}} />}
		</View>
	);
}


const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	stockName: {

	},
	stockSymbol:{

	}
}); 

export default SingleStock;
