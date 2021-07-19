import React, {useEffect}from 'react';
import Router from './src/router';
// import { AppState} from 'react-native';
// import Keyguard from 'react-native-keyguard';

import { QueryClient, QueryClientProvider } from 'react-query'

// import './config-i18n';

const App = props => {

  const queryClient = new QueryClient()

  useEffect(() => {
    console.log("In Use Effect - App")
  })

  return (
      <Router />
  );
};

export default App;