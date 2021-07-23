import React, {useState} from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import ShowJson from './showJson';
import { useOrders } from '../helper';

const PendingOrdersList = ({symbol, status, goBack}) => {

	const [isError, pendingOrders, refetch] = useOrders({symbol, status});
	
	const navigation = useNavigation();

	React.useEffect(() => {
		const refetchOnFocus = navigation.addListener('focus', () => {
		console.log("Calling Refetch on Pending orders");
		    if (refetch) {
		      refetch();
		    }
		});

		return refetchOnFocus;
	}, [navigation]); // Run Effect only on changing Nav (to prevent re-renders)

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