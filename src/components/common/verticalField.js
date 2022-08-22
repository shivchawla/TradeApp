import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';

import { PnLText } from './';
import { formatValue} from '../../utils';

import { useTheme, useDimensions, useTypography, StyledText} from '../../theme';

export const VerticalField = ({label, value, changeValue = 0, isPnL = false, labelTop = true, valuePrefix = '', isNumber = false, ...props}) => {
	
	const styles = useStyles();
	const { HP } = useDimensions();

	return (
		<View style={[styles.container, props.containerStyle]}>
			{labelTop && <StyledText style={[styles.label, props.labelStyle]}>{label}</StyledText>}
			{isPnL ? 
				<PnLText {...{value, changeValue}} {...{valueStyle: props.valueStyle, changeStyle: props.changeStyle}} />
				:
				<StyledText {...{isNumber}} style={[styles.value, props.valueStyle, {...isNumber && {paddingTop: HP(0.5)}}]}>{valuePrefix + formatValue(value)}
				</StyledText>
			}
			{!labelTop && <StyledText style={[styles.label, props.labelStyle]}>{label}</StyledText>}
		</View>
	);
}

const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();

	const styles = StyleSheet.create({
		container: {
			width:'50%',
		},
		label: {
			fontWeight: '400',
			fontSize: fontSize.four, 
			color: theme.positionLabel, 
		},
		value: {
			fontSize: fontSize.fourPointFive, 
			color: theme.positionValue,
		}
	})

	return styles;
}