import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import 'react-native-get-random-values';
import { nanoid } from 'nanoid';

import NetInfo from "@react-native-community/netinfo";

import { AppView, ConfirmButton, TinyTextButton, IconTextButton, Checkbox } from '../../components/common';
import { WithdrawForm } from '../../components/funds';
import { SUPPORTED_BANKS, BANK_ACCOUNT_TYPES } from '../../config'
import { useTheme, StyledText, WP, HP }  from '../../theme';
import { currentISODate } from '../../utils';
import { useAuth, useLoading } from '../../helper'

//Add logic to save auth state to temp storage
const CreateWithdraw = (props) => {

	const {theme, styles} = useStyles();
	const [formError , setFormError] = useState(null);
	const {navigation} = props;
		
	const [withdrawSummary, setWithdrawSummary] = useState(null);
	const [agree, setAgree] = useState(null);
	const [withdrawError, setWithdrawError] = useState(null);

	const {currentUser, userAccount} = useAuth();
	const {isLoading, loadingFunc} = useLoading();

	const onSubmit = async (values) => {
    	setWithdrawSummary({
    		...values, 
    		bankName: SUPPORTED_BANKS.find(item => item.key == values['bankName']).title,
    		accountType: BANK_ACCOUNT_TYPES.find(item => item.key == values['accountType']).title,
			finalAmount: `${values['currency']} ${values['amount']}`
		});
	}

	const submitWithdraw = async() => {

		if (!currentUser ) {
			throw Error("User doesn't exist");
		}

		if (!userAccount) {
			throw Error("User Account doesn't exist");
		}

		const netState = await NetInfo.fetch();

		if (!netState || !netState.isConnected) {
			throw Error('Internet not connected');
		}

		console.log("Email: ", currentUser?.email);
		console.log("Account: ", userAccount?.account?.id);

		const withdrawId = nanoid(10);
		//Once file uploaded
		await firestore().collection('Withdraws')
		.add({
			withdraw: withdrawSummary,
			withdrawId,
			user: currentUser?.email, //Add user Account instead
			account: userAccount?.account?.id, //Alpaca Account instead
			date: currentISODate(),
			ipAddress: netState.details.ipAddress,
			status: 'Pending'
		})

		return withdrawId;
	}

	const onCompleteWithdraw = async() => {
		try{
			const withdrawId = await loadingFunc(async() => await submitWithdraw());
			console.log('Withdraw Created');
			setWithdrawSummary({...withdrawSummary, withdrawId, complete: true});
		} catch (err) {
			setWithdrawError(err.message);
		}
	} 

	const {currency, amount, bankName, accountType} =  withdrawSummary || {};

	const Form = () => {
		return (
			<View style={styles.formContainer}>
				<WithdrawForm error={formError} onError={setFormError} onSubmit={onSubmit}/>
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
				<StyledText style={styles.summaryTitle}>SUMMARY</StyledText>
				<LabelValue label="You have submitted to request to withdraw" value={`${currency} ${amount}`} />
				<LabelValue label="Account Number:" value={`${withdrawSummary.accountNumber}`} />
				<LabelValue label="Selected Bank:" value={`${withdrawSummary.bankName}`} />
				<LabelValue label="Account Type:" value={`${withdrawSummary.accountType}`} />
				
				{withdrawSummary?.withdrawId && <LabelValue label="Withdraw Reference Id:" value={`${withdrawSummary.withdrawId}`} />}
				{withdrawSummary?.complete && <LabelValue label="Status:" value="Processing" />}
			</View>

			{edit && <View style={{alignItems: 'flex-end'}} >
				<TinyTextButton onPress={() => setWithdrawSummary(null)} title="Edit" />
			</View>}	
			</>
		)
	}

	const Finalizar = () => {
		return (
	  		<View style={styles.finalizeContainer}>
				<TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgree(!agree)}>
					<Checkbox
				    value={agree}
				    onToggle={setAgree}
				  />
				  <StyledText style={styles.agreeText}>I have made the deposit and uploaded the right document</StyledText>
				</TouchableOpacity>  
				 
				<ConfirmButton
					buttonContainerStyle={{position: 'absolute', bottom: 20}} 
					buttonStyle={{width: '90%'}} title="SUBMIT WITHDRAW REQUEST" 
					disabled={!agree} 
					onClick={onCompleteWithdraw} 
				/>
			</View>
		)
	}

	const title = withdrawSummary?.complete ? "WITHDRAW REQUEST CREATED" : withdrawError ? "ERROR" : withdrawSummary ? "WITHDRAW SUMMARY" : "CREATE WITHDRAW"
	
	return (
		<AppView 
			{...{title, isLoading}}  
			scrollViewStyle={{flexGrow:1}} 
			goBack={() => withdrawSummary?.complete || withdrawError ? navigation.navigate('Settings') : navigation.goBack()}
		>
			{withdrawError ? 
				<StyledText>{withdrawError}</StyledText>
				:
				!withdrawSummary?.complete ? 
					
					!withdrawSummary ? 
						<Form />
					:
					<>
						<Summary />
    					<Finalizar />
					</>
				: 
				<View>
					<View style={styles.successTextContainer}>
						<StyledText style={styles.successText}>We have received a withdraw request! We will send a notificaition with 1-3 days once it's completed. Thanks!</StyledText>
					</View>
					<Summary edit={false}/>
				</View>	
			}
	   </AppView>
	);
}

export default CreateWithdraw;

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
			padding: WP(3),
		},
		summaryLabelValue: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: WP(2),
			alignItems: 'center',
		},
		summaryLabel: {
			fontSize: WP(4),
			marginTop: WP(2),
			color: theme.grey4,
			maxWidth: '80%' 
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
		},
		successTextContainer: {
			marginTop: HP(5), 
			alignItems: 'center'
		},
		successText: {
			textAlign: 'center', 
			width: '80%', 
			fontSize: WP(4.5)
		}
	});

	return {theme, styles};
}
