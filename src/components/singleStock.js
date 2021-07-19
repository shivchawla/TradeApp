import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import TinyChart from './tinyChart'; 
import {useTickerData} from  '../helper';
import {ShowJson} from './showJson';

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
	return <>{tickerData && <ShowJson json={tickerData} /> }</>
}

const SingleStockEOD = ({ticker}) => {
	const tickerData = useTickerEODData(ticker);
	return <>{tickerData && <ShowJson json={tickerData} /> }</>
}

const SingleStock = ({ticker, realtime}) => {
	return (
		<View style={styles.container}>
			{/*<StockName/>*/}
			{/*<TinyChart/>*/}
			{/*<PriceChange lastPrice={tickerData}/>*/}
			{realtime ? <SingleStockRealTime {...{ticker}}/> : <SingleStockEOD {...{ticker}} />}
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