import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import {AppView, PnLText, LineChart} from './';

import * as Theme from '../../theme';

const {useTheme, WP, StyledText} = Theme;

export const HorizontalScrollMenu = ({items, isPadded = true, ...props}) => {
	const styles = useStyles();
	const theme = useTheme();
	
	const [selectedIndex, setIndex] = useState(0);

	const MenuButton = ({index, label, onPress}) => {
		return (
			<TouchableOpacity {...{onPress}} style={[styles.menuButton, props.menuButtonStyle, {...(index == selectedIndex) && {borderColor: theme.selectedBorder, padding: WP(8), borderWidth: 2, ...props?.selectedMenuStyle ?? {}}}]}>
				<StyledText style={[styles.menuButtonText, props.menuButtonTextStyle]}>{label}</StyledText>
			</TouchableOpacity>
		)
	}

	const Component = items[selectedIndex].component;

	return (
		<View style={[styles.container, props.containerStyle]}>	
			<View style={[styles.selectContainer, props.selectContainerStyle]}>
				{items.map(({label, key}, index) => {
					return (<MenuButton {...{key, label, index}} onPress={() => setIndex(index)} />);
				})}
			</View>
			<Component />
		</View>
	)
}


const useStyles = () => {
	const theme = useTheme();
	
	const styles = StyleSheet.create({
		container: {
			// alignItems: 'center', //???? - this pushes content outside visibility 
			justifyContent:'center',
		},
		selectContainer: {
			flexDirection: 'row',
			marginTop: WP(3),
			marginBottom: WP(3),
			justifyContent: 'space-between',
			alignItems: 'center',
			width: '100%'
		},
		menuButton: {
			paddingTop: WP(1),
			paddingBottom: WP(1),
		},
		menuButtonText: {

		},
	});

	return styles;
}
