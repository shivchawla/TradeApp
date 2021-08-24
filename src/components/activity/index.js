import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';

import { DisplayOrder } from '../order';
import { ShowJson } from '../common';
import { useTheme } from '../../theme';

export const DisplayActivity = ({activity}) => {
	return <ShowJson full={false} json={activity} />
}

export const DisplayActivityList = ({activityList, ...props}) => {
	const {theme, styles} = useStyles();

	return (
		<View style={[styles.activityList, props.containerStyle]}>
			{activityList && activityList.map((item, index) => {
				return <DisplayActivity key={item.key} activity={item} />	
			})}
		</View>
	)
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({

	});

	return {theme, styles};
}