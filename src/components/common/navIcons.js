import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useTheme, WP} from '../../theme';

export const AccountIcon = (props) => {
	const theme = useTheme();
	const styles = useStyles();

	const navigation = useNavigation();

	return (
		<TouchableOpacity style={[styles.leftIconContainer, props.containerStyle]} onPress={() => navigation.navigate('Settings')}>
			<Ionicons name="person-circle" color={props.iconColor || theme.backArrow} size={props.iconSize || WP(7)} />
		</TouchableOpacity>
	)
}

export const SearchIcon = ({onPress, ...props}) => {
	const theme = useTheme();
	const styles = useStyles();

	const navigation = useNavigation();
	return (
		<TouchableOpacity style={[styles.rightIconContainer, props.containerStyle]} onPress={onPress}>
			<Ionicons name="search" color={props.iconColor || theme.backArrow} size={props.iconSize || WP(7)} />
		</TouchableOpacity>
	)
}


export const GobackIcon = ({goBack, ...props}) => {
	const theme = useTheme();
	const styles = useStyles();

	const navigation = useNavigation();
	return (
		<TouchableOpacity style={[styles.leftIconContainer, props.containerStyle]} onPress={() => {typeof goBack === 'function' ? goBack() : navigation.goBack()}}>
			<Ionicons name="chevron-back" color={props.iconColor || theme.backArrow } size={props.iconSize || WP(7)} />
		</TouchableOpacity>
	)
}


export const FavoriteIcon = ({isFavorite, onPress, ...props}) => {
	const theme = useTheme();
	const styles = useStyles();

	return (
		<TouchableOpacity style={[styles.rightIconContainer, props.containerStyle]} onPress={onPress}>
			{isFavorite ? 
				<Ionicons name="heart" color={props.iconColor || theme.backArrow } size={props.iconSize || WP(7)} />
				:
				<Ionicons name="heart-outline" color={props.iconColor || theme.backArrow } size={props.iconSize || WP(7)} />
			}
		</TouchableOpacity>
	)
}


export const EditIcon = ({onPress, ...props}) => {
	const theme = useTheme();
	const styles = useStyles();

	return (
		<TouchableOpacity style={[styles.rightIconContainer, props.containerStyle]} onPress={onPress}>
			<Ionicons name="create-outline" color={props.iconColor || theme.backArrow } size={props.iconSize || WP(7)} />
		</TouchableOpacity>
	)
}



const useStyles = () => {

	const theme = useTheme();
	
	const styles = StyleSheet.create({
		leftIconContainer: {
			position: 'absolute',
			left: 10,
		},

		rightIconContainer: {
			position: 'absolute',
			right: 10,
		},
	});

	return styles;
} 