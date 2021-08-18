
import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AppView, AccountIcon, SearchIcon, HorizontalScrollMenu, AddIcon} from '../../components/common';
import { SingleStock } from '../../components/market';
import { useTheme, WP } from '../../theme' 

import {defaultStocks} from '../../config';
import { useAllWatchlist, useCreateWatchlist, useWatchlist, useDeletewatchlist } from '../../helper';

const ShowWatchlist = ({watchlistId}) => {

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
	const items = watchlists.map(item => {
		return {key: item.id, label: item.name, component: () => <ShowWatchlist {...{watchlistId: item.id}}/>}
	})

	return (
		<HorizontalScrollMenu {...{items}}/>
	) 
}


const Market = (props) => {

	const {isError, getAllWatchlist} = useAllWatchlist({enabled: false});
	const {createWatchlist} = useCreateWatchlist();
	
	const [watchlists, setWatchlists] = useState(null);

	const theme = useTheme();
	const navigation = useNavigation();
	
	React.useEffect(() => {

		const manageWatchlists = async() => {

			const watchlists = await getAllWatchlist();

			if (!!!watchlists || watchlists.length == 0) {
				createWatchlist({name: "Default", symbols: defaultStocks}, {
					onSuccess: (response, input) => {
						console.log("Success Creating watchlist");
						console.log(response);

						setWatchlists([response]); 
					},
					onError: (err, input) => console.log(err)
				});
			} else {
				setWatchlists(watchlists);
			}
		}

		manageWatchlists();

	}, []);

	return (
		<AppView headerLeft={<AccountIcon />} headerRight={<SearchIcon onPress={() => navigation.navigate("SearchStock")}/>} 
			title="Market" 
			goBack={false}>

			{!!watchlists && 
				<View style={styles.watchlistContainer}>
					<SelectWatchlist {...{watchlists}} selectContainerStyle={{width: WP(80)}}/>
					<AddIcon containerStyle={{position:'absolute', right: 0, top: 10}} onPress={() => navigation.navigate('ManageWatchlist') }/>
				</View>
			}

		</AppView>
	);
}

const styles = StyleSheet.create({
	watchlistContainer: {
		width: '100%',
		justifyContent: 'center',
	}
});

export default Market;