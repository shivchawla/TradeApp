import React, {useEffect, useState} from 'react';
import { View, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { AppView, VerticalField } from '../../components/common';

import { useTradingAccountData } from '../../helper';

import {formatValue} from '../../utils';
import {ACCOUNT_FIELDS, MAX_ACTIVITY_COUNT_HOME, MAX_POSITIONS_COUNT_HOME} from '../../config';
import { t } from 'i18next';

import {useTheme, useDimensions, useTypography, StyledText} from '../../theme';


const HorizontalField = ({label, value, isNumber = false, ...props}) => {
	const {theme, styles} = useStyles();

	return (
		<View style={[styles.horizontalField, props.fieldStyle]}>
			<StyledText style={styles.horizontalFieldLabel}>{label}: </StyledText>
			<StyledText {...{isNumber}} style={styles.horizontalFieldValue}>{formatValue(value)}</StyledText>
		</View>
	)
}

const AccountSummary = ({tradingAccount}) => {
	const {theme, styles} = useStyles();

	const getLabel = (key) => {
		console.log(typeof(ACCOUNT_FIELDS[key]));

		if(typeof(ACCOUNT_FIELDS[key]) == 'object') {
			return ACCOUNT_FIELDS[key].title;
		} else {
			return ACCOUNT_FIELDS[key];
		}
	}

	const getValue = (key) => {
		if(typeof(ACCOUNT_FIELDS[key]) == 'object' && ACCOUNT_FIELDS[key].isBool) {
			return tradingAccount[key] ? 'YES' : 'NO';
		} else {
			return tradingAccount[key];
		}
	}

	const isNumber = (key) => {
		if(typeof(ACCOUNT_FIELDS[key]) == 'object' && (ACCOUNT_FIELDS[key].isBool || ACCOUNT_FIELDS[key].isText)) {	
			return false;
		} else {
			return true;
		}

	}


	return (
		<View style={styles.accountSummaryContainer}>
		{tradingAccount && Object.keys(ACCOUNT_FIELDS).map((key, index) => {
			return (
				<HorizontalField 
					{...{key}}  
					isNumber={isNumber(key)}
					label={getLabel(key)} 
					value={getValue(key)}
				/>
			) 
		})
		}		
		</View>
	)	
}



const Account = () => {

	const navigation = useNavigation();
	const {theme, styles} = useStyles();
	const {WP, HP} = useDimensions();

	const {isLoading, tradingAccount} = useTradingAccountData();

	console.log("Trading Account");
	console.log(tradingAccount);

	return (
		<AppView title="Account" {...{isLoading}}>
			{tradingAccount && <AccountSummary {...{tradingAccount}} />}
		</AppView>
		
	)
}

const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();
	
	const styles = StyleSheet.create({
		horizontalField: {
			flexDirection: 'row', 
			paddingTop: HP(1),
			paddingBottom: HP(2),
			borderBottomWidth: 0.5,
			borderBottomColor: theme.grey9
		},
		horizontalFieldLabel: {
			fontSize: WP(4.5),
			width: '65%',
			color: theme.grey1
		},
		horizontalFieldValue: {
			// fontSize: WP(3.5),
			width: '35%',
			textAlign: 'right',
			paddingRight: WP(1)
		},
	})

	return {theme, styles}
}

export default Account;