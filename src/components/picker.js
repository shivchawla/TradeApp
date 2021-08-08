import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

import { useTheme, StyledText, Typography, WP, HP }  from '../theme';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight =
  Platform.OS === 'ios'
    ? Dimensions.get('window').height
    : require('react-native-extra-dimensions-android').get(
        'REAL_WINDOW_HEIGHT',
      );
  

export const Picker = ({items, selectedValue, onSelect}) => {
	const [show, setShow] = useState(false);
	const styles = useStyles();
	const theme = useTheme();

	return (
		<>{
			!!selectedValue &&
		<View style={styles.pickerContainer}>
			<TouchableOpacity style={styles.pickerViewContainer} onPress={() => setShow(!show)}>
				<StyledText style={styles.selectedValue}>{selectedValue.title}</StyledText> 
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

export const BottomPicker = ({items, selectedValue, onSelect}) => {
	const [show, setShow] = useState(false);
	const styles = useStyles();
	const theme = useTheme();

	return (
		<>
		{!!selectedValue &&
			<>
			<View style={styles.pickerContainer}>
				<TouchableOpacity style={styles.pickerViewContainer} onPress={() => setShow(!show)}>
					<StyledText style={styles.selectedValue}>{selectedValue.title}</StyledText> 
					{show ? <Ionicons name="chevron-up" color={theme.grey3} size={WP(5)} />
					 : <Ionicons name="chevron-down" color={theme.grey3} size={WP(5)} />
					}
				</TouchableOpacity>
			</View>
		

		<Modal 
			deviceWidth={deviceWidth}
      		deviceHeight={deviceHeight}
			animationType="slide" 
			isVisible={show} 
			onBackdropPress={() => setShow(false)}
			style={styles.bottomPickerOptionsModal}>
			<View style={styles.bottomPickerOptionsContainer}>
				<StyledText style={styles.bottomPickerTitle}>Select Value</StyledText>
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
		</Modal>
		</>
		}
	</>

	)
}

export const TextInputWithIcon = ({value, onChange, ...props}) => {
	const styles = useStyles();
	const theme = useTheme();

	const [edit, setEdit] = useState(false);

	return (
		<View style={styles.textInputContainer}>
			
			{!edit ? 
				<>
					<StyledText style={props.textStyle}>{value}</StyledText>
					<TouchableOpacity  onPress={() => setEdit(!edit)}>
			      		<Ionicons name="pencil" color={props.iconColor || theme.grey3} size={props.iconsSize || WP(6)} />
		      		</TouchableOpacity>
	      		</>
			:
				<TextInput
					{...props}
			        style={props.textStyle}
			        onChangeText={onChange}
			        value={value}
			        keyboardType="numeric"
			        onBlur={() => setEdit(false)}
			        autoFocus={edit}
		      	/>
			}
      	</View>
	)
}

export const HorizontalPickField = ({label, selectedValue, items, onSelect}) => {
	const styles = useStyles();
	// const [selectedValue, setValue] = useState(propValue)

	return (
		<View style={styles.horizontalPickField}>
			<StyledText style={styles.horizontalPickLabel}>{label}</StyledText>
			<BottomPicker {...{items, selectedValue, onSelect}} />
		</View>
	)
}

export const HorizontalInputField = ({label, value, onChange, ...props}) => {
	const styles = useStyles();
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
	const theme = useTheme();

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
		},
		bottomPickerOptionsModal: {
			justifyContent: 'flex-end',
			margin: 0
		},
		bottomPickerOptionsContainer: {
			height: HP(25),
			backgroundColor: theme.grey10,
			padding: WP(5)
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

	return styles;
}

