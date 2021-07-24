import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import ShowJson from './showJson';

import { useStockPositionData } from '../helper';

const ShowPosition = (position) => <ShowJson json={position || {}} />

const StockPositionWithSymbol = ({symbol}) => {
	const [isError, position] = useStockPositionData(symbol);
	console.log("Stock Position");
	console.log(position);
	console.log(isError);

	return (
		<ShowPosition json={position || {}} />
	);	
}

const StockPosition = ({symbol, position}) => {
	return (
		<>
			{position ? <ShowPosition json = {position} /> 
				: symbol ? <StockPositionWithSymbol {...{symbol}} />
				: <ShowJson json = {{error: "No Positions found"}} />
			}
		</>
	)	
}

const styles = StyleSheet.create({

});

export default StockPosition;