import React from 'react';
import { StyleSheet, TouchableOpacity, Linking, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, useDimensions, useTypography, StyledText } from '../../theme';

//Create varianle for backward compatibility
const Ionicons = Icon;

export const CustomIcon = ({iconName, ...props}) => {
	const {theme, styles} = useStyles();
	const { DefaultIconSize } = useTypography();

	return (
		<>{
			!!props?.hasBackground ? 
			<View style={props.backgroundStyle}>
				<Ionicons name={iconName} color={props.iconColor || theme.icon} size={props.iconSize || DefaultIconSize} /> 
			</View>
			:
			<Ionicons name={iconName} color={props.iconColor || theme.icon} size={props.iconSize || DefaultIconSize} />
		}
		</>
	)
}

export const IconButton = ({iconName, onPress, opacity=0.8,  ...props}) => {
	const {theme, styles} = useStyles();
	const { DefaultIconSize } = useTypography();

	return (
		<TouchableOpacity activeOpacity={opacity} style={props.containerStyle} onPress={onPress}>
			<Ionicons name={iconName} color={props.iconColor || theme.icon} size={props.iconSize || DefaultIconSize} />
		</TouchableOpacity>
	)
}

export const IconTextButton = ({iconName, image, title, onPress, opacity = 0.8, ...props}) => {
	const {theme, styles} = useStyles();
	const { DefaultIconSize } = useTypography();
	
	return (
		<TouchableOpacity activeOpacity={opacity} style={props.containerStyle} onPress={onPress}>
			{iconName && <Ionicons name={iconName} color={props.iconColor || theme.icon} size={props.iconSize || DefaultIconSize} />} 
			{image && <Image source={image} style={[styles.imageIcon, props.imageIconStyle]} />}
			<StyledText style={props.textStyle}>{title}</StyledText>
		</TouchableOpacity>
	)
}

export const AccountIcon = (props) => {
	const navigation = useNavigation();
	const onPress = props.onPress ? props.onPress : () => navigation.navigate('Settings');
	
	return (
		<IconButton {...props} iconName="person-circle" onPress={onPress} />
	)
}

export const CloseIcon = ({onPress, ...props}) => {
	return (
		<IconButton {...props} iconName="close" onPress={onPress} />
	)
}

export const SearchIcon = ({onPress, ...props}) => {
	return (
		<IconButton {...props} iconName="search" onPress={onPress} />
	)
}

export const GobackIcon = ({goBack, ...props}) => {
	const navigation = useNavigation();

	return (
		<IconButton {...props} iconName="chevron-back" onPress={() => {typeof goBack === 'function' ? goBack() : navigation.goBack()}} />
	)
}

export const FavoriteIcon = ({isFavorite, onPress, ...props}) => {
	return (
		<IconButton {...props} iconName={isFavorite ? "heart" : "heart-outline"} onPress={onPress} />
	)
}

export const EditIcon = ({onPress, ...props}) => {

	return (
		<IconButton {...props} iconName="create-outline" onPress={onPress} />
	)
}


export const AddIcon = ({onPress, ...props}) => {
	return (
		<IconButton {...props} iconName="add" onPress={onPress} />
	)
}

export const CalendarIcon = ({onPress, ...props}) => {
	return (
		<IconButton {...props} iconName="calendar-sharp" onPress={onPress} />
	)
}

export const DeleteIcon = ({onPress, ...props}) => {
	return (
		<IconButton {...props} iconName="trash-bin-sharp" onPress={onPress} />
	)
} 

export const DownloadIcon = ({onPress, ...props}) => {
	return (
		<IconButton {...props} iconName="download-outline" onPress={onPress} />
	)
} 

export const ShowHideButton = ({showDetail, onToggle, ...props}) => {
	return(
		<IconButton opacity={1.0} {...props} iconName={showDetail ? "chevron-up" : "chevron-down"} onPress={onToggle} />
	)
}

export const ToggleThemeButton = ({dark = false, onToggle, ...props}) => {
	return(
		<IconButton {...props} iconName={dark ? "sunny-outline" : "moon-outline"} onPress={onToggle} />
	)
}

export const SocialIcon = ({social, ...props}) => {
	const getSocialUrl = () => {
		var url = '';
		switch(social) {
			case 'facebook': 
				url = 'fb://';
				break;
			case 'facebook': 
				url = 'fb://';
				break;
			case 'facebook': 
				url = 'fb://';
				break;
			case 'facebook': 
				url = 'fb://';
				break;
			case 'default':
				url =  'fb://'
		}

		return url;			
	}

	const onPress = async() => {
		const url = getSocialUrl(); 
		if(await Linking.canOpenUrl(url)) {
			await Linking.openUrl(url);
		}
	}

	return (
		<IconButton iconName={`logo-${social}`} onPress={onPress} {...props}/>
	)
}



const useStyles = () => {

	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const Typography = useTypography();
	
	const styles = StyleSheet.create({
	});

	return {theme, styles};
} 