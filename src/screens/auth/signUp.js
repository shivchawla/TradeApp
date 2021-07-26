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
        auth.signOut();
        setSignedUp(true);
      })
      .catch(alert);
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

