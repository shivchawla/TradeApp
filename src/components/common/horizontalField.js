import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { PnLText } from './';
import { formatValue} from '../../utils';

import { useTheme, useDimensions, useTypography, StyledText} from '../../theme';


export const HorizontalField = ({label, value, isPnL=false, isNumber = false, ...props}) => {
	const {theme, styles} = useStyles();

	return (
		<View style={[styles.container, props.containerStyle]}>
			<StyledText style={[styles.label, props.labelStyle]}>{label}: </StyledText>
			{isPnL ? 
				<PnLText {...{value}} {...{valueStyle: props.valueStyle}} />
				: <StyledText {...{isNumber}} style={[styles.value, props.valueStyle]}>{value}</StyledText>
			}
		</View>
	)
}


const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();
	
	const styles = StyleSheet.create({
		container: {
			flexDirection: 'row',
		},
		label: {
			textAlign: 'right',
		},
		value: {
			textAlign: 'right',
		},
	});

	return {theme, styles};
}
