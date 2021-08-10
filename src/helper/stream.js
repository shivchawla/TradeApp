import React, {useState, useEffect} from 'react';
import useWebSocket, {ReadyState} from 'react-use-websocket';
import { useDebounce } from 'react-use';
import { Mutex } from 'async-mutex';

import {wsUrl, apiKey, apiSecret} from '../config';

const mutex = new Mutex(); //Use to control access to subscription list

function useWS() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState
  } = useWebSocket(wsUrl, {
    shouldReconnect: (closeEvent) => true,
    share: true,
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {

    console.log("Websocket useEffect on Mount")
    console.log(lastJsonMessage)
    // console.log(wsUrl);
    // console.log(connectionStatus);

    if (connectionStatus != 'Open') {
      return;
    }
    
    if (lastJsonMessage && lastJsonMessage.length > 0) {
      const data = lastJsonMessage.slice(-1)[0];

      var T = data["T"];
      if (data && (T == "success" || T == "error")) {
        // console.log("Last Json Message");
        // console.log(lastJsonMessage);
    
        var msg = data["msg"];
        var code = data["code"];

        if (T == "success" && msg == "connected" && !isAuthenticated) {
          console.log("Sending Message");
          console.log(JSON.stringify({"action": "auth", "key": apiKey, "secret": apiSecret}));
          sendJsonMessage({"action": "auth", "key": apiKey, "secret": apiSecret});
        }

        if (T == "success" && msg == "authenticated" && !isAuthenticated) {
          console.log("Setting Authentication", true)
          setIsAuthenticated(true);   
        }

        if (T == "error" && code == 406 && !isAuthenticated) {
          console.log("Too many connections");
          // setIsAuthenticated(true);
          // console.log("Setting Connect: false");
          // setConnect(false);
        }

        if (T == "error" && [400, 401, 402, 404, 408, 409, 500].includes(code)) {
          console.log("Setting Authentication", false)
          setIsAuthenticated(false);
        }

        //On Already authenticated
        if (T == "error" && code == 403) {
          // console.log(lastJsonMessage);
          // console.log("Setting Authentication", true)
          setIsAuthenticated(true);
        }
        
      } 
    }

  }) //Added only on mount

  return {isAuthenticated, sendJsonMessage, lastJsonMessage};

}

function useWebsocketHelper() {

  const {isAuthenticated, sendJsonMessage, lastJsonMessage: msg} = useWS();
  const [subscriptionList, setList] = useState({});

  const subscribe = async(symbol) => {
    console.log("Subscribing: ", symbol);
    await mutex.runExclusive(async () => {
      const currentList =  subscriptionList;
      currentList[symbol] = Math.max((currentList?.symbol ?? 0) + 1, 1); 
      
      //Subscribe immediately -- Handle  rest 5 seconds later
      if (isAuthenticated) {
        sendJsonMessage({"action":"subscribe","trades":[symbol]});
      }

      setList(currentList);
    })
  }

  const unsubscribe = async (symbol) => {
    console.log("Unsubscribing: ", symbol);
    await mutex.runExclusive(async () => {
      const currentList =  subscriptionList;
      currentList[symbol] = Math.max((currentList?.symbol ?? 0) + 1, 1); 
      setList(currentList);
    })
  }

  const handleSubscription = () => {
    if (isAuthenticated) {
      // console.log("Subscribing")
      const subSymbols = Object.keys(subscriptionList).filter(key => subscriptionList[key] > 0);
      const unsubSymbols = Object.keys(subscriptionList).filter(key => subscriptionList[key] == 0);

      console.log(subSymbols);
      console.log(unsubSymbols);

      console.log(JSON.stringify({"action":"subscribe","trades":subSymbols}));
      console.log(JSON.stringify({"action":"unsubscribe","trades":unsubSymbols}));

      //Subscribe and unsubscribe the symbols based on change in subscription list
      if (subSymbols.length > 0) {
        sendJsonMessage({"action":"subscribe","trades":subSymbols});
      }
      
      if (unsubSymbols.length > 0) {
        sendJsonMessage({"action":"unsubscribe","trades":unsubSymbols});
      }
    }
  }

  React.useEffect(() => {
    handleSubscription();
  }, [isAuthenticated]);

  //Use debounce to handle subscription symbols
  const [, cancel] = useDebounce(() => {
    console.log("useDebounce")  
    handleSubscription()
  }, 5000, [subscriptionList]);
  
  return {msg, subscribe, unsubscribe};

}

const WebsocketContext = React.createContext(null);
  
export const WebsocketProvider = ({children}) => {
  
  const {msg, subscribe, unsubscribe} = useWebsocketHelper();

  return(
    <WebsocketContext.Provider value={{msg, subscribe, unsubscribe} || {} }>
    {children}
    </WebsocketContext.Provider>
  )
};

const useStreamData = () => React.useContext(WebsocketContext);

export const useStockRealtimeData = (symbol, {subscribeOnConnect = true} = {}) => {
  const {msg, subscribe, unsubscribe} = useStreamData();
  const [rtData, setRealtime] = useState(null);

  React.useEffect(() => {
    if (subscribeOnConnect) {
      subscribe(symbol);
    }
  }, []);

  React.useEffect(() => {
    const symbolMsg = (msg || []).filter(item => item.S == symbol).slice(-1)[0];
    if(msg) {
      setRealtime(symbolMsg);
    }
  }, [msg]);

  return {rtData, subscribe, unsubscribe}
}
