import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStorageData = async (key, value, callback) => {
	try {
		await AsyncStorage.setItem(key, value, () => callback ? callback() : '');
	} catch (e) {
		console.error(e);
	}
}

export const getStorageData = async (key) => {
	try {
		
		const value = await AsyncStorage.getItem(key)
		if(value !== null) {
	  		return JSON.parse(value);
		}

		return null;

	} catch(e) {
		console.error(e);
	}

	return null;
}

export const removeStorageData = async (key) => {
	try {
		await AsyncStorage.removeItem(key)
	} catch(e) {
		console.error(e);
	}
}


export const useSymbolActivity = (symbol) => {
	const [activity, setActivity] = useState([]);

  	const fetchSymbolActivity = async(symbol) => {
		const key = "Activity-"+symbol;
		return await getStorageData(key);
  	}  

  	React.useEffect(() => {
		const updateActivities = async() => {
		const current = await fetchSymbolActivity(symbol)
	  	if (current) {
			setActivity(current);
	  	}
	}
	
	updateActivities(symbol);
	
	}, []);

	const addActivity = async(symbol, activity) => {
		console.log("Adding Activity for ", symbol);
		const key = "Activity-"+symbol;
		const currentActivities = await fetchSymbolActivity(symbol)
		const updatedActivities = (currentActivities || []).concat(activity);
		await setStorageData(key, JSON.stringify(updatedActivities));

		console.log("Setting Activity")  
		console.log(updatedActivities);
		setActivity(updatedActivities);
	}

  	return {activity, addActivity};
}

export const getWatchlistOrder = async() => {
	return await getStorageData("watchlistOrder");
}

export const setWatchlistOrder = async(watchlists) => {
	return await setStorageData("watchlistOrder", JSON.stringify(watchlists));
}

export const setCurrentTheme = async(theme) => {
	return await setStorageData("theme", JSON.stringify(theme));
}

export const getCurrentTheme = async() => {
	return await getStorageData("theme");
}

export const setLanguage = async(language) => {
	return await setStorageData("language", JSON.stringify(language));
}

export const getLanguage = async() => {
	return await getStorageData("language");
}

const USER_CREDENTIAL_KEY = 'userCredentials';
const ALPACA_ACCOUNT_KEY = 'alpacaAccount';
const AUTH_META_KEY = 'authMeta';

export const getCurrentUser = async() => await getStorageData(USER_CREDENTIAL_KEY);
export const getAlpacaAccount = async() => await getStorageData(ALPACA_ACCOUNT_KEY);

export const updateCurrentUser = async(currentUser) => await setStorageData(USER_CREDENTIAL_KEY, JSON.stringify(currentUser)); 
export const updateAlpacaAccount = async(alpacaAccount) => await setStorageData(ALPACA_ACCOUNT_KEY, JSON.stringify(alpacaAccount));


export const updateAuthMetaData = async(data) => await setStorageData(AUTH_META_KEY, JSON.stringify(data));
export const getAuthMetaData = async() => await getStorageData(AUTH_META_KEY);
