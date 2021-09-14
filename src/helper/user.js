import React, {useState} from 'react';
import { AppState } from 'react-native';

import auth from '@react-native-firebase/auth';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {useQuery} from 'react-query';
import queryString from 'query-string';

import {getCurrentUser, updateCurrentUser, 
	getAlpacaAccount, updateAlpacaAccount} from './store';

import { currentISODate, toISODate } from '../utils';

import {findUserInDb, addUserInDb, updateUserInDb,
	signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, 
	signInWithPhoneNumber, sendPasswordResetEmail, confirmPasswordReset, 
	applyActionCode, reloadUser, currentUser, updatePassword,
} from './firebase';

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


//User Email is Loaded
//Based on Email, db Account is loaded
//Based on AccountId, Brokerage account is fetched

const useAuthHelper = () => {

	const [currentUser, setCurrentUser] = useState(null);
	const [isLoadingAuth, setLoadingAuth] = useState(true);
	
	const [isErrorUser, setErrorUser] = useState(false);
	const [userAccount, setUserAccount] = useState(null);
	const [confirmPhone, setConfirmPhone] = useState(null);

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
		    		await applyActionCode(oobCode)
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
					await realoadUser();
					let updatedUser = await currentUser();
					console.log(updatedUser);
					setCurrentUser(updatedUser);

				} catch(err) {
					console.log(err);
					setLoadingAuth(false);
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
				// console.log("Current User Change Effect");
				// console.log(currentUser);
				await updateCurrentUser(currentUser);
				if (currentUser?.emailVerified) {
					console.log(currentUser?.email);
					const account = await getUserFromDb(currentUser?.email);
					// console.log("Found Account");
					// console.log(account);
					// console.log("Setting User Account");

					if (account) {
						setUserAccount(account);
					} else {
						// console.log("Setting Loading false");
						setLoadingAuth(false);
					}
				} else {
					setLoadingAuth(false);
				}
			}
		})()
	}, [currentUser])

	React.useEffect(() => {
		(async() => {
			if (userAccount) {
				await updateAlpacaAccount(userAccount);
				setLoadingAuth(false);
			}
			else if (!userAccount && currentUser) {
				setLoadingAuth(false);					
			}
		})()

	}, [userAccount])

	const getUserFromDb = async (email) => {
		// console.log("Getting User");
		return await findUserInDb(email)
	};

	const signInEmail = async (email, password) => {
		setLoadingAuth(true);

		const userCredential = await signInWithEmailAndPassword(email, password);
		// console.log("Signed In");
		// console.log(userCredential);
		setCurrentUser(userCredential?.user);
	}

	const signInPhone = async (phoneNumber) => {
		setLoadingAuth(true);
		setConfirmPhone(await signInWithPhoneNumber(phoneNumber));
	}

	const submitPhoneCode = async (code) => {
		const userCredential = confirmPhone.confirm(code);
		setCurrentUser(userCredential?.user)
	}

	const signUpEmail = async ({email, password}, {sendEmail=true, linkTo= null}) => {
		setLoadingAuth(true);
		
		let userCredential = await createUserWithEmailAndPassword(email, password);
    	
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
		setLoadingAuth(true);
		
    	return await signInWithPhoneNumber(phoneNumber);
	}

	const signOut = async () => {
		await firebaseSignOut();
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
		await updatePassword(newPassword);
	}

	const requestResetPassword = async (email) => {
		return await sendPasswordResetEmail(email, {handleCodeInApp: true});
	}

	const resetPassword = async (code, newPassword) => {
		return await confirmPasswordReset(code, newPassword);
	} 

	const updateUserAccount = async(userAccount) => {
		const account = await getAlpacaAccount();
		if (account) {
			await updateUserInDb(currentUser?.email, userAccount);	
		} else {
			await addUserInDb(currentUser?.email, userAccount);	
		}

		setUserAccount(userAccount);
	}

	//userAccount is not used anywhere (except locally) - remove it from output
	return {isLoadingAuth, currentUser, userAccount,  
		signInEmail, signUpEmail, signUpPhone, 
		signOut, requestResetPassword, resetPassword, 
		changePassword, updateUserAccount 
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