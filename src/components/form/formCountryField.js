import React, {useState} from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import get from 'lodash/get';
import countries from 'i18n-iso-countries';
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/es.json"));

import { Icon } from '../../components/common';

import { useTheme, WP, HP, StyledText } from '../../theme';

export const FormCountryField = ({field, placeholder, ...props}) => {
	
	const { handleChange, values } = props.handler;

	const [show, setShow] = useState(false);
	const {theme, styles} = useStyles();

	const handleSelect = (country) => {
		const {name} = country; 
		handleChange(field)(name);
	}

	const selectedValue = get(values, field);

	const CountryField = () => {
		return (
			<TouchableOpacity style={[styles.picker, props.pickerStyle]} onPress={() => setShow(!show)}>
				<View style={{flex:1}}>
					{!!selectedValue && <StyledText style={styles.labelStyle}>{placeholder}</StyledText> }	
					<StyledText style={[styles.pickerValue, props.valueStyle]}>{selectedValue ?? placeholder}</StyledText> 
				</View>
				{show ? <Icon iconName="chevron-up" iconColor={theme.grey3} iconSize={WP(5)} />
				 : <Icon iconName="chevron-down" iconColor={theme.grey3} iconSize={WP(5)} />
				}
			</TouchableOpacity>
		)
	}

	return (	
		<CountryPicker
	        countryCode={countries.getAlpha2Code(selectedValue, "en") || 'GT'}	 
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
		},

		labelStyle: {
			position: 'absolute',
			marginTop: -24, //??
			fontSize: WP(3.5),
			color: theme.grey5,
			paddingLeft: WP(1),
			paddingRight: WP(1),
			backgroundColor: theme.background,
		}
	});

	return {theme, styles};
}

