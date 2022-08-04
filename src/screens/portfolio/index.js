 import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import {AppView, AppHeader, PnLText, 
	LineChart, VerticalField,
	AccountIcon, SearchIcon, Collapsible, Clickable } from '../../components/common';

import { PortfolioDisplay, PnLGraph	 } from '../../components/portfolio';
import { DisplayOrderList } from '../../components/order';
import { DisplayActivityList } from '../../components/activity';

import * as Theme from '../../theme';
import { useStockPortfolioData, useTradingAccountData, 
	usePortfolioHistory, useOrders, useCancelAllOrders, useAccountActivity } from '../../helper';

import {formatValue} from '../../utils';
import {ACCOUNT_SUMMARY_FIELDS} from '../../config';

const {useTheme, WP, HP, StyledText} = Theme;

const HorizontalField = ({label, value, isPnL=false, ...props}) => {
	const {theme, styles} = useStyles();

	return (
		<View style={{flexDirection: 'row'}}>
			<StyledText style={styles.pnlHeaderLabel}>{label}: </StyledText>
			{isPnL ? 
				<PnLText {...{value}} {...{valueStyle: styles.pnlHeaderValue}} />
				: <StyledText style={styles.pnlHeaderValue}>{value}</StyledText>
			}
		</View>
	)
}

const ShowMoreButton = ({onPress}) => {
	const {theme, styles} = useStyles();
	return (
		<Clickable onPress={onPress}>
			<StyledText style={styles.showMoreText}>SHOW MORE</StyledText>
		</Clickable>
	)
}

const CancelOrderButton = ({onPress}) => {
	const {theme, styles} = useStyles();
	return (
		<Clickable onPress={onPress}>
			<StyledText style={styles.cancelOrderText}>CANCEL ALL</StyledText>
		</Clickable>
	)
}

const getLatestEquity = (history) => {
	return (history?.equity || []).slice(-1)[0];
}

const getPnL = (history) => {
	return (history?.profit_loss || []).slice(-1)[0];
}


const PortfolioHeader = ({portfolioHistory}) => {
	const {theme, styles} = useStyles();

	return (
		<>
		<AppHeader headerLeft={<AccountIcon />} headerRight={<SearchIcon onPress={() => navigation.navigate("SearchStock")} iconColor={theme.greyIcon}/>} title="Portfolio" goBack={false} />
		<View style={styles.portfolioHeader}>
			<VerticalField 
				label="Total Balance" 
				labelTop={false} 
				value={getLatestEquity(portfolioHistory)} 
				valuePrefix='$ '
				valueStyle={{fontSize: WP(6), fontWeight: '700'}}
			/>
			<View>
				<HorizontalField
					label="Chg. (1M)"
					value={formatValue(getPnL(portfolioHistory))}
					isPnL={true}
				/>
				<HorizontalField
					label="Chg. (1D)"
					value={formatValue(getPnL(portfolioHistory))}
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
					containerStyle={styles.accountSummaryField} 
				/>
			) 
		})
		}		
		</View>
	)	
}

const Portfolio = (props) => {
	const navigation = useNavigation();
	const {theme, styles} = useStyles();

	const {portfolio, getPortfolio} = useStockPortfolioData({enabled: false}); 
	const {tradingAccount, getTradingAccount} = useTradingAccountData({enabled: false});
	const {portfolioHistory, getPortfolioHistory} = usePortfolioHistory({enabled: false});
	const {orders, getOrders} = useOrders({status: 'all', limit: 10}, {enabled: false});
	const {accountActivity, getAccountActivity } = useAccountActivity({activity_type: 'DIV', limit: 10}, {enabled: false});
	
	const {cancelAllOrders} = useCancelAllOrders();
	const [relevantActivity, setActivity] = useState(null);

	React.useEffect(() => {
		(async() => {
			if (!!accountActivity && !!orders) {
				var allExceptNewOrders = orders.filter(item => item.status != "new").map(item => {return {...item, activity_type: 'ORDER'}});
				setActivity([...accountActivity, ...allExceptNewOrders].slice(0, 10));
			}
		})()
	}, [accountActivity, orders]);

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

	const cancelOrders = () => {
		cancelAllOrders({
			onSuccess: (response, input) => getOrders(),
			onError: (err, input) => console.log(err)
		})
	}

	const loading = !!!portfolioHistory;

	const pendingOrders = orders && orders.filter(item => item.status == "new");

	return (
		<AppView isLoading={loading} header={<PortfolioHeader {...{portfolioHistory}}/>} title="Portfolio">
			<Collapsible 
				title="PERFORMANCE" 
				content={<PnLGraph />}  
				show={true}
			/>

			{tradingAccount && 
				<Collapsible 
					title="ACCOUNT SUMMARY" 
					content={<AccountSummary {...{tradingAccount}} />} 
					containerStyle={{}}
				/>
			}
			
			{portfolio && 
				<Collapsible 
					title="POSITIONS" 
					containerStyle={{paddingLeft: WP(2)}}
					content={<PortfolioDisplay {...{portfolio, orders}}/>} 
				/>
			}
			{(pendingOrders && pendingOrders.length > 0) && 
				<Collapsible title="PENDING ORDERS" 
					containerStyle={{marginTop: HP(2)}}
					content={<DisplayOrderList orders={pendingOrders}/>}
					endButton={<CancelOrderButton onPress={cancelOrders}/>}
					buttonContainerStyle={{justifyContent: 'flex-end', marginBottom: HP(2)}} 
				/>
			}
			{(relevantActivity && relevantActivity.length > 0) && 
				<Collapsible 
					title="RECENT ACTIVITY" 
					content={<DisplayActivityList activityList={relevantActivity}/>}
					endButton={<ShowMoreButton onPress={() => navigation.navigate('History')} />} 
				/>
			}
		</AppView>
	);
}

const useStyles = () => {
	const {theme} = useTheme();
	
	const styles = StyleSheet.create({
		portfolioHeader: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			// borderBottomWidth:1,
			// borderColor: theme.grey5,
			padding: WP(2),
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
		showMoreText: {
			color: theme.backArrow
		},
		cancelOrderText: {
			color: theme.red
		}
	});

	return {theme, styles};
}

export default Portfolio;

