import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {LineChart} from '../common';

import * as Theme  from '../../theme';
const { useTheme, StyledText, WP, HP} = Theme;

import {NDaysAgoISODate, NWeeksAgoISODate, 
	NMonthsAgoISODate, NYearsAgoISODate, 
	currentISODate, toISODate, durationBetweenDates} from '../../utils'

import {useStockHistoricalData, useStockIntradayData, 
	useCalendar, isMarketOpen, getLatestTradingDay} from '../../helper';


//Special function to filter 5 day 30Min Bars 
//Because some bars lie outside the RTH (that needs to be filtered out)
const format5DayBars = (bars, calendar) => {

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

	//13*5 because There are 13 - 30Min intervals in RTH (and 5 days)
	var fBars = [].concat.apply([], tradingBars).slice(-5*13);

	// console.log("Final Bars")
	// console.log(fBars);

	return fBars;

}

const StockChartIntraday = ({symbol, ...props}) => {
	
	const [query, setQuery] = useState({});
	const [intradayBars, setBars] = useState([])

	const {getIntradayBars} = useStockIntradayData(symbol, query, {enabled: false});

	React.useEffect(() => {
		const manageBars = async() => {
			const marketOpen = await isMarketOpen();
			const latestTradingDay = await getLatestTradingDay();
			const end = toISODate(latestTradingDay.date + " " + latestTradingDay.close);
			const start = toISODate(latestTradingDay.date + " " + latestTradingDay.open);

			if (marketOpen) {
				const duration = durationBetweenDates( currentISODate(), end, 'hours');

				console.log(latestTradingDay);
				console.log(end);
				console.log("Duration: ", duration);

				//Now we know ho wmany milliseconds are left;
				// 5.5
				if (duration > 0 && duration > 4) {
					setQuery({start, end, timeframe: '1Min'})
				} else if (duration > 0 && duration > 2) {
					setQuery({start, end, timeframe: '2Min'})
				} else if( duration > 0) {
					setQuery({start, end, timeframe: '5Min'})
				}

			} else {
				setQuery({start, end, timeframe: '5Min'})	
			}
		}

		manageBars();
	}, []);

	React.useEffect(() => {

		console.log("Running timeframe changed Effect - Intraday");

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

				console.log(bars);

				var len = bars.length;

				switch(query?.timeframe) {
					case '1Min':
					setBars(fwdFill(bars, 6.5*60 - len));
					break;

					case '2Min':	
					setBars(fwdFill(bars, 6.5*30 - len));
					break;

					case '5Min':	
					setBars(fwdFill(bars, 6.5*12 - len));
					break;

					case '10Min':	
					setBars(fwdFill(bars, 6.5*6 - len));
					break;

					case '15Min':	
					setBars(fwdFill(bars, 6.5*4 - len));
					break;
				}
			});
		}

	}, [query])

	return (
		<LineChart values={intradayBars} {...props} />	
	)
}

const RangeSelector = ({onSelect}) => {
	const {theme, styles} = useStyles();

	const [selectedIndex, setIndex] = useState(4);
	
	const items = ['1D', '5D', '1M', '3M', 'YTD', '1Y', '5Y'];

	return (
		<View style={styles.rangeSelector}>
			{items.map((item, index) => {
				return (
					<TouchableOpacity style={{...index==selectedIndex && styles.selectedRange}} activeOpacity={1.0} onPress={() => {setIndex(index); onSelect(item)}}>
						<StyledText style={styles.rangeText}>{item}</StyledText>
					</TouchableOpacity>
				)
			})}
		</View>

	) 
}

const StockChartDaily = ({symbol, timeRange, ...props}) => {
	const [query, setQuery] = useState({});
	const [dailyBars, setBars] = useState([])

	//needs modification
	//If market is open, **END** is end of last trading day and not current trading date;
	//Also in case of YTD, timeframe can vary depending on duration from start of the year
	
	React.useEffect(() => {
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
				setQuery({}); //default
				break;
			case '1Y': 
				setQuery({start: NYearsAgoISODate(1), timeframe: '5Day'}); 
				break
			case '5Y':
				setQuery({start: NYearsAgoISODate(5), timeframe: '30Day'});
				break;  
		}
	}, [timeRange])

	const {getBars} = useStockHistoricalData(symbol, query, {enabled: false});

	//Calendar is just used of 5D timeRange
	const {getCalendar} = useCalendar(query, {enabled: false});

	React.useEffect(() => {
		const manageBars = async() => {
			if (query) {
				var bars = await getBars();
				if (timeRange == '5D') {
					const calendar = await getCalendar();
					bars = format5DayBars(bars, calendar);
				}
		
				setBars((bars || []).map(item => item.closePrice));
			}
		}

		manageBars();
	}, [query]);

	
	return (
		<LineChart values={dailyBars} {...props}/>		
	)
}

export const StockChart = ({type, hasSelector = false, ...props}) => {

	const [timeRange, setTimeRange] = useState(null)

	const onRangeSelect = (v) => {
		// console.log("*****************************************")
		// console.log("*****************************************")
		// console.log("On Range Select");
		// console.log(v);
		setTimeRange(v);
	}

	return (
		<>
	 	{
		 	type == "intraday" || timeRange == '1D' ? 
		 		<StockChartIntraday {...props} />
		 	:	
		 		<StockChartDaily {...props} { ...{timeRange}} />
 		}
 		{hasSelector && <RangeSelector onSelect={onRangeSelect}/>}
		</>
	);
}


const useStyles = () => {
	const theme = useTheme();

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
