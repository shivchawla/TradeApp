 import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {AppView, AppHeader, PnLText, 
	LineChart, VerticalField,
	AccountIcon, SearchIcon, ShowHideButton } from '../../components/common';

import { PortfolioDisplay } from '../../components/portfolio';
import { DisplayOrderList } from '../../components/order';
import { DisplayActivityList } from '../../components/activity';

import * as Theme from '../../theme';
import { useStockPortfolioData, useTradingAccountData, 
	usePortfolioHistory, useOrders, useAccountActivity } from '../../helper';

import {formatValue} from '../../utils';
import {ACCOUNT_SUMMARY_FIELDS} from '../../config';

const {useTheme, WP, StyledText} = Theme;

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

const PortfolioContentView = ({title, content, show = true, ...props}) => {
	const {theme, styles} = useStyles();
	const [showDetail, setShow] = useState(show);

	return (
		<View style={[styles.outerContentContainer, props.containerStyle]}>
			<View style={styles.contentHeader}>
				<TouchableOpacity onPress={() => setShow(!showDetail)}>
					<StyledText style={styles.contentTitle}>{title}</StyledText>
				</TouchableOpacity>
				<ShowHideButton containerStyle={styles.contentToggleIcon} {...{showDetail}} onToggle={() => setShow(!showDetail)} />
			</View>
			{showDetail && <View style={styles.contentContainer}>{content}</View>}
		</View>
	)
}

const Portfolio = (props) => {
	const {portfolio} = useStockPortfolioData(); 
	const {tradingAccount} = useTradingAccountData();
	const {portfolioHistory} = usePortfolioHistory();
	const {orders} = useOrders({status: 'open'});
	const {accountActivity, getAccountActivity } = useAccountActivity()
	
	const [relevantActivity, setActivity] = useState(null);

	React.useEffect(() => {
		if (!!accountActivity) {
			setActivity(accountActivity.filter(item => !!item.type && (item.type == "fill" || item.type.includes("div"))));
			// setActivity(accountActivity);
		}
	}, [accountActivity])

	const {theme, styles} = useStyles();

	const getLatestEquity = (history) => {
		return (history?.equity || []).slice(-1)[0];
	}

	const getPnL = (history) => {
		return (history?.profit_loss || []).slice(-1)[0];
	}

	const PortfolioHeader = () => {
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

	const PnLGraph = () => {
		return <LineChart values={portfolioHistory?.equity || []} /> 	
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


	const loading = !!!portfolioHistory;

	return (
		<AppView loading={loading} header={<PortfolioHeader />} title="Portfolio">
			{tradingAccount && <PortfolioContentView title="ACCOUNT SUMMARY" content={<AccountSummary />} containerStyle={{marginTop: WP(10)}}/>}
			<PortfolioContentView title="PERFORMANCE" content={<PnLGraph />}  show={false}/>
			{portfolio && <PortfolioContentView title="POSITIONS" content={<PortfolioDisplay {...{portfolio, orders}}/>} />}
			{(orders && orders.length > 0) && <PortfolioContentView title="PENDING ORDERS" content={<DisplayOrderList {...{orders}}/>} />}
			{(relevantActivity && relevantActivity.length > 0) && <PortfolioContentView title="RECENT ACTIVITY" content={<DisplayActivityList activityList={relevantActivity}/>} />}
		</AppView>
	);
}

const useStyles = () => {
	const theme = useTheme();
	
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
		outerContentContainer: {
			borderTopWidth:1,
			borderColor: theme.grey9,
			marginTop: WP(5),
			marginBottom: WP(5),
			width: WP(100) 
		},
		contentContainer: {
			marginTop: WP(5),
			paddingLeft: WP(2), 
			paddingRight: WP(2) 
		},
		contentHeader: {
			marginTop: -11,
			flexDirection: 'row',
			justifyContent: 'space-between'		
		},
		contentTitle: {
			backgroundColor: theme.background,
			paddingRight: WP(2),
			color: theme.grey3,
			fontWeight: '700',
			fontSize: WP(3.5)
		},
		contentToggleIcon: {
			backgroundColor: theme.background,
			paddingRight: WP(4),
			paddingLeft: WP(2),
			marginTop: WP(-1),
		}
		
	});

	return {theme, styles};
}

export default Portfolio;

