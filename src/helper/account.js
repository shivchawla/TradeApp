import React, {useState, useEffect} from 'react';
import {useQuery, useMutation} from 'react-query';
import { getBrokerageAccount, getTradingAccount, createBrokerageAccount } from  './api'; 

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
  return {isError, tradingAccount, getTradingAccount:() => refetch().then(r => r.data)};  
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

  return {isError, mutate};
}


export function useBrokerageAccountData(params = {}) {
  console.log("useBrokerageAccountData");
  const {isError, error, data, isLoading} = useQuery(['brokerageAccount'], () => getBrokerageAccount(), params);
  if (isError) {
    console.log(`ERROR (useBrokerageAccountData): ${error}`);
  }

  return {isError, data};  
}
