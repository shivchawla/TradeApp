import React, {useState, useEffect} from 'react';
import useWebSocket from 'react-use-websocket';

import {wsUrl, apiKey, apiSecret} from './';

console.log(wsUrl);

export function useWS() {

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

    if (connectionStatus != 'Open') {
      return;
    }
   
    if (lastJsonMessage && lastJsonMessage.length > 0) {
      const data = lastJsonMessage.slice(-1)[0];

      var T = data["T"];
      if (data && (T == "success" || T == "error")) {
        console.log("Last Json Message");
        console.log(lastJsonMessage);
    
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

        if (T == "error" && code == 406 && !isAuthenticated ) {
          console.log("Already authenticated");
          setIsAuthenticated(true);
        }

        if (T == "error" && [400, 401, 402, 404, 408, 409, 500].includes(code)) {
          console.log("Setting Authentication", false)
          setIsAuthenticated(false);
        }
        
      } 
    }
    
  })

  return [isAuthenticated, sendJsonMessage, lastJsonMessage];

}