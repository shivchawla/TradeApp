import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {useAuth} from '../../helper';
import AppView from '../../components/appView';
import ConfirmButton from '../../components/confirmButton';


const SignUp = ({props}) => {

  // const [email , setemail] = useState('');
  // const [password , setpassword] = useState('');
  const [signedUp, setSignedUp] = useState(false);
  const {signUp} = useAuth();
  
  const onSignup = async ({email, password}) => {
      console.log("In onSignup")
      try{
        const signedUp = await signUp({email, password});
        if (signedUp) {
          setSignedUp(true);
        }
      
      } catch(error) {
        if (error.code === 'auth/email-already-in-use') {
          alert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          alert('That email address is invalid!');
        }

        console.error(error);
      }
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

