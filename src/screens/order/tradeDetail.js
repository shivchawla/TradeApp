import React, {useState} from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import get from 'lodash/get';
import { useNavigation, StackActions } from '@react-navigation/native'; 

import AppView from '../../components/appView';
import ShowJson from '../../components/showJson'

const TradeDetail = (props) => {

	const {order, goBack} = get(props, 'route.params', {});
	const filledStatus = ['partially_filled', 'filled'];

	return (
		<AppView title="Trade Detail Screen" goBack={goBack || true} >
			{order && <ShowJson json={order} />}
		</AppView>
	);
}



export default TradeDetail;