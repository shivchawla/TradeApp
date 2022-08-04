import React, {useState} from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

import { CloseIcon, Icon } from './iconButtons';
import { useTheme, WP, HP, StyledText } from '../../theme';
import { deviceWidth, deviceHeight } from '../../utils';

const CustomModal = ({isVisible, onHide, navigation}) => {
  const {theme, styles} = useStyles();

  const CustomAction = ({iconName, title, description, onPress}) => {
      return (
        <TouchableOpacity style={styles.customAction} onPress={onPress}>
              <CustomIcon {...{iconName}} hasBackground={true} backgroundStyle={{padding: WP(2), backgroundColor: theme.grey8, borderRadius: 5}}/>
              <View style={styles.customActionTextContainer}>
                <StyledText style={styles.customActionTitle}>{title}</StyledText>
                <StyledText style={styles.customActionDescription}>{description}</StyledText>
              </View>
        </TouchableOpacity>
      )
  }

  return (
      <Modal 
        animationType="slide" 
        backdropOpacity={0.7}
        onBackdropPress={onHide}
        style={styles.modal}
        {...{isVisible, deviceWidth, deviceHeight}}>
        <View style={styles.modalContent}>
          
          <CustomAction iconName="bug" title="TRADE" description="Buy or Sell stock" onPress={() => navigation.navigate("ChooseStock", {onPressToOrder: true})} />
          <CustomAction iconName="pulse" title="SEARCH STOCKS" description="Search Stocks" onPress={() => navigation.navigate("SearchStock")} />
          <CustomAction iconName="cube" title="PENDING ORDERS" description="View Pending Orders" onPress={() => navigation.navigate("History", {field: 'orders'})} />
          <CustomAction iconName="notifications-circle" title="NOTIFICATIONS" description="View Notifications" onPress={() => navigation.navigate("Notifications")} />

          <View style={styles.closeButtonContainer}>
            <CloseIcon 
              onPress={onHide} 
              iconColor={theme.grey9} 
              containerStyle={styles.closeButton}
            />
          </View>
          
        </View>
      </Modal>
  )
}

export const CustomTabBar = ({ state, descriptors, navigation }) => {
  
  const {theme, styles} = useStyles();

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

        const icon = route.name == "Market" ? "stats-chart" : "pie-chart";
            
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
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center', ...(index%2 == 0) ? {marginRight: WP(20)} : {marginLeft: WP(20)}}}
          >
        
            <Ionicons name={icon} color={isFocused ? theme.light : theme.grey7} size={WP(7)} />

          </TouchableOpacity>
        );
      })}

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.quickActionButton}>
          <Ionicons style={{zIndex:3}} name="menu" color={theme.backArrow} size={WP(7)}/>
      </TouchableOpacity>

      <CustomModal isVisible={isModalVisible} onHide={() => setModalVisible(false)} {...{navigation}} />

    </View>

  );
}

const useStyles = () => {
  const {theme} = useTheme();
  
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
    },
    modal: {
      justifyContent: 'flex-end',
      margin: 0,
      width: WP(100),
    },
    modalContent: {
      // justifyContent: 'center', 
      minHeight: 320 + 50, 
      height: HP(40) + 50,
      backgroundColor: theme.grey10,
      width: WP(100),
      borderTopRightRadius: 25,
      borderTopLeftRadius: 25,
      position: 'absolute',
      bottom: 0
    },
    closeButtonContainer: {
      height: 50,
      width: '100%',
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      bottom: 0,
      zIndex:2,
      borderTopWidth:1,
      borderColor: theme.grey7,
    },
    closeButton: {
      padding: WP(2),
      backgroundColor: theme.icon,
    },
    customAction: {
      margin: WP(5),
      flexDirection: 'row'
    },
    customActionTextContainer: {
      marginLeft: WP(5)
    },
    customActionTitle: {
      color: theme.icon,
      fontSize: WP(4.5)
    },
    customActionDescription: {
      color: theme.grey4,
      fontSize: WP(4)
    }

  });

  return {theme, styles};
}
