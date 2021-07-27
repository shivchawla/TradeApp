import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import ConfirmButton from '../../components/confirmButton';

const Agreement = (props) => {

	const {navigation} = props;

	const toNextScreen = () => {
		navigation.navigate('Document');
	}

	return (
		<AppView title="Accept Agreement" goBack={false}>
			<ConfirmButton title="Next" onClick={toNextScreen}/>
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Agreement;