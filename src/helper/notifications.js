import React, {useState} from 'react';
import { addNotification as add, deleteNotifications as del, 
	markReadNotifications as markRead, getNotifications } from './store';

export const useNotifications = () => {
	const [notifications, setNotifications] = useState([]);

	React.useEffect(() => {
		(async() => {
			setNotifications(await getNotifications());
		})()
	}, []);

	const markReadNotifications = async(messages) => {
		await markRead(messages)		    
    	setNotifications(await getNotifications());
	}

	const deleteNotifications = async(messages) => {
	   await del(messages);
	   setNotifications(await getNotifications());
	}
	
	return {notifications, markReadNotifications, deleteNotifications, getNotifications};
}

