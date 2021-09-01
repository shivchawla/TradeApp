import React, {useState} from 'react';
import { useQuery, useMutation } from 'react-query';

import { updateTradeConfig, getTradeConfig } from './api';

export const useTradeConfig = (params = {}) => {
	const {mutate} = useMutation(updateParams => {
		updateTradeConfig(updateParams)
	})

	const {isError, data: tradeConfig, refetch} = useQuery('tradeConfig', () => getTradeConfig(), params)

	return {
		tradeConfig, 
		getTradeConfig: () => refetch().then(r => r.data),
		updateTradeConfig: (params, callbackParams) => mutate(params, callbackParams)
	}
} 
