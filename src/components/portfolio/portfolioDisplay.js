 import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
const Ionicons  = Icon;

import { PnLText } from '../common';
import { TickerDisplay, StockName } from '../market';
import { formatValue } from '../../utils';
import { OPEN_ORDER_STATUS } from '../../config';

import {useTheme, useDimensions, useTypography, StyledText} from '../../theme';

const TwoLineTitle = ({header, subHeader, ...props}) => {
	const { HP, WP } = useDimensions();
	const {theme} = useTheme();

	return (
		<View style={[{width: WP(30), alignItems: 'flex-start'}, props.containerStyle]}>
			<StyledText style={[{color: theme.grey3}, props.textStyle, props.headerStyle]}>{header}</StyledText>
			<StyledText style={[{fontSize: WP(3.5), color: theme.grey5}, props.textStyle, props.subHeaderStyle]}>{subHeader}</StyledText>
		</View>
	)
}

export const PortfolioDisplay = ({portfolio, orders = [], displayCount = -1, screen = 'Home'}) => {

	const {theme, styles} = useStyles();
	const { HP, WP } = useDimensions();

	const PortfolioDisplayHeaderHome= () => {
		return (
			<View style={styles.portfolioDisplayHeader}>
				<StyledText style={{width: WP(25), textAlign: 'left'}}>Symbol</StyledText>
				<StyledText style={{borderLeftWidth: 1,borderRightWidth: 1, borderColor: theme.grey5, width: WP(50), textAlign: 'center'}}>Last Price</StyledText>
				<StyledText style={{width: WP(25), textAlign:'center'}}>PnL</StyledText>
			</View>
		)
	}

	const DisplayPositionHome = ({position}) => {
		const {symbol, qty, side, unrealized_pl} = position;
		const navigation = useNavigation()

		const hasActiveOrder = orders.findIndex(item => item.symbol == symbol && OPEN_ORDER_STATUS.includes(item.status)) != -1;

		return (
			<TouchableOpacity style={styles.portfolioDisplayHeader} onPress={() => navigation.navigate('StockDetail', {symbol})}>
				<View style={styles.symbolQtyContainer}>
					<View style={{flexDirection: 'row', alignItems: 'center'}}> 
						<StyledText style={styles.symbol}>{symbol}</StyledText>
						{hasActiveOrder && 
							<View style={{marginLeft: WP(1)}}>
								<Ionicons name="ellipse" color={theme.green} size={WP(2)} />
							</View>
						}

					</View>
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

	const PortfolioDisplayHeaderMain= () => {
		return (
			<View style={[styles.portfolioDisplayHeader, {paddingBottom: HP(2), borderBottomWidth: 1, borderBottomColor: theme.grey9}]}>
				<TwoLineTitle containerStyle={{alignItems: 'flex-start', width: WP(35)}} header="Symbol" subHeader="Name"/>
				<TwoLineTitle containerStyle={{width: WP(35)}} header="Value" subHeader="Shares" />
				<TwoLineTitle containerStyle={{alignItem: 'flex-start', width: WP(30)}} header="Last" subHeader="Change(%)" />
			</View>
		)
	}

	const DisplayPositionMain = ({position}) => {
		const {symbol, qty, side, unrealized_pl,market_value} = position;
		const navigation = useNavigation();
		const {HP, WP} = useDimensions();

		const hasActiveOrder = orders.findIndex(item => item.symbol == symbol && OPEN_ORDER_STATUS.includes(item.status)) != -1;

		return (
			<TouchableOpacity style={styles.portfolioDisplayHeader} onPress={() => navigation.navigate('StockDetail', {symbol})}>
				<View style={[styles.symbolQtyContainer, {width: WP(35)}]}>
					<View style={{flexDirection: 'row', alignItems: 'center'}}> 
						<StockName {...{symbol}} nameStyle={{color: theme.grey5}}/>
						{hasActiveOrder && 
							<View style={{marginLeft: WP(1)}}>
								<Ionicons name="ellipse" color={theme.green} size={WP(2)} />
							</View>
						}
					</View>
				</View>
				<View style={{width: WP(35)}}>
					<StyledText>USD {formatValue(market_value)} </StyledText>
					<StyledText style={[styles.quantity, {textAlign: 'left'}]}>{formatValue(qty)} Shares</StyledText>
				</View>
				<TickerDisplay {...{symbol}}
					vertical={true}
					style={[styles.tickerDisplayContainer, {width: WP(30), alignItems: 'flex-start'}]} 
					priceChangeStyle={styles.priceChangeStyle}
					priceStyle={styles.priceStyle}/>
			</TouchableOpacity>
		)
	}

	return (
		<View style= {styles.portfolioDisplayContainer}>
			{/*<StyledText style={styles.portfolioDisplayTitle}>POSITIONS</StyledText>*/}
			{screen == 'Home' ? <PortfolioDisplayHeaderHome /> : <PortfolioDisplayHeaderMain />}
			{screen == 'Home' && portfolio.slice(0, displayCount).map((item, index) => {
				return <DisplayPositionHome key={index} position={item} />
			})}

			{screen == 'Portfolio' && portfolio.map((item, index) => {
				return <DisplayPositionMain key={index} position={item} />
			})}
		</View>

	)
}


const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();
	
	const styles = StyleSheet.create({
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
			fontSize: WP(4),
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
			flexDirection: 'row',
			justifyContent: 'center'
		},
		priceChangeStyle: {
			// textAlign: 'center',
			// marginLeft: WP(2),
			fontSize: WP(3.5)
		},
		priceStyle: {
			fontSize: WP(4)
		}
	});

	return {theme, styles};
}
