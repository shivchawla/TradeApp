import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
const Ionicons  = Icon;
import Modal from 'react-native-modal';

import { useTheme, StyledText, Typography, WP, HP }  from '../../theme';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : require('react-native-extra-dimensions-android').get(
        'REAL_WINDOW_HEIGHT',
      );
  

export const Picker = ({items, selectedValue, onSelect}) => {
	const [show, setShow] = useState(false);
	const {theme, styles} = useStyles();

	return (
		<>{
			!!selectedValue &&
		<View style={styles.pickerContainer}>
			<TouchableOpacity style={styles.pickerViewContainer} onPress={() => setShow(!show)}>
				<StyledText style={[styles.selectedValue, {...!selectedValue?.key && {fontSize: WP(3.5)}}]}>{selectedValue.title}</StyledText> 
				{show ? <Ionicons name="chevron-up" color={theme.grey3} size={WP(5)} />
				 : <Ionicons name="chevron-down" color={theme.grey3} size={WP(5)} />
				}
			</TouchableOpacity>

			{show && 
				<View style={styles.pickerOptionsContainer}>
					{
						items.map((item, index) => {
							if (item.key != selectedValue.key) {
								return (
									<TouchableOpacity key={item.key} onPress={() => {onSelect(item); setShow(false)}}> 
										<StyledText style={styles.pickerItem}>{item.title}</StyledText> 	
									</TouchableOpacity>
								)
							}
						})
					}
					
				</View>
			}
		</View>
	}
	</>

	)
}

export const BottomPicker = ({items, selectedValue, onSelect, placeholder = '', ...props}) => {
	const [show, setShow] = useState(false);
	const {theme, styles} = useStyles();

	console.log("Items: ", (items.length));
	console.log(items);
	console.log("Height: ", items.length*7);

	return (
		<>
		{!!selectedValue &&
			<>
				<TouchableOpacity style={[styles.pickerViewContainer, props.pickerContainerStyle]} onPress={() => setShow(!show)}>
					<StyledText style={[styles.selectedValue, props.valueStyle]}>{selectedValue?.title ?? placeholder}</StyledText> 
					{show ? <Ionicons name="chevron-up" color={theme.grey3} size={WP(5)} />
					 : <Ionicons name="chevron-down" color={theme.grey3} size={WP(5)} />
					}
				</TouchableOpacity>

		<Modal 
			deviceWidth={deviceWidth}
  		deviceHeight={deviceHeight}
			animationType="slide" 
			isVisible={show} 
			onBackdropPress={() => setShow(false)}
			style={styles.bottomPickerOptionsModal}>
			<View style={[styles.bottomPickerOptionsContainer, {height: HP(items.length*7)}]}>
				<StyledText style={styles.bottomPickerTitle}>Select Value</StyledText>
				{
					items.filter(item => item.key != selectedValue.key).map((item, index) => {
						return (
							<TouchableOpacity key={index} onPress={() => {onSelect(item); setShow(false)}}> 
								<StyledText style={styles.pickerItem}>{item.title}</StyledText> 	
							</TouchableOpacity>
						)
					})
				}
				
			</View>
		</Modal>
		</>
		}
	</>

	)
}

export const TextInputWithIcon = ({value, onChange, ...props}) => {
	const {theme, styles} = useStyles();

	const [edit, setEdit] = useState(false);

	return (
		<View style={styles.textInputContainer}>
			
			{!edit ? 
				<>
					<StyledText style={props.textStyle}>{value}</StyledText>
					<TouchableOpacity  style={props.iconContainerStyle} onPress={() => setEdit(!edit)}>
	      		<Ionicons name="pencil" color={props.iconColor || theme.grey3} size={props.iconSize || WP(6)} />
      		</TouchableOpacity>
    		</>
			:
				<TextInput
					{...props}
			        style={props.textStyle}
			        onChangeText={onChange}
			        value={value.toString()}
			        keyboardType={props.keyboardType || "numeric"}
			        onSubmitEditing={() => setEdit(false)}
			        autoFocus={edit}
		      	/>
			}
      	</View>
	)
}

export const HorizontalPickField = ({label, selectedValue, items, onSelect}) => {
	const {styles} = useStyles();

	return (
		<>
		{!!selectedValue && 
			<View style={styles.horizontalPickField}>
				<StyledText style={styles.horizontalPickLabel}>{label}</StyledText>
				{onSelect ? <BottomPicker {...{items, selectedValue, onSelect}} />
					: <StyledText style={styles.horizontalPickLabel}>{selectedValue.title}</StyledText>
				}
			</View>
		}
		</>
	)
}

export const HorizontalInputField = ({label, value, onChange, ...props}) => {
	const {styles} = useStyles();

	return (
		<View style={styles.horizontalPickField}>
			<StyledText style={styles.horizontalPickLabel}>{label}</StyledText>
			<TextInputWithIcon
				{...props}
		        onChange={onChange}
		        {...{value}}
	      	/>
		</View>
	)
}


const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		pickerContainer: {
			// height: HP(20)
		},
		pickerViewContainer: {
			flexDirection:'row',
			justifyContent: 'center',
			alignItems: 'center'
		},
		selectedValue: {
			fontSize: WP(6),
			marginRight: WP(2)
		},
		pickerOptionsContainer: {
			// position: 'absolute'
		},
		pickerItem: {
			fontSize: WP(6),
			color: theme.grey,
			marginBottom: HP(2)
		},
		bottomPickerOptionsModal: {
			justifyContent: 'flex-end',
			margin: 0,
		},
		bottomPickerOptionsContainer: {
			backgroundColor: theme.grey10,
			padding: WP(5),
			borderTopLeftRadius: 20,
			borderTopRightRadius: 20
		},
		bottomPickerTitle: {
			fontSize: WP(5),
			color: theme.grey5,
			marginBottom: HP(2)
		},
		horizontalPickField: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			paddingLeft: WP(3),
			paddingRight: WP(3),
			marginBottom: WP(5),
			width: WP(100)
		},
		horizontalPickLabel: {
			fontSize:  WP(4.5),
			color: theme.text	
		},
		textInputContainer: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center'
		},
	});

	return {theme, styles};
}

