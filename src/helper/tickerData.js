// import useWebSocket from 'react-use-websocket';
// import {wsUrl, apiKey, apiSecret} from './';
import React, {useState, useEffect} from 'react';
import {useQuery} from 'react-query';
import {useWS} from '../config/webSocket'
import {getSnapshot} from  './api'; 

export function useTickerRealtimeData(ticker) {

  const [isAuthenticated, sendJsonMessage, lastJsonMessage] = useWS();
  const [tickerData, setTickerData] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    console.log("useTickerData - use Effect");
    console.log("IsAuthenticated ", isAuthenticated);
    console.log("IsSubscribed ", isSubscribed);
    console.log(lastJsonMessage);

    if (isAuthenticated && !isSubscribed) {
      const msg = lastJsonMessage.filter(item => item.T == 'subscription');
      if (msg && msg.length > 0) {
        //Use every to shorcircuit the loop, once subscription is found
        msg.every(item => {
          const tradeList = item.trades;
          if (tradeList.includes(ticker)) {
            setIsSubscribed(true);
            return false
          }
          return true;
        })
      }

      if(!isSubscribed) {
        console.log("Sending Subscription for ", ticker);
        sendJsonMessage({"action":"subscribe","trades":[ticker]});
      }
    }

    if (isAuthenticated && isSubscribed) {
      //Filter LastJsonMessage for Ticker
      const msg = lastJsonMessage.filter(item => item.S == ticker).slice(-1)[0];
      if(msg) {
        setTickerData(msg);
      }
    } 

    // if (!isAuthenticated) {
    //   authenticate();
    // }

    //Cleanup
    return () => {
      if (isAuthenticated && isSubscribed) {
        sendJsonMessage({"action":"unsubscribe","trades":[ticker]});
      }      
    }
  }) 

  return tickerData;

}


export function useTickerEODData(ticker) {
  const {isLoading, error, data} = useQuery(['stockSnapshot', ticker], () => getSnapshot(ticker))
  return [isLoading, error, data];
}