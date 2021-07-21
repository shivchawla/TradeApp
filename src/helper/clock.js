import React from 'react';
import { useQuery } from 'react-query';
import { getClock } from './api';

export function useClock() {
	const {isError, error, data} = useQuery('clock', getClock);
	return data;
}