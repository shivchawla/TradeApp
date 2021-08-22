import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AppView, CalendarIcon, FullViewModal, DateRangePicker } from '../../components/common';
import { useTheme, WP, StyledText} from '../../theme';

const History = (props) => {
	const [isModalVisible, setModalVisible] = useState(false);

	const {theme, styles} = useStyles();

	return (
		<>
		<AppView title="History" headerRight={<CalendarIcon onPress={() => setModalVisible(true)}/>}>
		</AppView>

		<FullViewModal 
			isVisible={isModalVisible} 
			onClose={() => setModalVisible(false)} 
			title="Select Range">
			<DateRangePicker
	          onSuccess={(s, e) => {console.log(s); console.log(e)}}
	          theme={{ 
	          	calendarBackground: theme.background, 
	          	markColor: theme.backArrow, 
	          	markTextColor: theme.selectedColor,
          		arrowColor: theme.icon,
          		monthTextColor: theme.shadedText,
          		textDisabledColor: theme.text,
      		    dayTextColor: theme.shadedText,
          	}}

          	/>
		</FullViewModal>
		</>
	);
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({

	});

	return {theme, styles};
}

export default History;
