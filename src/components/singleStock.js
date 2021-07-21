import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

import StockChart from './stockChart'; 
import { useStockRealtimeData, useStockEODData, useClock } from  '../helper';
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

const SingleStockRealTime = ({symbol}) => {
	const symbolData = useStockRealtimeData(symbol);
	return (
		<View>{symbolData && <ShowJson json={symbolData} /> }</View>
	);
}

const SingleStockEOD = ({symbol}) => {
	// console.log("SingleStockEOD");
	// console.log(symbol);
	const [isLoading, error, data] = useStockEODData(symbol);
	
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

const SingleStock = ({symbol, onClick, detail = false}) => {
	// console.log("Single Stock");
	// console.log(symbol);
	const clock = useClock();
	const [realtime, setRealtime] = useState(false);

	useEffect(() => {
		console.log("Clock Effect")
		if (clock && clock.is_open) {
			setRealtime(true);
		} else {
			setRealtime(false);
		}
	});

	const PlainView = () => {
		return (
			<View style={styles.container}>
				{realtime ? <SingleStockRealTime {...{symbol}} /> : <SingleStockEOD {...{symbol}} />}
			</View>
		); 
	}

	return (
		<>
		{onClick ? 
			<>
			<Pressable onPressOut={onClick}><PlainView /></Pressable>
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
