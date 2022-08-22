import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';

import 'react-native-get-random-values';
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdef', 10)

import {useNetInfo} from "@react-native-community/netinfo";

import DocumentPicker from 'react-native-document-picker';

import { AppView, ConfirmButton, TinyTextButton, IconTextButton, Checkbox } from '../../components/common';
import { DepositForm } from '../../components/funds';
import { SUPPORTED_BANKS, BANK_ACCOUNT_TYPES } from '../../config'
import { useTheme, useDimensions, useTypography, StyledText }  from '../../theme';
import { currentISODate } from '../../utils';
import { useFunds, useStorage } from '../../helper'

//Add logic to save auth state to temp storage
const CreateDeposit = (props) => {

	const {theme, styles} = useStyles();
	const { HP, WP } = useDimensions();
	const [formError , setFormError] = useState(null);
	const {navigation} = props;
		
	const signInMsg = "Successfully signed in!";

	const [depositSummary, setDepositSummary] = useState(null);
	const [document, setDocument] = useState(null);
	const [agree, setAgree] = useState(null);
	const [finalAgree, setFinalAgree] = useState(null);
	const [depositError, setDepositError] = useState(null);

	const { isLoading: isLoadingDeposit, addDeposit } = useFunds(); 
	const { isLoading: isLoadingStorage, uploadDocument } = useStorage(); 

	const netInfo = useNetInfo(); 

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

		//First upload the image to cloud storage
		//Improve the saved file name
		const downloadUrl = await uploadDocument(document, {folder: 'deposit'});
		
		const depositId = nanoid();
		//Once file uploaded

		await addDeposit({
			details: depositSummary, 
			screenshot: downloadUrl,
			status: 'Pending', 
			depositId,
			date: new Date(currentISODate()),
			ipAddress: netInfo.details.ipAddress,
		})

		return depositId;
	}

	const onCompleteDeposit = async() => {
		try{
			const depositId = await submitDeposit();

			console.log('Deposit Added');
			setDepositSummary({...depositSummary, depositId, complete: true});
		} catch (err) {
			setDepositError(err.message);
		}
	} 

	const {currency, amount, bankName, accountType} =  depositSummary || {};

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
	const isLoading = isLoadingDeposit || isLoadingStorage;

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
						<View style={styles.formContainer}>
							<DepositForm error={formError} onError={setFormError} onSubmit={onSubmit}/>
					   </View>
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
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();

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
