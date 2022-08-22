import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { AppView, ConfirmButton } from '../../components/common';

const NoInternet = () => {
	return (
		<AppView title="NO INTERNET" goBack={false}>
		</AppView>
	)
}

export default NoInternet