import React, { Component } from "react";
import {
  Platform,
  StatusBar,
  View,
  BackHandler,
  TouchableOpacity
} from "react-native";
import {
  Content,
  Container,
  Right,
  Header,
  Left,
  Text,
  Body
} from "native-base";
import styles from "./style";
import { Metrics, Fonts, Images, Colors } from "../../themes";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import colors from "../../themes/Colors";
import firebase from "react-native-firebase";
import { FireBaseApp } from "../config";
const MenuItems = [
  {
    id: 1,
    name: "Profile"
  },
  {
    id: 2,
    name: "My Team"
  },
  {
    id: 3,
    name: "List of Teams"
  },
  {
    id: 4,
    name: "Upgrade"
  },
  {
    id: 5,
    name: "LOGOUT"
  },
];

import AsyncStorage from '@react-native-community/async-storage';
//----------get user data----------
var token = '';
var decoded = [];

//----------Api config ---------
import Ip from "../apihost";
const api_host = Ip.api_host;

let headers = new Headers();

headers.append('Access-Control-Allow-Origin', api_host);
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append('Content-Type', 'application/json');
headers.append('authorization', 'Bearer ' + token);

var jwtDecode = require('jwt-decode');

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      avatarSource: null,
      username: '',
      email: '',
      position: '',
      team_id: '',
      team_name: '',
    };
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      var id = await AsyncStorage.getItem('team_id');
      var name = await AsyncStorage.getItem('team_name');
      this.setState({
        team_id: id,
        team_name: name,
      })
      if (value !== null) {
        token = value;
        decoded = jwtDecode(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  async getStorage(index) {

    var id = await AsyncStorage.getItem('team_id');
    var name = await AsyncStorage.getItem('team_name');

    this.setState({
      team_id: id,
      team_name: name,
    })
    this.menuItemClickHandle(index)
  }

  menuItemClickHandle(index) {
    if (index == 0) {
      this.props.navigation.navigate("Profile");
    } else if (index == 1) {
      this.props.navigation.navigate("TeamMembers");
    } else if (index == 2) {
      this.props.navigation.navigate("TeamList");
    } else if (index == 3) {
      this.props.navigation.navigate("Pricing");
    } else if (index == 4) {
      this.logOut();
    }
  }

  async logOut() {
    await FireBaseApp.auth().signOut().then(function () {
      console.log("signOut is successful")
    }).catch(function (error) {
      console.log("signOut is failure")
    });
    await AsyncStorage.clear()
    this.props.navigation.navigate('SignIn')
  }

  renderIcon = index => {
    if (index == 1) {
      return (
        <MaterialCommunityIcons
          name="file-document-box"
          size={35}
          color="black"
        />
      );
    } else if (index == 2) {
      return (
        <MaterialCommunityIcons
          name="format-list-bulleted"
          size={35}
          color="black"
        />
      );
    } else if (index == 3) {
      return (
        <MaterialCommunityIcons
          name="cash-usd"
          size={35}
          color="black"
        />
      );
    } else if (index == 0) {
      return (
        <MaterialCommunityIcons
          name="account-edit"
          size={35}
          color="black"
        />
      );
    } else if (index == 4) {
      return (
        <Entypo
          name="log-out"
          size={35}
          color="black"
        />
      );
    }
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        // We have data!!
        token = value;
        decoded = jwtDecode(value);
        this.readUserInfo();
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  UNSAFE_componentWillMount() {
    try {
      this._retrieveData()
    } catch (e) {
      console.log(e);
    }
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  async readUserInfo() {
    var team = {
      'name': '',
      'email': '',
      'position': '',
      'photoURL': '',
    };

    await fetch(api_host + '/user/getById/' + decoded.user.id, {
      method: 'GET',
      headers: headers
    })
      .then(response => {
        response.json().then(data => {
          if (data.length > 0) {
            this.setState({
              avatarSource: data[0].pic,
              email: data[0].email,
              username: data[0].username,
              position: data[0].position
            });
          }
        })
      });
  }

  componentWillUnmount() {
    console.log("componentWillUnmount")
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    this.props.navigation.navigate("Home");
    return true;
  };

render() {
  if (Platform.OS === "android") {
    StatusBar.setBackgroundColor(Colors.backgroundcolor, true);
    StatusBar.setTranslucent(true);
  }
  return (
    <Container style={styles.mainView}>
      <Header androidStatusBarColor={"transparent"} style={styles.header}>
        <Left style={styles.left}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home')}
          >
            <MaterialCommunityIcons
              name="home"
              size={30}
              color="white"
            />
          </TouchableOpacity>
        </Left>

        <Body style={styles.body}>
          <Text style={styles.Dashboardtext}>Menu</Text>
        </Body>

        <Right style={styles.right}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Notification')}
          >
            <MaterialCommunityIcons
              name="bell"
              size={30}
              color="white"
            />
          </TouchableOpacity>
        </Right>
      </Header>
      <View style={{ backgroundColor: colors.backgroundcolor, height: 5, marginBottom: 10 }} />
      <View style={styles.menuView}>
        <KeyboardAwareScrollView >
          {MenuItems.map((item, index) => {
            return (
              <View style={{ flex: 1 }} key={index}>
                <TouchableOpacity
                  onPress={() => this.getStorage(index)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: Metrics.HEIGHT * 0.015
                  }}
                >
                  {this.renderIcon(index)}
                  <Text style={styles.menuName}>{item.name}</Text>
                </TouchableOpacity>
                <View
                  style={{
                    height: 1,
                    width: '100%',
                    alignItems: 'center',
                    backgroundColor: '#dcdde1',
                  }}
                />
              </View>
            );
          })}
        </KeyboardAwareScrollView>
      </View>
    </Container>
  );
}
}
