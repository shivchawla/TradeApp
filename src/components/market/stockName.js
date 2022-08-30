import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme'

import {formatName, formatValue} from '../../utils';
import { useAssetData, useStockPositionData } from  '../../helper';

export const StockName = ({symbol, showPosition = false, ...props}) => {

	const styles = useStyles();
	const {asset} = useAssetData(symbol);
	// const [asset, setAsset] = useState(null);
	const {position} = useStockPositionData(symbol, {enabled: showPosition});
	// console.log(position);

	return (
		<View style={[styles.stockNameContainer, props?.containerStyle]}>
			<StyledText style={styles.stockSymbol}>{!!asset ? asset.symbol : '---'}</StyledText>
			<StyledText style={styles.stockName}>{!!asset ? formatName(asset.name): '---'}</StyledText>
			{position && <StyledText style={styles.quantity}>{formatValue(position.qty)} Shares</StyledText>}
		</View>
	);
}

const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();

	const styles = StyleSheet.create({
		stockName: {
			color: theme.text
		},
		stockSymbol: {
			color: theme.text
		},
		quantity: {
			fontSize: WP(3.5),
			color: theme.grey4
		}
	})

	return styles;
}
