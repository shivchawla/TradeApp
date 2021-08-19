import React, {useState} from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

import { CloseIcon } from './navIcons';
import { useTheme, WP, HP, StyledText } from '../../theme';
import { deviceWidth, deviceHeight } from '../../utils';

const CustomModal = ({isVisible, onHide}) => {
  return (
      <Modal 
        animationType="slide" 
        backdropOpacity={1.0}
        {...{isVisible, deviceWidth, deviceHeight}}>
        <View style={{justfyContent: 'center', alignItems: 'center', height: HP(40)}}>
          <CloseIcon onPress={onHide} />
          <StyledText>QUICK ACTION</StyledText>
        </View>
      </Modal>
  )
}

export const CustomTabBar = ({ state, descriptors, navigation }) => {
  
  const styles = useStyles();
  const theme = useTheme();

  const [isModalVisible, setModalVisible] = useState(false);
  
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const icon = index == 0 ? "stats-chart" : "pie-chart";
            
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center', ...(index%2 == 0) ? {marginRight: WP(20)} : {marginLeft: WP(20)}}}
          >
        
            <Ionicons name={icon} color={isFocused ? theme.backArrow : theme.light} size={WP(7)} />

          </TouchableOpacity>
        );
      })}

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.quickActionButton}>
          <Ionicons style={{zIndex:3}} name="menu" color={theme.backArrow} size={WP(7)}/>
      </TouchableOpacity>
    
      <CustomModal isVisible={isModalVisible} onHide={() => setModalVisible(false)} />

    </View>




  );
}

const useStyles = () => {
  const theme = useTheme();
  
  const styles = StyleSheet.create({
    tabBar: {
      flexDirection: 'row',
      height: 50,
      alignItems: 'center',
      backgroundColor: theme.background,
      borderTopWidth:1,
      borderColor: theme.grey7,
      width: WP(100)
    },
    quickActionButton: {
      position: 'absolute',
      left: (deviceWidth - 25)/2,
    }

  });

  return styles;
}
