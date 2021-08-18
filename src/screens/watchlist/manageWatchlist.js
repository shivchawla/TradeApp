import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import DraggableFlatList, {RenderItemParams} from "react-native-draggable-flatlist";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { AppView, RightHeaderButton, EditIcon, ConfirmButton, TouchRadio} from '../../components/common';
import { useAllWatchlist, useDeleteWatchlist } from '../../helper';

import {useTheme, WP, StyledText} from '../../theme';

const WatchlistEdit = ({watchlist, onSelectionChanged}) => {
	const styles = useStyles();
	const theme = useTheme();
	const navigation = useNavigation();
	const [selected, setSelect] = useState(null);

	useFocusEffect(
		React.useCallback(() => {
			// console.log("Setting TouchRadio to unselect");
			setSelect(false);
		}, [navigation])
	);

	React.useEffect(() => {
		onSelectionChanged(selected);
	}, [selected])

	return (
		<View style={styles.watchlistEditRow}>
			<TouchableOpacity style={styles.watchlistSelector} onPress={() => setSelect(!selected)}>
				<TouchRadio {...{selected}} onToggle={() => setSelect(!selected)}/>
				<StyledText style={styles.watchlistName}>{watchlist.name}</StyledText>
			</TouchableOpacity>
			<View style={styles.iconContainer}>
				<EditIcon containerStyle={{marginRight: WP(3)}} onPress={() => navigation.navigate('EditWatchlist', {watchlistId: watchlist.id})} />
				<Ionicons name="menu" color={theme.backArrow} size={WP(7)}/>
			</View>
		</View>
	)
}

const ManageWatchlist = (props) => {
	const styles = useStyles();
	const navigation = useNavigation();
	
	const {isError, watchlists, getAllWatchlist} = useAllWatchlist();

	const [selectedWatchlists, setSelected] = useState([]);
	const {deleteWatchlist} = useDeleteWatchlist();

	useFocusEffect(
		React.useCallback(() => {
			getAllWatchlist();

			//Blur Effect -- BUT doesn't work as expected....still flashing!!
			return () => setSelected([]);
		}, [])
	);

	const updateSelection = (watchlist, selected) => {
		if (selected) {
			setSelected(selectedWatchlists.concat(watchlist.id));
		} else {
			setSelected(selectedWatchlists.filter(item => item != watchlist.id));
		}
	}

	const deleteSelected = () => {

		const delWatchList = (id) => new Promise((resolve, reject) => { 
			return deleteWatchlist(id, {
				onSuccess: (r, input) => {
					resolve(r); console.log("Watchlist Deleted: ", id);
				},
				onError: (err, input) => {
					console.log("Watchlist Deletion Error: ", id);
					reject(err) 
				}
			})
		})

		return Promise.all(selectedWatchlists.map(id => delWatchList(id)))
		.then(() => {
			fetchWatchlist();
			setSelected([])
		})

	}

	const HeaderRight = () => {
		if (selectedWatchlists.length > 0) {
			return <RightHeaderButton icon="trash-bin-sharp" onPress={deleteSelected} />
		} else {
			return <RightHeaderButton title="NEW" onPress={() => navigation.navigate('AddWatchlist', {watchlists})}/>
		}
	}

	return (
		<AppView title="Manage Watchlists" scroll={false} headerRight={<HeaderRight />}>
			<DraggableFlatList
				style={styles.draggableList}
				data={watchlists}
				renderItem={({item, index}) => <WatchlistEdit watchlist={item} onSelectionChanged={(selected) => updateSelection(item, selected)} />}
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
			width: '100%',
			marginTop: WP(5)
		},
		iconContainer: {
			flexDirection: 'row'
		},
		draggableList: {
			marginTop: WP(10),
		},
		watchlistName: {
			fontSize: WP(4.5),
			marginLeft: WP(3)
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
		},
		watchlistSelector: {
			flexDirection: 'row',
			alignItems:'center'
		},

	});

	return styles;
}

export default ManageWatchlist;