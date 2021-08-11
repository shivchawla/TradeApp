import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {AppView, ConfirmButton} from '../../components/common';

const Identity = (props) => {

	const {navigation} = props;

	const toNextScreen = () => {
		navigation.navigate('Disclosure');
	}

	return (
		<AppView title="Add Identity Info" goBack={false}>
			<ConfirmButton title="Next" onClick={toNextScreen}/>
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Identity;