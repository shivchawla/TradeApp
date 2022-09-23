import React, {useState} from 'react';
import { addNotification as add, deleteNotifications as del, 
	markReadNotifications as markRead, getNotifications as get } from './store';
import {useLoading} from './extra';

export const useNotifications = ({enabled = true}) => {
	const [notifications, setNotifications] = useState([]);
	const {isLoading, loadingFunc} = useLoading(true);

	React.useEffect(() => {
		(async() => {
			if(enabled) {
				setNotifications(await loadingFunc(get))
			}
		})()
	}, []);

	// React.useEffect(() => {
	// 	console.log("useNotifications: notifications updated: ", (notifications ?? []).length);
	// }, [notifications])


	// React.useEffect(() => {
	// 	console.log("useNotifications: isLoading updated: ", isLoading);
	// }, [isLoading])

	const markReadNotifications = async(messages) => {
		setNotifications(await loadingFunc(async() => {
			await markRead(messages)		    
	    	return await get();
    	}))
	}

	const deleteNotifications = async(messages) => {
		setNotifications(await loadingFunc(async() => {
		   	await del(messages);
		    return await get();
	    }))
	}

	const getNotifications = async() => {
		// console.log("Fetching notifications");
		setNotifications(await loadingFunc(get))
	}
	
	// console.log("Is Notification Loading: ", isLoading);

	return {isLoading, notifications, markReadNotifications, deleteNotifications, getNotifications};
}

