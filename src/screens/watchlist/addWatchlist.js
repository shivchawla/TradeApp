import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AppView, RightHeaderButton, 
	TextInputWithIcon} from '../../components/common';
import { generateName } from '../../utils';
import { useTheme, StyledText, WP } from '../../theme';
import { useCreateWatchlist } from '../../helper';

const AddWatchlist = (props) => {

	const styles = useStyles(); 
	const theme = useTheme();

	const {watchlists} = props.route.params;
	const [name, setName] = useState("");
	const {createWatchlist} = useCreateWatchlist();
	
	const navigation = useNavigation();

	React.useEffect(() => {
		if (watchlists) {
			setName(generateName(watchlists.map(item => item.name), 'Watchlist')); 
		}
	}, [])

	const createList = () => {
		createWatchlist({name, symbols:[]}, {
			onSuccess: (response, input) => {
				navigation.replace('EditWatchlist', {watchlistId: response.id})
			},
			onError: (err, input) => console.log(err)
		})
	}

	const HeaderRight = () => {
		const navigation = useNavigation();

		return (
			<RightHeaderButton title="CREATE" onPress={createList}/>
		)
	}

	return (
		<AppView title="Add Watchlist" scroll={false} headerRight={<HeaderRight />}>
			<View style={styles.nameContainer}>
				<StyledText style={{fontSize: WP(5)}}>NAME</StyledText>
				<TextInputWithIcon
					textStyle={styles.editContainer}
			        onChange={setName}
			        value={name}
			        keyboardType="text"
			        iconSize={WP(4)}
			        iconContainerStyle={{marginLeft: WP(3)}}
			        textStyle={{fontSize: WP(5)}}
		      	/>
	      	</View>
		</AppView>
	);
}

const useStyles = () => {
	const theme = useTheme();

	const styles = StyleSheet.create({
		nameContainer: {
			flexDirection: 'row', 
			alignItems: 'center', 
			justifyContent: 'space-between',
			width: '100%',
			marginTop: WP(10)
		},
		editContainer: {

		},
	});

	return styles;
}

export default AddWatchlist;
