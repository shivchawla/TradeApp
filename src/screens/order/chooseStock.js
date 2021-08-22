import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { AppView } from '../../components/common';
import { SearchStockList } from '../../components/market';

const ChooseStock = (props) => {
	return (
		<AppView title="Choose Stock">
			<SearchStockList onPressToOrder={true}/>
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default ChooseStock;