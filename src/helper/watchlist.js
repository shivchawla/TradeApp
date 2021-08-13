import React, {useState} from 'react';
import {useQuery} from 'react-query';

import {getAllWatchlist, getWatchlist, createWatchlist, 
		updateWatchlist, addAssetToWatchlist, 
		removeAssetToWatchlist, deleteWatchlist } from './api';

import { currentISODate, toISODate, yearStartISODate, dayStartISODate, dayEndISODate, duration} from '../utils';
import { useClock } from './clock';


const validateWatchlist = (watclistParams) => {
	return true;
}

export const useAllWatchList = (params = {}) => {
	const {isError, error, data: watchlists, refetch} = useQuery(['getAllWatchlist'], () => getAllWatchlist(), params);
	if (isError) {
		console.log("Error fetching all watchlists: ", error);
	}

	return {isError, watchlists, getAllWatchlist: () => refetch().then(r => r.data)}
}


export const useWatchList = (watchlist_id) => {
	const {isError, error, data: watchlist, refetch} = useQuery(['getAllWatchlist', watchlist_id], () => getWatchlist(watchlist_id), params);
	if (isError) {
		console.log("Error fetching all watchlist: ", error);
	}

	return {isError, watchlist, getWatchlist: () => refetch().then(r => r.data)}
}


export const useCreateWatchList = () => {
	const {isError, mutate} = useMutation(watchlistParams => {
	    if (validateWatchlist(watchlistParams)) {
	      return createWatchlist(updatedParams);
	    }

    	throw new Error("Invalid Watchlist Parameters");
	});

  return {isError, createWatchlist: (params, callbackParams) = mutate(params, callbackParams)};

}

export const useDeleteWatchList = () => {
	const {isError, mutate} = useMutation(watchlistId => deleteWatchlist(watchlistId))
	return {isError, deleteWatchlist: (params, callbackParams) => mutate(params, callbackParams)};
}


export const useUpdateWatchList = () => {
	const {isError, mutate} = useMutation(({watchlistId, watchlistParams})  => updateWatchlist(watchlistId, watchlistParams))
	return {isError, updateWatchlist: (params, callbackParams) => mutate(params, callbackParams)};
}

