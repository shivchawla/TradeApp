import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

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

export const signInWithEmailPassword = async ({email, password}) => await auth().signInWithEmailAndPassword(email, password);

export const createUserWithEmailPassword = async({email, password}) => await auth().createUserWithEmailAndPassword(email, password);

export const signOutFirebase = async() => await auth().signOut();
