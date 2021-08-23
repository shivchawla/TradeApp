import React, {useState} from 'react';
import { ScrollView, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { AppView, CalendarIcon, FullViewModal, DisplayOrderInList, 
	DateRangePicker, VerticalField, ConfirmButton, HorizontalButtonGroup } from '../../components/common';
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

const ShowHistoryItem = ({item}) => {
	if(item.type == 'order') {
		return <DisplayOrderInList order={item}/>
	} else {
		return <></>
	}
}

const ZeroActivityCount = ({start, end}) => {
	const {styles} = useStyles();
	return (
		<View style={styles.noActivityContainer}>
			<StyledText style={styles.noActivityTitle}>No Activities Found</StyledText>
		</View>
	) 
}

const ShowHistory = ({field, start, end}) => {
	const {theme, styles} = useStyles();

	const {accountActivity, getAccountActivity } = useAccountActivity({activity_type: field, after: start, until: end}, {enabled: field != 'all'})
	
	const orderQuery = {
		status: 'all',
		...(end && end != '') && {until: toISODate(end)},
		...(start && start != '') && {after: toISODate(start)},
	}

	const {orders, getOrders} = useOrders(orderQuery);

	// console.log("AccountActivity");
	// console.log(accountActivity);

	// console.log("Orders")
	// console.log(orders);

	//Now fills are present in both orders and accountActivity
	//Remove fills from accountActivity 

	const removeFills = (activities) => {
		return activities.filter(item => item.type != 'fill');
	}

	const updateOrderActivity = (orders) => {
		return orders.map(item => {
			return {...item, type: 'order'};
		})
	}	

	const allActivities = updateOrderActivity(orders || []).concat(removeFills(accountActivity || [])) 

	return (
		<View style={{flex:1}}>
			{(!!allActivities && allActivities.length > 0) ? 
				<FlatList
					style={styles.activityFlatList} 
				  	showsVerticalScrollIndicator={false}
					data={allActivities}
					keyExtractor={(item) => item.id}
					renderItem={({item, index}) => <ShowHistoryItem {...{item}} />}
				/>
				: <ZeroActivityCount {...{start, end}}/>
			}


		</View>
	)
}

const History = (props) => {
	const [isModalVisible, setModalVisible] = useState(false);

	//USE LATEST TRADING DATE
	// const currentDate
	const [start, setStart] = useState('');
	const [end, setEnd] = useState('');

	const [field, setField] = useState(null);
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

	return (
		<AppView scroll={false} title="History" headerRight={<CalendarIcon onPress={() => setModalVisible(true)}/>}>
		
			<HorizontalFieldSelection onSelect={handleFieldSelection} />
			<HorizontalPeriodSelection onSelect={handlePeriodSelection} />

			<ShowHistory {...{field, start, end}} />

			<FullViewModal 
				isVisible={isModalVisible} 
				onClose={() => setModalVisible(false)} 
				title="Select Range">
				<View style={styles.modalContent}>
					<View style={styles.displayContainer}>
						<VerticalField label="START" value={start} containerStyle={{alignItems: 'flex-start', paddingLeft: WP(5)}}/>
						<VerticalField label="END" value={end} containerStyle={{alignItems: 'flex-end', paddingRight: WP(5)}}/>
					</View>
					<View style={styles.calendarContainer}>
						<DateRangePicker
						  initialRange={[start, end]}	
						  maxDate={currentISODate('YYYY-MM-DD')}	
				          onSuccess={(s, e) => {setStart(s); setEnd(e);}}
				          style={styles.calendar}
				          theme={{ 
				          	calendarBackground: theme.background, 
				          	markColor: theme.backArrow, 
				          	markTextColor: theme.selectedColor,
			          		arrowColor: theme.icon,
			          		monthTextColor: theme.shadedText,
			          		textDisabledColor: theme.text,
			      		    dayTextColor: theme.shadedText,
			          	}}
			          	/>
		          	</View>

		          	{(!!start && !!end) && <ConfirmButton 
		          		onClick={() => setModalVisible(false)} 
		          		title="DONE" 
		          		buttonContainerStyle={{position: 'absolute', bottom:5}}
		          		buttonStyle={{width: '90%'}}/>
	          		}
	          	</View>
			</FullViewModal>
		</AppView>
	);
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		modalContent:{
			marginTop: HP(10),
		},
		displayContainer: {
			width: '100%', 
			flexDirection: 'row', 
			justifyContent: 'space-between'
		},
		calendarContainer: {
			flex:1,
			justifyContent: 'center'
		},
		calendar: {
			width: WP(95),
		},
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
