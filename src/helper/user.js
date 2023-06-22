import React, {useState} from 'react';
import { AppState } from 'react-native';

import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {useQuery} from 'react-query';
import queryString from 'query-string';

import {getCurrentUser, updateCurrentUser, 
	getAlpacaAccount, updateAlpacaAccount, updateAuthMetaData, getAuthMetaData} from './store';

import { currentISODate, toISODate, duration } from '../utils';

import {findUserInDb, addUserInDb, updateUserInDb,
	signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, 
	signInWithPhoneNumber, sendPasswordResetEmail, confirmPasswordReset, 
	applyActionCode, reloadUser, getUser, updatePassword, signInWithEmailLink,
	sendSignInLinkToEmail, PhoneAuthProvider, EmailAuthProvider, signInWithCredential
} from './firebase';


//User Email is Loaded
//Based on Email, db Account is loaded
//Based on AccountId, Brokerage account is fetched

const useAuthHelper = () => {

	const [currentUser, setCurrentUser] = useState(null);
	const [isLoadingAuth, setLoadingAuth] = useState(true);
	
	const [isErrorUser, setErrorUser] = useState(false);
	const [userAccount, setUserAccount] = useState(null);
	const [confirmPhone, setConfirmPhone] = useState(null);
	const [linkError, setLinkError] = useState(null);

	React.useEffect(() => {

		const handleDynamicLink = async(link) => {
			// Handle dynamic link inside your own application
		    // console.log("Received Dynamic Link: ", link)
		    if (link?.url) {
		    	const parsed = queryString.parse(link?.url);
		    	const mode = parsed?.mode;
		    	const oobCode = parsed?.oobCode;
		    	// console.log("Code: ", oobCode);

		    	if(mode == "verifyEmail") {
		    		//Apply oob code
		    		try{
		    			await applyActionCode(oobCode);
		    			setLinkError(null)
		    			setLoadingAuth(true);
	    			} catch(err) {
	    				//auth/invalid-action-code]
	    				// this link error is then caught in AuthInfo to show error	
	    				setLinkError('error-verification');
	    			}

		    		await checkUserCredential();
		    	} else if (mode == "signIn") {
		    		//This means forgot password has been clicked
		    		//Apply oob code
		    		// await applyActionCode(oobCode);
		    		await signInWithEmailLink("shivchawla2001@gmail.com", link?.url)
		    		await updateAuthMetaData({emailAuth: true, phoneAuth: false});
		    		await checkUserCredential();
		    	}
		    }	
		};

	    const unsubscribeDL = dynamicLinks().onLink(handleDynamicLink);
	    
		const checkUserCredential  = async () => {

			try{
				const x = await getUser();
				if (!x) {
					setLoadingAuth(false);
					setCurrentUser(null);
					return;
				}
			} catch (err) {
				setLoadingAuth(false);
				setCurrentUser(null);
				return;
			} 

			//Update logic to check for last signed in time 
			var storedUser = await getCurrentUser();
			if (!!storedUser?.emailVerified) {
				onNewCurrentUser(storedUser);
			} else {
				try{
					//If Email is not verified, refetch from aut
					// console.log("Check the user from auth - After reload");
					await reloadUser();
					let updatedUser = await getUser();

					// console.log("Updated User");
					// console.log(updatedUser);

					onNewCurrentUser({...updatedUser._user});

				} catch(err) {
					// console.log(err);
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
				
				//Check Auth Meta as well to make user Account is fetched

				if (currentUser?.emailVerified && 
					currentUser?.authMeta?.emailAuth && 
					currentUser?.authMeta?.phoneAuth && 
					!!!currentUser?.authMeta?.pending) {
					
					// console.log(currentUser?.email);
					const userDb = await getUserFromDb(currentUser?.email);
					
					if (userDb) {
						//check for validity of FCM token
						await checkFCMToken(userDb);
					}
					
					const account = userDb?.account;
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

	const checkFCMToken = async(userDb) => {
		const token = userDb?.fcmInfo?.token;
		const lastUpdated = userDb?.fcmInfo?.lastUpdated;

		let needsUpdate = true;
		if(token && lastUpdated) {
			const timePassed = duration(lastUpdated);
			// console.log("timePassed: ", timePassed);

			// if (timePassed < 30*24*60*60*1000) {
			// 	needsUpdate = false;
			// }
		} 
		
		// console.log("Is Token update needed: ", needsUpdate);
		if (needsUpdate) {
			//Add FCM token to 
			const fcmToken = await messaging().getToken();
			// console.log(currentUser?.email);
			await updateUserInDb(currentUser?.email, {fcmInfo: {token: fcmToken, lastUpdated: new Date()}});
		}
	}

	const getUserFromDb = async (email) => {
		// console.log("Getting User");
		return await findUserInDb(email)
	};

	const onNewCurrentUser = async(user) => {
		// console.log("onNewCurrentUser");
		// console.log(user);

		if (user) {
			const authMeta = await getAuthMetaData();
			// console.log("Auth Meta Data");
			// console.log(authMeta);

			// console.log("User Argument");
			// console.log(user);

			// console.log("Appended User")
			// console.log({...user._user})

			setCurrentUser({...user, authMeta});
		} else {
			setCurrentUser(null);
		}
	}

	const signInEmail = async (email, password) => {
		setLoadingAuth(true);

		// console.log("signInEmail")
		// console.log("Email: ", email);
		// console.log("Password: ", password);

		const userCredential = await signInWithEmailAndPassword(email, password);
		// console.log("Signed In");
		// console.log(userCredential);
		await updateAuthMetaData({emailAuth: true, phoneAuth: true});	
		onNewCurrentUser({...userCredential?.user._user});
	}

	const linkEmail = async ({email, password}, {sendEmail = true} = {}) => {

		// console.log("Linking Email")
		setLoadingAuth(true);

		// console.log("liningEmailToUser")
		// console.log("Email: ", email);
		// console.log("Password: ", password);

		const user = await getUser()

		if (user && !!user.email) {
			throw({code: 'auth/already-linked-another-email'});
		}

		const emailCredential = await EmailAuthProvider.credential(email, password);
		const userCredential = await user.linkWithCredential(emailCredential);	
		
		if(sendEmail) {
    		await sendEmailVerification();
		}

		const oldAuthMeta = await getAuthMetaData();
		await updateAuthMetaData({...oldAuthMeta, emailAuth: true});	
		onNewCurrentUser({...userCredential?.user._user});
	}

	const signInPhone = async (phoneNumber) => {
		setLoadingAuth(true);
		setConfirmPhone(await signInWithPhoneNumber(phoneNumber));
	}

	const getPhoneCredentials = async(code) => {
		const credentials = await PhoneAuthProvider.credential(confirmPhone.verificationId, code); 
		
		//Signin with phone credential to make sure OTP is valid
		await signInWithCredential(credentials);
		await signOut();
		//Then signout to continue with email  

		setConfirmPhone(null);
		return credentials;
	}

	const submitPhoneCode = async (code) => {
		const userCredential = await confirmPhone.confirm(code);
		setConfirmPhone(null);
		const oldAuthMeta = await getAuthMetaData();
		await updateAuthMetaData({...oldAuthMeta, phoneAuth: true});

		onNewCurrentUser({...userCredential?.user._user})
	}

	const sendEmailVerification = async() => {
		try{
			await auth().currentUser.sendEmailVerification({
    			url:'https://fincript-dev.firebaseapp.com',	
    			handleCodeInApp: true,
    			android: {
    				packageName: 'com.fincript.rndev'
    			}
    		}) 
		} catch(err) {

		}
	}

	//Not in use downstream
	//because phone credentials can't be connected once verified
	//hence, we do other way round... link email credential to phone
	const signUpEmail = async ({email, password}, {sendEmail=true, linkTo= null}) => {
		setLoadingAuth(true);
		
		// console.log("Email: ", email);
		// console.log("Password: ", password);
		let userCredential = await createUserWithEmailAndPassword(email, password);

    	if(sendEmail) {
    		await sendEmailVerification();
		}

		if(linkTo) {
			//Get finally linked userCredentials
			userCredential = await userCredential.user.linkWithCredential(linkTo);
		}

		const oldAuthMeta = await getAuthMetaData();
		await updateAuthMetaData({...oldAuthMeta, emailAuth: true});

		onNewCurrentUser({...userCredential?.user._user});

		//Don't signout to allow sign-In on clicking the link
        // await auth().signOut();

        return userCredential;
	}

	const signUpPhone = async (phoneNumber) => {
		setLoadingAuth(true);
    	setConfirmPhone(await signInWithPhoneNumber(phoneNumber));
	}

	const signOut = async () => {

		try{
			await firebaseSignOut();
		} catch(err) {
			console.log(err);
		}

		await setCurrentUser(null);
		await setUserAccount(null);
		await updateAlpacaAccount(null);
		await updateCurrentUser(null);
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
		await updateUserInDb(currentUser?.email, {account: userAccount.account});	
		setUserAccount(userAccount);
	}

	const sendSignInLink = async(email) => {
		// console.log("Sending link auth to: ", email);
		return await sendSignInLinkToEmail(email, {
			url:'https://fincript-dev.firebaseapp.com',	
			handleCodeInApp: true,
			android: {
				packageName: 'com.fincript.rndev'
			}
		})
	}

	const resetAuth = async() => {
		setConfirmPhone(null);
		await signOut();
	}

	const resetPhoneAuth = async() => {
		const oldAuthMeta = await getAuthMetaData();
		await updateAuthMetaData({...oldAuthMeta, phoneAuth: false});
		setConfirmPhone(null);
	}

	//userAccount is not used anywhere (except locally) - remove it from output
	return {isLoadingAuth, currentUser, userAccount, confirmPhone, submitPhoneCode,
		signInEmail, signUpEmail, signUpPhone, signInPhone,
		signOut, requestResetPassword, resetPassword, 
		changePassword, updateUserAccount, sendSignInLink,
		verifiedUser: currentUser?.emailVerified && currentUser?.authMeta?.emailAuth && currentUser?.authMeta?.phoneAuth,
		authMeta: currentUser?.authMeta, 
		sendEmailVerification,
		getPhoneCredentials, linkError, resetAuth, resetPhoneAuth, linkEmail		
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
