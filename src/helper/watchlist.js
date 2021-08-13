import React, {useState} from 'react';
import { useQuery, useMutation } from 'react-query';

import {getAllWatchlist, getWatchlist, createWatchlist, 
		updateWatchlist, addAssetToWatchlist, 
		removeAssetToWatchlist, deleteWatchlist } from './api';

import { currentISODate, toISODate, yearStartISODate, dayStartISODate, dayEndISODate, duration} from '../utils';
import { useClock } from './clock';


const validateWatchlist = (watclistParams) => {
	return true;
}

export const useAllWatchlist = (params = {}) => {
	const {isError, error, data: watchlists, refetch} = useQuery(['getAllWatchlist'], () => getAllWatchlist(), params);
	if (isError) {
		console.log("Error fetching all watchlists: ", error);
	}

	return {isError, watchlists, getAllWatchlist: () => refetch().then(r => r.data)}
}


export const useWatchlist = (watchlist_id, params={}) => {
	const {isError, error, data: watchlist, refetch} = useQuery(['getAllWatchlist', watchlist_id], () => getWatchlist(watchlist_id), params);
	if (isError) {
		console.log("Error fetching all watchlist: ", error);
	}

	return {isError, watchlist, getWatchlist: () => refetch().then(r => r.data)}
}


export const useCreateWatchlist = () => {
	const {isError, mutate} = useMutation(watchlistParams => {
	    if (validateWatchlist(watchlistParams)) {
	      return createWatchlist(watchlistParams);
	    }

    	throw new Error("Invalid Watchlist Parameters");
	});

  return {isError, createWatchlist: (params, callbackParams) => mutate(params, callbackParams)};

}

export const useDeleteWatchlist = () => {
	const {isError, mutate} = useMutation(watchlistId => deleteWatchlist(watchlistId))
	return {isError, deleteWatchlist: (params, callbackParams) => mutate(params, callbackParams)};
}


export const useUpdateWatchlist = () => {
	const {isError, mutate} = useMutation(({watchlistId, watchlistParams})  => updateWatchlist(watchlistId, watchlistParams))
	return {isError, updateWatchlist: (params, callbackParams) => mutate(params, callbackParams)};
}

