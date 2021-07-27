import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import auth from '@react-native-firebase/auth';

import AppView from '../../components/appView';
import ConfirmButton from '../../components/confirmButton';


const SignUp = ({props}) => {

  // const [email , setemail] = useState('');
  // const [password , setpassword] = useState('');
  const [signedUp, setSignedUp] = useState(false);
  
  const onSignup = ({email, password}) => {
      console.log("In onSignup")
      auth().createUserWithEmailAndPassword(email , password)
      .then(userCredential => {
        // send verification mail.
        userCredential.user.sendEmailVerification();
        auth().signOut();
        setSignedUp(true);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          alert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          alert('That email address is invalid!');
        }

        console.error(error);
      });
  }
  
  const signupMsg = "Successfully signed up! Please Check your email";

  return (
    <AppView title="Sign Up">
        {!signedUp && <ConfirmButton title="Sign Up" onClick={() => onSignup({email: "shiv.chawla@yandex.com", password: "Fincript"})} />}
        {signedUp && <Text>{signupMsg}</Text>}
    </AppView>
  );
}

export default SignUp;

