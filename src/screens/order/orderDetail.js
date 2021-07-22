import React, {useState} from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import get from 'lodash/get';
import { useNavigation, StackActions } from '@react-navigation/native'; 

import { useCancelOrder, useOrderDetail } from '../../helper';

import AppView from '../../components/appView';
import ShowJson from '../../components/showJson'

const SingleButton = ({title, onClick, ...props}) => {
	return (
		<Pressable style={[styles.button, props.buttonStyle]} onPressOut={onClick}>
			<Text style={[styles.buttonText, props.buttonTextStyle]}>{title}</Text>
		</Pressable>
	);
}
	

const OrderButtons = ({order, goBack}) => {

	const [isError, mutate] = useCancelOrder();
	const navigation = useNavigation();

	const onCancelOrder = (order) => {
		mutate(order.id, {
			onSuccess: (response, input) => {
				console.log("Cancel Successful")
				console.log(response); 
				navigation.navigate('OrderStatus', 
					{
						goBack: navigation.dispatch(StackActions.pop(2)), //Go Back two screens
						order: {id: order.id}
					})},
			onError: (error, input) => console.log(error)
		})
	}	
	
	const onUpdateOrder = (order) => navigation.navigate('UpdateOrder', {order});

	return (
		<View style={styles.buttonContainer}>
			<SingleButton title="CANCEL" onClick={() => onCancelOrder(order)} />
			<SingleButton title="UPDATE" onClick={() => onUpdateOrder(order)} />
		</View>
		)
}


const OrderDetail = (props) => {

	const {orderId, goBack} = get(props, 'route.params', {});
	const [isError, order] = useOrderDetail(orderId);

	return (
		<AppView title="Order Detail Screen" goBack={goBack || true} footer={order && order.status != 'canceled' && <OrderButtons {...{order, goBack}} />} >
			{order && <ShowJson json={order} />}
		</AppView>
	);
}

const styles = StyleSheet.create({
	buttonContainer: {
	    // position: 'absolute',
	    // bottom:20,
	    // width: '90%',
	    width: '100%',
	    flexDirection:'row',
	    justifyContent:'space-between',
	    // alignItems:'center'
	},
	button: {
	    backgroundColor:'#FE9901',
	    height: 35,
	    justifyContent:'center',
	    alignItems:'center',
	    width:'40%'
	  },
	buttonText: {
	    fontFamily: "roboto-700",
	    color: 'white',
	    fontSize: 16,
	    fontWeight:"700"
	},
});

export default OrderDetail;