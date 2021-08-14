import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import DraggableFlatList, {RenderItemParams} from "react-native-draggable-flatlist";
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AppView, StockName } from '../../components/common';
import { SearchStockList } from '../../components/market';
import { useWatchlist, useDeletewatchlist } from '../../helper';
import {useTheme, WP, StyledText, PaddedView} from '../../theme';

const WatchlistItem = ({stock}) => {
	return (
		<PaddedView>
			<StockName {...{stock}} />
			<Ionicons name="menu" color={theme.backArrow } size={WP(7)} />
		</PaddedView>
	)
}

const EditWatchlist = (props) => {
	const styles = useStyles();
	  
	const {watchlistId} = props.route.params;
	const {watchlist} = useWatchlist(watchlistId);

	return (
		<AppView title={watchlist.name}>
			<DraggableFlatList
			  	style={styles.draggableList}
		        data={watchlists?.assets ?? []}
		        renderItem={({item, index}) => <WatchlistItem stock={item} />}
		        keyExtractor={(item, index) => `draggable-item-${item.symbol}`}
		        onDragEnd={({ data }) => setData(data)}
		      />
		</AppView>
	);
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({

	});

	return styles;	
}


export default EditWatchlist;