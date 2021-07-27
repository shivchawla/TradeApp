import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';

import ConfirmButton from '../../components/confirmButton';


const Contact = (props) => {

	const {navigation} = props;

	const toNextScreen = () => {
		navigation.navigate('Identity');
	}
	return (
		<AppView title="Add Contact Info" goBack={false}>
			<ConfirmButton title="Next" onClick={toNextScreen}/>
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Contact;