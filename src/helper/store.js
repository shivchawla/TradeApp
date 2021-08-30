import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStorageData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value)
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