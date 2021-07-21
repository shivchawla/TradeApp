import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import ShowJson from './showJson';

import { useStockPositionData } from '../helper';

const StockPosition = ({ticker}) => {
	const [isError, position] = useStockPositionData(ticker);
	console.log("Stock Position");
	console.log(position);
	console.log(isError);

	return (
		<>	
			{(!isError && position) && <ShowJson json={position || {}} />}
		</>
	);
}

const styles = StyleSheet.create({

});

export default StockPosition;