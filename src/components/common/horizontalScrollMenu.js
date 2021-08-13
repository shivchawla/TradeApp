import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import {AppView, PnLText, LineChart} from './';

import * as Theme from '../../theme';

const {useTheme, WP, StyledText, PaddedView} = Theme;

export const HorizontalScrollMenu = ({items, isPadded = true, ...props}) => {
	const styles = useStyles();
	const theme = useTheme();
	
	const [selectedIndex, setIndex] = useState(0);

	const MenuButton = ({index, label, onPress}) => {
		return (
			<TouchableOpacity {...{onPress}} style={[styles.menuButton, props.menuButtonStyle, {...(index == selectedIndex) && {borderColor: theme.selectedBorder, padding: WP(8), borderWidth: 2}}]}>
				<StyledText style={[styles.menuButtonText, props.menuButtonTextStyle]}>{label}</StyledText>
			</TouchableOpacity>
		)
	}

	const Component = items[selectedIndex].component;

	const OuterContainer = isPadded ? PaddedView : View;
	return (
		<OuterContainer style={[styles.container, props.containerStyle]}>	
			<View style={[styles.selectContainer, props.selectContainerStyle]}>
				{items.map(({label, key}, index) => {
					return (<MenuButton {...{key, label, index}} onPress={() => {console.log("Pressed: ", index); setIndex(index);}} />);
				})}
			</View>
			<Component />
		</OuterContainer>
	)
}


const useStyles = () => {
	const theme = useTheme();
	
	const styles = StyleSheet.create({
		container: {
			// alignItems: 'center',
			justifyContent:'center',
			// borderBottomWidth: 1,
			// borderColor: theme.grey5,
			width:'100%' 
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
