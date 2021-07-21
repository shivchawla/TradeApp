import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName';
import SingleStock from '../../components/singleStock';
import TradeButtons from '../../components/tradeButtons';
import StockPosition from '../../components/stockPosition';

const StockDetail = (props) => {
	console.log("Stock Detail");
	console.log(props);
	const {ticker} = props.route.params;
	const {navigation} = props;
	const onBuy = () => {
		navigation.navigate('PlaceOrder', {ticker, action: "BUY"});
	}

	const onSell = () => {
		navigation.navigate('PlaceOrder', {ticker, action: "SELL"});		
	}

	return (
		<AppView footer={<TradeButtons {...{onBuy, onSell}}/>} title="Stock Detail Screen">
			<SingleStock {...{ticker}} detail={true}/>
			<StockPosition {...{ticker}} />
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default StockDetail;