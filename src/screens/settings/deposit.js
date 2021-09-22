import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import 'react-native-get-random-values';
import { nanoid } from 'nanoid';

import RNFS from 'react-native-fs';
import NetInfo from "@react-native-community/netinfo";

import DocumentPicker from 'react-native-document-picker';

import { AppView, ConfirmButton, TinyTextButton, IconTextButton, Checkbox } from '../../components/common';
import { DepositForm } from '../../components/funds';
import { SUPPORTED_BANKS, BANK_ACCOUNT_TYPES } from '../../config'
import { useTheme, StyledText, WP, HP }  from '../../theme';
import { currentISODate } from '../../utils';
import { useAuth, useLoading } from '../../helper'

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
	const [depositError, setDepositError] = useState(null);

	const {currentUser, userAccount} = useAuth();
	const {isLoading, loadingFunc} = useLoading();

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

	const submitDeposit = async() => {

		if (!currentUser ) {
			throw Error("User doesn't exist");
		}

		if (!userAccount) {
			throw Error("User Account doesn't exist");
		}

		let reference;

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

		//After creating reference
		
		const netState = await NetInfo.fetch();

		if (!netState || !netState.isConnected) {
			throw Error('Internet not connected');
		}

		console.log("Email: ", currentUser?.email);
		console.log("Account: ", userAccount?.account?.id);

		const depositId = nanoid(10);
		//Once file uploaded
		await firestore().collection('Deposits')
		.add({
			deposit: depositSummary,
			depositId,
			user: currentUser?.email, //Add user Account instead
			account: userAccount?.account?.id, //Alpaca Account instead
			date: currentISODate(),
			ipAddress: netState.details.ipAddress,
			screenshot: await reference.getDownloadURL(),
			status: 'Pending'
		})

		return depositId;
	}

	const onCompleteDeposit = async() => {
		try{
			const depositId = await loadingFunc(async() => await submitDeposit());
			console.log('Deposit Added');
			setDepositSummary({...depositSummary, depositId, complete: true});
		} catch (err) {
			setDepositError(err.message);
		}
	} 

	const {currency, amount, bankName, accountType} =  depositSummary || {};

	const Form = () => {
		return (
			<View style={styles.formContainer}>
				<DepositForm error={formError} onError={setFormError} onSubmit={onSubmit}/>
		   </View>
		)
	}

	const LabelValue = ({label, value}) => {
		return (
			<View style={styles.summaryLabelValue}>
				<StyledText style={styles.summaryLabel}>{label} </StyledText>
				<StyledText style={styles.summaryValue}>{value}</StyledText>
			</View>
		)
	}

	const Summary = ({edit = true}) => {
		return (
			<>
			<View style={styles.summaryContainer}>
				<StyledText style={styles.summaryTitle}>DEPOSIT SUMMARY</StyledText>
				<LabelValue label="You have agreed to deposit" value={`${currency} ${amount}`} />
				<LabelValue label="Account Number:" value={`${depositSummary.accountNumber}`} />
				<LabelValue label="Selected Bank:" value={`${depositSummary.bankName}`} />
				<LabelValue label="Account Type:" value={`${depositSummary.accountType}`} />
				
				{depositSummary?.depositId && <LabelValue label="Deposit Reference Id:" value={`${depositSummary.depositId}`} />}
				{depositSummary?.complete && <LabelValue label="Status:" value="Processing" />}
			</View>

			{edit && <View style={{alignItems: 'flex-end'}} >
				<TinyTextButton onPress={() => setDepositSummary(null)} title="Edit" />
			</View>}	
			</>
		)
	}

	const Finalizar = () => {
		return (
	  		<View style={styles.finalizeContainer}>
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
						<View style={styles.summaryContainer}>
							<LabelValue label="Receipt Uploaded" value="YES" />
							
							<StyledText>{document?.name}</StyledText>
							<View style={{alignItems: 'center', marginTop: HP(2)}}>
								<TinyTextButton onPress={() => setDocument(null)} title="Remove and Upload Again" />
							</View>
						</View>
						<TouchableOpacity style={styles.checkboxContainer} onPress={() => setFinalAgree(!finalAgree)}>
							<Checkbox
						    value={finalAgree}
						    onToggle={setFinalAgree}
						  />
						  <StyledText style={styles.agreeText}>I have made the deposit and uploaded the right document</StyledText>
						</TouchableOpacity>  
						 
						<ConfirmButton
							buttonContainerStyle={{position: 'absolute', bottom: 10}} 
							buttonStyle={{width: '70%'}} title="COMPLETE DEPOSIT" 
							disabled={!finalAgree} 
							onClick={onCompleteDeposit} 
						/>

					</>
				}
			</View>
		)
	}

	const title = depositSummary?.complete ? "DEPOSIT SUCCESSFUL" : depositError ? "ERROR" : "CREATE DEPOSIT"
	
	return (
		<AppView 
			{...{title, isLoading}}  
			scrollViewStyle={{flexGrow:1}} 
			goBack={() => depositSummary?.complete || depositError ? navigation.navigate('Settings') : navigation.goBack()}
		>

			{depositError ? 
				<StyledText>{depositError}</StyledText>
				:
				!depositSummary?.complete ? 
					
					!depositSummary ? 
						<Form />
					:
					<>
						<Summary />
						
						<TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgree(!agree)}>
							<Checkbox
								disabled={!!document}
						    	value={agree}
						    	onToggle={setAgree}
						  />
						  <StyledText style={styles.agreeText}>I agree to terms and conditions</StyledText>
					  </TouchableOpacity>

					  {agree && <Finalizar />}
					</>

				: 
				<View>
					<View style={{marginTop: HP(5), alignItems: 'center' }}>
						<StyledText style={{textAlign: 'center', width: '80%', fontSize: WP(4.5)}}>We have received a deposit request! We will send a notificaition with 1-3 days once it's completed. Thanks!</StyledText>
					</View>
					<Summary edit={false}/>
				</View>	
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
			width: '40%',
			marginTop: HP(3)
		},
		summaryContainer: {
			marginTop: HP(5),
			backgroundColor: theme.grey9,
			padding: WP(3)
		},
		summaryLabelValue: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: WP(2),
			alignItems: 'center' 
		},
		summaryLabel: {
			fontSize: WP(4),
			marginTop: WP(2),
			color: theme.grey4
		},
		summaryValue: {
			fontSize: WP(4.5),
			marginTop: WP(2),
			color: theme.grey
		},
		summaryTitle:{
			fontSize: WP(4.5),
			color: theme.icon
		},
		checkboxContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: HP(2)
		},
		agreeText: {
			fontSize: WP(4),
			marginLeft: WP(2)
		},
		finalizeContainer: {
			marginTop: HP(5),
			flex: 1
		}
	});

	return {theme, styles};
}
