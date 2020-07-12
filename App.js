 /**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import NavigationScreen from './navigation/appnavigation';
import FlashMessage from "react-native-flash-message";
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { MenuProvider } from 'react-native-popup-menu';

export default class App extends Component {
  constructor(props) {
    super(props);
    Icon.loadFont();
  }
  render() {
    return (
      <MenuProvider>
      <View style={{ flex: 1 }}>
        <NavigationScreen />
        <FlashMessage position="top" animated={true} autoHide={true} />
      </View>
      </MenuProvider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
