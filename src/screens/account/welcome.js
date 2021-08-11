import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { AppView, ConfirmButton} from '../../components/common';

const Welcome = (props) => {

	const {navigation} = props;

	const toNextScreen = () => {
		navigation.navigate('Contact');
	}
	return (
		<AppView title="Welcome" goBack={false}>
			<ConfirmButton title="Next" onClick={toNextScreen}/>
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Welcome;