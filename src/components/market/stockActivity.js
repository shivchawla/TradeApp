import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import { ShowJson } from '../common';
import { useOrders } from '../../helper';

import { COMPLETE_ORDER_STATUS, OPEN_ORDER_STATUS } from '../config'

import { filterTrades, filterOpenOrders } from '../../helper';

const ShowTradeActivity = ({type, list}) => {
	return (
		<>
			list.length == 0 ? <ShowJson json={{info: "No trades found"}} />
			: list.map((item, index) => <ShowJson key={index} json={item} />)
		</>
	)
}

const ShowTradeHistory = (trades) => <ShowTradeActtivity type="trade" list={trades} />

const TradeHistoryWithSymbol = ({symbol}) => {

	const {isError, orders: closedOrders} = useOrders({symbol, status: "closed"});
	return (
		<ShowTradeHistory trades={filterTrades(closedOrders)} />
	)

}

const ShowOpenOrders = (orders) => <ShowTradeActivity type="order" list={orders} />


const OpenOrdersWithSymbol = ({symbol}) => {

	const {isError, orders: openOrders} = useOrders({symbol, status: "open"});
	return (
		<ShowTradeHistory trades={filterOrders(openOrders)} />
	)
}

export const OpenOrders = ({symbols, orders}) => {
	return (
		<>
			{
				orders ? <ShowOpenOrders {...{trades}} /> : 
				symbol ? <OpenOrdersWithSymbol {...{symbol}} /> :
				<ShowJson json={{error: "Error in Component"}} />
			}
		</>
	)
}

export const TradeHistory = ({symbols, trades}) => {
	return (
		<>
			{
				trades ? <ShowTradeHistory {...{trades}} /> : 
				symbol ? <TradeHistoryWithSymbol {...{symbol}} /> :
				<ShowJson json={{error: "Error in Component"}} />
			}
		</>
	)
}


const styles = StyleSheet.create({

});