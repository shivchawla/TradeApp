import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity } from 'react-native';
	
import { getLatestTradingDay, getNextTradingDay } from '../../helper';
import { StyledText, WP, HP, useTheme }  from '../../theme';
import { toTimeZoneDate, durationBetweenDates } from '../../utils';

export const DisplayOutRTH = ({orderDetail, ...props}) => {
	const {theme, styles} = useStyles();

	const [isAfterMarket, setAfterMarket] = useState(null);
	const [nextMarketOpen, setMarketOpen] = useState(null);
	
	React.useEffect(() => {
		const computeAfterMarket = async() => {
			const latestTradingDay = await getLatestTradingDay();
			const nextTradingDay = await getNextTradingDay();
			;
			const dayClose = toTimeZoneDate(latestTradingDay.date + ' ' + latestTradingDay.close);
			const dayOpen = toTimeZoneDate(latestTradingDay.date + ' ' + latestTradingDay.open);
			
			const orderTime = toTimeZoneDate(orderDetail?.submitted_at || orderDetail?.created_at);
			const durationClose = durationBetweenDates(dayClose, orderTime);
			const durationOpen = durationBetweenDates(orderTime, dayOpen);

			if (durationClose > 0 || durationOpen > 0) {
				setAfterMarket(true);
			}

			const nextOpen = toTimeZoneDate(nextTradingDay.date + ' ' + nextTradingDay.open, "Do MMM YYYY hh:mm A");
			
			if (durationOpen > 0) {
				setMarketOpen(dayOpen);
			} else {
				setMarketOpen(nextOpen);
			}
		}

		computeAfterMarket();

	}, []) 

	return (
		<>
		{isAfterMarket &&
			<View style={[styles.alertMessageContainer, props.containerStyle]}>
				<StyledText style={styles.alertMessageTitle}>Order is placed after regular market hours.</StyledText>
				<StyledText style={styles.alertMessage}>It will be submitted at next market open on {nextMarketOpen} local time</StyledText>
			</View>
		}
		</>
	)	
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		alertMessageContainer: {
			padding: WP(3),
		},
		alertMessageTitle: {
			fontSize: WP(4),
			color: theme.grey2
		},
		alertMessage: {
			marginTop: WP(2),
			color: theme.grey2
		},
	})

	return {theme, styles};
} 