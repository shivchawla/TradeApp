import React, {useState} from 'react';
import { AppState } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {useQuery} from 'react-query';
import queryString from 'query-string';

export const EmailAuthProvider = auth.EmailAuthProvider;
export const PhoneAuthProvider = auth.PhoneAuthProvider;

import {getCurrentUser, updateCurrentUser, 
	getAlpacaAccount, updateAlpacaAccount} from './store';

import { currentISODate, toISODate } from '../utils';

import { useBrokerageAccountData } from './account';

const USER_DB = 'Users';

const findUserDb = async(email) => {
	console.log("findUserDb");
	console.log(email);
	try{
		return firestore().collection(USER_DB)
		.where('email','==', email)
		.limit(1)
	  	.get()
		.then(querySnapshot => {
			
			if (querySnapshot.size < 1) {
				return null;
			}

		    return querySnapshot.docs[0].data();
		})
	} catch(err) {
		console.log("There is an Error");
		console.log(err);
		return null;
	}
}

const addUserDb = async(email, userAccount) => {
	return firestore().collection(USER_DB)
	.add({
		email,
	    ...userAccount
	})
}

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

//Removed it's use
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

	const [currentUser, setCurrentUser] = useState(null);
	const [isErrorUser, setErrorUser] = useState(false);

	const [userAccount, setUserAccount] = useState(null);

	const [confirmPhone, setConfirmPhone] = useState(null);

	// const email = currentUser?.email;
	// const {userAccount, setUserAccount, isError: isErrorAccount} = useGetUserAccount(email, {enabled: !!email});

	const accountId = userAccount?.id;
	console.log("AccountId ", accountId);

	const {data: brokerageAccount, isError: isErrorBrokerage} = useBrokerageAccountData({enabled: !!accountId})

	React.useEffect(() => {

		const handleDynamicLink = async(link) => {
			// Handle dynamic link inside your own application
		    console.log("Received Dynamic Link: ", link)
		    if (link?.url) {
		    	const parsed = queryString.parse(link?.url);
		    	const mode = parsed?.mode;
		    	if(mode == "verifyEmail") {
		    		const oobCode = parsed?.oobCode;
		    		//Apply oob code
		    		await auth().applyActionCode(oobCode)
		    		await checkUserCredential();
		    	}
		    }	
		};

		console.log("useCheckCredentials");
	    const unsubscribeDL = dynamicLinks().onLink(handleDynamicLink);

		const checkUserCredential  = async () => {

			//Update logic to check for last signed in time 
			var currentUser = await getCurrentUser();
			if (!!currentUser?.emailVerified) {
				setCurrentUser(currentUser);
			} else {
				try{
					//If Email is not verified, refetch from aut
					console.log("Check the user from auth - After reload");

					await auth().currentUser.reload();

					let updatedUser = await auth().currentUser;
					console.log(updatedUser);

					if (!currentUser) {
						setErrorUser(true);
					} else {
						setCurrentUser(updatedUser);
					}
				} catch(err) {
					console.log(err);
				}
			}
		}

		checkUserCredential()

 		return () => {
	      unsubscribeDL()
	    };
	}, [])

	React.useEffect(() => {
		(async() => {
			if (currentUser) {
				console.log("Current User Change Effect");
				console.log(currentUser);
				await updateCurrentUser(currentUser);
				if (currentUser?.emailVerified) {
					console.log(currentUser?.email);
					await getUserFromDb(currentUser?.email);
				}
			}
		})()
	}, [currentUser])


	React.useEffect(() => {
		(async() => {
			if (userAccount) {
				await updateAlpacaAccount(account);	
			}
		})()	
	}, [userAccount])


	const getUserFromDb = async (email) => {
		console.log("Getting User");
		const account = await findUserDb(email)
		console.log("Found Account");
		console.log(account);
		console.log("Setting User Account");
		setUserAccount(account);
	};

	const signInEmail = async (email, password) => {
		const userCredential = await auth().signInWithEmailAndPassword(email, password);

		console.log("Signed In");
		console.log(userCredential);

	  	if (userCredential.user?.emailVerified) {
			setCurrentUser(userCredential?.user)
	  	} else {
	  		// setLoading(false);
	  		throw new Error({code: "auth/email-not-verified"});
	  	}

	  	return;
	}

	const signInPhone = async (phoneNumber) => {
		setConfirmPhone(await auth().signInWithPhoneNumber(phoneNumber));
	}

	const submitPhoneCode = async (code) => {
		const userCredential = confirmPhone.confirm(code);

		if (userCredential?.user) {
			setCurrentUser(userCredential?.user)
	  	} else {
	  		throw new Error({code: "auth/email-not-verified"});
	  	}

	  	return; 
	}

	const signUpEmail = async ({email, password}, {sendEmail=true, linkTo= null}) => {
		let userCredential = await auth().createUserWithEmailAndPassword(email, password);
    	
    	if(sendEmail) {
    		await userCredential.user.sendEmailVerification({
    			url:'https://fincript-dev.firebaseapp.com',	
    			handleCodeInApp: true,
    			android: {
    				packageName: 'com.fincript.rndev'
    			}
    		});
		}

		if(linkTo) {
			//Get finally linked userCredentials
			userCredential = await userCredential.user.linkWithCredential(linkTo);
		}

		setCurrentUser(userCredential?.user);

		//Don't signout to allow sign-In on clicking the link
        // await auth().signOut();

        return userCredential;
	}

	const signUpPhone = async (phoneNumber) => {
    	return await auth().signInWithPhoneNumber(phoneNumber);
	}

	const signOut = async () => {
		await auth().signOut();
		await updateCurrentUser(null);
		await updateAlpacaAccount(null);
	}

	const changePassword = async({password, newPassword}) => {
		const currentUser = await getCurrentUser();
		const email = currenUser?.email;
		if (!email) {
			throw new Error("No user found");
		}

		//Proceed to signIn -- Before changing password, recent signIn is required
		await signIn(email, password);

		//Now that signIn is complete, update Password
		await auth().currentUser.updatePassword(newPassword);
	}

	const requestResetPassword = async (email) => {
		return await auth().sendPasswordResetEmail(email, {handleCodeInApp: true});
	}

	const resetPassword = async (code, newPassword) => {
		return await auth().confirmPasswordReset(code, newPassword);
	} 

	return {currentUser, userAccount, brokerageAccount, 
		isErrorUser, isErrorBrokerage, 
		signInEmail, signUpEmail, signUpPhone, 
		signOut, requestResetPassword, resetPassword, 
		changePassword 
	};
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