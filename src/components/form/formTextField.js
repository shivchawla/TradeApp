import React, {useState} from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import get from 'lodash/get';
import CountryPicker, {Flag} from 'react-native-country-picker-modal';

import { useTheme, StyledText, WP, HP } from '../../theme';

export const FormTextField = ({field, placeholder, handler, setCustomError = null, ref = null, disabled = false, instructionText='', isPhone=false, ...props}) => {
	const { handleChange, handleBlur, handleSubmit, values, errors, touched, setErrors} = handler;

	// console.log("FormTextField");
	// console.log(field);
	// console.log(handleChange);

	const {theme, styles} = useStyles();
	const value = get(values, field);
	const error = get(errors, field);
	const [showCountry, setShowCountry] = useState(false)
	const [selectedCountry, setSelectedCountry] = useState(null)
	const [valueWithoutCode, setValueWithoutCode] = useState(null)

	React.useEffect(() => {
		setValueWithoutCode(value.replace(callingCode ?? '',''))
	}, [value])

	const [callingCode, setCallingCode] = useState(null);

	const handleChangeNumber = (txt) => {
		if (isPhone) {
			console.log("handleChangeNumber")
			handleChange(field)(callingCode + txt)
		} else {
			handleChange(field)(txt);
		}
	}

	React.useEffect(() => {
		if(selectedCountry) {
			console.log("Country Selected");
			console.log(selectedCountry);
			console.log(selectedCountry?.callingCode?.[0]);
			setCallingCode('+' + selectedCountry?.callingCode?.[0]);
		} else {
			setCallingCode('+502');
		}
	}, [selectedCountry])

	React.useEffect(() => {
		handleChangeNumber(valueWithoutCode || '');
	}, [callingCode])

	const FlagButton = () => {
		return (
			<TouchableOpacity onPress={() => setShowCountry(true)} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
				<Flag countryCode={selectedCountry?.cca2 || 'GT'} /><StyledText style={{fontSize: WP(4.5), marginLeft: WP(-3)}}>({callingCode})</StyledText>
			</TouchableOpacity>
		)
	}

	const handleSelect = (country) => {
		setSelectedCountry(country);
	}

	return (
		<View style={[styles.fieldContainer, props.containerStyle]}>
			<View style={styles.inputContainer}>
				{!!value && <StyledText style={styles.labelStyle}>{placeholder}</StyledText>}
				
				
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					{isPhone &&  
						<CountryPicker
					        countryCode={selectedCountry?.cca2 ?? 'GT'}	
					        withCallingCode={true} 
					        preferredCountries={['GT', 'IN']}
					        onSelect={handleSelect}
					        renderFlagButton={FlagButton}
					        visible={showCountry}
					        onClose={() => setShowCountry(false)}
			      		/>
		      		}
					<TextInput style={[styles.textinput, props.inputStyle]}
						placeholder={isPhone ? '' : placeholder}
						style={[{fontSize: WP(4.5)}, {...isPhone && {marginTop: 3, marginLeft: 10, flex:1}}]}
						keyboardType={props?.type ?? 'default'}
						placeholderTextColor={theme.grey7}
						onChangeText={handleChangeNumber}
						onBlur={handleBlur(field)}
						onFocus={() => {setErrors({}); if(setCustomError) {setCustomError()}}}
						onSubmitEditing={() => props?.nextRef?.current?.focus() || ''}
						autoCompleteType="off"
						value={valueWithoutCode}
						autoFocus={isPhone}
						editable={!disabled}
					/>
				</View>
			</View>
			{!!instructionText && <StyledText style={styles.instructionText}>{instructionText}</StyledText>}
			{error && <StyledText style={styles.errorText}>{error}</StyledText>}

		</View>
	)
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		fieldContainer: {
			marginBottom: HP(3),
			width: '90%',
		},
		inputContainer: {
			borderWidth: 1,
			borderColor: theme.grey5,
			paddingLeft: WP(3),

		},
		textInput: {
			color: theme.text,
			backgroundColor: theme.background,
		},
		labelStyle: {
			position: 'absolute',
			marginTop: -11, //??
			fontSize: WP(3.5),
			color: theme.grey5,
			paddingLeft: WP(1),
			paddingRight: WP(1),
			left: WP(3),
			backgroundColor: theme.background
		},
		errorText: {
			textAlign:'left',
			color: theme.error,
			marginTop: HP(0.2)
		},
		instructionText: {
			fontSize: WP(3.8),
			color: theme.grey6
		}
	});

	return {theme, styles};
}
