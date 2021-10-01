import React, {useState} from 'react';
import { ScrollView, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { AppView, CalendarIcon, 
	DatePickerModal, HorizontalButtonGroup } from '../../components/common';

import { DisplayActivityList } from '../../components/activity';

import { useTheme, WP, HP, StyledText} from '../../theme';
import {currentISODate, NWeeksAgoISODate, NDaysAgoISODate, toISODate} from  '../../utils';
import { useAccountActivity, useOrders } from '../../helper'

const HorizontalFieldSelection = ({onSelect}) => {
	const {styles} = useStyles();
	const items = {'all': 'All', 'orders': 'Orders', 'dividends': 'Dividends'};
	return <HorizontalButtonGroup 
		initialValue={0}
		{...{items, onSelect}} 
		buttonStyle={styles.fieldSelectionButton}
		buttonTextStyle={styles.fieldSelectionButtonText}
		selectedButtonStyle={styles.selectedFieldButton} 
	/>
}

const HorizontalPeriodSelection = ({onSelect}) => {
	const {styles} = useStyles();
	//Instead get calendar days -- To be Fixed!!!
	var items = {};
	[...Array(10).keys()].forEach(i => {
		items= {...items, 
			[NDaysAgoISODate(i, "YYYY-MM-DD")]:[NDaysAgoISODate(i, "Do MMM YY")]
		}
	})

	return <HorizontalButtonGroup
		initialValue={null} 
		scroll={true}
		{...{items, onSelect}} 
		buttonStyle={styles.periodSelectionButton}
		buttonTextStyle={styles.periodSelectionButtonText}
		selectedButtonStyle={styles.selectedPeriodButton} 
	/>
}

const ZeroActivityCount = () => {
	const {styles} = useStyles();
	return (
		<View style={styles.noActivityContainer}>
			<StyledText style={styles.noActivityTitle}>No Activities Found</StyledText>
		</View>
	) 
}

const ShowHistory = ({field, range, onLoadingEnd}) => {
	const {theme, styles} = useStyles();

	const [start, end] = range || [];

	const {isLoading: isLoadingActivity, accountActivity, getAccountActivity } = useAccountActivity({activity_type: field, after: start, until: end}, {enabled: field != 'all'})
	
	const orderQuery = {
		status: 'all',
		...(end && end != '') && {until: toISODate(end)},
		...(start && start != '') && {after: toISODate(start)},
	}

	const {isLoading: isLoadingOrders, orders, getOrders} = useOrders(orderQuery);

	React.useEffect(() => {
		if (!isLoadingActivity && !isLoadingOrders) {
			onLoadingEnd();
		}
	}, [isLoadingActivity, isLoadingOrders])	


	const removeFills = (activities) => {
		return activities.filter(item => item.activity_type != 'FILL');
	}

	const updateOrderActivity = (orders) => {
		return orders.map(item => {
			return {...item, activity_type: 'ORDER'};
		})
	}	

	const allActivities = updateOrderActivity(orders || []).concat(removeFills(accountActivity || [])) 

	const isLoading = isLoadingActivity || isLoadingOrders;

	return (
		<View style={{flex:1}}>
			{!isLoading &&
				<>
				{(!!allActivities && allActivities.length > 0) ? 
					<DisplayActivityList
						style={styles.activityFlatList} 
						activityList={allActivities}
					/>
					: 
					<ZeroActivityCount />
				}
				</>
			}
		</View>
	)
}

const History = (props) => {
	const [isModalVisible, setModalVisible] = useState(false);

	const [range, setRange] = useState(null);
	const [field, setField] = useState(null);
	const [isLoading, setLoading] = useState(true);

	//Period needs to in  form of range tooo... avoid extra state variable
	const [period, setPeriod] = useState(null)

	const {theme, styles} = useStyles();

	const handleFieldSelection = (field) => {
		console.log("Handle Field Selection: ", field);
		setField(field);
	}

	const handlePeriodSelection = (period) => {
		console.log("Handle Period Selection: ", period);
		setPeriod(period);
	}

	React.useEffect(() => {
		if (range) {
			setLoading(true);
		}
	}, [range])

	return (
		<AppView isLoading={isLoading} scroll={false} title="History" headerRight={<CalendarIcon onPress={() => setModalVisible(true)}/>}>
		
			<HorizontalFieldSelection onSelect={handleFieldSelection} />
			<HorizontalPeriodSelection onSelect={handlePeriodSelection} />

			<ShowHistory 
				{...{field, range}} 
				onLoadingStart={() => setLoading(true)} 
				onLoadingEnd={() => {console.log("Set Loading: false"); setLoading(false)}}
			/>

			<DatePickerModal 
				isVisible={isModalVisible}
				onClose={() => setModalVisible(false)}
				onSelectRange={(s,e) => setRange([s,e])}
			/>

		</AppView>
	);
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		buttonGroupContainer: {
			flexDirection: 'row',
			marginTop: WP(3),
			width: '100%'
		},
		scrollButtonGroupContainer: {
			marginTop: WP(3),
			maxHeight: 30,
			alignItems: 'center'
		},
		fieldSelectionButton: {
			backgroundColor: theme.grey9,
			padding: WP(1),
			paddingLeft: WP(4),
			paddingRight: WP(4),
			marginRight: WP(4)
		},
		fieldSelectionButtonText: {
			
		},
		selectedFieldButton: {
			backgroundColor: theme.backArrow,
		},
		periodSelectionButton: {
			borderColor: theme.grey5,
			borderWidth:1,
			padding: WP(1),
			paddingLeft: WP(3),
			paddingRight: WP(3),
			marginRight: WP(2),
		},
		periodSelectionButtonText: {

		},
		selectedPeriodButton: {
			borderColor: theme.backArrow,
		}, 
		noActivityContainer: {
			flex:1,
			justifyContent: 'center',
			alignItems: 'center'
		},
		noActivityTitle: {
			fontSize: WP(5)
		},
		activityFlatList: {
			marginTop: WP(5)
		}
	});

	return {theme, styles};
}

export default History;
