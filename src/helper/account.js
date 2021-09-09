import React, {useState, useEffect} from 'react';
import {useQuery, useMutation} from 'react-query';
import { getBrokerageAccount, getTradingAccount, createBrokerageAccount, getAccountActivity } from  './api'; 


//Write a order key validation function
const validateAccountParams = (params) => {
	return true;
}

export function useTradingAccountData(params={}) {
	console.log("useTradingAccountData");
	const {isError, error, data: tradingAccount, refetch} = useQuery(['tradingAccount'], () => getTradingAccount(), params);
	if (isError) {
		console.log(`ERROR (useTradingAccountData): ${error}`);
	}

	return {isError, tradingAccount, getTradingAccount: () => refetch().then(r => r.data)};  
}


export function useCreateBrokerageAccount() {
	console.log("useCreateBrokerageAccount");
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
	console.log("useBrokerageAccountData");
	const {isError, error, data: brokerageAccount, refetch} = useQuery(['brokerageAccount'], () => getBrokerageAccount(), params);
	if (isError) {
		console.log(`ERROR (useBrokerageAccountData): ${error}`);
	}

	return {isError, brokerageAccount, getBrokerageAccount: () => refetch().then(r => r.data)};  
}


export function useAccountActivity({activity_type = null, date = '', until = '', after = '', limit = 10} = {}, params = {}) {
	console.log("useAccountActivity");
	const queryKey = ['accountActivity', activity_type, date, until, after].filter(item => item && item != '' );
	console.log(queryKey);
	
	const {isError, error, data: accountActivity, refetch} = useQuery(queryKey, () => getAccountActivity({activity_type, date, until, after}), params);
	if (isError) {
		console.log(`ERROR (useAccountActivity): ${error}`);
	}

	return {isError, accountActivity, getAccountActivity: () => refetch().then(r => r.data)};
}
