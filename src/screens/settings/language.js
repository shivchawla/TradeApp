import React, {useState} from 'react';
import { TouchableOpacity, StyleSheet, View, Image } from "react-native";

import { AppView, CustomIcon} from '../../components/common';

import { useTheme, useDimensions, useTypography, StyledText } from '../../theme';
import { locales } from '../../locales';
import { useTranslation } from 'react-i18next';

const flagIcons = {
  'en': require('../../assets/images/icon-us-flag.png'),
  'es': require('../../assets/images/icon-gt-flag.png'),
};

const Language = ({locale, selected, onSelect, ...props}) => {

	const {theme, styles} = useStyles();
	const {t} = useTranslation();
	
	const code = locale.split("-")[0] 

	return (
		<TouchableOpacity onPress={() => onSelect(locale)} style={styles.flagContainer}> 
	        <View style={{flexDirection: 'row'}}>
		        <Image
		          source={flagIcons[code]}
		          resizeMode="contain"
		          style={styles.image}
		        ></Image>
		        <StyledText style={styles.flagText}>{t('language:' + code)}</StyledText>
    		</View>
    		{selected && <CustomIcon iconName="checkmark-outline" />}
    	</TouchableOpacity>
	)
}


const SelectLanguage = (props) => {
	
	const {theme, styles} = useStyles();
	const {i18n} = useTranslation();

	const [currentLocale, setCurrent] = useState(i18n.language);
	
	const onLanguageSelect = (locale) => {
			setCurrent(locale)
	}

	React.useEffect(() => {
		i18n.changeLanguage(currentLocale);
	}, [currentLocale])

	return (
		<AppView title="UPDATE LANGUAGE">
			<View style={styles.languageSelectContainer}>
			{locales.map((locale, index) => {
				return <Language 
					key={`locale-${locale}`} 
					locale={locale}
					selected={locale == currentLocale} 
					onSelect={onLanguageSelect} 
				/>
			})
			}	
			</View>
		</AppView>
	)
}


const useStyles = () => {
	const { theme } = useTheme();
    const { HP, WP } = useDimensions();
    const { fontSize, fontWeight } = useTypography();


	const styles = StyleSheet.create({
	  languageSelectContainer: {
	  	marginTop: HP(5)
	  },
	  flagContainer: {
	    alignItems: 'center',
	    justifyContent: 'space-between',
	    flexDirection: 'row',
	    height: 40,
	    marginLeft:10,
	    marginRight:10
	  },
	  image: {
	    width: 20,
	    height: 20,
	  },
	  flagText: {
	    marginLeft: WP(2)
	  },
	});

	 return {theme, styles};
}

export default SelectLanguage;