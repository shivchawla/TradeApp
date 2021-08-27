// import useWebSocket from 'react-use-websocket';
// import {wsUrl, apiKey, apiSecret} from './';
import React, {useState} from 'react';
import {useQuery} from 'react-query';
import {useWS} from '../config/webSocket'
import { getSnapshot, getIntradayData, getHistoricalData, getStocks, getAssetData, getSeekingAlphaNews } from  './api'; 
import { currentISODate, toISODate, yearStartISODate, dayStartISODate, dayEndISODate, duration} from '../utils';
import { useClock } from './clock';

export function useStockEODData(symbol, params = {}) {
  const {isLoading, error, data: snapshot, refetch} = useQuery(['stockSnapshot', symbol], () => getSnapshot(symbol), params);
  return {isLoading, snapshot, getSnapshot:() => refetch().then(r => r.data)};
}

export function useStockHistoricalData(symbol, {start = yearStartISODate(), end = dayEndISODate(), timeframe = '1Day'} = {}, params = {}) {
  const query = {start, end, timeframe};
  const {isLoading, error, data: bars, refetch} = useQuery(['stockHistorical', {symbol, start, end, timeframe}], () => getHistoricalData(symbol, query), params)
  return {bars, getBars: () => refetch().then(r => r.data)};
}

export function useStockIntradayData(symbol, {start = dayStartISODate(), end = dayEndISODate(), timeframe = '30Min'} = {}, params = {}) {
  const query = {start, end, timeframe};
  const {isLoading, error, data: intradayBars, refetech} = useQuery(['stockIntraday', {symbol, start, end, timeframe}], () => getIntradayData(symbol, query), params);
  return {intradayBars, getIntradayBars:() => refetech().then(r => r.data)};
}


export function useStockList(params={}) {
  const {clock, getClock} = useClock();
  console.log("useStockList");
  console.log(clock);
  const cacheTime = !!clock?.next_open ? duration(clock.next_open) : null;
  const staleTime = cacheTime;
  const {isError, error, data: stockList, refetch} = useQuery(['stockList', clock?.next_open ?? ''], () => clock ? getStocks() : [], {...params, ...cacheTime && {cacheTime}, ...staleTime && {staleTime}});

  return {isError, stockList, getStockList: () => refetch().then(r => r.data)}; 
}

export function useAssetData(symbol, params = {}) {
  // const clock = useClock();

  // React.useEffect(() => {
  //   console.log("Clock Variable changed");
  //   console.log(clock);
  // }, [clock])

  // const clock = getClock();
  // console.log("useAssetData");
  // console.log("Next Open: ", clock?.next_open);

  // const cacheTime = next_open ? duration(next_open) : null;
  // const staleTime = cacheTime;

  // console.log("CacheTime ", cacheTime);
  // console.log("StaleTime ", staleTime);

  const {isLoading, error, data: asset, refetch} = useQuery(['assetData', symbol], () => getAssetData(symbol), params); 
  // {...cacheTime && {cacheTime}, ...staleTime && {staleTime}});
  
  return {asset, getAsset: () => refetch().then(r => r.data)};
}

export function useStockNews(symbol, params={}) {
  const {isLoading, isError, error, data: news, refetch} = useQuery(['stockNews', symbol], () => getSeekingAlphaNews(symbol), params); 
  if(isError) {
    console.log("[ERROR] UseStockNews");
    console.log(error);
  }
  
  return {news, getNews: () => refetch().then(r => r.data)};
}
