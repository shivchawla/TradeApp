import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme, StyledText} from '../../theme'

import {formatName} from '../../utils';
import { useAssetData } from  '../../helper';

export const StockName = ({symbol, stock, ...props}) => {
	const styles = useStyles();
	const {getAsset} = useAssetData(symbol, {enabled: false});
	const [asset, setAsset] = useState(null);

	React.useEffect(() => {
		const fetchAsset = async() => {
			if (!!!asset) {
				if (!!stock) {
					setAsset(stock)
				} else {
					setAsset(await getAsset(symbol));
				}
			}
		}

		fetchAsset();

	}, []);

	return (
		<View style={[styles.stockNameContainer, props.containerStyle]}>
			<StyledText style={styles.stockSymbol}>{!!asset ? asset.symbol : '---'}</StyledText>
			<StyledText style={styles.stockName}>{!!asset ? formatName(asset.name): '---'}</StyledText>
		</View>
	);
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		stockName: {
			color: theme.text
		},
		stockSymbol: {
			color: theme.text
		},
	})

	return styles;
}
