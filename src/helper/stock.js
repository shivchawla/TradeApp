// import useWebSocket from 'react-use-websocket';
// import {wsUrl, apiKey, apiSecret} from './';
import React, {useState} from 'react';
import {useQuery} from 'react-query';
import {useWS} from '../config/webSocket'
import { getSnapshot, getIntradayData, getHistoricalData, getStocks, getAssetData } from  './api'; 
import { currentISODate, toISODate, yearStartISODate, dayStartISODate, dayEndISODate, duration} from '../utils';
import { useClock } from './clock';

export function useStockRealtimeData(symbol) {

  const [isAuthenticated, sendJsonMessage, lastJsonMessage] = useWS();
  const [stockData, setStockData] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const {data:dailyData} = useQuery(['stockSnapshot', symbol], () => getSnapshot(symbol))

  React.useEffect(() => {
    // console.log("useTickerData - use Effect");
    // console.log("IsAuthenticated ", isAuthenticated);
    // console.log("IsSubscribed ", isSubscribed);
    // console.log(lastJsonMessage);

    if (isAuthenticated && !isSubscribed) {
      const msg = (lastJsonMessage || []).filter(item => item.T == 'subscription');
      if (msg && msg.length > 0) {
        //Use every to shorcircuit the loop, once subscription is found
        msg.every(item => {
          const tradeList = item.trades;
          if (tradeList.includes(symbol)) {
            console.log("Setting Subscription to true");
            console.log(lastJsonMessage);
            setIsSubscribed(true);
            return false;
          }
          return true;
        })
      }

      if(!isSubscribed) {
        console.log("Sending Subscription for ", symbol);
        console.log(JSON.stringify({"action":"subscribe","trades":[symbol]}));
        sendJsonMessage({"action":"subscribe","trades":[symbol]});
      }
    }

    if (!isAuthenticated && isSubscribed) {
      setIsSubscribed(false);
    }

    if (isAuthenticated && isSubscribed) {
      //Filter LastJsonMessage for Ticker
      const msg = (lastJsonMessage || []).filter(item => item.S == symbol).slice(-1)[0];
      if(msg) {
        setStockData(msg);
      }
    } 

  }); 

  //Use Effect only for cleanup at unmount
  React.useEffect(() => {
    //Cleanup
    return () => {
      if (isAuthenticated && isSubscribed) {
        console.log("Sending unsubscription Message");
        console.log(JSON.stringify({"action":"unsubscribe","trades":[symbol]}));
        console.log("Setting isSubscribed: ", false);
        sendJsonMessage({"action":"unsubscribe","trades":[symbol]});
        setIsSubscribed(false);
      }      
    }

  }, []);

  return {...stockData, ...dailyData};
}

export function useStockEODData(symbol, params = {}) {
  const {isLoading, error, data, refetch} = useQuery(['stockSnapshot', symbol], () => getSnapshot(symbol), params);
  return {isLoading, error, data, getData:() => refetch().then(r => r.data)};
}

export function useStockHistoricalData(symbol, {start = yearStartISODate(), end = dayEndISODate(), timeframe = '1Day'} = {}) {
  console.log("useStockHistoricalData");
  console.log(start);
  console.log(end);
  console.log(timeframe);

  const query = {start, end, timeframe};
  const {isLoading, error, data} = useQuery(['stockHistorical', {symbol, start, end, timeframe}], () => getHistoricalData(symbol, query))
  return data;
}

export function useStockIntradayData(symbol, {start = dayStartISODate(), end = dayEndISODate(), timeframe = '30Min'} = {}) {
  const query = {start, end, timeframe};
  const {isLoading, error, data} = useQuery(['stockIntraday', {symbol, start, end, timeframe}], () => getIntradayData(symbol, query));
  return data;
}


export function useStockList() {
  const {next_open} = useClock();
  const cacheTime = next_open ? duration(next_open) : null;
  const staleTime = cacheTime;
  const {isError, error, data} = useQuery(['stockList', clock ? clock.next_open : ''], () => clock ? getStocks() : [], {...cacheTime && {cacheTime}, ...staleTime && {staleTime}});
  
  return data; 

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
