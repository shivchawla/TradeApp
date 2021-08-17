import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import DraggableFlatList, {RenderItemParams} from "react-native-draggable-flatlist";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

import { AppView, StockName, RightHeaderButton, ConfirmButton, CloseIcon } from '../../components/common';
import { SearchStockList } from '../../components/market';
import { useWatchlist, useDeletewatchlist } from '../../helper';
import {useTheme, WP, StyledText} from '../../theme';
import { diffArray, removeArray, deviceWidth, deviceHeight } from '../../utils'


const TouchRadio = ({selected, onToggle}) => {
	const theme = useTheme();
	return (
		<TouchableOpacity onPress={onToggle} >
			{selected ?
				<Ionicons name="radio-button-on" color={theme.backArrow } size={WP(5)} />
				:
				<Ionicons name="radio-button-off" color={theme.backArrow } size={WP(5)} />
			}
			</TouchableOpacity>
	)
} 


const WatchlistItem = ({stock, onSelectionChanged}) => {
	const theme = useTheme();
	const styles = useStyles();
	const [selected, setSelect] = useState(null);

	React.useEffect(() => {
		onSelectionChanged(selected);
	}, [selected])

	return (
		<View style={styles.watchlistItemContainer}>
			<TouchableOpacity style={styles.stockSelector} onPress={() => setSelect(!selected)}>
				<TouchRadio {...{selected}} onToggle={() => setSelect(!selected)}/>
				<StockName {...{stock}} containerStyle={styles.stockNameContainer}/>
			</TouchableOpacity>
			<Ionicons name="swap-vertical" color={theme.backArrow } size={WP(7)} />
		</View>
	)
}

const EditWatchlist = (props) => {
	const styles = useStyles();
	const theme = useTheme();
	  
	const {watchlistId} = props.route.params;
	const {watchlist} = useWatchlist(watchlistId);
	const [assets, setAssets] = useState([]);
	const [selectedRows, setRows] = useState([]);
	const [showFooter, setShowFooter] = useState(false);
	const [isModalVisible, setModalVisible] = useState(false);

	React.useEffect(() => {
		setAssets(watchlist?.assets);
	}, [watchlist]);

	React.useEffect(() => {
		const oSymbols = (watchlist?.assets ?? []).map(item => item.symbol);
		const nSymbols = (assets || []).map(item => item.symbol)

		const extraSymbols = diffArray(oSymbols, nSymbols);

		if(!!watchlist && !!assets && extraSymbols.length > 0) {
			setShowFooter(true);
		} else {
			setShowFooter(false);
		}

	}, [assets]);

	const updateSelection = (stock, selected) => {
		if (selected) {
			setRows(selectedRows.concat(stock));
		} else {
			setRows(selectedRows.filter(item => item.symbol != stock.symbol));
		}
	}

	const saveList = () => {

	}

	const deleteList = () => {
		if (selectedRows.length > 0) {
			setAssets(assets.filter(item => !selectedRows.map(item => item.symbol).includes(item.symbol)));
			setRows([]);
		}
	}

	const toggleWatchlist = (stock) => {

		if (assets.map(item => item.symbol).includes(stock.symbol)) {
			//Remove
			setAssets(removeArray(assets, stock, 'symbol'))
		} else {
			setAssets(assets.concat(stock));
		}
	}

	const HeaderRight = () => {
		if (selectedRows.length > 0) {
			return <RightHeaderButton icon="trash-bin-sharp" onPress={deleteList} />
		} else {
			return <RightHeaderButton icon="search" onPress={() => setModalVisible(true)} />
		}
	}

	const FooterButton = () => {
		return (
			<>
			{showFooter && <ConfirmButton buttonStyle={{width: '100%'}} title="SAVE" onPress={saveList}/>}
			</>
		)
	}

	const showItem = ({item: stock}) => {
		return (
			<View style={styles.watchlistItemContainer}>
				<TouchableOpacity onPress={() => toggleWatchlist(stock)}>
					<View style={styles.stockSelector} >
							{assets.map(item => item.symbol).includes(stock.symbol) ?
								<Ionicons name="heart" color={theme.backArrow } size={WP(7)} /> :
								<Ionicons name="heart-outline" color={theme.backArrow } size={WP(7)} />
							}
						<StockName {...{stock}} containerStyle={styles.stockNameContainer}/>
					</View>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<AppView isLoading={!!!watchlist} title={watchlist?.name} 
			headerRight={<HeaderRight />} footer={<FooterButton />} >
			<DraggableFlatList
			  	style={styles.draggableList}
		        data={assets ?? []}
		        renderItem={({item, index}) => <WatchlistItem stock={item} onSelectionChanged={(selected) => updateSelection(item, selected)}/>}
		        keyExtractor={(item, index) => `draggable-item-${item.symbol}`}
		        onDragEnd={({ data }) => setData(data)}
		      />


		    //TODO:   
		    //Improve this - by passing intial list of assets
		    //And re-render only once by not updating assets everytime

			<Modal 
				animationType="slide" 
				backdropOpacity={1.0}
				isVisible={isModalVisible} 
				style={styles.modal}
				{...{deviceWidth, deviceHeight}}>
				<View style={{flex:1, justfyContent: 'center', alignItems: 'center'}}>
					<View style={styles.searchStockHeader}>
						<StyledText style={styles.headerTitle}>Search Stocks</StyledText>
						<CloseIcon onPress={() => setModalVisible(false)} containerStyle={{position: 'absolute', right: 0}}/>
					</View>
					<SearchStockList {...{showItem}} />
				</View>
			</Modal>

		</AppView>
	);
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		draggableList: {
			marginTop: WP(5)
		},
		watchlistItemContainer: {
			flexDirection: 'row',
			marginBottom: WP(3),
			alignItems: 'center',
		},
		stockSelector: {
			flexDirection: 'row',
			alignItems: 'center',
			width: '100%',
		},
		stockNameContainer: {
			marginLeft: WP(3)
		},
		iconButton: {

		},
		tinyButton: {
			padding: WP(0.5),
			paddingLeft: WP(2.5),
			paddingRight: WP(2.5),
			backgroundColor: theme.backArrow
		},
		tinyButtonText: {
			color: theme.dark,
			fontWeight: '700'
		},
		floatingButton: {
			position: 'absolute',
			bottom: 20,
			right: 20,
			backgroundColor: theme.backArrow,
			borderRadius:100,
			padding: WP(2)
		},
		modal: {
			// flex:1,
			// width: '50%',
			// alignItems: 'center',
			// justifyContent: 'center'
		},
		searchStockHeader: {
			height: 40, 
			width: '100%', 
			marginBottom: WP(5),
			justifyContent: 'center',
		},
		headerTitle: {
			textAlign: 'center',
			fontSize: WP(4.5),
			color: theme.backArrow
		}
	});

	return styles;	
}


export default EditWatchlist;