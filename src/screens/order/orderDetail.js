import React, {useState} from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import get from 'lodash/get';
import { useNavigation, StackActions } from '@react-navigation/native'; 

import { useCancelOrder, useOrderDetail } from '../../helper';
import { useTheme, StyledText, Typography, WP, HP, Colors, getPnLColor }  from '../../theme';

import {AppView, ShowJson} from '../../components/common';

const SingleButton = ({title, onClick, ...props}) => {
	return (
		<Pressable style={[styles.button, props.buttonStyle]} onPressOut={onClick}>
			<StyledText style={[styles.buttonText, props.buttonTextStyle]}>{title}</StyledText>
		</Pressable>
	);
}
	

const OrderButtons = ({order}) => {

	const [isError, mutate] = useCancelOrder();
	const navigation = useNavigation();

	const goBack = () => navigation.dispatch(StackActions.pop(2)); //Go Back two screens

	const onCancelOrder = (order) => {
		mutate(order.id, {
			onSuccess: (response, input) => {
				console.log("Cancel Successful")
				console.log(response); 
				navigation.navigate('OrderStatus', 
					{
						goBack,
						order: {id: order.id}
					})},
			onError: (error, input) => console.log(error)
		})
	}	
	
	const onUpdateOrder = (order) => navigation.navigate('UpdateOrder', {order, goBack});

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

	const canceledStatus = ['pending_cancel', 'canceled']
	return (
		<AppView title="Order Detail Screen" goBack={goBack || true} footer={order && !canceledStatus.includes(order.status) && <OrderButtons {...{order}} />} >
			{order && <ShowJson json={order} />}
		</AppView>
	);
}

const styles = StyleSheet.create({
	buttonContainer: {
	    width: '100%',
	    flexDirection:'row',
	    justifyContent:'space-between',
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