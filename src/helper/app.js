import React, {useState} from 'react';
import messaging from '@react-native-firebase/messaging';

import {removeStorageData, addNotification} from './store';

import { setupTradingDays } from './clock';

//When the app starts;
//Check if next trading day exists and is after today
//If above condition is not met, fetch calendar and save current(last) & next trading day
export const useAppStartup = () => {

	const [isLoading, setLoading] = useState(true);    
	
	React.useEffect(() => {

		const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  			// Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
	    	console.log('A new FCM message arrived!', remoteMessage);
	    	addNotification(remoteMessage)
	    });


		//To setup a background handler, 
		//call the setBackgroundMessageHandler outside of your application logic as early as possible:
	    //LOGIC now moved to index.js

	 	// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
		//   	console.log('Message handled in the background!', remoteMessage);
		//   	addNotification(remoteMessage)
		// });

		(async() => {

			// console.log("Setting Up App");
			
			// console.log("Removing the subscription List - on Mount");
			removeStorageData('subscriptionList');

			await setupTradingDays();

			setLoading(false);

		})()

	    return unsubscribe;

	}, []);

	return {isLoading}
}
