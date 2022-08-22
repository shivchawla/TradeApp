import React, {useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

import {useTheme, useDimensions, useTypography, StyledText} from '../../theme';

export const OtpInput = ({code, onCodeChange, onCodeFinish, codeCount = 6, onFocus, ...props}) => {
	
	const {theme, styles} = useStyles();

	const inputCodeRef = React.useRef(new Array());
	const [codes, setCodes] = useState(new Array());

	const {deviceWidth, deviceHeight} = useDimensions();

	React.useEffect(() => {
		setCodes(Array.from({...(code||'').split(''), length: codeCount}, (v,i) => v || ''));
	}, [code]);

	React.useEffect(() => {
		onCodeChange && onCodeChange(getCodes());
		const isTypeFinish = codes.every((i) => {
			return i !== '';
		});

		if (isTypeFinish) {
			onCodeFinish && onCodeFinish(getCodes());
		}
	}, [codes]);

	const getCodes = () => {
		return codes.join('');
	};

	const onChangeCode = (code, index) => {

		if (code != '') {
			inputCodeRef.current[Math.min(index + 1, codeCount - 1)].focus();
		} else {
			inputCodeRef.current[Math.max(index - 1, 0)].focus();
		}

		if (index == codeCount - 1) {
			inputCodeRef.current[Math.min(index + 1, codeCount - 1)].blur();
		} 
		
		const typedCode = code.slice(-1);
		const currentCodes = [...codes];
		currentCodes[index] = typedCode;
		setCodes(currentCodes);
	};

	const onKeyPress = (event, index) => {
		const key = event.nativeEvent.key;
		let destIndex = index;
		if (key === 'Backspace') {
			inputCodeRef.current[Math.max(index - 1, 0)].focus();
		}
	};

	return (
		<View style={[styles.form, props.containerStyle]}>
			{codes.map((code, index) => {
				return (
					<TextInput
						onFocus={() => index == 0 ? onFocus() : null}
						key={index}
						keyboardType="numeric"
						ref={element => inputCodeRef.current.push(element)}
						style={[
							styles.input,
							props.otpStyles,
							{width: deviceWidth / (codeCount + 2), height: deviceHeight / 14},
						]}
						onChangeText={text => onChangeCode(text, index)}
						onKeyPress={event => onKeyPress(event, index)}
						value={code}
					/>
				);
			})}
		</View>
	);
}


const useStyles = () => {

	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();

	
	const styles = StyleSheet.create({
		form: {
		    flexDirection: 'row',
		    justifyContent: 'center',
		    alignItems: 'center',
	  	},
	  	input: {
		    // flex: 1,
		    marginHorizontal: 4,
		    fontSize: WP(5),
		    textAlign: 'center',
		    color: theme.icon,
		    backgroundColor: theme.grey7,
	  	},
	});

	return {theme, styles};
}