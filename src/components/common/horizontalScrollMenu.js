import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';

import AppView from './appView';
import PnlText from './pnlText';
import { LineChart } from './linechart';

import {useTheme, StyledText} from '../../theme';

export const HorizontalScrollMenu = ({items, isPadded = true, scroll = true, ...props }) => {
	const styles = useStyles();
	const {theme, HP, WP, Typography} = useTheme();
	
	
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
			{scroll ? 
				<ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.selectContainer, props.selectContainerStyle]}>
					{items.map(({label, key}, index) => {
						return (<MenuButton {...{key, label, index}} onPress={() => setIndex(index)} />);
					})}
				</ScrollView>
			:
				<View style={[styles.selectContainerView, props.selectContainerStyle]}>
					{items.map(({label, key}, index) => {
						return (<MenuButton {...{key, label, index}} onPress={() => setIndex(index)} />);
					})}
				</View>
			}
			<Component />
		</View>
	)
}


const useStyles = () => {
	const {theme, HP, WP, Typography} = useTheme();
	
	
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
			// width: '100%'
		},
		selectContainerView: {
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
