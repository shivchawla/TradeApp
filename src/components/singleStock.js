import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

import StockChart from './stockChart'; 
import { useStockRealtimeData, useStockEODData } from  '../helper';
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
	const tickerData = useStockRealtimeData(ticker);
	return (
		<View>{tickerData && <ShowJson json={tickerData} /> }</View>
	);
}

const SingleStockEOD = ({ticker}) => {
	// console.log("SingleStockEOD");
	// console.log(ticker);
	const [isLoading, error, data] = useStockEODData(ticker);
	
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

const SingleStock = ({ticker, realtime, onClick, detail = false}) => {
	// console.log("Single Stock");
	// console.log(ticker);

	const PlainView = () => {
		return (
			<View style={styles.container}>
				{realtime ? <SingleStockRealTime {...{ticker}} /> : <SingleStockEOD {...{ticker}} />}
			</View>
		); 
	}

	return (
		<>
		{onClick ? 
			<>
			<Pressable onPressOut={onClick}><PlainView /></Pressable>
			{detail && <StockChart {...{ticker}} />}
			</>
		:    
			<>
			<PlainView />
			{detail && <StockChart {...{ticker}} size="full" type="historical"/>}
			</>
		}
		</> 
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
