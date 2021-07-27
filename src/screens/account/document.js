import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import ConfirmButton from '../../components/confirmButton';

const Document = (props) => {

	const {navigation} = props;

	const toNextScreen = () => {
		navigation.navigate('TrustedContact');
	}

	return (
		<AppView title="Upload Documents" goBack={false}>
			<ConfirmButton title="Next" onClick={toNextScreen}/>
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Document;