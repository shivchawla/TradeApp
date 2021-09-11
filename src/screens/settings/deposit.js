import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import 'react-native-get-random-values';
import { nanoid } from 'nanoid';

import RNFS from 'react-native-fs';
import NetInfo from "@react-native-community/netinfo";

import DocumentPicker from 'react-native-document-picker';
import CheckBox from '@react-native-community/checkbox';

import { AppView, ConfirmButton, TinyTextButton, IconTextButton } from '../../components/common';
import { DepositForm } from '../../components/form';
import { SUPPORTED_BANKS, BANK_ACCOUNT_TYPES } from '../../config'
import { useTheme, StyledText, WP, HP }  from '../../theme';
import { currentISODate } from '../../utils';
import { useAuth } from '../../helper'

//Add logic to save auth state to temp storage
const CreateDeposit = (props) => {

	const {theme, styles} = useStyles();
	const [formError , setFormError] = useState(null);
	const {navigation} = props;
		
	const signInMsg = "Successfully signed in!";

	const [depositSummary, setDepositSummary] = useState(null);
	const [document, setDocument] = useState(null);
	const [agree, setAgree] = useState(null);
	const [finalAgree, setFinalAgree] = useState(null);
	const [complete, setComplete] = useState(false);
	const [depositError, setDepositError] = useState(null);

	const {currentUser, userAccount} = useAuth();

	const onSubmit = async (values) => {
    	setDepositSummary({
    		...values, 
    		bankName: SUPPORTED_BANKS.find(item => item.key == values['bankName']).title,
    		accountType: BANK_ACCOUNT_TYPES.find(item => item.key == values['accountType']).title,
			finalAmount: `${values['currency']} ${values['amount']}`
		});
	}

	const selectDocument = async() => {
		try {
		  const res = await DocumentPicker.pick({
		    type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
		  }).then(arr => arr[0]);

		  if (res) {
			setDocument(res);
		  }
		  
		} catch (err) {
		  if (DocumentPicker.isCancel(err)) {
		    console.log("User Canceled Upload")
		  } else {
		    throw err
		  }
		}
	}


	const onCompleteDeposit = async() => {

		if (!currentUser ) {
			setDepositError("User doesn't exist");
			return;
		}

		// if (!userAccount) {
		// 	setDepositError("User Account doesn't exist");
		// 	return;
		// }

		let reference;

		try {
			//First upload the image to cloud storage
			//Improve the saved file name

			reference = storage().ref(`/images/deposit/${currentUser.email}/${document.name}`);

			//For android, first get the correct file destination
			const destPath = `${RNFS.TemporaryDirectoryPath}/${nanoid()}`;
			await RNFS.copyFile(document.uri, destPath);

			const fileStat = await RNFS.stat(destPath); 
		  	console.log("Stat");
		  	console.log(fileStat);

			await reference.putFile(fileStat.originalFilepath);

		} catch (err) {
			console.log("Error uploading the document");
			console.log(err);
			setDepositError(err);
			return;
		}

		const netState = await NetInfo.fetch();

		if (!netState || !netState.isConnected) {
			setDepositError('Internet not connected');
			return;
		}
  
		// console.log("********");
		// console.log({
		// 	deposit: depositSummary,
		// 	user: currentUser?.user?.email,
		// 	// ...userAccount,
		// 	date: currentISODate(),
		// 	ipAddress: netState.details.ipAddress,
		// 	screenshot: reference.getDownloadURL()
		// });


		//Once file uploaded
		const depositCollection = firestore().collection('Deposits');
		depositCollection
		.add({
			deposit: depositSummary,
			user: currentUser?.user?.email, //Add user Account instead
			account: '9703c0b1-67bf-492d-aeff-95c108299188', //Alpaca Account instead
			date: currentISODate(),
			ipAddress: netState.details.ipAddress,
			screenshot: await reference.getDownloadURL(),
			status: 'Pending'
		})
		.then(() => {
			console.log('Deposit Added');
			setComplete(true)
		});
	}

	const {currency, amount, bankName, accountType} =  depositSummary || {};

	const Form = () => {
		return (
			<View style={styles.formContainer}>
				{formError && <StyledText style={styles.signInError}>{formError} </StyledText>}
				<DepositForm setCustomError={setFormError} onSubmit={onSubmit}/>
		   </View>
		)
	}

	const Summary = () => {
		return (
			<>
			<View style={styles.depositSummary}>
				<StyledText>You have agreed to deposit {currency} {amount}</StyledText>
				<StyledText>Selected Bank: {SUPPORTED_BANKS.find(item => item.key == bankName)?.title || ''}</StyledText>
				<StyledText>Account Type: {BANK_ACCOUNT_TYPES.find(item => item.key == accountType)?.title}</StyledText>
			</View>
			<TinyTextButton onPress={() => setDepositSummary(null)} title="Edit" />
			</>

		)
	}

	const Finalizar = () => {
		return (
	  		<>
		  		<StyledText>Proceed to make a deposit and upload a receipt below </StyledText>

				{!document ? 
					<IconTextButton 
						iconName="cloud-upload-outline" 
						title="UPLOAD" 
						onPress={selectDocument} 
						containerStyle={styles.uploadButton}
						textStyle={{marginLeft: WP(2)}}	
					/>
					:
					<>
						<View style={{flexDirection: 'row'}}>
							<StyledText>Receipt Uploaded: YES</StyledText>
							<StyledText>{document?.name}</StyledText>
							<TinyTextButton onPress={() => setDocument(null)} title="Remove" />
						</View>
						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setFinalAgree(!finalAgree)}>
							<CheckBox
						    value={finalAgree}
						    onValueChange={setFinalAgree}
						  />
						  <StyledText>I have made the deposit and uploaded the right document</StyledText>
						</TouchableOpacity>  
						 
						<ConfirmButton 
							buttonContainerStyle={{position: 'absolute', bottom: 20}} 
							buttonStyle={{width: '70%'}} title="COMPLETE DEPOSIT" 
							disabled={!finalAgree} 
							onClick={onCompleteDeposit} 
						/>

					</>
				}
			</>
		)
	}

	const title = complete ? "DEPOSIT SUCCESSFUL" : depositError ? "ERROR" : "CREATE DEPOSIT"
	
	return (
		<AppView {...{title}}  scroll={false} goBack={() => complete || depositError ? navigation.navigate('Settings') : navigation.goBack()}>
			
			{/*<IconTextButton 
				iconName="cloud-upload-outline" 
				title="UPLOAD" 
				onPress={selectDocument} 
				containerStyle={styles.uploadButton}
				textStyle={{marginLeft: WP(2)}}	
			/>*/}

			{depositError ? 
				<StyledText>{depositError}</StyledText>
				:
				!complete ? 
					!depositSummary ? 
						<Form />
					:
					<>
						<Summary />
						
						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setAgree(!agree)}>
							<CheckBox
							 disabled={!!document}
						    value={agree}
						    onValueChange={setAgree}
						  />
						  <StyledText>I agree to terms and conditions</StyledText>
					  </TouchableOpacity>

					  {agree && <Finalizar />}
					</>
				: <StyledText>Deposit Created Successfully!</StyledText>
			}
	   </AppView>
	);
}

export default CreateDeposit;

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		formContainer: {
			justifyContent: 'center', 
			textAlign: 'center', 
			flex:1, 
			width: '100%',
			marginTop: HP(5)
		},

		uploadButton: {
			flexDirection: 'row', 
			alignItems: 'center', 
			justifyContent: 'center',
			alignSelf: 'center',
			// backgroundColor: theme.ico,
			borderWidth:1,
			borderColor: theme.text,
			padding: WP(2),
			width: '40%'
		}
	});

	return {theme, styles};
}
