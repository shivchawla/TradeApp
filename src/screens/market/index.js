
import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { AppView, AccountIcon, SearchIcon, HorizontalScrollMenu, AddIcon} from '../../components/common';
import { SingleStock } from '../../components/market';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme' 

import {defaultStocks} from '../../config';
import { useAllWatchlist, useCreateWatchlist, useWatchlist, useDeletewatchlist, getWatchlistOrder } from '../../helper';

const ShowWatchlist = ({watchlistId}) => {

	const {HP, WP} = useDimensions();
	const navigation = useNavigation();
	const {watchlist} = useWatchlist(watchlistId);

	const toStockDetail = (symbol) => {
		navigation.navigate('StockDetail', {symbol});
	}

	return (
		<View style={{marginTop: WP(5)}}>
		{watchlist && watchlist.assets.length > 0 &&
			watchlist.assets.map(({symbol}, index) => {	
				return <SingleStock key={symbol} {...{symbol}} onClick={() => toStockDetail(symbol)}/>
			})
		}
		</View>
	)
}

const SelectWatchlist = ({watchlists}) => {

	const {styles} = useStyles();
	const { HP, WP } = useDimensions();

	const items = watchlists.map(item => {
		return {key: item.id, label: item.name, component: () => <ShowWatchlist {...{watchlistId: item.id}}/>}
	})

	return (
		<HorizontalScrollMenu {...{items}} 
			selectContainerStyle={styles.selectContainer} 
			menuButtonStyle={styles.menuButton}
			selectedMenuStyle={{padding: WP(3)}}
		/>
	) 
}


const Market = (props) => {

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