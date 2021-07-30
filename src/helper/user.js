import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useQuery} from 'react-query';

// import { signInWithEmailPassword, createUserWithEmailPassword, signOutFirebase findUserDb, addUserDb } from './firebase';
import {getStorageData, setStorageData} from './store';
import { currentISODate, toISODate } from '../utils';

import { useBrokerageAccountData } from './account';

export const findUserDb = async(email) => {
	console.log("findUserDb");
	console.log(email);
	return firestore().collection('Users')
	.where('email','==', email)
	.limit(1)
  	.get()
	.then(querySnapshot => {
		
		if (querySnapshot.size < 1) {
			return null;
		}

	    return querySnapshot.docs[0];
	})
	.catch(err => {
		console.log(err);
	})
}

export const addUserDb = async(email, userAccount) => {
	return firestore().collection('Users')
	.add({
		email,
	    ...userAccount
	})
}

// export const signInWithEmailPassword = async ({email, password}) => await auth().signInWithEmailAndPassword(email, password);

// export const createUserWithEmailPassword = async({email, password}) => await auth().createUserWithEmailAndPassword(email, password);

// export const signOutFirebase = async() => await auth().signOut();


const USER_CREDENTIAL_KEY = 'userCredentials';
const ALPACA_ACCOUNT_KEY = 'alpacaAccount';

const getCurrentUser = async() => await getStorageData(USER_CREDENTIAL_KEY);
const getAlpacaAccount = async() => await getStorageData(ALPACA_ACCOUNT_KEY);

const updateCurrentUser = async(currentUser) => await setStorageData(USER_CREDENTIAL_KEY, JSON.stringify(currentUser)); 
const updateAlpacaAccount = async(alpacaAccount) => await setStorageData(ALPACA_ACCOUNT_KEY, JSON.stringify({...alpacaAccount, lastUpdated: currentISODate()}));

const useCheckCredentials = () => {
	const [currentUser, setCurrentUser] = useState(null);

	React.useEffect(() => {
		console.log("useCheckCredentials");
		const checkUserCredential  = async () => {
			//Update logic to check for last signed in time 
			setCurrentUser(await getCurrentUser())
		}

		checkUserCredential()

	}, []);

	return currentUser;

}

const useGetUserAccount = (email, {enabled = false}) => {
	const [userAccount, setUserAccount] = useState(null);
	const [isError, setError] = useState(false);

	React.useEffect(() => {
		if (enabled) {
			console.log("useGetUserAccount");

			const getUser = async () => {
				const account = await findUserDb(email)
				if (account) {
					await updateAlpacaAccount(account);	
					setUserAccount(account);
				} else {
					setError(true);
				}
			};

			getUser();
		}
	}, [email]);

	return {userAccount, setUserAccount, isError};
}


//User Email is Loaded
//Based on Email, db Account is loaded
//Based on AccountId, Brokerage account is fetched


const useAuthHelper = () => {
	// const [userAccount, setUserAccount] = useState(null);
	const [currentUser, setCurrentUser] = useState(null);
	const [isErrorUser, setErrorUser] = useState(false);

	const email = currentUser?.user?.email;
	const {userAccount, setUserAccount, isError: isErrorAccount} = useGetUserAccount(email, {enabled: !!email});

	const accountId = userAccount?.id;
	console.log("AccountId ", accountId);

	const {data: brokerageAccount, isError: isErrorBrokerage} = useBrokerageAccountData({enabled: !!accountId})

	React.useEffect(() => {
		console.log("useCheckCredentials");
		const checkUserCredential  = async () => {
			//Update logic to check for last signed in time 
			const currentUser = await getCurrentUser();
			if (!!currentUser?.user?.email) {
				setCurrentUser(currentUser);
			} else {
				setErrorUser(true);
			}
		}

		checkUserCredential()

	}, []);


	const getUserFromDb = async (email) => {
		console.log("Getting User");
		const account = await findUserDb(email)
		console.log("Found Account");
		console.log(account);
		await updateAlpacaAccount(account);	
		console.log("Setting User Account");
		setUserAccount(account);
	};

	const signIn = async (email, password) => {
		const userCredential = await auth().signInWithEmailAndPassword(email, password);

		console.log("Signed In");
		console.log(userCredential);

	  	if (userCredential.user.emailVerified) {
	  		await updateCurrentUser(userCredential);
			setCurrentUser(userCredential)
	  		
	        await getUserFromDb(email);
	  	} else {
	  		// setLoading(false);
	  		throw new Error({code: "auth/email-not-verified"});
	  	}

	  	return;
	}

	const signUp = async ({email, password}) => {
		const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        userCredential.user.sendEmailVerification();
        auth().signOut();
        return true;
	}

	const signOut = async () => {
		await auth().signOut();
		await updateCurrentUser(null);
		await updateAlpacaAccount(null);
	}

	const requestResetPassword = async (email) => {
		return await auth().sendPasswordResetEmail(email, {handleCodeInApp: true});
	}

	const resetPassword = async (code, newPassword) => {
		return await auth().confirmPasswordReset(code, newPassword);
	} 
	
	return {currentUser, userAccount, brokerageAccount, 
			isErrorUser, isErrorAccount, isErrorBrokerage,  
			signIn, signUp, signOut, requestResetPassword, resetPassword };
}


const AuthContext = React.createContext(null);
	
export const AuthProvider = ({children}) => {
	
	const auth = useAuthHelper();

	return(
		<AuthContext.Provider value={auth}>
		{children}
		</AuthContext.Provider>
	)
};

export const useAuth = () => React.useContext(AuthContext);