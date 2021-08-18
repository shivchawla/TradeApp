import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import DraggableFlatList, {RenderItemParams} from "react-native-draggable-flatlist";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { AppView, RightHeaderButton, EditIcon, ConfirmButton, TouchRadio} from '../../components/common';
import { useAllWatchlist, useDeleteWatchlist, getWatchlistOrder, setWatchlistOrder } from '../../helper';

import {useTheme, WP, StyledText} from '../../theme';

const WatchlistEdit = ({watchlist, onSelectionChanged, onDrag}) => {
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
				<TouchableOpacity onLongPress={onDrag} >
					<Ionicons name="menu" color={theme.backArrow} size={WP(7)}/>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const ManageWatchlist = (props) => {
	const styles = useStyles();
	const navigation = useNavigation();
	
	const {isError, watchlists, getAllWatchlist} = useAllWatchlist();
	const [orderedWatchlists, setOrderedWatchlist] = useState(null);

	const [selectedWatchlists, setSelected] = useState([]);
	const {deleteWatchlist} = useDeleteWatchlist();

	useFocusEffect(
		React.useCallback(() => {
			getAllWatchlist();

			//Blur Effect -- BUT doesn't work as expected....still flashing!!
			return () => setSelected([]);
		}, [])
	);

	const updateWatchlistOrder = async() => {
		if (watchlists) {
			const orderedNames = await getWatchlistOrder();
			if (orderedNames ) {
				setOrderedWatchlist(orderedNames.map(name => watchlists.find(item => item.name == name)));
			} else {
				setOrderedWatchlist(watchlists);
			}
		}
	}

	React.useEffect(() => {
		updateWatchlistOrder();
	}, [watchlists])

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

	const handleDragEnd = async(data) => {
		await setWatchlistOrder(data.map(item => item.name))
		updateWatchlistOrder()
	}

	return (
		<AppView title="Manage Watchlists" scroll={false} headerRight={<HeaderRight />}>
			<DraggableFlatList
				style={styles.draggableList}
				data={orderedWatchlists || []}
				renderItem={({item, index, drag}) => <WatchlistEdit watchlist={item} onSelectionChanged={(selected) => updateSelection(item, selected)} onDrag={drag}/>}
				keyExtractor={(item, index) => `draggable-item-${item.id}`}
				onDragEnd={({ data }) => handleDragEnd(data)}
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