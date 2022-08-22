import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import { VerticalField } from './verticalField'
import { FullViewModal } from './fullViewModal';
import { ConfirmButton } from './confirmButton';
import { DateRangePicker } from './dateRangePicker';

import {useTheme, useDimensions, useTypography, StyledText} from '../../theme';
import {currentISODate} from '../../utils';

export const DatePickerModal = ({isVisible, onClose, onSelectRange}) => {

	const [start, setStart] = useState('');
	const [end, setEnd] = useState('');

	const {theme, styles} = useStyles();
	const { HP, WP } = useDimensions();

	return (
		<FullViewModal 
			{...{isVisible, onClose}} 
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
	          		onClick={() => {
          				onClose(); 
          				onSelectRange(start, end);
          			}} 
	          		title="DONE" 
	          		buttonContainerStyle={{position: 'absolute', bottom:5}}
	          		buttonStyle={{width: '90%'}}/>
          		}
          	</View>
		</FullViewModal>
	)
}


const useStyles = () => {
	const { theme } = useTheme();
	const { HP, WP } = useDimensions();
	    const Typography = useTypography();
	
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