import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';

import { AppView } from '../../components/common';
import { SearchStockList } from '../../components/market';

import { useTheme, useDimensions, useTypography, StyledText }  from '../../theme';

const SearchStock = (props) => {
	const styles = useStyles();

	return (
		<AppView title="Search Stocks">
			<SearchStockList />
		</AppView>
	);
}

const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();


	const styles = StyleSheet.create({
		chartContainer: {
			paddingTop: HP(5)
		},
		empty: {
			height: HP(20)
		},
		footer: {
			backgroundColor: theme.grey10
		}

	});

	return styles;
}

export default SearchStock;