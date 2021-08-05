import React, {useState} from 'react';
import { useQuery } from 'react-query';
import { getClock } from './api';
import { getCalendar } from './api';
import { currentISODate, NDaysAgoISODate, dayStartISODate, latestDayStartFromCalendar } from '../utils';
import { getStorageData } from './store';


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

export function useLatestTradingDay() {
	const [latestTradingDay, setLatestTradingDay] = useState(null);
	const { getClock} = useClock({enabled: false});
	const { getCalendar } = useCalendar(null, {enabled: false});

	React.useEffect(() => {
		const fetchTradingDate = async() => {
			const td = await getStorageData('latestTradingDay')
			if(!!td?.datetime && !!td?.lastUpdated) {

				const lastUpdated = td?.lastUpdated;

				//Check last updated time 
				//What shoudl be the condition
				setLatestTradingDay(td.datetime);

			} else {
				const calendar = await getCalendar();
				const clock = await getClock();

				const latest = clock.is_open ? dayStartISODate() : latestDayStartFromCalendar(calendar, clock);
				console.log("latestTradingDay");
				console.log(latest);
				await setStorageData('latestTradingDay', JSON.stringify({datetime: latest, lastUpdated: clock.timestamp});
				
				setLatestTradingDay(latest);
			}
		}
	}, []);

	return latestTradingDay;
}
