import React, {useEffect}from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import {LogBox} from 'react-native';

import Router from './src/router';

LogBox.ignoreAllLogs(true);

const App = props => {

  const queryClient = new QueryClient()

  useEffect(() => {
    LogBox.ignoreLogs(['Setting a timer ']);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
};

export default App;