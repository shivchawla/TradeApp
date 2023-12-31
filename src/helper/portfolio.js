import React, {useState, useEffect} from 'react';
import {useQuery} from 'react-query';

import { getStockPosition, getStockPortfolio, getPortfolioHistory } from  './api'; 

export function useStockPositionData(symbol, params={}) {
  console.log("useStockPositionData: ", symbol);
  const {isError, error, data: position, refetch} = useQuery(['stockPosition', symbol], () => getStockPosition(symbol), params);
  
  if (isError) {
    console.log(`ERROR (useStockPositionData): ${error}`);
  }
  
  return {isError, position, getPosition: () => refetch().then(r => r.data)};
}

export function useStockPortfolioData(params={}) {
  console.log("useStockPortfolioData");
  const {isError, error, data: portfolio, refetch} = useQuery(['stockPortfolio'], () => getStockPortfolio(), params);
  if (isError) {
    console.log(`ERROR (useStockPortfolioData): ${error}`);
  }

  return {isError, portfolio, getPortfolio: () => refetch().then(r => r.data)};
}


export function usePortfolioHistory({period = '1M', timeframe = '1D'} = {}, params={}) {
  console.log("usePortfolioHistory");
  const {isError, error, data: portfolioHistory, refetch} = useQuery(['portfolioHistory', {period, timeframe}], () => getPortfolioHistory({period, timeframe}), params);
  if (isError) {
    console.log(`ERROR (usePortfolioHistory): ${error}`);
  }
  return {isError, portfolioHistory, getPortfolioHistory: () => refetch().then(r => r.data)};  
}