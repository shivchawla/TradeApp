import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
const Ionicons  = Icon;
import {useFocusEffect} from '@react-navigation/native';

import { VerticalField, PnLText, Collapsible } from '../common';
import * as Theme  from '../../theme';
import { POSITION_FIELDS, POSITION_SUMMARY_FIELDS } from '../../config';
import { useStockPositionData } from '../../helper';
import { formatValue, formatPctValue } from '../../utils';

const { useTheme, StyledText, Typography, WP, HP } = Theme;

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

export const StockPositionHeader = ({position}) => {
	const SHOW_SUMMARY_KEYS = Object.keys(POSITION_SUMMARY_FIELDS);
	const {theme, styles} = useStyles();
	
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
			<View style={styles.positionSummaryContainer}>
				{
					positionSummary(position).map((item, index) => {
						return <MiniField key={item.field} {...item} style={{...index%2==1 && {marginRight: 0}}} />
					})
				}
			</View>
		</View>
	)
}

const StockPositionList = (position) => {
	const SHOW_POSITION_KEYS = Object.keys(POSITION_FIELDS);
	const {theme, styles} = useStyles();

	return ( 
		<View style={styles.positionListContainer}>
			{ formatPositionToArray(position, SHOW_POSITION_KEYS).map(({field, value, changeValue}, index) => {
					return (
						<VerticalField 
							key={field} 
							containerStyle={styles.positionFieldContainer}
							isPnL={field.includes("_pl")} 
							label={POSITION_FIELDS[field]}
							{...{value, changeValue}} 
						/>
					)	
				})
			}
		</View>
	)
}

const ShowPosition = ({position}) => {
	return (
		<>{
			!!position && 
			<Collapsible 
				title="YOUR POSITION"
				summary={<StockPositionHeader {...{position}} />}
				content={<StockPositionList {...position} />}
			/>
		}
		</>
	)	
}

const StockPositionWithSymbol = ({symbol}) => {
	const {theme, styles} = useStyles();
	const {isError, getPosition} = useStockPositionData(symbol, {enabled: false});
	const [position, setPosition] = useState(null);
		
	useFocusEffect(
		React.useCallback(() => {
			const fetchPosition = async() => {
				setPosition(await getPosition());
			}

			fetchPosition();

		}, [])
	)
	
	return <ShowPosition {...{position}} />
	
}

export const StockPosition = ({symbol, position}) => {
	// console.log("StockPosition");
	// console.log(symbol);
	// console.log(position);

	return (
		<>
			{position ? <ShowPosition {...{position}} /> 
				: symbol ? <StockPositionWithSymbol {...{symbol}} />
				: <ShowJson json = {{error: "No Positions found"}} />
			}
		</>
	)	
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		positionContainer: {
			width: '100%',
			paddingTop: WP(4)
		},
		positionListContainer: {
			flexDirection: 'row',
			flexWrap: 'wrap',
		},
		positionHeaderContainer: {
			flexDirection: 'row',
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
			width: '50%',
			paddingLeft: WP(3),
			marginBottom: WP(5),
			textAlign: 'left'
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

	return {theme, styles};
};
