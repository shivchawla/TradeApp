import React, {useState, useEffect} from 'react';
import {useQuery} from 'react-query';

import { getStockPosition, getStockPortfolio, getTradingAccount } from  './api'; 

export function useStockPositionData(symbol) {
  console.log("useStockPositionData: ", symbol);
  const {isError, error, data} = useQuery(['stockPosition', symbol], () => getStockPosition(symbol));
  if (isError) {
    console.log(`ERROR (useStockPositionData): ${error}`);
  }
  return [isError, data];
}


export function useStockPortfolioData() {
  console.log("useStockPortfolioData");
  const {isError, error, data} = useQuery(['stockPortfolio'], () => getStockPortfolio());
  if (isError) {
    console.log(`ERROR (useStockPortfolioData): ${error}`);
  }
  return [isError, data];
}

export function useTradingAccountData() {
  console.log("useTradingAccountData");
  const {isError, error, data} = useQuery(['tradingAccount'], () => getTradingAccount());
  if (isError) {
    console.log(`ERROR (useTradingAccountData): ${error}`);
  }
  return [isError, data];  
}

