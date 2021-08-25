import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useTheme, WP, defaultIconSize} from '../../theme';

const IconButton = ({name, onPress, opacity=0.8,  ...props}) => {
	const {theme, styles} = useStyles();

	return (
		<TouchableOpacity activeOpacity={opacity} style={props.containerStyle} onPress={onPress}>
			<Ionicons name={name} color={props.iconColor || theme.icon} size={props.iconSize || defaultIconSize} />
		</TouchableOpacity>
	)
}

export const AccountIcon = (props) => {
	const navigation = useNavigation();

	return (
		<IconButton {...props} name="person-circle" onPress={() => navigation.navigate('Settings')} />
	)
}

export const CloseIcon = ({onPress, ...props}) => {
	return (
		<IconButton {...props} name="close" onPress={onPress} />
	)
}

export const SearchIcon = ({onPress, ...props}) => {
	return (
		<IconButton {...props} name="search" onPress={onPress} />
	)
}

export const GobackIcon = ({goBack, ...props}) => {
	const navigation = useNavigation();

	return (
		<IconButton {...props} name="chevron-back" onPress={() => {typeof goBack === 'function' ? goBack() : navigation.goBack()}} />
	)
}

export const FavoriteIcon = ({isFavorite, onPress, ...props}) => {
	return (
		<IconButton {...props} name={isFavorite ? "heart" : "heart-outline"} onPress={onPress} />
	)
}

export const EditIcon = ({onPress, ...props}) => {

	return (
		<IconButton {...props} name="create-outline" onPress={onPress} />
	)
}


export const AddIcon = ({onPress, ...props}) => {
	return (
		<IconButton {...props} name="add" onPress={onPress} />
	)
}

export const CalendarIcon = ({onPress, ...props}) => {
	return (
		<IconButton {...props} name="calendar-sharp" onPress={onPress} />
	)
}

export const DeleteIcon = ({onPress, ...props}) => {
	return (
		<IconButton {...props} name="trash-bin-sharp" onPress={onPress} />
	)
} 

export const ShowHideButton = ({showDetail, onToggle, ...props}) => {
	return(
		<IconButton opacity={1.0} {...props} name={showDetail ? "chevron-up" : "chevron-down"} onPress={onToggle} />
	)
}



const useStyles = () => {

	const theme = useTheme();
	
	const styles = StyleSheet.create({
	});

	return {theme, styles};
} 