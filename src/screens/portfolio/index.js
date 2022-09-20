import React, {useEffect, useState} from 'react';
import { View, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import {AppView, AppHeader, PnLText, 
	LineChart, VerticalField,
	AccountIcon, SearchIcon, Collapsible, Clickable, ShowMoreContainer } from '../../components/common';

import { PortfolioDisplay } from '../../components/portfolio';
import { ProfileSidebarWithIcon } from '../../components/profile';

import { useStockPortfolioData, usePortfolioHistory, useOrders } from '../../helper';

import {formatValue} from '../../utils';
import { t } from 'i18next';

import {useTheme, useDimensions, useTypography, StyledText} from '../../theme';

const HorizontalField = ({label, value, changeValue,  isPnL=false, isNumber = false, ...props}) => {
	const {theme, styles} = useStyles();

	return (
		<View style={styles.horizontalField}>
			<StyledText style={styles.pnlHeaderLabel}>{label}: </StyledText>
			{isPnL ? 
				<PnLText {...{value, changeValue}} {...{valueStyle: styles.pnlHeaderValue, changeStyle: styles.pnlHeaderValue}} />
				: <StyledText {...{isNumber, changeValue}} style={styles.pnlHeaderValue}>{value}</StyledText>
			}
		</View>
	)
}

const getTotalCost = (portfolio = []) => {
	const totalCost = portfolio ? portfolio.reduce((tv, position) => tv + parseFloat(position.cost_basis), 0) : 0;
	return totalCost;
}

const getCurrentPnL = (portfolio = []) => {
	return portfolio.reduce((tv, position) => tv + parseFloat(position.unrealized_pl), 0);
}

const getCurrentPnLChange = (portfolio = []) => {
	const totalCost = getTotalCost(portfolio);
	return totalCost > 0 ? getCurrentPnL(portfolio)/totalCost : 0;
}

const getLatestEquity = (history) => {
	return (history?.equity || []).slice(-1)[0];
}

const getDailyPnL = (history) => {
	return (history?.profit_loss || []).slice(-1)[0];
}

const getDailyPnLChange = (history, portfolio = []) => {
	const totalCost = getTotalCost(portfolio);
	return totalCost > 0 ? getDailyPnL(history)/totalCost : 0;
}

const PortfolioHeader = ({portfolioHistory, portfolio, ...props}) => {
	const {theme, styles} = useStyles();
	const {HP, WP} = useDimensions();
	const navigation = useNavigation();
	const {t} = useTranslation();

	return (
		<>
		{!props.hideTop && <AppHeader headerLeft={<ProfileSidebarWithIcon />} headerRight={<SearchIcon onPress={() => navigation.navigate("SearchStock")} iconColor={theme.greyIcon}/>} title={t('screens:portfolio')} goBack={false} headerContainerStyle={props.topHeaderStyle}/>}
		<View style={[styles.portfolioHeader, props.bottomHeaderStyle]}>
			<VerticalField 
				label="Portfolio Value" 
				labelTop={true}
				isNumber={true} 
				value={getLatestEquity(portfolioHistory)} 
				valuePrefix='$ '
				containerStyle={{width: WP(45)}}
				valueStyle={styles.latestEquityText}
				labelStyle={{fontSize:WP(4.5), color: theme.grey1}}
			/>
			<View>
				<HorizontalField
					label="Today's PnL"
					value={formatValue(getDailyPnL(portfolioHistory))}
					changeValue={getDailyPnLChange(portfolioHistory, portfolio)}
					isPnL={true}
				/>
				<HorizontalField
					label="Total PnL"
					value={getCurrentPnL(portfolio)}
					changeValue={getCurrentPnLChange(portfolio)}
					isPnL={true}
				/> 
			</View>
		</View>
		</>
	)
}

const Portfolio = (props) => {
	const navigation = useNavigation();
	const {theme, styles} = useStyles();
	const {WP, HP} = useDimensions();

	const {portfolio, getPortfolio} = useStockPortfolioData({enabled: false}); 
	const {portfolioHistory, getPortfolioHistory} = usePortfolioHistory({enabled: false});
	const {orders, getOrders} = useOrders({status: 'all', limit: 10}, {enabled: false});
	
	useFocusEffect(
		React.useCallback(() => {
			(() => {
				getPortfolio();
				getPortfolioHistory();
				getOrders();
			})();
		}, [])
	);

	const loading = !portfolio || !portfolioHistory || !orders;

	const pendingOrders = orders && orders.filter(item => item.status == "new");

	const Header = () => <PortfolioHeader {...{portfolioHistory, portfolio}}/>

	return (
		<AppView title="Portfolio" isLoading={loading} header={<Header />}>
			{(portfolio && orders) && 
				<View style={{marginTop: HP(4)}}>
					<StyledText style={{fontSize: WP(6), color: theme.grey1, marginBottom: HP(1)}}> Your Holdings </StyledText>
					<PortfolioDisplay {...{portfolio, orders}} screen='Portfolio'/>
				</View>
			}
		</AppView>
	);
}

const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();
	
	const styles = StyleSheet.create({
		portfolioHeader: {
			flexDirection: 'row',
			alignItems: 'flex-end',
			padding: WP(2),
			paddingTop: WP(2),
			width: '100%',
		},
		horizontalField: {
			flexDirection: 'row', 
			alignItems: 'flex-end', 
			marginBottom: HP(0.5),
			marginTop: HP(0.5)
		},
		portfolioFieldLabel: {
			fontSize: WP(4.5)
		},
		pnlHeaderLabel: {
			// textAlign: 'left',
			fontSize: WP(3.5),
			width: WP(20)
		},
		pnlHeaderValue: {
			textAlign: 'right',
			fontSize: WP(3.5)
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
		showMoreText: {
			color: theme.backArrow
		},
		cancelOrderText: {
			color: theme.red
		},
		latestEquityText: {
			fontSize: WP(6), fontWeight: '700'
		}
	});

	return {theme, styles};
}

export default Portfolio;

