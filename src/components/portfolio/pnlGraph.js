import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { LineChart, RangeSelector } from '../common';
import { usePortfolioHistory, getLatestTradingDay } from '../../helper';

import * as Theme  from '../../theme';
const { useTheme, StyledText, WP, HP} = Theme;

import {yearStartISODate, currentISODate, 
	toISODate, durationBetweenDates, getRoundedCurrentTime} from '../../utils'

export const PnLGraph = (props) => {

	const {theme, styles} = useStyles();
	const [query, setQuery] = useState(null);
	const {getPortfolioHistory} = usePortfolioHistory(query || {}, {enabled: false});
	const [history, setHistory] = useState(null)

	const items = ['1D', '5D', '1M', '3M', '6M', 'YTD', '1Y', '5Y']
	const [selectedIndex, setIndex] = useState(2);

	React.useEffect(() => {

		const ytdQuery = async() => {
			if (items[selectedIndex] == 'YTD') {
				const latestTradingDay = await getLatestTradingDay();
				const start = toISODate(latestTradingDay.date + " " + latestTradingDay.open);
				const yStart = yearStartISODate();

				const current = currentISODate();
				const durationDays = durationBetweenDates( yStart, current,  'days');

				if (durationDays > 7) {
					return {start: yStart, timeframe: '1D'};
				}

				const durationHours = durationBetweenDates( yStart, current, 'hours');
			
				if (durationHours < 4) {
					return {start: yStart, end: getRoundedCurrentTime('1Min'), timeframe: '1Min'};
				} else if (durationHours < 24) {
					return {start: yStart, end: getRoundedCurrentTime('5Min'), timeframe: '5Min'};
				} else {
					return {start: yStart, end: getRoundedCurrentTime('15Min'), timeframe: '15Min'};
				} 
			}

		}

		const manageQuery = async() => {
			const timeRange = items[selectedIndex];

			if (timeRange) {
				console.log("manageQuery: ", timeRange);
				switch (timeRange) {
					case '1D':
						setQuery({period: '1D', timeframe: '5Min'})
						break;

					case '5D':
						setQuery({period: '5D', timeframe: '15Min'})
						break;

					case '1M':
						setQuery({period: '1M', timeframe: '1D'})
						break;

					case '3M':
						setQuery({period: '3M', timeframe: '1D'})
						break;

					case '6M':
						setQuery({period: '6M', timeframe: '1D'})
						break;

					case 'YTD':
						setQuery(await ytdQuery());
						break;	

					case '1Y':
						setQuery({period: '1A', timeframe: '1D'})
						break;			

					case '5Y':
						setQuery({period: '1A', timeframe: '1D'})
						break;			
				}
			}
		}

		manageQuery()
	}, [selectedIndex]);


	React.useEffect(() => {
		const manageHistory = async() => {
			if (query) {
				console.log("Query Changed");
				console.log(query);

				getPortfolioHistory().then(response => {
					setHistory(response || {});	
				})
			}
		}

		manageHistory();
	}, [query])

	return (
		<View style={styles.outerContainer}>
			<LineChart 
				{...props}
				data={history?.equity ?? []} 
				base={history?.base_value}
				hasTooltip={true}
				baseline={true}/>
			<RangeSelector {...{items, selectedIndex}} onSelect={(v) => setIndex(v)}/>
		</View>
	)
}

const useStyles = () => {
	const theme = useTheme();
	const styles = StyleSheet.create({
		outerContainer: {
			marginTop: HP(5)
		}
	});

	return {theme, styles};
}



