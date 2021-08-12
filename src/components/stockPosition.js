import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { VerticalField, PnLText } from './common';
import { useTheme, StyledText, Typography, WP, HP, Colors, getPnLColor }  from '../theme';
import { POSITION_FIELDS, POSITION_SUMMARY_FIELDS } from '../config';
import { useStockPositionData } from '../helper';
import { formatValue, formatPctValue } from '../utils';

const formatPositionToArray = (position, KEYS = []) => {
	return KEYS.map(key => {
		return {field: key, value: position[key], changeValue: position[key + 'pc']}
	});
}

const positionSummary = (position) => {
	const SHOW_SUMMARY_KEYS = Object.keys(POSITION_SUMMARY_FIELDS);

	return SHOW_SUMMARY_KEYS.map(key => {
		if (key == "qty") {
			return {field: key, label: position["side"].toUpperCase(), value: position[key]};
		} else {
			return {field: key, value: position[key], changeValue: position[key + 'pc']};
		}
	})

}

const ShowHideButton = ({showDetail, onToggle}) => {
	const styles = useStyles();
	const theme = useTheme();
	return(
		<TouchableOpacity onPress={onToggle} style={styles.showHideButton}>
			<Ionicons name={showDetail ? "chevron-up" : "chevron-down"} color={theme.backArrow} size={WP(5)} />
		</TouchableOpacity>
	)
}

const StockPositionHeader = ({position, onToggle, showDetail}) => {
	const SHOW_SUMMARY_KEYS = Object.keys(POSITION_SUMMARY_FIELDS);
	const styles = useStyles();
	
	const MiniField = ({label, field, value, changeValue, style}) => {
		if (field == "side") {
			return <></>;
		}

		return(
			<View style={[styles.positionSummaryField, style]}>
				<StyledText style={styles.positionSummaryFieldLabel}>{label || POSITION_SUMMARY_FIELDS[field]}: </StyledText>
				{
					field.includes("_pl") ? 
					<PnLText {...{value, changeValue}} />
					: 
					<StyledText> {formatValue(value)} </StyledText>

				}
			</View>
		);
	}

	return (
		<View style={styles.positionHeaderContainer}>
			<StyledText style={styles.positionHeaderTitle}>Your Position</StyledText>
			<View style={styles.positionSummaryContainer}>
				{
					positionSummary(position).map((item, index) => {
						return <MiniField key={item.field} {...item} style={{...index%2==1 && {marginRight: 0}}} />
					})
				}
			 <ShowHideButton {...{onToggle, showDetail}}/>
			</View>
		</View>
	)
}

const StockPositionList = (position) => {
	const SHOW_POSITION_KEYS = Object.keys(POSITION_FIELDS);
	const styles = useStyles();

	return ( 
		<View style={styles.positionListContainer}>
			{ formatPositionToArray(position, SHOW_POSITION_KEYS).map((item, index) => {
					return <VerticalField key={item.field} style={styles.positionFieldContainer} isPnL={item.field.includes("_pl")} {...{label: POSITION_FIELDS[item.field], value: item.value, changeValue: item.changeValue}} />	
				})
			}
		</View>
	)
}

const ShowPosition = (position) => <ShowJson json={position || {}} />

const StockPositionWithSymbol = ({symbol}) => {
	const {isError, position} = useStockPositionData(symbol);
	const [showDetail, setShow] = useState(true);

	const styles = useStyles();

	return (
		<>
		{!!position &&
			<View style={styles.positionContainer}>
				<StockPositionHeader {...{position, showDetail}} onToggle={() => setShow(!showDetail)}/> 
				{showDetail && <StockPositionList {...position} />}
			</View>
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

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		positionContainer: {
			width: WP(100),
			borderTopWidth:1,
			borderColor: theme.darkgrey,
			paddingTop: WP(4)
		},
		positionListContainer: {
			width: WP(100),
			flexDirection: 'row',
			flexWrap: 'wrap',
		},
		positionHeaderContainer: {
			width: WP(100),
			flexDirection: 'row',
			// marginTop: WP(3),
			marginBottom: WP(5),
			justifyContent:'space-between'
		},
		showHideButton: {
			marginRight: WP(2),
			marginLeft: WP(2), 
			justifyContent: 'center'
		},
		positionHeaderTitle: {
			fontSize: Typography.five,
			color: theme.darkgrey,
			paddingLeft: WP(2),
		},
		positionSummaryContainer: {
			flexDirection: 'row',
			// paddingRight: WP(2),
			alignItems: 'center'
		},
		positionSummaryField: {
			marginRight: WP(3),
			flexDirection: 'row'
		},
		positionSummaryFieldLabel: {
			color: theme.darkgrey
		},
		positionFieldContainer: {
			width: WP(50),
			paddingLeft: WP(5),
			marginBottom: WP(5)
		},
		positionFieldLabel: {
			fontWeight: '400',
			fontSize: Typography.four, 
			color: theme.positionLabel, 
		},
		positionFieldValue: {
			fontSize: Typography.fourPointFive, 
			color: theme.positionValue
		}

	});

	return styles;
};

export default StockPosition;