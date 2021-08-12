import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';

import { PnLText } from './';
import * as Theme from '../../theme';
import { formatValue} from '../../utils';

const { useTheme, StyledText, WP, Typography} = Theme;

export const VerticalField = ({label, value, changeValue = 0, isPnL = false, ...props}) => {
	
	const styles = useStyles();

	return (
		<View style={[styles.container, props.containerStyle]}>
			<StyledText style={[styles.label, props.labelStyle]}>{label}</StyledText>
			{isPnL ? 
				<PnLText {...{value, changeValue}} {...{valueStyle: props.valueStyle, changeStyle: props.changeStyle}} />
				:
				<StyledText style={[styles.value, props.valueStyle]}>{formatValue(value)}
				</StyledText>
			}
		</View>
	);
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		container: {
			width:'50%',
			// paddingLeft: WP(5),
			// marginBottom: WP(5)
		},
		label: {
			fontWeight: '400',
			fontSize: Typography.four, 
			color: theme.positionLabel, 
		},
		value: {
			fontSize: Typography.fourPointFive, 
			color: theme.positionValue
		}
	})

	return styles;
}