// import useWebSocket from 'react-use-websocket';
// import {wsUrl, apiKey, apiSecret} from './';
import React, {useState, useEffect} from 'react';
import {useQuery} from 'react-query';
import {useWS} from '../config/webSocket'
import { getSnapshot, getIntradayData, getHistoricalData } from  './api'; 
import { currentISODate, toISODate, yearStartISODate, dayStartISODate, dayEndISODate} from '../utils';

export function useStockRealtimeData(symbol) {

  const [isAuthenticated, sendJsonMessage, lastJsonMessage] = useWS();
  const [stockData, setStockData] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const {data:dailyData} = useQuery(['stockSnapshot', symbol], () => getSnapshot(symbol))

  useEffect(() => {
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
  useEffect(() => {
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

export function useStockEODData(symbol) {
  const {isLoading, error, data} = useQuery(['stockSnapshot', symbol], () => getSnapshot(symbol))
  return [isLoading, error, data];
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
  const {isLoading, error, data} = useQuery(['stockIntraday', {symbol, start, end, timeframe}], () => getIntradayData(symbol, query))
  return data;
}

