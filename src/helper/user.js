import React, {useState} from 'react';
import {useQuery} from 'react-query';

import { signIn, findUserDb } from '../helper'

import { currentISODate, toISODate } from '../utils';

export const USER_CREDENTIAL_KEY = 'userCredentials';
export const ALPACA_ACCOUNT_KEY = 'alpacaAccount';

export const getCurrentUser = async() => await getStorageData(USER_CREDENTIAL_KEY);
export const getAlpacaAccount = async() => await getStorageData(ALPACA_ACCOUNT_KEY);

export const updateCurrentUser = async(currentUser) => await setStorageData(USER_CREDENTIAL_KEY, JSON.stringify(currentUser)); 
export const updateAlpacaAccount = async(alpacaAccount) => await setStorageData(ALPACA_ACCOUNT_KEY, JSON.stringify({...alpacaAccount, lastUpdated: currentISODate()}));


export const useCheckCredentials = () => {
	const [currentUser, setCurrentUser] = useState(null);

	React.useEffect(() => {
		const checkUserCredential  = async () => {
			//Update logic to check for last signed in time 
			setCurrentUser(await getCurrentUser())
		}

		checkUserCredential()

	}, []);

	return currentUser;

}
