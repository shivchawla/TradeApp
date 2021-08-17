import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import DraggableFlatList, {RenderItemParams} from "react-native-draggable-flatlist";
import { useNavigation } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { AppView, RightHeaderButton, EditIcon, ConfirmButton} from '../../components/common';
import {useAllWatchlist } from '../../helper';

import {useTheme, WP, StyledText} from '../../theme';

const WatchlistEdit = ({watchlist}) => {
	const styles = useStyles();
	const theme = useTheme();
	const navigation = useNavigation();

	return (
		<View style={styles.watchlistEditRow}>
			<StyledText style={styles.watchlistName}>{watchlist.name}</StyledText>
			<View style={styles.iconContainer}>
				<EditIcon containerStyle={{marginRight: WP(3)}} onPress={() => navigation.navigate('EditWatchlist', {watchlistId: watchlist.id})} />
				<Ionicons name="menu" color={theme.backArrow} size={WP(7)}/>
			</View>
		</View>
	)
}

const ManageWatchlist = (props) => {
	const styles = useStyles();
	
	const {isError, watchlists} = useAllWatchlist();

	const HeaderRight = () => {
		return (
			<RightHeaderButton title="NEW" onPress={""}/>
		)
	}

	return (
		<AppView title="Manage Watchlists" scroll={false} headerRight={<HeaderRight />}>
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

const useStyles = () => {

	const theme = useTheme();

	const styles = StyleSheet.create({
		watchlistEditRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			width: '100%'
		},
		iconContainer: {
			flexDirection: 'row'
		},
		draggableList: {
			marginTop: WP(10),
		},
		watchlistName: {
			fontSize: WP(4.5)
		},
		addWatchlistButton: {
			padding: WP(0.5),
			paddingLeft: WP(2.5),
			paddingRight: WP(2.5),
			backgroundColor: theme.backArrow
		},
		buttonText: {
			color: theme.dark,
			fontWeight: '700'
		}
	});

	return styles;
}

export default ManageWatchlist;