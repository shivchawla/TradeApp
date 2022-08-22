import React from 'react';
import {View, StyleSheet} from 'react-native';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme'

import {formatPctValue, formatValue} from '../../utils';

export const PnLText = ({value = 0, changeValue = 0, withBracket = true, isPct = true, isNotional = false, ...props}) => {
	const { theme, styles } = useStyles();
	const { getPnLColor } = useTypography();

	const valueColor = getPnLColor(value);
	const changeValueColor = getPnLColor(changeValue);

	const formattedValue = (isNotional ? 'USD ': '') + formatValue(value);
	const formatChangeValue = (withBracket ? "(" : "") + (isPct ? formatPctValue(changeValue) : formatValue(value)) +  (withBracket ? ")" : "");
	
	const textAlign = props?.valueStyle?.textAlign;
	const justifyContent = textAlign == 'right' ? 'flex-end' : textAlign == 'center' ? 'center' : 'flex-start'; 

	return (
		<View style={[styles.pnlTextContainer, props.containerStyle, {justifyContent}]}>
			{!!value && <StyledText isNumber={true} style={[styles.valueText, props.valueStyle, {color: valueColor}]}> {formattedValue}</StyledText>}
			{!!changeValue && <StyledText isNumber={true} style={[styles.changeText, props.changeStyle, {color: changeValueColor}]}> {formatChangeValue}</StyledText>}
		</View>
	);
}


const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();

	const styles = StyleSheet.create({
		pnlTextContainer: {
			flexDirection: 'row',
		},
	});

	return {theme, styles};
}
