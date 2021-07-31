import React, {useEffect}from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import {YellowBox} from 'react-native';

import Router from './src/router';

const App = props => {

  const queryClient = new QueryClient()

  useEffect(() => {
    YellowBox.ignoreWarnings(['Setting a timer']);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
};

export default App;