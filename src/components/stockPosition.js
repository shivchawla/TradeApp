import React, {useState} from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import ShowJson from './showJson';
import { useTheme, StyledText, Typography, WP, HP }  from '../theme';
import { POSITION_FIELDS } from '../config';
import { useStockPositionData } from '../helper';

const PositionField = ({label, value, changeValue = 0, isPnL = false, right = false}) => {
	const theme = useTheme();

	const getColor = (value) => {
		return value > 0 ? theme.green : theme.red;
	}

	const formatValue = (value) => {
		var output = value;

		try {
			output = parseFloat(value);
			var decimals = output.countDecimals();
			if(decimals == 0) {
				return value;
			} else {
				return output.toFixed(2);
			}
		} catch (e) { console.log(e); }

		return value.toUpperCase();
	}

	return (
		<View style={styles.positionFieldContainer}>
			<StyledText style={[Typography.four, {color: theme.positionLabel}, styles.positionFieldLabel]}>{label}</StyledText>
			<StyledText style={[Typography.fourPointFive, {color: theme.positionValue}, styles.positionFieldValue, {...isPnL && {color: getColor(value)}}]}>{formatValue(value)}
				{!!changeValue && <StyledText style={[Typography.fourPointFive, {color: theme.positionValue}, styles.positionFieldValue, {...isPnL && {color: getColor(value)}}]}> ({(changeValue*100).toFixed(2)}%)</StyledText>}
			</StyledText>
		</View>
	);
} 

const ShowPosition = (position) => <ShowJson json={position || {}} />

const StockPositionWithSymbol = ({symbol}) => {
	const [isError, position] = useStockPositionData(symbol);
	// console.log(position);
	// console.log();
	const SHOW_POSITION_KEYS = Object.keys(POSITION_FIELDS);

	const formatPositionToArray = (position) => {
		return SHOW_POSITION_KEYS.map(key => {
			return {key:key, value: position[key], changeValue: position[key + 'pc']}
		});
	}

	return (
		<>
		{!!position && 
			<FlatList style={styles.positionContainer}
				data={formatPositionToArray(position)}
				numColumns={2}
				renderItem={({item, index}) => (
					<PositionField right={index%2} isPnL={item.key.includes("_pl")} {...{label: POSITION_FIELDS[item.key], value: item.value, changeValue: item.changeValue}} />	
				)}
			/>
		}	
		</>
	);	
}

const StockPosition = ({symbol, position}) => {
	return (
		<>
			{position ? <ShowPosition json = {position} /> 
				: symbol ? <StockPositionWithSymbol {...{symbol}} />
				: <ShowJson json = {{error: "No Positions found"}} />
			}
		</>
	)	
}

const styles = StyleSheet.create({
	positionContainer: {
		width: '100%',
	},
	positionFieldContainer: {
		width: WP(50),
		paddingLeft: WP(5),
		marginBottom: WP(5)
	},
	positionFieldLabel: {
		fontWeight: '400'
	},
	positionFieldValue: {
	}

});

export default StockPosition;