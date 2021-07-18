import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../components/appView';
import SingleStock from '../components/singleStock';

const StockDetail = (props) => {
	const {stocks} = props;

	return (
		<AppView>
			{stocks && stocks.length > 0 &&
				stocks.map((stock, index) => {	
					return <SingleStock stock={...}/>
				})
			}
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default StockDetail;