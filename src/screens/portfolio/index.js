import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import AppView from '../../components/appView';
import ScreenName from '../../components/screenName'
import ShowJson from '../../components/showJson'

import { useStockPortfolioData, useTradingAccountData, usePortfolioHistory } from '../../helper';

const Portfolio = (props) => {
	const [isErrorPortfolio, portfolio] = useStockPortfolioData(); 
	const [isErrorAccount, account] = useTradingAccountData();
	const [isErrorHistory, portfolioHistory] = usePortfolioHistory();

	return (
		<AppView hasHeader={false} title="Portfolio Home Screen">
			{portfolioHistory && <ShowJson json={portfolioHistory || {}} full={false} />}
			{account && <ShowJson json={account || {}} />}
			{portfolio && <ShowJson json={portfolio || {}} />}
		</AppView>
	);
}

const styles = StyleSheet.create({

});

export default Portfolio;