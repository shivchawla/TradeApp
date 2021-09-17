import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const EmailAuthProvider = auth.EmailAuthProvider;
export const PhoneAuthProvider = auth.PhoneAuthProvider;

const USER_DB = 'Users';

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

export const updateUserInDb = async(email, userAccount) => {
	try{
		return firestore().collection(USER_DB)
		.where('email','==', email)
		.limit(1)
	  	.get()
		.then(querySnapshot => {
			
			if (querySnapshot.size < 1) {
				return null;
			}

		    return querySnapshot.docs[0].update({account: userAccount.account})
		})
	} catch(err) {
		console.log("There is an Error");
		console.log(err);
		return null;
	}
}

export const addUserInDb = async(email, userAccount) => {
	return firestore().collection(USER_DB)
	.add({
		email,
	    account: userAccount.account
	})
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
