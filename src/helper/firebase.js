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

export const signIn = async ({email, password}) => {
	const userCredential = await auth().signInWithEmailAndPassword(email , password)

  	if (userCredential.user.emailVerified) {
        return userCredential;
  	} else {
  		throw new Error({code: "auth/email-not-verified"});
  	}
}

export const useUserAccount = (email) => {
	const [userAccount, setUserAccount] = useState(null);

	React.useEffect(() => {
		const getUser = async() = await findUserDb(email).then(account => setUserAccount(account));

		getUser();
	}, []);
}

