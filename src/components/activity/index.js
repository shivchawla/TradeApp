import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { DisplayOrder } from '../order';
import { ShowJson } from '../common';
import { useTheme, WP, HP } from '../../theme';

export const DisplayActivity = ({activity}) => {
	const {theme, styles} = useStyles();
	const activityType =  activity?.activity_type;
	
	if (activityType == "ORDER") {
		return <DisplayOrder 
				order={activity} 
				showSymbol={true} 
				showIcon={true}
				showOrderType={false}
				pastTense={true}
				descriptionStyle={styles.orderStyle}/>
	} 
	else if (activityType?.startsWith("DIV")) {
		return <ShowJson json={activity} full={false} />
	} else {
		return <></>
	}
}

export const DisplayActivityList = ({activityList, ...props}) => {
	const {theme, styles} = useStyles();

	return (
		<ScrollView style={[styles.activityList, props.containerStyle]}>
			{activityList && activityList.map((item, index) => {
				return <DisplayActivity key={item.id} activity={item} />	
			})}
		</ScrollView>
	)
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		activityList: {
			marginTop: HP(2)
		},
		orderStyle: {
			color: theme.grey5,
		} 
	});

	return {theme, styles};
}