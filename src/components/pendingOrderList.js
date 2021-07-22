import React, {useState} from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import ShowJson from './showJson';
import { useOrders } from '../helper';

const PendingOrdersList = ({symbol, status, goBack}) => {

	const [isError, pendingOrders] = useOrders({symbol, status});
	
	console.log("pendingOrders");
	console.log(pendingOrders);

	const navigation = useNavigation();

	const toOrderDetail = (orderId) => {
		console.log("To Order Detail");
		navigation.navigate('OrderDetail', {orderId, goBack});
	} 

	return (
		<ScrollView>
		{pendingOrders && pendingOrders.map((order, index) => {
			return (
				<Pressable style={{marginBottom: 50}} key={index} onPressOut={() => toOrderDetail(order.id)}> 
					<ShowJson json={order} full={false}/>
				</Pressable> );
			})
		}
		</ScrollView>
	);
}

const styles = StyleSheet.create({

});

export default PendingOrdersList;