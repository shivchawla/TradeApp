import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {BarIndicator} from 'react-native-indicators';


import StockChart from './stockChart'; 
import { useStockRealtimeData, useStockEODData, useClock, useAssetData } from  '../helper';
import ShowJson from './showJson';

import {StyledText} from './styled';



const StockName = (props) => {
	// console.log(props);

	const formatName = (name) => {
		const RSTRING = 'Common Stock';
		return name.replace('Common Stock', '').trim();
	}

	return (
		<View>
			<StyledText style={styles.stockSymbol}>{props.symbol}</StyledText>
			<StyledText style={styles.stockName}>{formatName(props.name)}</StyledText>
		</View>
	);
}

const PriceChange = (props) => {
	// console.log(...props);
	return (
		<ShowJson json={props} />
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
	const {data} = useStockEODData(symbol);
	// console.log(data);

	// React.useEffect(() => { //This is mounted many times
	// 	console.log("Running Use Effect of SingleStockEOD - ************************");
	// }, [])

	const isLoading = !!!data || !!!asset;

	return (
		<View>
			{isLoading && <BarIndicator color="black" />} 
			<View style={styles.singleStockRow}>
				{asset && <StockName {...asset} />}
				{data && <PriceChange {...data} />}
			</View>

			{data && <ShowJson json={data} /> }
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
