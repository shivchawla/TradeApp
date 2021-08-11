import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {AppView} from '../../components/common';
import SearchStockList from '../../components/searchStockList';

const ChooseStock = (props) => {
	return (
		<AppView title="Choose Stock" scroll={false}>
			<SearchStockList />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default ChooseStock;