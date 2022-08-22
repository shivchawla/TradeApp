import React, {useState} from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import get from 'lodash/get';

import { CustomIcon, FullViewModal } from '../../components/common';
import { useTheme, StyledText } from '../../theme';
import { currentISODate, toISODate, startOfDayLocal } from '../../utils';

export const FormDateField = ({field, placeholder, ...props}) => {
	
	const { handleChange, errors, values } = props.handler;

	const [show, setShow] = useState(false);
	const {theme, styles} = useStyles();

	const handleDaySelect = (d) => {
		// console.log("Selected Date");
		// console.log(d);
		// console.log(startOfDayLocal(d.nativeEvent.timestamp));
		// console.log(new Date(d.nativeEvent.timestamp).toLocaleDateString());
		// console.log(toISODate(startOfDayLocal(d.nativeEvent.timestamp), "YYYY-MM-DD"));

		handleChange(field)(startOfDayLocal(d.nativeEvent.timestamp));
		setShow(false);
	}

	const value = get(values, field);
	const date = value ? new Date(value) : new Date();
	const displayDate = value ? toISODate(value, 'DD/MM/YYYY') : ''; 

	const error = get(errors, field);

	return (
		<View style={styles.fieldContainer}>
			<TouchableOpacity style={[styles.picker, props.pickerStyle]} onPress={() => setShow(!show)}>
				<View style={{flex: 1}}>
					{!!displayDate && <StyledText style={styles.labelStyle}>{placeholder}</StyledText>}
					<StyledText style={[styles.pickerValue, props.valueStyle, {...!!!displayDate && {color: theme.grey7}}]}>{displayDate || placeholder}</StyledText>
				</View>
				{show ? <CustomIcon iconName="chevron-up" iconColor={theme.grey3} iconSize={WP(5)} />
				 : <CustomIcon iconName="chevron-down" iconColor={theme.grey3} iconSize={WP(5)} />
				}
			</TouchableOpacity>
			{error && <StyledText style={styles.errorText}>{error}</StyledText>}

			{show && 
				<DateTimePicker
					mode="date"
					value={date}
			        onChange={handleDaySelect}
			        maximumDate={new Date()}
		      	/>
			}
		</View>
	)
}


const useStyles = () => {

	const {theme, HP, WP, Typography} = useTheme();


	const styles = StyleSheet.create({
		fieldContainer: {
			marginBottom: HP(3)
		},
		picker: {
			flexDirection: 'row',
			width: '90%',
			alignItems: 'center', 
			borderWidth:1, 
			borderColor: theme.grey5, 
			height:50,
			paddingLeft: WP(4),
			paddingRight: WP(4), 
			justifyContent:'space-between', 
		},

		pickerValue: {
			fontSize: WP(4.5)
		},

		labelStyle: {
			position: 'absolute',
			marginTop: -24, //??
			fontSize: WP(3.5),
			color: theme.grey5,
			paddingLeft: WP(1),
			paddingRight: WP(1),
			backgroundColor: theme.background
		},
		errorText: {
			textAlign:'left',
			color: theme.error,
			marginTop: HP(0.2)
		},
	});

	return {theme, styles};
}

