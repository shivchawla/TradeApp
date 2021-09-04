import React, {useState} from 'react';
import {removeStorageData} from './store';


import { setupTradingDays } from './clock';
import { useAuth } from './';

//When the app starts;
//Check if next trading day exists and is after today
//If above condition is not met, fetch calendar and save current(last) & next trading day
export const useAppStartup = () => {

    const [isLoading, setLoading] = useState(true);    
    const {currentUser, userAccount, brokerageAccount, isErrorUser, isErrorAccount, isErrorBrokerage, signIn} = useAuth(); 
  
    React.useEffect(() => {

      const setupApp = async() => {

        console.log("Setting Up App");
        await signIn('shiv.chawla@yandex.com', 'Password');
     
        await setupTradingDays();

        setLoading(false);

      }

      console.log("Removing the subscription List - on Mount");
      removeStorageData('subscriptionList');

      setupApp();

    }, []);

    //Improve this logic when you get time
    const isLoadingAuth = !isErrorUser && !isErrorAccount && !isErrorBrokerage && !!!brokerageAccount?.data;

    return isLoading || isLoadingAuth;
}