import React, {useState, useEffect, useMemo} from 'react';
import {ScrollView, View, Text, StyleSheet, TextInput, FlatList, Pressable} from 'react-native';
import { debounce } from "lodash";
import {useNavigation} from '@react-navigation/native';

import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';
import SingleStock from  './singleStock';

import { useStockList } from '../../helper';
import {initialStocks} from '../../config'

export const SearchStockList = () => {

	const stockList = useStockList();
	const [stocks, setStocks] = useState([]);
	const [keyword, setKeyword] = useState('');
	const navigation = useNavigation();
	const styles = useStyles();

	// Initial Mount  
	useEffect(() => {
		// console.log(initialStocks);
		// console.log(stockList.length);
		// console.log((stockList || []).filter(item => initialStocks.includes(item.symbol)));

		setStocks((stockList || []).filter(item => initialStocks.includes(item.symbol)))
	}, [stockList]);

	// Effect on changing keyword
	useEffect(() => {	
		// console.log("Keyword Use Effect")
		// console.log(keyword);

		if (keyword != '') {
			const fStocks = (stockList || [])
				.filter(stock => stock.symbol.toLowerCase().indexOf(keyword.toLowerCase()) != -1)
				.sort((a, b) => a < b ? 1 : -1)
			    .slice(0, 20);
			setStocks(fStocks);
		} else {
			// console.log(initialStocks);
			console.log((stockList || []).length);
			// console.log((stockList || []).filter(item => initialStocks.includes(item.symbol)));

			setStocks((stockList || []).filter(item => initialStocks.includes(item.symbol)));		}
	}, [keyword]);

	const changeHandler = (text) => {
	    setKeyword(text);
  	};

	const debouncedChangeHandler = useMemo(() => debounce(changeHandler, 300), []);
	

	const toStockDetail = (symbol) => {
		navigation.navigate('StockDetail', {symbol});
	}

	renderItem = ({item}) => {
		// console.log(item);
		return (
			<Pressable style={styles.stockContainer} onPressOut={() => toStockDetail(item.symbol)}>
				<StyledText style={styles.stockSymbol}>{item.symbol}</StyledText>
				<StyledText style={styles.stockName}>{item.name}</StyledText>
			</Pressable>
		);
	}

	return (
		<View>
			<StyledTextInput style={styles.textInput} onChangeText={changeHandler} type="text" />
			<FlatList
				data={stocks}
				renderItem={renderItem}
				keyExtractor={item => item.id}
			/>

		</View>
	);
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		stockContainer: {

		},
		stockName: {
			color:'black'
		},
		stockSymbol: {
			color:'black'
		},
		textInput: {
			textAlign: 'left',
			color:'black'
		}
	});

	return styles;
}
