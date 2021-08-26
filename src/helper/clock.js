import React, {useState} from 'react';
import { useQuery } from 'react-query';
import { getClock } from './api';
import { getCalendar } from './api';
import { currentISODate, NDaysAgoISODate, NDaysAfterISODate, 
	dayStartISODate, latestDayStartFromCalendar, durationBetweenDates, 
	duration, toTimeZoneDate, toISODate, currentTimeZoneDate } from '../utils';
import { setStorageData, getStorageData } from './store';


export function useClock(params={}) {
	const {isError, data: clock, refetch} = useQuery('clock', getClock, {refetchOnMount: false, ...params});
	return {clock, getClock: () => refetch().then(r => r.data)}; 

	// {is_open: data?.is_open, next_open: data?.next_open, next_close: data?.next_close};
}

export function useCalendar({start = NDaysAgoISODate(5, "YYYY-MM-DD"), end = currentISODate("YYYY-MM-DD")} = {}, params={}) {
	// console.log("Use Calendar");
	// console.log(start);
	// console.log(end);

	const query = {...start && {start}, ...end && {end}};
	// console.log(query);
	const {isError, data: calendar, refetch} = useQuery(['calendar', query], () => getCalendar(query), {refetchOnMount: false, ...params});
	return {calendar, getCalendar: () => refetch().then(r => r.data)}; 
}

// export function useLatestTradingDay() {
// 	const [latestTradingDay, setLatestTradingDay] = useState(null);
// 	const { getClock} = useClock({enabled: false});
// 	const { getCalendar } = useCalendar({}, {enabled: false});

// 	React.useEffect(() => {

// 		const updateTradingDate = async () => {
// 			const calendar = await getCalendar();
// 			const clock = await getClock();

// 			const latest = clock.is_open ? dayStartISODate() : latestDayStartFromCalendar(calendar, clock);
// 			// console.log("setLatestTradingDay ", latest);
// 			await setStorageData('latestTradingDay', JSON.stringify({datetime: latest, lastUpdated: clock.timestamp}));
			
// 			setLatestTradingDay(latest);
// 		}

// 		const fetchTradingDate = async() => {
// 			const td = await getStorageData('latestTradingDay');
// 			if(!!td?.datetime && !!td?.lastUpdated) {

// 				const lastUpdated = td?.lastUpdated;
// 				// const wasOpen = td?.isOpen;
// 				// const clock = await getClock();

// 				// if (clock.is_open != td?.isOpen) {
// 				// 	updateTradingDate();
// 				// } else
// 				if(duration(lastUpdated, 'hours') > 6) {
// 					updateTradingDate();
// 				} else {
// 					//Check last updated time 
// 					//What shoudl be the condition
// 					// console.log("setLatestTradingDay ", td.datetime);
// 					setLatestTradingDay(td.datetime);	
// 				}

// 			} else {
// 				updateTradingDate();
// 			}
// 		}

// 		fetchTradingDate();
// 	}, []);

// 	return latestTradingDay;
// }


export function useLatestTradingDay() {
	const [latestDay, setLatestDay] = useState(null);

	React.useEffect(() => {
		const handleLogic = async() => {
				const isStale = await isCalendarStale();

				if(isStale) {
					await setupTradingDays();
				}
				
				const latestDay = await getLatestTradingDay();
				setLatestDay(toISODate(latestDay.date + " " + latestDay.open));
		}

		handleLogic();

	}, [])

	return latestDay;
}

//Used at app startup
export const setupTradingDays = async() => {

	const isStale = await isCalendarStale();

	if(!isStale) {
		return;
	}

	const calendar = await getCalendar({after: NDaysAgoISODate(5, "YYYY-MM-DD"), before:NDaysAfterISODate(5, "YYYY-MM-DD")});
    const currentDate = currentTimeZoneDate();

    //NOW in calendar, find FIRST MARKET OPEN after currentDate
    var idx = calendar.findIndex(item => {
      const dayOpen = toTimeZoneDate(item.date + " " + item.open);
      return durationBetweenDates(currentDate, dayOpen) > 0;
    })
    
    //Once found, update in local storage
    if (idx != -1) {
      nextTradingDay = calendar[idx];
      await setStorageData("nextTradingDay", JSON.stringify(nextTradingDay));
    }          

    if (idx > 0) {
      lastTradingDay = calendar[idx - 1];
      await setStorageData("latestTradingDay", JSON.stringify(lastTradingDay));
    }
}


export const isCalendarStale = async() => {
	var nextTradingDay = await getStorageData("nextTradingDay");
	var latestTradingDay = await getStorageData("latestTradingDay");

	console.log("isCalendarStale");
	console.log(nextTradingDay);
	console.log(latestTradingDay);

	if(!nextTradingDay) {
		console.log("YES ITS STALE");
		return true;
	}

  const currentDate = await currentTimeZoneDate();

	//NOW check is current datetime is after nextTradingDay Open
	const dayOpen = toTimeZoneDate(nextTradingDay.date + " " + nextTradingDay.open);
	var cond = durationBetweenDates(dayOpen, currentDate) > 0;

	if (cond) {
		console.log("YES ITS STALE");
	}

	return cond
}

export const getLatestTradingDay = async(refresh = false) => {
	var latestTradingDay = await getStorageData("latestTradingDay");

	if (!latestTradingDay || refresh) {
		await setupTradingDays()
	  	latestTradingDay = await getStorageData("latestTradingDay");
  	}

	return latestTradingDay;
}


export const getNextTradingDay = async(refresh = false) => {

	var nextTradingDay = await getStorageData("nextTradingDay");

	if (!nextTradingDay || refresh) {
		await setupTradingDays();
		nextTradingDay = await getStorageData("nextTradingDay");
	}

	return nextTradingDay;
}


export const isMarketOpen = async() => {
	var latestTradingDay = await getLatestTradingDay();

	//Just the day (wihtout time) 
	const day = toTimeZoneDate(latestTradingDay.date);
	var currentDate = currentTimeZoneDate("YYYY-MM-DD");

	console.log("IS MARKET OPEN");
	console.log(day);
	console.log(currentDate);

	if (durationBetweenDates(day, currentDate) > 0) {
		//STALE...SO FORCE REFRESH
		latestTradingDay = await getLatestTradingDay(true);
	}

	const dayOpen = toTimeZoneDate(latestTradingDay.date + " " + latestTradingDay.open);
	const dayClose = toTimeZoneDate(latestTradingDay.date + " " + latestTradingDay.close);
	
	currentDate = currentTimeZoneDate();
	var cond = durationBetweenDates(dayOpen, currentDate) > 0 && durationBetweenDates(currentDate, dayClose) > 0;

	if (cond) {
		console.log("YES ITS OPEN");
	} else {
		console.log("ITS CLOSED");
	}

	return cond;

}

