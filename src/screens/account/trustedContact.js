import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {AppView, ConfirmButton} from '../../components/common';

import { useCreateBrokerageAccount, addUserDb, updateAlpacaAccount } from '../../helper';

import {accountParams} from '../../config'; //TEMP CODE

const TrustedContact = (props) => {

	const {navigation} = props;

	const [isError, mutate] = useCreateBrokerageAccount();

	const sendApplication = () => {
		mutate(accountParams, {
			onSuccess: (response, input) => handleAccountCreation(input.contact.email_address, response), 
			onError: (error, input) => handleError(error, input)
		});
	}

	const handleError = (error, input) => {
		console.log(error);
	}

	const handleAccountCreation = async(email, account) => {
		try {
			const output = [await addUserDb(email, account), await updateAlpacaAccount(account)];
		} catch(err){
			console.log(err);
		}
	}

	return (
		<AppView title="Add Trusted Contact" goBack={false}>
			<ConfirmButton title="Send" onClick={sendApplication}/>
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default TrustedContact;