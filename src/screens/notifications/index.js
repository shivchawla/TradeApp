import React, {useState} from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useNotifications} from '../../helper'

import { AppView, ShowJson } from '../../components/common';


const TradeNotification = ({notification}) => {

}

const Notification = ({notification}) => {
	const navigation = useNavigation();

	const {type} = notification;

	return (
		<TouchableOpacity onPress={() => navigation.navigate()}>
			{type == "TRADE" && <TradeNotification {...{notification}} />}		
		</TouchableOpacity>
	)

}

const Notifications = (props) => {

	const {notifications, deleteNotifications, markReadNotifications, getNotifications } = useNotifications();

	// useFocusEffect(
	// 	React.useCallback(() => {
	// 		(async() => {
	// 			getNotifications()
	// 	}, [])
	// )


	React.useEffect(() => {
		console.log("Notifications List Updated!!!")
	}, [notifications])

	return (
		<AppView title="Notifications Screen">
			{notifications && notifications.map((notification, index) => {
				return <Notification key={index} {...{notification}} />
			})}
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Notifications;