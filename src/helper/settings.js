import React, {useState} from 'react';
import { useQuery, useMutation } from 'react-query';

import { updateTradeConfig, getTradeConfig } from './api';

export const useTradeConfig = (params = {}) => {
	const {mutate} = useMutation(updateParams => {
		updateTradeConfig(updateParams)
	})

	const {isError, data: tradeConfig, refetch} = useQuery('tradeConfig', async() => getTradeConfig(), params)

	return {
		tradeConfig, 
		getTradeConfig: async() => refetch().then(r => r.data),
		updateTradeConfig: async(params, callbackParams) => mutate(params, callbackParams)
	}
} 
