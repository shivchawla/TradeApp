import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import TinyChart from '../components/tinyChart'; 

const StockName = (props) => {
	return (
		<View>
			<Text style={styles.stockSymbol}>{props.symbol}</Text>
			<Text style={styles.stockName}>{props.name}</Text>
		</View>
	);
}

const PriceChange = () => {
	return (
		<View>
			
		</View>
	);
}

const SingleStock = ({props}) => {
	return (
		<View style={styles.container}>
			<StockName/>
			<TinyChart/>
			<PriceChange/>
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