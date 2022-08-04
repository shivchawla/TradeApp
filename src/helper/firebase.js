import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import 'react-native-get-random-values';
import { nanoid } from 'nanoid';

import RNFS from 'react-native-fs';

export const EmailAuthProvider = auth.EmailAuthProvider;
export const PhoneAuthProvider = auth.PhoneAuthProvider;

const USER_DB = 'Users';
const DEPOSIT_DB = 'Deposits';
const WITHDRAW_DB = 'Withdraws';

export const findUserInDb = async(email) => {
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

const addUserInDb = async(email, data) => {
	return firestore().collection(USER_DB)
	.add({
		email,
	    ...data
	})
}


export const updateUserInDb = async(email, data) => {

	try{
		return firestore().collection(USER_DB)
		.where('email','==', email)
		.limit(1)
	  	.get()
		.then(querySnapshot => {
			
			if (querySnapshot.size < 1) {
				addUserInDb(email, data)
				return null;
			}

			console.log(data);
			console.log(querySnapshot.docs[0]);
		    return querySnapshot.docs[0].ref.update(data)
		})
	} catch(err) {
		console.log("There is an Error");
		console.log(err);
		return null;
	}
}


export const addDepositInDb = async(email, deposit) => {
	await firestore().collection(DEPOSIT_DB)
	.add({email, ...deposit})
}

export const addWithdrawInDb = async(email, withdraw) => {
	await firestore().collection(WITHDRAW_DB)
	.add({email, ...withdraw})
}

export const getWithdrawsInDb = async(email, {start, end} = {}) => {
	try{
		return firestore().collection(WITHDRAW_DB)
		.where('email','==', email)
		.where('date', '>=', new Date(start))
		.where('date', '<=', new Date(end))
	  	.get()
		.then(querySnapshot => {
			console.log("querySnapshot");
			console.log(querySnapshot);
			
			if (querySnapshot.size < 1) {
				return [];
			}

		    return querySnapshot.docs.map(doc => doc.data());
		})
	} catch(err) {
		console.log("There is an Error");
		console.log(err);
		return [];
	}
}

export const getDepositsInDb = async(email, {start, end}) => {
	try{
		return firestore().collection(DEPOSIT_DB)
		.where('email', '==', email)
		.where('date', '>=', new Date(start))
		.where('date', '<=', new Date(end))
	  	.get()
		.then(querySnapshot => {

			console.log("querySnapshot");
			console.log(querySnapshot);

			if (querySnapshot.size < 1) {
				return [];
			}

		    return querySnapshot.docs.map(doc => doc.data());
		})
	} catch(err) {
		console.log("There is an Error");
		console.log(err);
		return [];
	}
}

export const uploadDocumentInStorage = async(document, path) => {
	const reference = await storage().ref(path);

	//For android, first get the correct file destination
	const destPath = `${RNFS.TemporaryDirectoryPath}/${nanoid()}`;
	await RNFS.copyFile(document.uri, destPath);
	const fileStat = await RNFS.stat(destPath); 

	await reference.putFile(fileStat.originalFilepath);

	return await reference.getDownloadURL(); 
}


export const signInWithEmailAndPassword = async (email, password) => await auth().signInWithEmailAndPassword(email, password);

export const createUserWithEmailAndPassword = async(email, password) => await auth().createUserWithEmailAndPassword(email, password);

export const signOut = async() => await auth().signOut();

export const signInWithPhoneNumber = async(phoneNumber) => await auth().signInWithPhoneNumber(phoneNumber);

export const sendPasswordResetEmail = async(email, params = {}) => await auth().sendPasswordResetEmail(email, params);

export const sendSignInLinkToEmail = async(email, params = {}) => await auth().sendSignInLinkToEmail(email, params);

export const confirmPasswordReset = async(code, newPassword) => await auth().confirmPasswordReset(code, newPassword);

export const applyActionCode = async(oobCode) => await auth().applyActionCode(oobCode);

export const reloadUser = async() => await auth().currentUser.reload();

export const getUser = async() => await auth().currentUser;

export const updatePassword = async(newPassword) => await auth().currentUser.updatePassword(newPassword);

export const signInWithEmailLink = async(email, emailLink) => await auth().signInWithEmailLink(email, emailLink);

export const signInWithCredential = async(credential) => await auth().signInWithCredential(credential);
