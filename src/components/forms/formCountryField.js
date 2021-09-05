import React, {useState} from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';

import { Icon } from '../../components/common';

import { useTheme, WP, HP, StyledText } from '../../theme';

export const FormCountryField = ({field, ...props}) => {
	
	const { handleChange, values } = props.handler;

	const [show, setShow] = useState(false);
	const {theme, styles} = useStyles();

	const handleSelect = (country) => {
		const {cca2, name} = country; 

		console.log("Selected Country");
		console.log(country);
		handleChange(`${field}.code`)(cca2);
		handleChange(`${field}.name`)(name);
	}

	const selectedValue = values[field];

	const CountryField = () => {
		return (
			<>
			{!!selectedValue &&
				<TouchableOpacity style={[styles.picker, props.pickerStyle]} onPress={() => setShow(!show)}>
					<StyledText style={[styles.pickerValue, props.valueStyle]}>{selectedValue?.name ?? ''}</StyledText> 
					{show ? <Icon iconName="chevron-up" iconColor={theme.grey3} iconSize={WP(5)} />
					 : <Icon iconName="chevron-down" iconColor={theme.grey3} iconSize={WP(5)} />
					}
				</TouchableOpacity>
			}
			</>
		)
	}

	return (	
		<CountryPicker
	        countryCode={selectedValue?.code || 'GT'}	 
	        preferredCountries={['GT', 'IN']}
	        onSelect={handleSelect}
	        renderFlagButton={CountryField}
	        visible={show}
	        onClose={() => setShow(false)}
        /> 
	)
}

const useStyles = () => {

	const {theme} = useTheme();

	const styles = StyleSheet.create({
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
			marginBottom: HP(3)
		},

		pickerValue: {
			fontSize: WP(4.5)
		}
	});

	return {theme, styles};
}

