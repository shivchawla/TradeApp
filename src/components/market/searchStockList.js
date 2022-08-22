import React, {useState, useEffect, useMemo} from 'react';
import {ScrollView, View, StyleSheet, TextInput, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
const Ionicons  = Icon;

import { useTheme, useDimensions, useTypography, StyledText }  from '../../theme';
import { ConfirmButton } from '../common';

import { StockName, SingleStock } from './';

import { useStockList } from '../../helper';
import { initialStocks } from '../../config'
import { formatName, removeArray, diffArray } from '../../utils';

const useStockSearch = () => {

	const {stockList, getStockList} = useStockList();
	const [stocks, setStocks] = useState([]);
	const [keyword, setKeyword] = useState('');

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

		if (keyword && keyword != '') {
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

	return {stocks, setKeyword};
		
}

const SearchStockBasic = ({renderItem}) => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();

	const styles = useStyles();

	const {stocks, setKeyword} = useStockSearch()
	
	//Add useDebounce from react-use
	const changeHandler = (text) => {
	    setKeyword(text);
  	};
	
	return (
		<View style={styles.listContainer}>
			<TextInput placeholder="Search Stocks" style={styles.textInput} onChangeText={changeHandler} type="text" />
			<FlatList 
				data={stocks}
				renderItem={renderItem}
				keyExtractor={item => item.id}
			/>
		</View>
	);
} 

export const SearchStockList = ({onPressToOrder = false}) => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();

	const styles = useStyles();

	const navigation = useNavigation();
	const toStockDetail = (symbol) => {
		navigation.navigate('StockDetail', {symbol});
	}

	const toOrder = (symbol) => {
		navigation.navigate('PlaceOrder', {symbol});
	}

	const renderItem = ({item: stock}) => {

		const onPress = onPressToOrder ? () => toOrder(stock.symbol) :  () => toStockDetail(stock.symbol)
		
		return (
			<TouchableOpacity style={styles.stockContainer} onPress={onPress}>
				<StockName {...{stock}} />
				<Ionicons name="chevron-forward" color={theme.backArrow } size={WP(7)} />
			</TouchableOpacity>
		);
	}

	return <SearchStockBasic {...{renderItem}} />;
}


export const SearchStockWatchlist = React.forwardRef(({initialStocks, onSave}, ref) => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();

	const styles = useStyles();

	const [selectedStocks, setSelected] = useState(initialStocks ?? []);
	const [showFooter, setShowFooter] = useState(false);

	const toggleSelected = (stock) => {
		if (selectedStocks.map(item => item.symbol).includes(stock.symbol)) {
			//Remove
			setSelected(removeArray(selectedStocks, stock, 'symbol'))
		} else {
			setSelected(selectedStocks.concat(stock));
		}	
	}

	React.useEffect(() => {
		const oSymbols = (initialStocks ?? []).map(item => item.symbol);
		const nSymbols = (selectedStocks || []).map(item => item.symbol)

		const extraSymbols = diffArray(oSymbols, nSymbols);

		if(!!selectedStocks && extraSymbols.length > 0) {
			setShowFooter(true);
		} else {
			setShowFooter(false);
		}

	}, [selectedStocks]);

	const FooterButton = () => {
		return (
			<>
			{showFooter && <ConfirmButton buttonStyle={{width: '100%',position: 'absolute', bottom: 0}} title="SAVE" onClick={onSave}/>}
			</>
		)
	}

	const renderItem = ({item: stock}) => {
		return (
			<View style={styles.watchlistItemContainer}>
				<TouchableOpacity onPress={() => toggleSelected(stock)}>
					<View style={styles.stockSelector} >
						{selectedStocks.map(item => item.symbol).includes(stock.symbol) ?
							<Ionicons name="heart" color={theme.backArrow } size={WP(7)} /> :
							<Ionicons name="heart-outline" color={theme.backArrow } size={WP(7)} />
						}
						<StockName {...{stock}} containerStyle={{marginLeft: WP(5)}}/>
					</View>
				</TouchableOpacity>
			</View>
		);
	}

	//Added this to get list of selected stocks in parent component
    React.useImperativeHandle(ref, () => ({getSelectedStocks: () => selectedStocks}), [selectedStocks]);

	return (
		<View style={{width: '100%', flex:1, alignItems: 'center'}}>
			<SearchStockBasic {...{renderItem}} />
			<FooterButton />
		</View>
	)

})

const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();


	const styles = StyleSheet.create({
		listContainer: {
			width: '100%',
			flex: 1
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
		},
		watchlistItemContainer: {
			flexDirection: 'row',
			marginBottom: WP(3),
			alignItems: 'center',
		},
		stockSelector: {
			flexDirection: 'row',
			alignItems: 'center',
			width: '100%',
		},
	});

	return styles;
}
