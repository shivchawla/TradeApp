import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import DraggableFlatList, {RenderItemParams} from "react-native-draggable-flatlist";
import {useNavigation} from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { AppView, EditIcon} from '../../components/common';
import {useAllWatchlist } from '../../helper';

import {useTheme, WP, StyledText, PaddedView} from '../../theme';

const WatchlistEdit = ({watchlist}) => {
	const theme = useTheme();
	const navigation = useNavigation();

	return (
		<PaddedView style={styles.watchlistEditRow}>
			<StyledText style={styles.watchlistName}>{watchlist.name}</StyledText>
			<View style={styles.iconContainer}>
				<EditIcon containerStyle={{position: 'relative'}} onPress={() => navigation.navigate('EditWatchlist', {watchlist})} />
				<Ionicons name="menu" color={theme.backArrow} size={WP(7)}/>
			</View>
		</PaddedView>
	)
}

const ManageWatchlist = (props) => {
	
	const {isError, watchlists} = useAllWatchlist();
	return (
		<AppView title="Manage Watchlist" scroll={false}>
			  <DraggableFlatList
			  	style={styles.draggableList}
		        data={watchlists}
		        renderItem={({item, index}) => <WatchlistEdit watchlist={item} />}
		        keyExtractor={(item, index) => `draggable-item-${item.id}`}
		        onDragEnd={({ data }) => setData(data)}
		      />
			
		</AppView>
	);
}

const styles = StyleSheet.create({
	watchlistEditRow: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	iconContainer: {
		flexDirection: 'row'
	},
	draggableList: {
		marginTop: WP(10)
	},
	watchlistName: {
		fontSize: WP(4.5)
	}

});

export default ManageWatchlist;