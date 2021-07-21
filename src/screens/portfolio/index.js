import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName'
import ShowJson from '../../components/showJson'

import { useStockPortfolioData, useTradingAccountData } from '../../helper';

const Portfolio = (props) => {
	const [isErrorPortfolio, portfolio] = useStockPortfolioData(); 
	const [isErrorAccount, account] = useTradingAccountData();

	return (
		<AppView hasHeader={false}>
			<ScreenName name="Portfolio Home Screen" />
			{account && <ShowJson json={account || {}} />}
			{portfolio && <ShowJson json={portfolio || {}} />}
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Portfolio;