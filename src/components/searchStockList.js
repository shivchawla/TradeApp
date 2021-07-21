import React, {useState, useEffect, useMemo} from 'react';
import {ScrollView, View, Text, StyleSheet, TextInput, FlatList} from 'react-native';
import { debounce } from "lodash";

import SingleStock from  './singleStock';

import { useStockList } from '../helper';

import {initialStocks} from '../config'

const SearchStockList = () => {

	const stockList = useStockList();
	const [stocks, setStocks] = useState([]);
	const [keyword, setKeyword] = useState('');
	const [page, setPage] = useState(0);

	// Initial Mount  
	useEffect(() => {
		console.log(initialStocks);
		console.log(stockList.length);
		console.log((stockList || []).filter(item => initialStocks.includes(item.symbol)));

		setStocks((stockList || []).filter(item => initialStocks.includes(item.symbol)))
	}, []);

	// Effect on changing keyword
	useEffect(() => {	
		console.log("Keyword Use Effect")
		if (keyword != '') {
			setStocks((stockList || []).filter(stock => { return stock.symbol.indexOf(keyword) != -1 || stock.name.indexOf(keyword) != -1;}));
		} else {
			console.log(initialStocks);
			console.log((stockList || []).length);
			console.log((stockList || []).filter(item => initialStocks.includes(item.symbol)));

			setStocks((stockList || []).filter(item => initialStocks.includes(item.symbol)));		}
	}, [keyword]);

	const changeHandler = (text) => {
	    setKeyword(text);
  	};

	const debouncedChangeHandler = useMemo(() => debounce(changeHandler, 300), []);
	
	renderItem = ({item}) => {
		// console.log(item);
		return (
			<View style={styles.stockContainer}>
				<Text style={styles.stockSymbol}>{item.symbol}</Text>
				<Text style={styles.stockName}>{item.name}</Text>
			</View>
		);
	}

	return (
		<View>
			<TextInput onChangeText={changeHandler} type="text" />
			<FlatList
				data={stocks.slice(page*20, (page+1)*20)}
				renderItem={renderItem}
				keyExtractor={item => item.id}
				onEndReached={() => setPage(page + 1)}
			/>

		</View>
	);
}

const styles = StyleSheet.create({
	stockContainer: {

	},
	stockName: {
		color:'black'

	},
	stockSymbol: {
		color:'black'
	}
});

export default SearchStockList;