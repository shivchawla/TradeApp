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
}

