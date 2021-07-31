import React, {useState} from 'react';
import { useQuery } from 'react-query';
import { getClock } from './api';

export function useClock(params={}) {
	const {isError, data: clock, refetch} = useQuery('clock', getClock, {enabled: true, refetchOnMount: false, ...params});
	return {clock, getClock: () => refetch().then(r => r.data)}; 

	// {is_open: data?.is_open, next_open: data?.next_open, next_close: data?.next_close};
}