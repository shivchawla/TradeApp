import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';

import { AppView, FavoriteIcon, Collapsible, FullViewModal, Checkbox, ConfirmButton } from '../../components/common';
import { StockChart, TradeButtons, StockPosition, 
	StockOrders, StockDetailTop, StockMarketData, StockNews } from '../../components/market';

import { useTheme, StyledText }  from '../../theme';
import { useAssetData, useAllWatchlist, useUpdateWatchlist, useLoading } from  '../../helper';

const WatchlistsModal = ({watchlists, symbol, updateLists}) => {

	// console.log("Wathclists Modal");
	// console.log(watchlists);
	// console.log(isVisible)
	const [orgObj, setOrgObj] = useState({});
	const [watchlistsWithSymbol, setWatchlistWithSymbol] = useState({});
	const [dirty, setDirty] = useState(false);

	React.useEffect(() => {
		
		(async() => {
			if (watchlists) {
				var obj = {};
				(watchlists || []).forEach(item => {
					if (item.assets.map(item => item.symbol).includes(symbol)) {
						obj = {...obj, [item.id]: true}
					}
				})
		
				setOrgObj(obj);
				setWatchlistWithSymbol(obj);	
			}
		})();
	}, [watchlists]);

	React.useEffect(() => {

		console.log("UseEffect watchlistsWithSymbol");
		console.log(watchlistsWithSymbol);
		
		if (watchlistsWithSymbol) {
			
			var x = Object.keys(watchlistsWithSymbol).filter(x => !Object.keys(orgObj).includes(x));
			var y = Object.keys(orgObj).filter(x => !Object.keys(watchlistsWithSymbol).includes(x));

			setDirty(x.length > 0 || y.length > 0);
		}

	}, [watchlistsWithSymbol])

	const onToggleSymbolInWatchlist = (watchlist) => {
		var obj;

		if (watchlistsWithSymbol[watchlist.id]) {
			obj = {...watchlistsWithSymbol, [watchlist.id]: false};
		} else {
			obj = {...watchlistsWithSymbol, [watchlist.id]: true};
		}

		var filterObj = {}
		Object.keys(obj).forEach(key => {
			if (obj[key]) {
				filterObj = {...filterObj, [key]: true};
			}
		});

		setWatchlistWithSymbol(filterObj);
	}
	
	return (
		<>
		<View style={{padding: WP(5), flex: 1}}>
			{(watchlists || []).map((item, index) => {
				return (
					<View key={index} style={{flexDirection: 'row', width: '100%', marginBottom: HP(3)}}>
						<Checkbox value={watchlistsWithSymbol[item.id]} onToggle={() => onToggleSymbolInWatchlist(item)} />
						<StyledText style={{fontSize: WP(4.5), marginLeft: WP(3)}}>{item.name}</StyledText>
					</View>
				)	
			})}
		</View>
			
		{dirty && <ConfirmButton title="UPDATE" onClick={() => updateLists(Object.keys(watchlistsWithSymbol))} buttonContainerStyle={{marginBottom: HP(3)}} buttonStyle={{width: '80%'}}/>}
		</>
	)
}

const StockDetail = (props) => {
	const {symbol} = props.route.params;
	const {navigation} = props;
	const {styles} = useStyles();

	const [showWatchlistModal, setWatchlistModalVisible] = useState(false);
	const [isFavorite, setIsFavorite] = useState(false);
	const {watchlists, getAllWatchlist} = useAllWatchlist({populate: true})	

	const {updateWatchlist} = useUpdateWatchlist();
	const {isLoading, loadingFunc} = useLoading(false);

	React.useEffect(() => {
		// console.log("Wathclists Changed");
		(async() => {
			// console.log("Async function called");
			// console.log(watchlists);
			const symbols = Array.prototype.concat.apply([], (watchlists || []).map(item => { return (item?.assets ?? []).map(item => item.symbol)}));
			setIsFavorite(symbols.includes(symbol));
		})()		
	}, [watchlists])

	const {asset} = useAssetData(symbol);

	const onBuy = () => {
		navigation.navigate('PlaceOrder', {symbol, action: "BUY", fractionable: asset?.fractionable});
	}

	const onSell = () => {
		navigation.navigate('PlaceOrder', {symbol, action: "SELL", fractionable: asset?.fractionable});		
	}

	const updateLists = async(watchlistsWithSymbol) => await loadingFunc(
		async() => {
			console.log("watchlistsWithSymbol: ", watchlistsWithSymbol);
			await watchlists.map(async(watchlist) => {
				var symbols = watchlist.assets.map(item => item.symbol);
				const hasSymbol = symbols.includes(symbol);
				var update = false;

				if (watchlistsWithSymbol.includes(watchlist.id) && !hasSymbol) { 
					update = true;
					symbols = [...symbols, symbol];
				} else if (!watchlistsWithSymbol.includes(watchlist.id) && hasSymbol) {
					update = true;
					symbols = symbols.filter(k => k != symbol);						
				}

				if (update) {
					// console.log("updating List: ", watchlist.id);
					// console.log(symbols);
					await updateWatchlist({watchlistId: watchlist.id, watchlistParams: {name: watchlist.name, symbols}})
				}
			})
		}
	).then(() => setWatchlistModalVisible(false)).then(() => getAllWatchlist())

	return (
		<AppView
			isLoading={isLoading} 
			title={showWatchlistModal ? "Add/Delete in Watchlist" : symbol} 
			headerRight={!showWatchlistModal && <FavoriteIcon onPress={() => setWatchlistModalVisible(true)} isFavorite={isFavorite}/>} 
			footer={!showWatchlistModal && <TradeButtons {...{onBuy, onSell}} />} 
			footerContainerStyle={styles.footer}
			goBack={showWatchlistModal ? () => setWatchlistModalVisible(false) : () => navigation.goBack()}
		>	
			{showWatchlistModal ? 
				<WatchlistsModal {...{watchlists, symbol, updateLists}}/>
				:
				<>	
					<StockDetailTop {...{symbol}} />
					<Collapsible 
						title="PRICE CHART" 
						containerStyle={{marginBottom: HP(3)}}
						content={
							<StockChart 
								{...{symbol, size: 'L'}} 
								style={styles.chartContainer}
								hasSelector={true}
								hasTooltip={true} 
								baseline={true}
							/>
						}

					/>
					<StockMarketData {...{symbol}} />

					<StockPosition {...{symbol}} />
					<StockOrders {...{symbol}} />
					<StockNews {...{symbol}} />

					<View style={styles.empty}></View>
				</>
		}
		
		</AppView>

	);
}

const useStyles = () => {
	const {theme, HP, WP, Typography} = useTheme();


	const styles = StyleSheet.create({
		chartContainer: {
			paddingTop: HP(5)
		},
		empty: {
			height: HP(20)
		},
		footer: {
			backgroundColor: theme.grey10
		}

	});

	return {theme, styles};
}

export default StockDetail;