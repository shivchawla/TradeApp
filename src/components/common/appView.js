import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
import { BarIndicator } from 'react-native-indicators';

import { StyledText, useTheme, WP, defaultIconSize, HP } from '../../theme';
import { GobackIcon } from './iconButtons';
import { FullViewModal } from './';

export const AppHeader = ({ title, goBack = true, ...props }) => {
  const showHeader = React.useMemo(() => title || goBack, [title, goBack]);
  const { styles } = useStyles();

  return (
    <>
      {showHeader && (
        <View style={[styles.headerContainer, props.headerContainerStyle]}>
          {!!props?.headerLeft && <View style={styles.headerLeft}>{props.headerLeft}</View>}
          {goBack && (
            <View style={styles.headerLeft}>
              <GobackIcon {...{ goBack }} />
            </View>
          )}
          {title && (
            <StyledText style={[styles.headerTitle, props.headerTitleStyle]}>{title}</StyledText>
          )}
          {!!props?.headerRight && <View style={styles.headerRight}>{props.headerRight}</View>}
        </View>
      )}
    </>
  );
};

export const AppView = ({
  scroll = true,
  footer,
  hasHeader = true,
  header,
  isLoading = false,
  keyboardMode = '',
  onScroll,
  ...props
}) => {
  const { theme, styles } = useStyles();

  // console.log("Scroll: ", scroll);
  // console.log(props.children);

  console.log("--------Rendering App View------")

  const [showModal, setShowModal] = useState(false);
  const scrollRef = React.useRef();

  //This sets showModal based on prop change
  React.useEffect(() => {
    setShowModal(isLoading);
  }, [isLoading]);

  //On Blur, any modal should be turned off
  useFocusEffect(
    React.useCallback(() => {
      //Blur Effect
      return () => {
        setShowModal(false);
      };
    }, [])
  );

  //Check for ZERO padding
  const hasPadding = (props?.padding ?? '') !== '';

  return (
    <>
      <FullViewModal isVisible={showModal} opacity={0.8}>
        <View>{showModal && <BarIndicator color={theme.icon} />}</View>
      </FullViewModal>

      {scroll || keyboardMode == 'overlap' ? (
        <View style={styles.scrollAppContainer}>
          {hasHeader || header ? header ? header : <AppHeader {...props} /> : <></>}
          <KeyboardAwareScrollView
            innerRef={(r) => (scrollRef.current = r)}
            enableOnAndroid={true}
            contentContainerStyle={[
              styles.scrollView,
              props.scrollViewStyle,
              {
                ...(hasPadding && {
                  paddingLeft: WP(props.padding),
                  paddingRight: WP(props.padding),
                }),
              },
            ]}
            showsVerticalScrollIndicator={false}
            {...{ onScroll }}
          >
            {props.children}
          </KeyboardAwareScrollView>
          {footer && (
            <View style={[styles.footerContainer, props.footerContainerStyle]}>{footer}</View>
          )}
        </View>
      ) : (
        <KeyboardAvoidingView style={[styles.appContainer, props.appContainerStyle]}>
          {hasHeader || header ? header ? header : <AppHeader {...props} /> : <></>}
          <View
            style={[
              styles.staticView,
              {
                ...(hasPadding && {
                  paddingLeft: WP(props.padding),
                  paddingRight: WP(props.padding),
                }),
              },
              props.staticViewStyle,
            ]}
          >
            {props.children}
          </View>
          {footer && (
            <View style={[styles.footerContainer, props.footerContainerStyle]}>{footer}</View>
          )}
        </KeyboardAvoidingView>
      )}
    </>
  );
};

const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    scrollAppContainer: {
      flex: 1,
      // alignItems: 'center',
      width: WP(100),
      backgroundColor: theme.background,
    },
    scrollView: {
      backgroundColor: theme.background,
      width: WP(100),
      paddingLeft: WP(3),
      paddingRight: WP(3),
    },
    appContainer: {
      flex: 1,
      // alignItems: 'center',
      width: WP(100),
      backgroundColor: theme.background,
    },
    staticView: {
      flex: 1,
      paddingLeft: WP(3),
      paddingRight: WP(3),
      backgroundColor: theme.background,
    },
    headerContainer: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
      backgroundColor: theme.background,
    },
    footerContainer: {
      position: 'absolute',
      bottom: WP(0),
      width: WP(100),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerRight: {
      position: 'absolute',
      right: 10,
      justifyContent: 'center',
    },
    headerLeft: {
      position: 'absolute',
      left: 10,
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  return { theme, styles };
};
