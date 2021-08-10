import React, {useEffect}from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import {LogBox} from 'react-native';

import Router from './src/router';
import {removeStorageData} from './src/helper';

LogBox.ignoreAllLogs(true);

const App = props => {

  const queryClient = new QueryClient()

  useEffect(() => {
    LogBox.ignoreLogs(['Setting a timer ']);
    console.log("Removing the subscription List - on Mount");
    removeStorageData('subscriptionList');

    // return () => {
    //   console.log("Removing the subscription List - on Unmount");
    //   removeStorageData('subscriptionList');
    // }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
};

export default App;