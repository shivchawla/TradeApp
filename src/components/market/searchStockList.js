import React, {useState, useEffect, useMemo} from 'react';
import {ScrollView, View, StyleSheet, TextInput, FlatList, TouchableOpacity} from 'react-native';
import { debounce } from "lodash";
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';
import { SingleStock, StockName } from  './';

import { useStockList } from '../../helper';
import { initialStocks } from '../../config'
import { formatName } from '../../utils';

export const SearchStockList = ({showItem}) => {

	const {stockList, getStockList} = useStockList();
	const [stocks, setStocks] = useState([]);
	const [keyword, setKeyword] = useState('');
	const navigation = useNavigation();
	const theme = useTheme();
	const styles = useStyles();

	//TODO: Fetch all stocks at market open
	//Search locally instead of API call
	//Thus, no change on typing keyword

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
			// console.log((stockList || []).length);
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

	renderItem = ({item: stock}) => {
		return (
			<TouchableOpacity style={styles.stockContainer} onPress={() => toStockDetail(stock.symbol)}>
				<StockName {...{stock}} />
				<Ionicons name="chevron-forward" color={theme.backArrow } size={WP(7)} />
			</TouchableOpacity>
		);
	}

	return (
		<View style={styles.listContainer}>
			<TextInput placeholder="Search Stocks" style={styles.textInput} onChangeText={changeHandler} type="text" />
			<FlatList style
				data={stocks}
				renderItem={showItem ? showItem : renderItem}
				keyExtractor={item => item.id}
			/>

		</View>
	);
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		listContainer: {
			// width: WP(100),
			width: '100%',
			// alignItems: 'center'
		},
		stockContainer: {
			marginTop: WP(5),
			flexDirection: 'row',
			justifyContent: 'space-between'
		},
		textInput: {
			textAlign: 'left',
			color:theme.text,
			borderWidth: 1, 
			borderColor: theme.text,
			padding: WP(1),
			paddingLeft: WP(4),
			marginBottom: WP(10),
			width: '100%'
		}
	});

	return styles;
}
