 import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {AppView, AppHeader, PnLText, 
	LineChart, HorizontalScrollMenu, VerticalField,
	AccountIcon, TickerDisplay} from '../../components/common';

import * as Theme from '../../theme';
import { useStockPortfolioData, useTradingAccountData, usePortfolioHistory } from '../../helper';

import {formatValue} from '../../utils';
import {ACCOUNT_SUMMARY_FIELDS} from '../../config';

const {useTheme, WP, StyledText} = Theme;

const PortfolioDisplay = ({portfolio}) => {

	const theme = useTheme();
	const styles = useStyles();

	const PortfolioDisplayHeader = () => {
		return (
			<View style={styles.portfolioDisplayHeader}>
				<StyledText style={{width: WP(25), textAlign: 'left'}}>Symbol</StyledText>
				<StyledText style={{borderLeftWidth:1,borderRightWidth:1, borderColor: theme.grey5, width: WP(50), textAlign: 'center'}}>Last Price</StyledText>
				<StyledText style={{width: WP(25), textAlign:'center'}}>PnL</StyledText>
			</View>
		)
	}

	const DisplayPosition = ({position}) => {
		const {symbol, qty, side, unrealized_pl} = position;
		const navigation = useNavigation()

		return (
			<TouchableOpacity style={styles.portfolioDisplayHeader} onPress={() => navigation.navigate('StockDetail', {symbol})}>
				<View style={styles.symbolQtyContainer}>
					<StyledText style={styles.symbol}>{symbol}</StyledText>
					<StyledText style={styles.quantity}>{formatValue(qty)} Shares</StyledText>
				</View>
				<TickerDisplay {...{symbol}} 
					style={styles.tickerDisplayContainer} 
					priceChangeStyle={styles.priceChangeStyle}
					priceStyle={styles.priceStyle}/>
				<PnLText valueStyle={styles.pnlText} value={unrealized_pl}  />
			</TouchableOpacity>
		)
	}

	return (
		<View style= {styles.portfolioDisplayContainer}>
			<StyledText style={styles.portfolioDisplayTitle}>POSITIONS</StyledText>
			<PortfolioDisplayHeader />
			{portfolio.map((item, index) => {
				return <DisplayPosition key={index} position={item} />
			})
			}
		</View>

	)
}

const Portfolio = (props) => {
	const {isError: isErrorPortfolio, portfolio} = useStockPortfolioData(); 
	const {isError: isErrorAccount, tradingAccount} = useTradingAccountData();
	const {isError: isErrorHistory, portfolioHistory} = usePortfolioHistory();

	const styles = useStyles();

	const getLatestEquity = (history) => {
		return (history?.equity || []).slice(-1)[0];
	}

	const getPnL = (history) => {
		return (history?.profit_loss || []).slice(-1)[0];
	}

	const PortfolioHeader = () => {
		return (
			<>
			<AppHeader headerLeft={<AccountIcon />} title="Portfolio" goBack={false} />
			<View style={styles.portfolioHeader}>
				<VerticalField label="Total Balance" value={getLatestEquity(portfolioHistory)} />
				<VerticalField 
					label="Change (1M)" 
					value={getPnL(portfolioHistory)} 
					isPnL={true} 
					labelStyle={styles.pnlHeaderLabel}
					valueStyle={styles.pnlHeaderValue}/>
			</View>
			</>
		)
	}

	const PnLGraph = () => {
		return <LineChart values={portfolioHistory?.equity || []} /> 	
	}

	const PortfolioPie = () => {
		return <StyledText>Portfolio Pie</StyledText>;	
	}

	const AccountSummary = () => {
		return (
			<View style={styles.accountSummaryContainer}>
			{tradingAccount && Object.keys(ACCOUNT_SUMMARY_FIELDS).map((key, index) => {
				return (
					<VerticalField 
						{...{key}}  
						label={ACCOUNT_SUMMARY_FIELDS[key]} 
						value={tradingAccount[key]}
						containerStyle={styles.accountSummaryField} 
					/>
				) 
			})
			}		
			</View>
		)	
	}

	const menuItems = [
		{key:'pnl', label:'PNL', component: PnLGraph},
		{key:'portfolio', label:'PORTFOLIO', component: PortfolioPie},
		{key:'account', label:'ACCOUNT', component: AccountSummary},
	];

	const loading = !!!portfolio || !!!tradingAccount || !!!portfolioHistory

	return (
		<>
		{!loading && 
			<AppView header={<PortfolioHeader />} title="Portfolio">
				<HorizontalScrollMenu items={menuItems} scroll={false}/>
				{portfolio && <PortfolioDisplay {...{portfolio}}/>}
			</AppView>
		}
		</>
	);
}

const useStyles = () => {
	const theme = useTheme();
	
	const styles = StyleSheet.create({
		portfolioHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			borderBottomWidth:1,
			borderColor: theme.grey5,
			paddingBottom: WP(2),
			paddingTop: WP(2),
			width: '100%'
		},
		portfolioFieldLabel: {
			fontSize: WP(4.5)
		},
		pnlHeaderLabel: {
			textAlign: 'right',
		},
		pnlHeaderValue: {
			textAlign: 'right',
		},
		accountSummaryContainer: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			width: '100%'
		},
		accountSummaryField: {
			width: '50%',
			padding: WP(3),
		},
		portfolioDisplayContainer: {
			width: '100%',	
		},
		portfolioDisplayTitle: {
			marginTop: WP(3),
			fontSize: WP(4.5)
		},
		portfolioDisplayHeader: {
			flexDirection: 'row',
			width: '100%',
			marginTop: WP(5)
		},
		symbolQtyContainer: {
			width: WP(25), 
		},
		symbol: {
			fontSize: WP(4)
		},
		quantity: {
			fontSize: WP(3.5),
			color: theme.grey5
		},
		pnlText: {
			width: WP(25), 
			textAlign:'center'
		},
		tickerDisplayContainer: {
			width: WP(50), 
			// alignItems: 'center',
			flexDirection: 'row',
			justifyContent: 'center'
		},
		priceChangeStyle: {
			// textAlign: 'center',
			marginLeft: WP(2),
			fontSize: WP(4)
		},
		priceStyle: {
			fontSize: WP(4)
		}
	});

	return styles;
}

export default Portfolio;

