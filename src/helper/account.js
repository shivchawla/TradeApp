import React, {useState, useEffect} from 'react';
import {useQuery, useMutation} from 'react-query';
import { getBrokerageAccount, getTradingAccount, createBrokerageAccount, getAccountActivity } from  './api'; 


//Write a order key validation function
const validateAccountParams = (params) => {
	return true;
}

export function useTradingAccountData(params={}) {
	// console.log("useTradingAccountData");
	const {isError, error, data: tradingAccount, refetch} = useQuery(['tradingAccount'], async() => getTradingAccount(), params);
	if (isError) {
		console.log(`ERROR (useTradingAccountData): ${error}`);
	}

	return {isError, tradingAccount, getTradingAccount: async() => refetch().then(r => r.data)};  
}


export function useCreateBrokerageAccount() {
	// console.log("useCreateBrokerageAccount");
	const {isError, mutate} = useMutation(accountParams => {
		if(validateAccountParams(accountParams)) {
			return createBrokerageAccount(accountParams); //return is important
		} else {
			throw new Error("Invalid Account Parameters");
		}

	});

	return {isError, createBrokerageAccount: (params, callbackParams) => mutate(params, callbackParams)};
}


export function useBrokerageAccountData(params = {}) {
	// console.log("useBrokerageAccountData");
	const {isLoading, isError, error, data: brokerageAccount, refetch} = useQuery(['brokerageAccount'], async() => getBrokerageAccount(), params);
	if (isError) {
		console.log(`ERROR (useBrokerageAccountData): ${error}`);
	}

	return {isLoading, brokerageAccount, getBrokerageAccount: async() => refetch().then(r => r.data)};  
}


export function useAccountActivity({activity_type = null, date = '', until = '', after = '', limit = 10} = {}, params = {}) {
	// console.log("useAccountActivity");
	const queryKey = ['accountActivity', activity_type, date, until, after].filter(item => item && item != '' );
	// console.log(queryKey);
	
	const {isError, isLoading, error, data: accountActivity, refetch} = useQuery(queryKey, async() => getAccountActivity({activity_type, date, until, after}), params);
	if (isError) {
		console.log(`ERROR (useAccountActivity): ${error}`);
	}

	return {isError, isLoading, accountActivity, getAccountActivity: async() => refetch().then(r => r.data)};
}
