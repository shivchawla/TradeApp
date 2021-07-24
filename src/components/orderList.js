import React, {useState} from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import ShowJson from './showJson';
import { useOrders } from '../helper';

//What's the differene between TradeHistory and this component
//Also, do we need the goBack here?

const OrdersList = ({symbol, status, goBack}) => {

	const [isError, orders, refetch] = useOrders({symbol, status});
	
	const navigation = useNavigation();

	React.useEffect(() => {
		const refetchOnFocus = navigation.addListener('focus', () => {
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

	const toTradeDetail = (order) => {
		console.log("To Trade Detail");
		navigation.navigate('TradeDetail', {order, goBack});	
	}

	const toDetailScreen = (order, status) => {
		return status == "closed" ? toTradeDetail(order) : toOrderDetail(order.id);
	}

	return (
		<ScrollView>
			{orders && orders.map((order, index) => {
				return (
					<Pressable style={{marginBottom: 50}} key={index} onPressOut={() => toDetailScreen(order, status)}> 
						<ShowJson json={order} full={false}/>
					</Pressable> );
				})
			}
		</ScrollView>
	);
}

const styles = StyleSheet.create({

});

export default OrdersList;