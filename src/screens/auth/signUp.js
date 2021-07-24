import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import auth from '@react-native-firebase/auth';

import ConfirmButton from '../../components/confirmButton';

const SignUp = ({props}) => {

  // const [email , setemail] = useState('');
  // const [password , setpassword] = useState('');
  
  const onSignup = ({email, password}) => {
      auth.createUserWithEmailAndPassword(email , password)
      .then(userCredential => {
        // send verification mail.
        userCredential.user.sendEmailVerification();
        auth.signOut();
        alert("Email sent");
      })
      .catch(alert);
  }
  
  return (
    <AppView title="Sign Up">
        <ConfirmButton title="Sign Up" onClick={() => onSignUp({email: "shiv.chawla@yandex.com", password: "Fincript"})} />
    </AppView>
  );
}

export default SignUp;

