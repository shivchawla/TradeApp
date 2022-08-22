import React, {useState} from 'react';
import { TouchableOpacity, StyleSheet, View} from "react-native";
import { useTranslation } from 'react-i18next';

import { AppView, CalendarIcon, DatePickerModal, HorizontalButtonGroup } from '../../components/common';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme';
import { useFunds } from '../../helper';
import { NMonthsAgoISODate, currentISODate, toTimeZoneDate} from '../../utils';

const ZeroTransactionCount = () => {
	return(
		<StyledText>No funding transaction found for this period</StyledText>
	)
}

const LabelValue = ({label, value, ...props}) => {
	const {theme, styles} = useStyles();

	return (
		<View style={styles.summaryLabelValue}>
			<StyledText style={styles.summaryLabel}>{label} </StyledText>
			{!!value && <StyledText style={[styles.summaryValue, props.valueStyle]}>{value}</StyledText>}
		</View>
	)
}

const ShowTransaction = ({transaction}) => {
	const {theme, styles} = useStyles();

	return (
		<View style={styles.summaryContainer}>
			<LabelValue label="Transaction Type" value={transaction?.type} valueStyle={styles.transactionType}/>
			<LabelValue label="Reference ID" value={transaction?.depositId || transaction?.withdrawId} />
			<LabelValue label="Date" value={toTimeZoneDate(transaction?.date, 'MMM Do YYYY hh:mm:ss A')} />
			<LabelValue label="Amount" value={transaction?.details?.finalAmount} />
			<LabelValue label="Bank Name" value={transaction?.details?.bankName} />
			<LabelValue label="Account Number" value={transaction?.details?.accountNumber} />
			<LabelValue label="Account Type" value={transaction?.details?.accountType} />
			<LabelValue label="Status" value={transaction?.status}/>
		</View>			
	)	
}

const ShowTransactionList = ({start, end, type}) => {
	const {theme, styles} = useStyles();

	const {getDeposits, getWithdraws, getFundingTransactions} = useFunds();
	const [transactions, setTransactions] = useState(null);

	React.useEffect(() => {
		(async() => {
			setTransactions(await getFundingTransactions({start, end, type}));
		})()
	}, [start, end, type])

	return (
		<>
		{transactions && transactions.length > 0 ? 
			<View style={styles.documentList}>
				{transactions && transactions.reverse().map((item, index) => {
					return (
						<ShowTransaction key={`transaction-${index}`} transaction={item} />
					)	
				})}
			</View>
		:
		<ZeroTransactionCount />
		}
		</>
	)
}


const FundHistory = (props) => {

	const [isModalVisible, setModalVisible] = useState(false);
	const [range, setRange] = useState([NMonthsAgoISODate(12), currentISODate()]);
	const [start, end] = range;

	const [type, setType] = useState('all'); 

	const onSelectType = (type) => {
		setType(type);
	}

	const {theme, styles} = useStyles();

	return (
		<AppView title="FUNDING HISTORY" headerRight={<CalendarIcon onPress={() => setModalVisible(true)} />} >
			
			<HorizontalButtonGroup 
				items={{all: 'All', deposit : 'Deposits', withdraw: 'Withdraws'}} 
				onSelect={onSelectType} 
				buttonStyle={styles.menuButton} 
				selectedButtonStyle={styles.selectedMenuButton}
				selectedButtonTextStyle={styles.selectedButtonText} 
			/>
			
			<ShowTransactionList {...{start, end, type}} />

			<DatePickerModal 
				isVisible={isModalVisible}
				onClose={() => setModalVisible(false)}
				onSelectRange={(s,e) => setRange([s,e])}
			/>
		</AppView>
	)
}


const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();


	const styles = StyleSheet.create({
		documentList: {
			// marginTop: HP(2),
			marginBottom: HP(5)
		},
		documentRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			height: 40,
			borderBottomWidth: 0.5,
			borderColor: theme.grey9,
			marginBottom: HP(2)
		},
		menuButton: {
			borderWidth: 1,
			borderColor: 'white',
			padding: WP(1),
			paddingLeft: WP(4),
			paddingRight: WP(4),
			marginRight: WP(5)
		},
		selectedMenuButton: {
			borderColor: theme.icon
		},
		selectedButtonText: {
			color: theme.icon
		},
		summaryContainer: {
			marginTop: HP(5),
			backgroundColor: theme.grey9,
			padding: WP(3),
		},
		summaryLabelValue: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: WP(1),
			alignItems: 'center' 
		},
		summaryLabel: {
			fontSize: WP(4),
			marginTop: WP(2),
			color: theme.grey4
		},
		summaryValue: {
			fontSize: WP(4),
			marginTop: WP(2),
			color: theme.grey
		},
		transactionType: {
			borderWidth: 1, 
			borderColor: theme.icon, 
			color: theme.icon, 
			padding: WP(1),
			paddingLeft: WP(2),
			paddingRight: WP(2)
		}
	})

	return {theme, styles};
}


export default FundHistory;

