import React, {useState} from 'react';
import { View, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { ShowJson, Collapsible } from '../common';
import { useTheme, WP, HP, StyledText } from '../../theme'; 
import { useStockNews } from '../../helper';
import { newsUrl } from '../../config';

const ShowNews = ({news, symbol}) => {

	const {theme, styles} = useStyles(); 
	const navigation = useNavigation();

	const [numItems, setNumItems] = useState(5);

	const NewsItem = ({item}) => {
		const title = item?.attributes?.title;
		const url = item?.links?.self ? `${newsUrl}${item?.links?.self}` : null;

		const onNewsPress = () => {
			Linking.openURL(url);
		}

		return (
			<>
			{title && url  && 
				<TouchableOpacity style={styles.newsItem} onPress={onNewsPress}>
					<StyledText style={styles.newsTitle}>{title}</StyledText>
				</TouchableOpacity>
			}
			</>
		)
	}
	
	return (
		<View style={styles.newsContainer}>
			{news && news.slice(0, numItems).map((item, index) => {
				return <NewsItem key={index} {...{item}} />
			})
			}
			{news.length > numItems && 
				<View style={styles.buttonContainer}>
					<TouchableOpacity style={styles.showMoreButton} onPress={() => setNumItems(numItems + 5)}>
						<StyledText style={styles.showMoreText}>MORE NEWS</StyledText>
					</TouchableOpacity>
				</View>
			} 
		</View>
	)
} 

export const StockNews = ({symbol, ...props}) => {

	const {news, getNews} = useStockNews(symbol);

	useFocusEffect(
		React.useCallback(() => {
			getNews();
		}, [])
	)

	return (
		<>
		{!!news?.data && news.data.length > 0 &&
		<Collapsible		
			title="NEWS"
			content={<ShowNews news={news.data} {...{symbol}} />}
		/>
		}
		</>
	)
}

const useStyles = () => {
	const {theme} = useTheme();

	const styles = StyleSheet.create({
		newsContainer: {
			width: '100%',
		},

		newsItem: {
			marginTop: HP(2)
		},
		newsTitle: {
			fontSize: WP(4.5)
		},
		buttonContainer: {
			flexDirection: 'row', 
			justifyContent: 'center', 
			marginTop: HP(2)
		},
		showMoreButton: {
			justifyContent: 'center'
		},
		showMoreText: {
			color: theme.icon
		}
	})

	return {theme, styles}
}