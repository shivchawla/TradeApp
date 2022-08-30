
import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { AppView, AccountIcon, SearchIcon, HorizontalScrollMenu, AddIcon, TinyTextButton} from '../../components/common';
import { SingleStock } from '../../components/market';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme' 

import {defaultStocks} from '../../config';
import { useWatchlist, useWatchlistHelper, useCreateWatchlist, useStockPortfolioData } from '../../helper';

const ShowAllStocks = ({assets}) => {

	// console.log("Render ShowAllStocks: ", assets);
	const {styles} = useStyles();

	const navigation = useNavigation();

	const toStockDetail = React.useCallback((symbol) => {
		navigation.navigate('StockDetail', {symbol});
	}, [])


	const listStocks = React.useMemo(() => assets && assets.map(({symbol}) => {	
		return <SingleStock key={symbol} {...{symbol}} onClick={() => toStockDetail(symbol)} />
	}), [assets]);


	// This is imporatant; Stabilize the component for same object/array to prevent multiple rendering
	// Commented code below leads to multiple rendering 

	// return (
	// 	<>
	// 		{assets && assets.map(({symbol}) => {	
	// 			return <SingleStock key={symbol} {...{symbol}} />
	// 		})}
	// 	</>
	// )

	return (
		<>
			{listStocks}
			{(assets && assets.length == 0) && 
				<View style={styles.emptyWatchlist}>
					<StyledText style={styles.emptyWatchlistMsg}>Empty Watchlist</StyledText>
					<TinyTextButton title="Add Stock" buttonStyle={styles.addStockButton} onPress={() => navigation.navigate('SearchStock')} />
				</View>
			}
		</>
	)

}

const ShowWatchlist = ({watchlistId}) => {

	const {HP, WP} = useDimensions();
	const {watchlist} = useWatchlist(watchlistId);

	return (
		<View style={{marginTop: WP(5)}}>
			{watchlist && <ShowAllStocks assets={watchlist?.assets || []} />}
		</View>
	)
}

const SelectWatchlist = ({watchlists}) => {

	console.log("Render SelectWatchlist");

	const {styles} = useStyles();
	const { HP, WP } = useDimensions();

	//Form-1: Crucial to use useMemo to prevent rendering
	const items = React.useMemo(() => watchlists.map(item => {
		return {key: item.id, label: item.name, component: React.memo(() => <ShowWatchlist {...{watchlistId: item.id}}/>)}
	}), [watchlists]);

	const [selectedId, setSelectedId] = useState(null);
	const [selected, setSelected] = useState(null);

	const onSelect = (idx) => {
		setSelectedId(watchlists?.[idx]?.id);
	}

	React.useEffect(() => {
		const idx = watchlists.findIndex(item => item.id == selectedId);
		if (idx !=- 1) {
			setSelected(idx);	
		}
	}, [watchlists])

	//Form 2
	//Form 1 and 2 should be same but Form 1 is smalled (crucial to use useMemo to prevent rendering)
	
	// React.useEffect(() => {
	// 	setItems(watchlists.map(item => {
	// 		return {key: item.id, label: item.name, component: React.memo(() => <ShowWatchlist {...{watchlistId: item.id}}/>)}
	// 	}))
	// }, [watchlists])

	return items && items.length > 0 && 
		(<HorizontalScrollMenu {...{items}} 
			initialSelected={selected}
			onSelect={onSelect} 
			selectContainerStyle={styles.selectContainer} 
			menuButtonStyle={styles.menuButton}
			selectedMenuStyle={{padding: WP(3)}}
		/>
	) 
}


const Market = (props) => {

	console.log("*********Render Market**********");	
	const {theme, styles} = useStyles();
	const {HP, WP} = useDimensions();
	const navigation = useNavigation();

	const {watchlists, orderedWatchlists, updateWatchlistOrder} = useWatchlistHelper();
	const {createWatchlist} = useCreateWatchlist();

	const HeaderRight = () => {
		return (
			<View style={{flexDirection: 'row'}}>
				<SearchIcon onPress={() => navigation.navigate("SearchStock")} iconColor={theme.greyIcon}/>
				<AddIcon containerStyle={{marginLeft: WP(4)}} onPress={() => navigation.navigate('ManageWatchlist', {watchlists}) } iconColor={theme.greyIcon}/>	
			</View>
		)
	}	

	return (
		<AppView headerLeft={<AccountIcon />} headerRight={<HeaderRight />}
			title="Market" 
			goBack={false}>

			{!!orderedWatchlists && 
				<View style={styles.watchlistContainer}>
					<SelectWatchlist watchlists={orderedWatchlists} />
				</View>
			}

		</AppView>
	);
}

const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();

	const styles = StyleSheet.create({
		watchlistContainer: {
			width: '100%',
			justifyContent: 'center',
			height: '100%'
		},
		selectContainer: {
			justifyContent: 'flex-start'
		},
		menuButton: {
			marginRight: WP(5),
			padding:WP(1)
		},
		emptyWatchlist: {
			justifyContent: 'center', 
			width: '100%', 
			alignItems: 'center', 
			marginTop: WP(50)
		},
		addStockButton: {
			marginTop: HP(1)
		}

	});

	return {theme, styles};
}

export default Market;