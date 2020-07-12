import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StatusBar,
  Platform,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import {
  Container,
  Header,
  Content,
  Button,
  Left,
  Right,
  Body,
  Separator,
  SwipeRow
} from "native-base";

import styles from "./styles";

import { Images, Metrics, Fonts, Colors } from "../../themes";

import AsyncStorage from '@react-native-community/async-storage';

import firebase from "react-native-firebase";
import { FireBaseApp } from "../config";
import Ip from "../apihost";
const api_host = Ip.api_host;
var decoded = [];
var token = ''
headers = new Headers();
headers.append('Access-Control-Allow-Origin', api_host);
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append('Content-Type', 'application/json');
headers.append('authorization', 'Bearer ' + token);

var jwtDecode = require('jwt-decode');

export default class Teams extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    AsyncStorage.removeItem('team_id')
    AsyncStorage.removeItem('team_name')
    this.state = {
      basic: true,
      data: [],
      // dataSource: dataObjects
    };
  }

  _retrieveData = async () => {
    try {
      console.log("host url = " + Ip.api_host)
      const value = await AsyncStorage.getItem('token');
      console.log(value)
      if (value !== null) {
        token = value;
        decoded = await jwtDecode(value);
        this.readUserInfo()
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  async readUserInfo() {
    var id = decoded.user.id
    console.log("decoded = ", decoded.user)
    FireBaseApp
      .firestore()
      .collection("users")
      .doc(FireBaseApp.auth().currentUser.uid)
      .update({
        userId: id
      });
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  componentDidMount() {
    this._retrieveData()
  }
  handleBackButtonClick = () => {
    BackHandler.exitApp()
    return true;
  };

  render() {
    StatusBar.setBarStyle("light-content", true);
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(Colors.backgroundcolor, true);
      StatusBar.setTranslucent(true);
    }
    return (
      <Container style={styles.mainview}>
        <Header androidStatusBarColor={"transparent"} style={styles.header}>
          <Left style={styles.left}>

          </Left>

          <Body style={styles.body}>
            <Text style={styles.Dashboardtext}>Teams</Text>
          </Body>

          <Right style={styles.right}>
            {/* <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("EditSong", {
                  screenName: "Add Song"
                })
              }
            >
              <MaterialCommunityIcons
                name="plus-circle-outline"  //music-note-plus
                size={25}
                color={"#fff"}
              />
            </TouchableOpacity> */}
          </Right>
        </Header>
        <View style={{ backgroundColor: Colors.backgroundcolor, height: Metrics.HEIGHT * 0.01, width: Metrics.WIDTH }} />
        <View style={{ flexDirection: 'row', marginTop: Metrics.HEIGHT * 0.15 }}>
          <View style={{ width: Metrics.WIDTH * 0.15 }} />
          <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate("CreateTeam")}>
            <Image style={{ width: Metrics.WIDTH * 0.3, height: Metrics.WIDTH * 0.3, }}
              source={require('../../images/create_team.png')} />
            <Text style={{ textAlign: 'center' }}>Create Team</Text>
          </TouchableOpacity>
          <View style={{ width: Metrics.WIDTH * 0.1 }} />
          <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate("TeamList")}>
            <Image style={{ width: Metrics.WIDTH * 0.3, height: Metrics.WIDTH * 0.3, }}
              source={require('../../images/join_team.png')} />
            <Text style={{ textAlign: 'center' }}>Join Team</Text>
          </TouchableOpacity>
          <View style={{ width: Metrics.WIDTH * 0.15 }} />
        </View>
      </Container>
    );
  }

}
