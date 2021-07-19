import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useQuery} from 'react-query';

import AppView from '../../components/appView';
import SingleStock from '../../components/singleStock';
import ScreenName from '../../components/screenName';

import {defaultStocks} from '../../config';

// console.log(defaultStocks);

const Market = (props) => {
	// const {stocks} = props;

	const { isLoading, isError, data, error } = useQuery('clock', getClock);

	return (
		<AppView>
			<ScreenName name="Market Screen" />
			{defaultStocks && defaultStocks.length > 0 &&
				defaultStocks.map((ticker, index) => {	
					console.log("Ticker ", ticker);
					return <SingleStock key={ticker} realtime={data.is_open} {...{ticker}} />
				})
			}
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Market;