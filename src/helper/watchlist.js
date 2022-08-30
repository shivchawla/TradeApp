import React, {useState} from 'react';
import { useQuery, useMutation } from 'react-query';

import {getAllWatchlist, getWatchlist, createWatchlist, 
		updateWatchlist, addAssetToWatchlist, 
		removeAssetToWatchlist, deleteWatchlist } from './api';

import { currentISODate, toISODate, yearStartISODate, dayStartISODate, dayEndISODate, duration} from '../utils';
import { useClock } from './clock';

import {getWatchlistOrder, setWatchlistOrder} from './store'


const validateWatchlist = (watclistParams) => {
	return true;
}

export const useAllWatchlist = (params = {}) => {
	const {isError, error, data: watchlists, refetch} = useQuery(['getAllWatchlist'], async() => getAllWatchlist(params?.populate ?? false), params);
	if (isError) {
		console.log("Error fetching all watchlists: ", error);
	}

	return {isError, watchlists, getAllWatchlist: async() => refetch().then(r => r.data)}
}


export const useWatchlist = (watchlist_id, params={}) => {
	const {isError, error, data: watchlist, refetch} = useQuery(['getWatchlist', watchlist_id], async() => getWatchlist(watchlist_id), params);
	if (isError) {
		console.log("Error fetching all watchlist: ", error);
	}

	return {isError, watchlist, getWatchlist: async() => refetch().then(r => r.data)}
}


export const useCreateWatchlist = (watchlistParams = {}) => {
	const {isError, mutate} = useMutation(watchlistParams => {
	    if (validateWatchlist(watchlistParams)) {
	      return createWatchlist(watchlistParams);
	    }

    	throw new Error("Invalid Watchlist Parameters");
	});

  return {isError, createWatchlist: async(params, callbackParams) => mutate(params, callbackParams)};

}

export const useDeleteWatchlist = (watchlistId) => {
	const {isError, mutate} = useMutation(watchlistId => deleteWatchlist(watchlistId))
	return {isError, deleteWatchlist: async(params, callbackParams) => mutate(params, callbackParams)};
}


export const useUpdateWatchlist = (watchlistId, watchlistParams={}) => {
	const {isError, mutate} = useMutation(({watchlistId, watchlistParams})  => updateWatchlist(watchlistId, watchlistParams))
	return {isError, updateWatchlist: async(params, callbackParams) => mutate(params, callbackParams)};
}


const WatchlistContext = React.createContext(null);
	
export const WatchlistProvider = ({children}) => {

	const {watchlists} = useAllWatchlist();
	const {createWatchlist} = useCreateWatchlist();
	const [orderedWatchlists, setOrderedWatchlists] = useState([])

	const getOrderedWatchlist = async(wls) => {
		if (wls) {
			const orderedNames = await getWatchlistOrder().then(out => out ? out.filter(it => it) : null); //Filter out null
			if (orderedNames && orderedNames.length > 0) {
				return orderedNames.map(name => wls.find(item => item.name == name));
			} else {
				return wls;
			}
		}
	};

	const updateWatchlistOrder = (wls) => {
		setOrderedWatchlists(wls);
	}

	React.useEffect(() => {
		//Update the order in LOCAL STORE
		setWatchlistOrder(orderedWatchlists.map(item => item.name));
	}, [orderedWatchlists])

	React.useEffect(() => {

		const onChangeWatchlist = async() => {
			if (!!!watchlists || watchlists.length == 0) {
				createWatchlist({name: "Default", symbols: defaultStocks}, {
					onSuccess: (response, input) => {
						setOrderedWatchlists([response]); 
					},
					onError: (err, input) => console.log(err)
				});
			} else {
				setOrderedWatchlists(await getOrderedWatchlist(watchlists));
			}
		}

		onChangeWatchlist();

	}, [watchlists])

	return (
		<WatchlistContext.Provider value={{watchlists, orderedWatchlists, updateWatchlistOrder}}>
			{children}
		</WatchlistContext.Provider>
	)
};

export const useWatchlistHelper = () => React.useContext(WatchlistContext);
