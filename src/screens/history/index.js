import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AppView, CalendarIcon, FullViewModal, 
	DateRangePicker, VerticalField, ConfirmButton } from '../../components/common';
import { useTheme, WP, HP, StyledText} from '../../theme';

import {currentISODate, NWeeksAgoISODate} from  '../../utils';

const History = (props) => {
	const [isModalVisible, setModalVisible] = useState(false);
	const [start, setStart] = useState(NWeeksAgoISODate(1, 'YYYY-MM-DD'));
	const [end, setEnd] = useState(currentISODate('YYYY-MM-DD'));

	const {theme, styles} = useStyles();

	return (
		<AppView title="History" headerRight={<CalendarIcon onPress={() => setModalVisible(true)}/>}>
		
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
			          onSuccess={(s, e) => {console.log("Start: ",s);console.log("End: ",e);setStart(s); setEnd(e);}}
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

	          	<ConfirmButton 
	          		onClick={() => setModalVisible(false)} 
	          		title="DONE" 
	          		buttonContainerStyle={{position: 'absolute', bottom:5}}
	          		buttonStyle={{width: '90%'}}/>
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

		}
	});

	return {theme, styles};
}

export default History;
