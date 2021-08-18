import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import DraggableFlatList, {RenderItemParams} from "react-native-draggable-flatlist";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

import { AppView, StockName, RightHeaderButton, ConfirmButton, CloseIcon, TouchRadio } from '../../components/common';
import { SearchStockWatchlist } from '../../components/market';
import { useWatchlist, useDeletewatchlist, useUpdateWatchlist } from '../../helper';
import {useTheme, WP, StyledText} from '../../theme';
import { diffArray, removeArray, deviceWidth, deviceHeight } from '../../utils'

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
	const {getWatchlist} = useWatchlist(watchlistId, {enabled: false});
	const [watchlist, setWatchlist] = useState(null);
	const [assets, setAssets] = useState([]);
	const [selectedRows, setRows] = useState([]);
	const [showFooter, setShowFooter] = useState(false);
	const [isModalVisible, setModalVisible] = useState(false);
	const {updateWatchlist} = useUpdateWatchlist();

	const watchlistRef = React.useRef();

	React.useEffect(() => {
		const fetchWatchlist = async() => {
			setWatchlist(await getWatchlist());
		}
		fetchWatchlist();
	}, [])

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

	}, [watchlist, assets]);

	const updateSelection = (stock, selected) => {
		if (selected) {
			setRows(selectedRows.concat(stock));
		} else {
			setRows(selectedRows.filter(item => item.symbol != stock.symbol));
		}
	}

	const saveList = () => {
		updateWatchlist({watchlistId: watchlist.id, watchlistParams: {name: watchlist.name, symbols: assets.map(item => item.symbol)}},
			{
				onSuccess: (response, input) => {
					setWatchlist(response);
				},

				onError: (err, input) => {console.log(err); console.log(input)}
			});
	}

	const deleteList = () => {
		if (selectedRows.length > 0) {
			setAssets(assets.filter(item => !selectedRows.map(item => item.symbol).includes(item.symbol)));
			setRows([]);
		}
	}

	const handleClose = () => {
		setAssets(watchlistRef?.current?.getSelectedStocks() ?? assets);
		setModalVisible(false);
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
			{showFooter && <ConfirmButton buttonStyle={{width: '100%'}} title="SAVE" onClick={saveList}/>}
			</>
		)
	}

	const ZeroAssetCount = () => {
		return (
			<View style={styles.noAssetsContainer}>
				<StyledText style={styles.noAssetTitle}>No Symbols found</StyledText>
				<TouchableOpacity style={styles.noAssetButton} onPress={() => setModalVisible(true)} >
					<StyledText style={styles.noAssetButtonText}>ADD STOCKS</StyledText>
				</TouchableOpacity>
			</View>
		) 
	}

   //TODO:   
	    //Improve this - by passing intial list of assets
	    //And re-render only once by not updating assets everytime

	return (
		<AppView scroll={false} isLoading={!!!assets} title={watchlist?.name ?? "HOPE"} 
			headerRight={<HeaderRight />} footer={<FooterButton />} >
			{!!assets && assets.length > 0 ? <DraggableFlatList
			  	style={styles.draggableList}
		        data={assets ?? []}
		        renderItem={({item, index}) => <WatchlistItem stock={item} onSelectionChanged={(selected) => updateSelection(item, selected)}/>}
		        keyExtractor={(item, index) => `draggable-item-${item.symbol}`}
		      />
		  	:
		    <ZeroAssetCount /> 
		 	}
			<Modal 
				animationType="slide" 
				backdropOpacity={1.0}
				isVisible={isModalVisible} 
				style={styles.modal}
				{...{deviceWidth, deviceHeight}}>
				<View style={{flex:1, justfyContent: 'center', alignItems: 'center'}}>
					<View style={styles.searchStockHeader}>
						<StyledText style={styles.headerTitle}>Search Stocks</StyledText>
						<CloseIcon onPress={handleClose} containerStyle={{position: 'absolute', right: 0}}/>
					</View>
					<SearchStockWatchlist ref={watchlistRef} initialStocks={assets}/>
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
		},
		noAssetsContainer: {
			flex:1,
			justifyContent: 'center',
			alignItems: 'center'
		},
		noAssetTitle: {
			fontSize: WP(5)
		},
		noAssetButton: {
			backgroundColor: theme.backArrow,
			padding: WP(1),
			paddingLeft: WP(3),
			paddingRight: WP(3),
			marginTop: WP(4)
		},
		noAssetButtonText: {
			fontSize: WP(4),
			color: theme.dark
		}

	});

	return styles;	
}


export default EditWatchlist;