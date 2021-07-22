import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import get from 'lodash/get';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName';
import ShowJson from '../../components/showJson';

import { useNavigation } from '@react-navigation/native';

import { useOrderDetail } from '../../helper';

const OrderStatus = (props) => {
	const {order, goBack} = get(props, 'route.params', {});

	//Get Order Id and refetch the order (in case the status has changed)
	const {id} = order;
	const orderDetail = useOrderDetail(id)
	const navigation = useNavigation();

	return (
		<AppView title="Order Status Screen" goBack={goBack || true}>
			{orderDetail && <ShowJson json={orderDetail} />}
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default OrderStatus;