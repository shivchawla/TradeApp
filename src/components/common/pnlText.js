import React from 'react';
import {View, StyleSheet} from 'react-native';
import * as Theme from '../../theme'

import {formatPctValue, formatValue} from '../../utils';

export const PnLText = ({value = 0, changeValue = 0, withBracket = true, isPct = true, isNotional = false, ...props}) => {
	const styles = useStyles();

	const valueColor = Theme.getPnLColor(value);
	const changeValueColor = Theme.getPnLColor(changeValue);

	const formattedValue = (isNotional ? 'USD ': '') + formatValue(value);
	const formatChangeValue = (withBracket ? "(" : "") + (isPct ? formatPctValue(changeValue) : formatValue(value)) +  (withBracket ? ")" : "");
	
	const StyledText = Theme.StyledText;

	const textAlign = props?.valueStyle?.textAlign;
	const justifyContent = textAlign == 'left' ? 'flex-start' : textAlign == 'center' ? 'center' : 'flex-end'; 

	return (
		<View style={[styles.pnlTextContainer, props.containerStyle, {justifyContent}]}>
			{!!value && <StyledText style={[styles.valueText, props.valueStyle, {color: valueColor}]}> {formattedValue}</StyledText>}
			{!!changeValue && <StyledText style={[styles.changeText, props.changeStyle, {color: changeValueColor}]}> {formatChangeValue}</StyledText>}
		</View>
	);
}


const useStyles = () => {
	const theme = Theme.useTheme();

	const styles = StyleSheet.create({
		pnlTextContainer: {
			flexDirection: 'row',
		},
	});

	return styles;
}
