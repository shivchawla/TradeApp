import React, {useState} from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native';

import { useTheme, WP, HP, StyledText} from '../../theme';

export const HorizontalButtonGroup = ({items, onSelect, initialValue = 0, scroll = false, ...props}) => {
	const [selectedIndex, setSelected] = useState(initialValue);
	const {styles} = useStyles();
	
	const renderItems = () => {
		return Object.keys(items).map((key, index) => {
			return (
				<TouchableOpacity style={[props.buttonStyle, {...index == selectedIndex && props.selectedButtonStyle}]} {...{key}} onPress={() => {setSelected(index); onSelect(key)}}>
					<StyledText style={[props.buttonTextStyle, {...index == selectedIndex && props.selectedButtonTextStyle}]}>{items[key]}</StyledText>
				</TouchableOpacity>
			)
		})
	}

	return (
		<>
		{!scroll ? 
			<View style={styles.buttonGroupContainer}>
				{renderItems()}
			</View>
		:
		<View>
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.buttonGroupContainer}>
				{renderItems()}
			</ScrollView>
		</View>
		}
		</>
	)
}


const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		buttonGroupContainer: {
			flexDirection: 'row',
			marginTop: WP(3),
		},
	});

	return {theme, styles};
}

