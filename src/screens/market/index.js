
import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { AppView, AccountIcon, SearchIcon, HorizontalScrollMenu, AddIcon} from '../../components/common';
import { SingleStock } from '../../components/market';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme' 

import {defaultStocks} from '../../config';
import { useAllWatchlist, useCreateWatchlist, useWatchlist, useDeletewatchlist, getWatchlistOrder } from '../../helper';


const ShowAllStocks = ({assets}) => {

	console.log("Render ShowAllStocks: ", assets);
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
		</>
	)

}

const ShowWatchlist = ({watchlistId}) => {

	console.log("Render ShowWatchlist: ", watchlistId);

	const {HP, WP} = useDimensions();
	const {watchlist} = useWatchlist(watchlistId);
	const [assets, setAssets] = useState(null);
	const isLoading = !(watchlist && watchlist.assets.length > 0);

	React.useEffect(() => {

		if (watchlist) {	
			setAssets(watchlist?.assets || []);
		}

	}, [watchlist])

	return (
		<View style={{marginTop: WP(5)}}>
			{assets && <ShowAllStocks {...{assets}} />}
		</View>
	)
}

const SelectWatchlist = ({watchlists}) => {

	console.log("Render SelectWatchlist");

	const {styles} = useStyles();
	const { HP, WP } = useDimensions();
	// const [items, setItems] = useState([]);

	//Form 1
	const items = React.useMemo(() => watchlists.map(item => {
		return {key: item.id, label: item.name, component: React.memo(() => <ShowWatchlist {...{watchlistId: item.id}}/>)}
	}), [watchlists]);


	//Form 2
	//Form 1 and 2 should be same but Form 1 is smalled (crucial to use useMemo to prevent rendering)
	
	// React.useEffect(() => {
	// 	setItems(watchlists.map(item => {
	// 		return {key: item.id, label: item.name, component: React.memo(() => <ShowWatchlist {...{watchlistId: item.id}}/>)}
	// 	}))
	// }, [watchlists])

	return items && items.length > 0 && 
		(<HorizontalScrollMenu {...{items}} 
			selectContainerStyle={styles.selectContainer} 
			menuButtonStyle={styles.menuButton}
			selectedMenuStyle={{padding: WP(3)}}
		/>
	) 
}


const Market = (props) => {

	console.log("*********Render Market**********");	

	const {isError, getAllWatchlist} = useAllWatchlist();
	const {createWatchlist} = useCreateWatchlist();
	
	const [watchlists, setWatchlists] = useState(null);

	const {theme, styles} = useStyles();
	const {HP, WP} = useDimensions();

	const navigation = useNavigation();

	useFocusEffect(
		React.useCallback(() => {
			manageWatchlists();
		}, [])
	);
	
	const updateWatchlistOrder = async(wls) => {
		if (wls) {
			const orderedNames = await getWatchlistOrder();
			if (orderedNames ) {
				return orderedNames.map(name => wls.find(item => item.name == name));
			} else {
				return wls;
			}
		}
	}

	const manageWatchlists = async() => {

		const watchlists = await getAllWatchlist();

		if (!!!watchlists || watchlists.length == 0) {
			createWatchlist({name: "Default", symbols: defaultStocks}, {
				onSuccess: (response, input) => {
					setWatchlists([response]); 
				},
				onError: (err, input) => console.log(err)
			});
		} else {
			const ordered = await updateWatchlistOrder(watchlists);
			setWatchlists(ordered);
		}
	}

	const HeaderRight = () => {
		return (
			<View style={{flexDirection: 'row'}}>
				<SearchIcon onPress={() => navigation.navigate("SearchStock")} iconColor={theme.greyIcon}/>
				<AddIcon containerStyle={{marginLeft: WP(4)}} onPress={() => navigation.navigate('ManageWatchlist') } iconColor={theme.greyIcon}/>	
			</View>
		)
	}	

	return (
		<AppView headerLeft={<AccountIcon />} headerRight={<HeaderRight />}
			title="Market" 
			goBack={false}>

			{!!watchlists && 
				<View style={styles.watchlistContainer}>
					<SelectWatchlist {...{watchlists}}/>
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
		},
		selectContainer: {
			justifyContent: 'flex-start'
		},
		menuButton: {
			marginRight: WP(5),
			padding:WP(1)
		}

	});

	return {theme, styles};
}

export default Market;