import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {LineChart, RangeSelector} from '../common';

import { useTheme, useDimensions, useTypography, StyledText} from '../../theme';

import {NDaysAgoISODate, NWeeksAgoISODate, yearStartISODate,
	NMonthsAgoISODate, NYearsAgoISODate, 
	currentISODate, toISODate, durationBetweenDates, getRoundedCurrentTime} from '../../utils'

import {useStockHistoricalData, useStockIntradayData, 
	useCalendar, isMarketOpen, getLatestTradingDay, useStockEODData } from '../../helper';

//Special function to filter 5 day 30Min Bars 
//Because some bars lie outside the RTH (that needs to be filtered out)
const filterTradingBars = (bars, calendar) => {

	// console.log("Calendar");
	// console.log(calendar);

	// console.log("Bars");
	// console.log(bars);

	var tradingBars = calendar.map(day => {
		var dayClose = toISODate(day.date + " " + day.close);
		var dayOpen = toISODate(day.date + " " + day.open);
		return bars.filter(bar => durationBetweenDates(bar.timestamp, dayClose) > 0 && durationBetweenDates(dayOpen, bar.timestamp) >= 0);
	})

	// console.log();
	// console.log();
	// console.log("*************");
	// console.log("*************");
	// console.log("Trading Bars")
	// console.log(tradingBars);

	return [].concat.apply([], tradingBars)

	// console.log("Final Bars")
	// console.log(fBars);

	// return fBars;

}

const StockChartIntraday = ({symbol, ...props}) => {
	
	const [query, setQuery] = useState({});
	const [intradayBars, setBars] = useState([])

	const {getIntradayBars} = useStockIntradayData(symbol, query, {enabled: false});
	const {snapshot} = useStockEODData(symbol);

	React.useEffect(() => {
		const manageBars = async() => {
			const marketOpen = await isMarketOpen();
			const latestTradingDay = await getLatestTradingDay();
			const end = toISODate(latestTradingDay.date + " " + latestTradingDay.close);
			const start = toISODate(latestTradingDay.date + " " + latestTradingDay.open);

			if (marketOpen) {
				const duration = durationBetweenDates( currentISODate() , end, 'hours');

				console.log(latestTradingDay);
				console.log(end);
				console.log("Duration: ", duration);

				//Now we know ho wmany milliseconds are left;
				// 5.5
				if (duration > 0 && duration > 4) {
					setQuery({start, end: getRoundedCurrentTime('1Min'), timeframe: '1Min'})
				} else if (duration > 0 && duration > 2) {
					// console.log("Get Rounded Current Time")
					// console.log(getRoundedCurrentTime('2Min'))
					setQuery({start, end : getRoundedCurrentTime('2Min'), timeframe: '2Min'})
				} else if( duration > 0) {
					setQuery({start, end: getRoundedCurrentTime('5Min'), timeframe: '5Min'})
				}

			} else {
				setQuery({start, end, timeframe: '5Min'})	
			}
		}

		manageBars();
	}, []);

	React.useEffect(() => {

		// console.log("Running timeframe changed Effect - Intraday");

		const fwdFill = (bars, ct) => {
			var fmtBars = (bars || []).map(item => item.closePrice);

			if (ct > 0) {
				return fmtBars.concat(new Array(ct).fill(null))
			} else {
				return fmtBars;
			}
		}

		if (query?.timeframe) {
			getIntradayBars().then(bars => {
				// console.log(bars);

				const fBars = bars ?? [];

				var len = fBars.length;

				switch(query?.timeframe) {
					case '1Min':
					setBars(fwdFill(fBars, 6.5*60 - len));
					break;

					case '2Min':	
					setBars(fwdFill(fBars, 6.5*30 - len));
					break;

					case '5Min':	
					setBars(fwdFill(fBars, 6.5*12 - len));
					break;

					case '10Min':	
					setBars(fwdFill(fBars, 6.5*6 - len));
					break;

					case '15Min':	
					setBars(fwdFill(fBars, 6.5*4 - len));
					break;
				}
			});
		}

	}, [query])

	return (
		<LineChart base={snapshot?.prevDailyBar?.closePrice} data={intradayBars} {...props} />	
	)
}


const StockChartDaily = ({symbol, timeRange, ...props}) => {
	const [query, setQuery] = useState(null);
	const [dailyBars, setBars] = useState([])

	//Needs modification - NO MODIFICATION IS NEEDED FOR 1
	//1. If market is open, **END** is end of last trading day and not current trading date;
	//2. Also in case of YTD, timeframe can vary depending on duration from start of the year
	
	React.useEffect(() => {
		const ytdQuery = async() => {
			if (timeRange == 'YTD') {
				const latestTradingDay = await getLatestTradingDay();
				const start = toISODate(latestTradingDay.date + " " + latestTradingDay.open);
				const yStart = yearStartISODate();

				const current = currentISODate();

				// console.log("Setting Up YTD Query");

				const durationMonths = durationBetweenDates( yStart, current, 'months');
				// console.log("durationMonths: ", durationMonths);

				if (durationMonths > 9) {
					return {start: yStart, timeframe: '5Day'};
				}

				// const durationWeeks = durationBetweenDates( yStart, current, 'weeks');
				const durationDays = durationBetweenDates( yStart, current,  'days');
				// console.log("durationDays: ", durationDays);

				if (durationDays > 7) {
					return {start: yStart, timeframe: '1Day'};
				}

				const durationHours = durationBetweenDates( yStart, current, 'hours');
			
				// console.log("durationHours: ", durationHours);
				// console.log("durationWeeks: ", durationWeeks);
				
				if (durationHours < 2) {
					return {start: yStart, end: getRoundedCurrentTime('1Min'), timeframe: '1Min'};
				} else if (durationHours < 4) {
					return {start: yStart, end: getRoundedCurrentTime('2Min'), timeframe: '2Min'};
				} else if (durationHours < 24) {
					return {start: yStart, end: getRoundedCurrentTime('5Min'), timeframe: '5Min'};
				} else {
					return {start: yStart, end: getRoundedCurrentTime('30Min'), timeframe: '30Min'};
				} 
			}

		}

		const manageQuery = async() => {
			// console.log("Manage Query: ", timeRange);

			switch(timeRange) {
				case '5D':
					setQuery({start: NDaysAgoISODate(8), timeframe: '30Min'}); 
					break;
				case '1M':
					setQuery({start: NMonthsAgoISODate(1), timeframe: '1Day'}); 
					break;
				case '3M': 
					setQuery({start: NMonthsAgoISODate(3), timeframe: '1Day'});
					break;
				case 'YTD':
					setQuery(await ytdQuery()); //default
					break;
				case '1Y': 
					setQuery({start: NYearsAgoISODate(1), timeframe: '5Day'}); 
					break
				case '5Y':
					setQuery({start: NYearsAgoISODate(5), timeframe: '30Day'});
					break;  
			}
		}

		manageQuery();
	}, [timeRange])

	const {getBars} = useStockHistoricalData(symbol, query || {}, {enabled: false});

	//Calendar is just used of 5D timeRange
	const {getCalendar} = useCalendar(query || {}, {enabled: false});

	React.useEffect(() => {
		const manageBars = async() => {
			if (query) {
				var bars = await getBars();
				if (timeRange == '5D' || query?.timeframe == '30Min') {
					const calendar = await getCalendar();
					bars = (filterTradingBars(bars, calendar) || [])

					if (timeRange == '5D') {
						//13*5 because There are 13 - 30Min intervals in RTH (and 5 days)
						bars = bars.slice(-5*13);
					}

				}
		
				setBars((bars || []).map(item => item.closePrice));
			}
		}

		manageBars();
	}, [query]);

	// console.log("Final Query");
	// console.log(query);

	return (
		<LineChart data={dailyBars} {...props}/>		
	)
}

export const StockChart = ({type, hasSelector = false, ...props}) => {

	const items = ['1D', '5D', '1M', '3M', 'YTD', '1Y', '5Y'];
	const [selectedIndex, setIndex] = useState(4);
	
	const onRangeSelect = (v) => {
		// console.log("*****************************************")
		// console.log("*****************************************")
		// console.log("On Range Select");
		// console.log(v);
		setIndex(v);
	}

	return (
		<>
	 	{
		 	type == "intraday" || items[selectedIndex] == '1D' ? 
		 		<StockChartIntraday {...props} />
		 	:	
		 		<StockChartDaily {...props} timeRange={items[selectedIndex]} />
 		}
 		{hasSelector && <RangeSelector {...{items, selectedIndex}} onSelect={onRangeSelect}/>}
		</>
	);
}


const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();


	const styles = StyleSheet.create({
		rangeSelector: {
			// borderTopWidth: 1,
			// borderColor: theme.grey9,
			flexDirection: 'row',
			width: '100%',
			justifyContent: 'space-between',
			paddingLeft: WP(5),
			paddingRight: WP(5),
			marginTop: HP(4)
		},
		selectedRange: {
			borderWidth:1,
			borderColor: theme.green,
			paddingLeft: WP(2),
			paddingRight: WP(2)
		},
		rangeText: {
			color: theme.green
		}
	});

	return {theme, styles};

}
