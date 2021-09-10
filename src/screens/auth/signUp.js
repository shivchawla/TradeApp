import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { useAuth, EmailAuthProvider, PhoneAuthProvider, setStorageData } from '../../helper';
import { AppView, ConfirmButton } from '../../components/common';
import { SignUpForm } from '../../components/auth';

import { useTheme, StyledText, WP, HP }  from '../../theme';

const SignUp = (props) => {

	const {signUpPhone, signUpEmail, updateUser} = useAuth();

	const [signUpType, setSignUpType] = useState('phone');
	const [signUpError, setSignUpError] = useState(null);
	const [signedUp, setSignedUp] = useState(false);
	const [phoneConfirm, setPhoneConfirm] = useState(null); 
	
	const [phoneCredentials, setPhoneCredentials] = useState(null);
	const [emailCredentials, setEmailCredentials] = useState(null);	

	const [otp, setOtp] = useState(null); 

	React.useEffect(() => {

		const handleChangePhoneCredentials = async() => {
			if (phoneCredentials) {
				//When phone is confirmed update storage
				//when does this expire
				// await setStorageData("phoneAuth", JSON.stringify(phoneCredentials));

				//Now, move on-to email auth
				setSignUpType("email");
			}
		}

		handleChangePhoneCredentials()

	}, [phoneCredentials])

	React.useEffect(() => {

		const handleChangeEmailCredentials = async() => {
			if (emailCredentials) {
				//When phone is confirmed update storage
				//when does this expire
				await setStorageData("emailAuth", JSON.stringify(emailCredentials));

				if (emailCredentials && phoneCredentials) {
					//Now, move on-to email auth
					setSignedUp(true);	
				}
			}
		}

		handleChangeEmailCredentials();

	}, [emailCredentials])

	const onSubmitOtp = async() => {
		try {

			const phoneAuthCredentials = await PhoneAuthProvider.credential(phoneConfirm.verificationId, otp);

			console.log("phoneAuthCredentials");
			console.log(phoneAuthCredentials);

			// const userCredentials = await phoneConfirm.confirm(otp);

			console.log("User successfully signed/created with PHONE");
			// console.log(userCredentials);

			setPhoneCredentials(phoneAuthCredentials);

	    } catch (error) {
	    	console.log(error);
			setSignUpError('Invalid OTP code');
    	}
	}

	const onSignUpPhone = async ({phoneNumber}) => {
		console.log("On SignUp - Phone");
		console.log(phoneNumber);

		try {
			setPhoneConfirm(await signUpPhone(phoneNumber));
		} catch (error) {
			setSignUpError(error.code);
		}
	}

	const onSignUpEmail = async ({email, password}) => {
		console.log("In onSignup - Email");
		
		try {
			
			const userCredentials = await signUpEmail({email, password}, {linkTo: phoneCredentials});
			console.log("User successfully signed/created with EMAIL");
			
			setEmailCredentials(userCredentials)
						
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

	const {theme, styles} = useStyles();

	// console.log("signUpType: ", signUpType);
	// console.log(phoneConfirm);
	// console.log(signUpType == "phone" && !phoneConfirm);
	// console.log((signUpType == "phone" && !phoneConfirm) || (signUpType == "email"));
	
	return (
		<AppView title="Sign Up" goBack={false}>
			{signedUp ? 
				<StyledText>Verify Email to proceed</StyledText>
			:
			
				<>
				{((signUpType == "phone" && !phoneConfirm) || (signUpType == "email")) &&
					<SignUpForm type={signUpType} disabled={signUpType == "phone" && phoneConfirm} onSubmit={signUpType == "phone" ? onSignUpPhone : onSignUpEmail}/>
				}

				{(signUpType == "phone" && phoneConfirm) && 
					<View>
						<TextInput 
							placeholder="OTP"
							keyboardType="numeric"
							placeholderTextColor={theme.grey7}
							onChangeText={setOtp}
							autoCompleteType="off"
							value={otp}
						/>
						<ConfirmButton title="SUBMIT OTP" onClick={onSubmitOtp} />
					</View>
				}
				</>
			}
		</AppView>
	);
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({

	})

	return {theme, styles};
}

export default SignUp;

