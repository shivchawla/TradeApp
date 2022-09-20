import React, {useEffect, useState} from 'react';
import { View, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import {AppView, AppHeader, PnLText, 
	LineChart, VerticalField,
	AccountIcon, SearchIcon, Collapsible, Clickable, ShowMoreContainer } from '../../components/common';

import { PortfolioDisplay, PnLGraph	 } from '../../components/portfolio';
import { DisplayOrderList } from '../../components/order';
import { DisplayActivityList } from '../../components/activity';
import { StockNews } from '../../components/market';
import { ProfileSidebarWithIcon } from '../../components/profile'; 

import { useStockPortfolioData, useTradingAccountData, 
	usePortfolioHistory, useOrders, useCancelAllOrders, useAccountActivity } from '../../helper';

import {formatValue} from '../../utils';
import {ACCOUNT_SUMMARY_FIELDS, MAX_ACTIVITY_COUNT_HOME, MAX_POSITIONS_COUNT_HOME} from '../../config';
import { t } from 'i18next';

import {useTheme, useDimensions, useTypography, StyledText} from '../../theme';

const HorizontalField = ({label, value, isPnL=false, isNumber = false, ...props}) => {
	const {theme, styles} = useStyles();

	return (
		<View style={{flexDirection: 'row'}}>
			<StyledText style={styles.pnlHeaderLabel}>{label}: </StyledText>
			{isPnL ? 
				<PnLText {...{value}} {...{valueStyle: styles.pnlHeaderValue}} />
				: <StyledText {...{isNumber}} style={styles.pnlHeaderValue}>{value}</StyledText>
			}
		</View>
	)
}

const ShowMoreButton = ({onPress}) => {
	const {styles} = useStyles();
	const {t} = useTranslation();
	return (
		<Clickable onPress={onPress}>
			<StyledText style={styles.showMoreText}>{t('common:showMore')}</StyledText>
		</Clickable>
	)
}

const CancelOrderButton = ({onPress}) => {
	const {styles} = useStyles();
	return (
		<Clickable onPress={onPress}>
			<StyledText style={styles.cancelOrderText}>{t('common:cancelAll')}</StyledText>
		</Clickable>
	)
}

const getLatestEquity = (history) => {
	return (history?.equity || []).slice(-1)[0];
}

const getPnL = (history) => {
	return (history?.profit_loss || []).slice(-1)[0];
}

const PortfolioNews = ({symbols}) => {
	return symbols.map(symbol => <StockNews key={symbol} {...{symbol}} showMore={false}/>)
}

const PortfolioHeader = ({portfolioHistory, ...props}) => {
	const {theme, styles} = useStyles();
	const {WP} = useDimensions();

	const navigation = useNavigation();
	const {t} = useTranslation();

	const totalBalance = React.useMemo(() => getLatestEquity(portfolioHistory), [portfolioHistory]);
	const balanceChange1M = React.useMemo(() => formatValue(getPnL(portfolioHistory)), [portfolioHistory]);
	const balanceChange1D = React.useMemo(() => formatValue(getPnL(portfolioHistory)), [portfolioHistory]);

	console.log("PortfolioHeader");

	return (
		<>
		{!props.hideTop && <AppHeader headerLeft={<ProfileSidebarWithIcon />} headerRight={<SearchIcon onPress={() => navigation.navigate("SearchStock")} iconColor={theme.greyIcon}/>} title={t('screens:portfolio')} goBack={false} headerContainerStyle={props.topHeaderStyle}/>}
		<View style={[styles.portfolioHeader, props.bottomHeaderStyle]}>
			<VerticalField 
				label="Total Balance" 
				labelTop={false}
				isNumber={true} 
				value={totalBalance} 
				valuePrefix='$ '
				valueStyle={styles.latestEquityText}
			/>
			<View>
				<HorizontalField
					label="Chg. (1M)"
					value={balanceChange1M}
					isPnL={true}
				/>
				<HorizontalField
					label="Chg. (1D)"
					value={balanceChange1D}
					isPnL={true}
				/> 
			</View>
		</View>
		</>
	)
}

const AccountSummary = ({tradingAccount}) => {
	const {theme, styles} = useStyles();

	return (
		<View style={styles.accountSummaryContainer}>
		{tradingAccount && Object.keys(ACCOUNT_SUMMARY_FIELDS).map((key, index) => {
			return (
				<VerticalField 
					{...{key}}  
					label={ACCOUNT_SUMMARY_FIELDS[key]} 
					value={tradingAccount[key]}
					isNumber={true}
					containerStyle={styles.accountSummaryField} 
				/>
			) 
		})
		}		
		</View>
	)	
}

const Home = (props) => {
	const navigation = useNavigation();
	const {theme, styles} = useStyles();
	const {WP, HP} = useDimensions();

	const {portfolio, getPortfolio} = useStockPortfolioData({enabled: false});
	const {portfolioHistory, getPortfolioHistory} = usePortfolioHistory(); 
	const {tradingAccount, getTradingAccount} = useTradingAccountData({enabled: false});
	const {orders, getOrders} = useOrders({status: 'all', limit: 10}, {enabled: false});
	const {accountActivity, getAccountActivity } = useAccountActivity({activity_type: 'DIV', limit: 10}, {enabled: false});
	
	const {cancelAllOrders} = useCancelAllOrders();
	const [relevantActivity, setActivity] = useState(null);

	React.useEffect(() => {
		(async() => {
			if (!!accountActivity && !!orders) {
				var allExceptNewOrders = orders.filter(item => item.status != "new").map(item => {return {...item, activity_type: 'ORDER'}});
				setActivity([...accountActivity, ...allExceptNewOrders].slice(0, MAX_ACTIVITY_COUNT_HOME));
			}

			if (!portfolio) {

			}
		})()
	}, [accountActivity, orders, portfolio]);

	useFocusEffect(
		React.useCallback(() => {
			(() => {
				getPortfolio();
				getTradingAccount();
				getPortfolioHistory();
				getOrders();
				getAccountActivity();
			})();
		}, [])
	);


	const cancelOrders = React.useCallback(() => {
		cancelAllOrders({
			onSuccess: (response, input) => getOrders(),
			onError: (err, input) => console.log(err)
		})
	})

	const loading = !!!portfolioHistory;
	const pendingOrders = React.useMemo(() => orders && orders.filter(item => item.status == "new"), [orders]);

	console.log("Rendering Home");

	return (
		<AppView title="Home" isLoading={loading} header={<PortfolioHeader {...{portfolioHistory}}/>}>
			<Collapsible
				title="PERFORMANCE" 
				content={<PnLGraph />}  
				enabled={false}
			/>

			{tradingAccount && 
				<ShowMoreContainer 
					title="ACCOUNT SUMMARY" 
					content={<AccountSummary {...{tradingAccount}} />}
					onShowMore={() => navigation.navigate('Account')} 
					containerStyle={{}}
				/>
			}
			
			{portfolio && 
				<ShowMoreContainer 
					title="TOP POSITIONS" 
					containerStyle={{paddingLeft: WP(2)}}
					onShowMore={() => navigation.navigate('Portfolio')} 
					content={<PortfolioDisplay {...{portfolio, orders}} displayCount={MAX_POSITIONS_COUNT_HOME}/>} 
				/>
			}
			{(pendingOrders && pendingOrders.length > 0) && 
				<ShowMoreContainer title="PENDING ORDERS" 
					containerStyle={{marginTop: HP(2)}}
					content={<DisplayOrderList orders={pendingOrders}/>}
					endButton={<CancelOrderButton onPress={cancelOrders}/>}
					buttonContainerStyle={{justifyContent: 'flex-end', marginBottom: HP(2)}} 
				/>
			}
			{(relevantActivity && relevantActivity.length > 0) && 
				<ShowMoreContainer 
					title="RECENT ACTIVITY" 
					content={<DisplayActivityList activityList={relevantActivity}/>}
					endButton={<ShowMoreButton onPress={() => navigation.navigate('History')} />} 
				/>
			}

			{portfolio &&
				<ShowMoreContainer 
					title="PORTFOLIO NEWS" 
					containerStyle={{marginBottom: HP(4)}}
					content={<PortfolioNews symbols={portfolio.map(pos => pos.symbol)}/>} 
				/>
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
			justifyContent: 'space-between',
			padding: WP(2),
			paddingTop: WP(2),
			width: '100%',
			shadowColor: "#fff",
			shadowOpacity: 1,
			shadowRadius: 5,
			shadowOffset: {
				height: 11,
				width: 0
			},
			elevation: 5
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

export default Home;

