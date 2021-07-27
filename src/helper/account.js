import React, {useState, useEffect} from 'react';
import {useQuery, useMutation} from 'react-query';
import { getBrokerageAccount, getTradingAccount, createBrokerageAccount } from  './api'; 

//Write a order key validation function
const validateAccountParams = (params) => {
  return true;
}


export function useTradingAccountData() {
  console.log("useTradingAccountData");
  const {isError, error, data} = useQuery(['tradingAccount'], () => getTradingAccount());
  if (isError) {
    console.log(`ERROR (useTradingAccountData): ${error}`);
  }
  return [isError, data];  
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

  return [isError, mutate];
}


export function useBrokerageAccountData(accoundId) {
  console.log("useBrokerageAccountData");
  const {isError, error, data} = useQuery(['brokerageAccount'], () => getBrokerageAccount(accoundId));
  if (isError) {
    console.log(`ERROR (useBrokerageAccountData): ${error}`);
  }
  return [isError, data];  
}
