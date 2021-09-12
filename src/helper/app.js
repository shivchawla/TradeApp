import React, {useState} from 'react';
import {removeStorageData} from './store';

import { setupTradingDays } from './clock';

//When the app starts;
//Check if next trading day exists and is after today
//If above condition is not met, fetch calendar and save current(last) & next trading day
export const useAppStartup = () => {

		const [isLoading, setLoading] = useState(true);    
		
		React.useEffect(() => {

			(async() => {

				console.log("Setting Up App");
				
				console.log("Removing the subscription List - on Mount");
				removeStorageData('subscriptionList');

				// await signIn('shiv.chawla@yandex.com', 'Password');
		 
				await setupTradingDays();

				setLoading(false);

			})()

		}, []);

		return {isLoading}
}
