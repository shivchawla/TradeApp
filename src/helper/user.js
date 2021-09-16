import React, {useState} from 'react';
import { AppState } from 'react-native';

import auth from '@react-native-firebase/auth';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {useQuery} from 'react-query';
import queryString from 'query-string';

import {getCurrentUser, updateCurrentUser, 
	getAlpacaAccount, updateAlpacaAccount, updateAuthMetaData, getAuthMetaData} from './store';

import { currentISODate, toISODate } from '../utils';

import {findUserInDb, addUserInDb, updateUserInDb,
	signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, 
	signInWithPhoneNumber, sendPasswordResetEmail, confirmPasswordReset, 
	applyActionCode, reloadUser, getUser, updatePassword, signInWithEmailLink,
	sendSignInLinkToEmail, PhoneAuthProvider
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

	React.useEffect(() => {

		const handleDynamicLink = async(link) => {
			// Handle dynamic link inside your own application
		    console.log("Received Dynamic Link: ", link)
		    if (link?.url) {
		    	const parsed = queryString.parse(link?.url);
		    	const mode = parsed?.mode;
		    	const oobCode = parsed?.oobCode;
		    	console.log("Code: ", oobCode);

		    	if(mode == "verifyEmail") {
		    		//Apply oob code
		    		await applyActionCode(oobCode)
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
				const x = await auth().currentUser;
				console.log("User signed In");
				console.log(x);

				if (!x) {
					setLoadingAuth(false);
					onNewCurrentUser(null);
					return;
				}
			} catch (err) {
				setLoadingAuth(false);
				onNewCurrentUser(null);
				return;
			} 

			//Update logic to check for last signed in time 
			var storedUser = await getCurrentUser();
			if (!!storedUser?.emailVerified) {
				onNewCurrentUser(storedUser);
			} else {
				try{
					//If Email is not verified, refetch from aut
					console.log("Check the user from auth - After reload");
					await reloadUser();
					let updatedUser = await getUser();

					console.log("Updated User");
					console.log(updatedUser);

					onNewCurrentUser({...updatedUser._user});

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
				console.log("Current User Change Effect");
				console.log(currentUser);
				await updateCurrentUser(currentUser);

				//Check Auth Meta as well to make user Account is fetched

				if (currentUser?.emailVerified && 
					currentUser?.authMeta?.emailAuth && 
					currentUser?.authMeta?.phoneAuth && 
					!!!currentUser?.authMeta?.pending) {
					
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

	const onNewCurrentUser = async(user) => {
		if (user) {
			const authMeta = await getAuthMetaData();
			console.log("Auth Meta Data");
			console.log(authMeta);

			console.log("User Argument");
			console.log(user);

			// console.log("Appended User")
			// console.log({...user._user})

			setCurrentUser({...user, authMeta});
		} else {
			setCurrentUser(null);
		}
	}

	const signInEmail = async (email, password) => {
		setLoadingAuth(true);

		console.log("signInEmail")
		console.log("Email: ", email);
		console.log("Password: ", password);

		const userCredential = await signInWithEmailAndPassword(email, password);
		// console.log("Signed In");
		// console.log(userCredential);
		await updateAuthMetaData({emailAuth: true, phoneAuth: true});	
		onNewCurrentUser({...userCredential?.user._user});
	}

	const signInPhone = async (phoneNumber) => {
		setLoadingAuth(true);
		setConfirmPhone(await signInWithPhoneNumber(phoneNumber));
	}

	const getPhoneCredentials = async(code) => {
		return await PhoneAuthProvider.credential(phoneConfirm.verificationId, code); 
	}

	const submitPhoneCode = async (code) => {
		const userCredential = confirmPhone.confirm(code);

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

	const signUpEmail = async ({email, password}, {sendEmail=true, linkTo= null}) => {
		setLoadingAuth(true);
		
		console.log("Email: ", email);
		console.log("Password: ", password);
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
		await firebaseSignOut();
		await onNewCurrentUser(null);
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

	const sendSignInLink = async(email) => {
		console.log("Sending link auth to: ", email);
		return await sendSignInLinkToEmail(email, {
			url:'https://fincript-dev.firebaseapp.com',	
			handleCodeInApp: true,
			android: {
				packageName: 'com.fincript.rndev'
			}
		})
	}

	//userAccount is not used anywhere (except locally) - remove it from output
	return {isLoadingAuth, currentUser, userAccount, confirmPhone, submitPhoneCode,
		signInEmail, signUpEmail, signUpPhone, signInPhone,
		signOut, requestResetPassword, resetPassword, 
		changePassword, updateUserAccount, sendSignInLink,
		verifiedUser: currentUser?.emailVerified && currentUser?.authMeta?.emailAuth && currentUser?.authMeta?.phoneAuth,
		authMeta: currentUser?.authMeta, 
		sendEmailVerification,
		getPhoneCredentials		
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