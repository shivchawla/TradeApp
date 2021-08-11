import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {AppView, ConfirmButton} from '../../components/common';

const Disclosure = (props) => {

	const {navigation} = props;

	const toNextScreen = () => {
		navigation.navigate('Agreement');
	}

	return (
		<AppView title="Share Disclosures" goBack={false}>
			<ConfirmButton title="Next" onClick={toNextScreen}/>
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Disclosure;