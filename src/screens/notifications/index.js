import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useNotifications} from '../../helper'
import { AppView, ShowJson, TouchRadio } from '../../components/common';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme' 
import { toTimeZoneDate, dayStartISODate } from '../../utils'

const NotificationContext = React.createContext(null);

// const NotificationProvider = ({children}) => {
// 	const [selectedNotifications, setSelectedNotifications] = useState([]);

// 	const [selectionMode, setSelectionMode] = useState(false)

// 	/**WHY THE CHILD RENDER IS SLOW
// 	 * As this function gets modified with every selection, all child notification items get re-rendered
// 	 **/
// 	const onNotificationSelected = React.useCallback((notification, selected) => {
// 		if(selected) {
// 			setSelectionMode(true);
// 		}

// 		 IMPORTANT CHANGE: Use function state updates to get previous values
// 		 * this in conjucntion with usecallback will offer updated but memoized function for children
		
// 		if (selected) {
// 			setSelectedNotifications((x) => [...x, notification.messageId])
// 		} else {
// 			setSelectedNotifications((x) => x.filter(msgId => msgId != notification.messageId ))
// 		}

// 	}, [])

// 	return (
// 		<NotificationContext.Provider value={{selectionMode, onNotificationSelected}}>
// 			{children}
// 		</NotificationContext.Provider>
// 	)
// } 


const OtherNotification = ({notification}) => {
	// console.log("Render OTHER Notification");
	return null;
		// <Text>{JSON.stringify(notification)}</Text>
	// )
}

const TradeNotification = React.memo(({notification, showRadio, onNotificationSelected}) => {

	// console.log("Render Trade notification");

	// const {onNotificationSelected, selectionMode: showRadio} = React.useContext(NotificationContext);
	const [selected, setSelected] = useState(false);
	const {read = false} = notification;
	const {styles} = useStyles();

	React.useEffect(() => {
		// console.log("onRadioSelected: ", selected)
		onNotificationSelected(notification, selected);
	}, [selected])


	// React.useEffect(() => {
	// 	console.log("onNotificationSelected Changed");
	// }, [onNotificationSelected])

	const onLongPress = () => {
		if (!showRadio) {
			setSelected(true)
		}
	}

	const onSelectRadio = () => {
		setSelected(!selected);
	}

	// console.log("Render TRADE Notification");
	const message = JSON.parse(notification?.data?.message ?? "");
	// console.log(message);

	const {event = ""} = message;

	// if (event == "new" || event == "") {
	// 	return <></>;
	// }

	const {symbol, price, status, order_type, filled_avg_price, filled_qty, filled_at, canceled_at, updated_at, failed_at} = message?.order; 

	const orderType = order_type == "limit" ? "LMT" : "MKT";
	const orderString = `${orderType} Order for ${symbol}`;

	let timeString = '';
	if (status == "filled") {
		// console.log(filled_at);
		timeString = toTimeZoneDate(filled_at, "D MMM YYYY hh:mm:ss A");
		// console.log("Time String: ", timeString);
	} else if (status == "canceled") {
		timeString = toTimeZoneDate(canceled_at, "D MMM YYYY hh:mm:ss A");
		// console.log(timeString);
	} else if (status == "updated") {
		timeString = toTimeZoneDate(updated_at, "D MMM YYYY hh:mm:ss A");
	} else if (status == "failed") {
		timeString = toTimeZoneDate(failed_at, "D MMM YYYY hh:mm:ss A");
	}

	return (
		<TouchableOpacity style={styles.notificationContainer} onLongPress={onLongPress}>
			<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

				<View style={{marginLeft: 10}}>
					<View style={styles.notificationTagContainer}>
						<StyledText style={styles.notificationTag}>{status.toUpperCase()}</StyledText>
					</View>
					<StyledText style={styles.notificationTitle}>{orderString}</StyledText>
					<StyledText style={styles.notificationTime}>{timeString}</StyledText>
				</View>

				{showRadio && <TouchRadio {...{selected}} onToggle={onSelectRadio} style={{marginRight: 20}}/>} 

			</View>

			{!read && <View style={styles.unreadCircle}></View>}

		</TouchableOpacity>
	)
})

const AccountNotification = ({notification}) => {
	console.log("Render ACCOUNT Notification");
	return null;
		// <Text>{JSON.stringify(notification)}</Text>
	// )
}

const TransferNotification = ({notification}) => {
	console.log("Render TRANSFER Notification");
	return null
		// <Text>{JSON.stringify(notification)}</Text>
	// )
}

const JournalNotification = ({notification}) => {
	console.log("Render JOURNAL Notification");
	return 	null;
		// <Text>{JSON.stringify(notification)}</Text>
}

const Notification = (props) => {
	const navigation = useNavigation();
	const {notification} = props;
	const {type} = notification?.data;

	// console.log("Render Notification")
	const showDetail = () => navigation.navigate('NotificationDetail', {notification});

	let NotificationElem = OtherNotification;
	if (type == "TRADE") {
		NotificationElem = TradeNotification;
	} else if (type == "ACCOUNT") {
		NotificationElem = AccountNotification;
	} else if (type == "TRANSFER") {
		NotificationElem = TransferNotification;
	} else if (type == "JOURNAL") {
		NotificationElem = JournalNotification;
	}

	return (
		<NotificationElem {...props} />
	)
}


const Notifications = (props) => {

	const {isLoading, notifications: allNotifications, deleteNotifications, markReadNotifications, getNotifications } = useNotifications({enabled: false});
	const [selectedNotifications, setSelectedNotifications] = useState([]);
	const [selectionMode, setSelectionMode] = useState(false)

	const [notifications, setNotifications] = useState([]);

	const loadMoreNotifications = () => {
		setNotifications((nfs) => allNotifications.slice(0, nfs.length + 10));
	}

	React.useEffect(() => {
		if(allNotifications && allNotifications.length > 0) {
			setNotifications(allNotifications.slice(0, 10));
		}
	}, [allNotifications])

	/**WHY THE CHILD RENDER IS SLOW
	 * As this function gets modified with every selection, all child notification items get re-rendered
	 **/
	const onNotificationSelected = React.useCallback((notification, selected) => {
		if(selected) {
			setSelectionMode(true);
		}

		/*IMPORTANT CHANGE: Use function state updates to get previous values
		 * this in conjucntion with usecallback will offer updated but memoized function for children
		*/
		if (selected) {
			setSelectedNotifications((x) => [...x, notification.messageId])
		} else {
			setSelectedNotifications((x) => x.filter(msgId => msgId != notification.messageId ))
		}

	}, [])

	const renderNotification = ({item: notification}) => {
		return (
			<Notification {...{notification, onNotificationSelected}} showRadio={selectionMode}/>
		)
	}


	useFocusEffect(
		React.useCallback(() => {
			(async() => {
				getNotifications()
			})()
		}, [])
	)

	// console.log("Render Notifications")

	
	// console.log("Notifications Loaded: ", isLoading);
	// console.log(notifications.map(it => it.messageId));

	// console.log(allNotifications.length)

	return (
		<AppView 
			title="Notifications Screen"
			{...{isLoading}} 
			list={true} 
			data={notifications}
			renderItem={renderNotification}
			keyExtractor={item => item.messageId}
			onEndReached={loadMoreNotifications}
		/>	
	);
}

// const Notifications = () => {
// 	return (
// 		<NotificationProvider>
// 			<NotificationsList />
// 		</NotificationProvider>
// 	)
// }

const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP} = useDimensions();
    const {fontSize, fontWeight} = useTypography();

  	const styles = StyleSheet.create({
	    notificationContainer: {
	    	// height: HP(15),
	    	borderBottomWidth: 1,
	    	borderBottomColor: theme.grey9,
	    	justifyContent: 'center',
	    	paddingBottom: HP(1),
	    	marginBottom: HP(1)
	    },
	    notificationTagContainer: {
	    	borderWidth: 1,
	    	backgroundColor: theme.grey9,
	    	alignSelf: 'flex-start',
	    	padding: WP(1)
	    },
	    notificationTag: {
	    	color: theme.grey2,
	    	fontSize: WP(3)
	    },
	    notificationTitle: {
	    	fontSize: WP(4)
	    },

    	notificationTime: {
    		fontSize: WP(3.5),
    		color: theme.grey4
	    },
	    unreadCircle: {
	    	height: WP(1),
	    	width: WP(1),
	    	borderRadius: WP(0.5)
	    }
    });

    return { theme, styles };
}

export default Notifications;