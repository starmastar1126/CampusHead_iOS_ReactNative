import React, { Component } from "react";
import {
  Platform,
  StatusBar,
  View,
  Text,
  Image,
  TouchableOpacity
} from "react-native";
import { Content } from "native-base";
import styles from "./style";
import { Metrics, Fonts, Images, Colors } from "../../themes";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import firebase from "react-native-firebase";
import { FireBaseApp } from "../config";
const MenuItems = [
  {
    id: 1,
    name: "Home"
  },
  {
    id: 2,
    name: "Songs"
  },
  {
    id: 3,
    name: "Calendar"
  },
  {
    id: 4,
    name: "Team Members"
  },
  {
    id: 5,
    name: "Pricing"
  },
  {
    id: 6,
    name: "Profile"
  },
  {
    id: 7,
    name: "List of Teams"
  },
  // {
  //   id: 8,
  //   name: "Notification"
  // },
  {
    id: 8,
    name: "LOGOUT"
  },
  // {
  //   id: 8,
  //   name: "LOGOUT"
  // }
];

import AsyncStorage from '@react-native-community/async-storage';
//----------get user data----------
var token = '';
// console.log(token)
// var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMTQsImVtYWlsIjoid2FuZ3dlaUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IldhbmcgV2VpIiwicGFzc3dvcmQiOiIkMmEkMDgkQVZXRS5EVEp5dHMvdEJpOXNoa3hLTzZsdk8yZS9YeEZ2QVkzajVhWjc2OGlyZThLcWwxelciLCJwaWMiOiJodHRwOi8vMTkyLjE2OC4xLjExMjo4MDgwL3B1YmxpYy91cGxvYWRzL3Byb2ZpbGUvMV8wajZOeGxVNDYwWkRqLUpReXc3X1V3LmpwZyIsImRhdGVfcmVnaXN0cmF0aW9uIjoiMjAxOS0wNi0xM1QxMDoxOTowMC4wMDBaIiwibWVtYmVyc2hpcCI6bnVsbCwidGVhbV9pZCI6MzQsInJvbGUiOm51bGwsInBvc2l0aW9uIjoiRnVpIHlvIGRhIHhpYSBCaW4gSmlhbmcgemhvbmcgbHUgZGFuZG9uZyBsaWFvIG5pbmcgQ2hpbmEifSwiaWF0IjoxNTYwNzEyOTUzLCJleHAiOjE1NjMzMDQ5NTN9.dqf9ilvEtDnwPHBN0QW1VH_OSR1QtNKQVvowi7lyV3k";
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
export default class SideMenu extends Component {
  constructor(props) {
    super(props);
    this._retrieveData()
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
      console.log("id ======================= " + id)
      var name = await AsyncStorage.getItem('team_name');
      this.setState({
        team_id: id,
        team_name: name,
      })
      if (value !== null) {
        token = value;
        decoded = jwtDecode(value);
        // this.readTeamInfo();
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
      if (this.state.team_id != null && this.state.team_id != '')
        this.props.navigation.navigate("Home");
      else
        this.props.navigation.navigate("TeamList");
    } else if (index == 1) {
      if (this.state.team_id != null && this.state.team_id != '')
        this.props.navigation.navigate("Songs");
      else
        this.props.navigation.navigate("TeamList");
    } else if (index == 2) {
      if (this.state.team_id != null && this.state.team_id != '')
        this.props.navigation.navigate("Calendar");
      else
        this.props.navigation.navigate("TeamList");
    } else if (index == 3) {
      if (this.state.team_id != null && this.state.team_id != '')
        this.props.navigation.navigate("TeamMembers");
      else
        this.props.navigation.navigate("TeamList");
    } else if (index == 6) {
      this.props.navigation.navigate("TeamList");
    } else if (index == 4) {
      if (this.state.team_id != null && this.state.team_id != '')
        this.props.navigation.navigate("Pricing");
      else
        this.props.navigation.navigate("TeamList");
    } else if (index == 5) {
      this.props.navigation.navigate("Profile");
    // } else if (index == 7) {
    //   this.props.navigation.navigate("Notification");
    } else if (index == 7) {
      this.logOut()
    }
    this.props.navigation.closeDrawer();
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
    if (index == 0) {
      return (
        <Ionicons
          name="ios-home"
          size={25}
          color="#6f6f6f"
          style={{
            marginLeft: Metrics.HEIGHT * 0.06
          }}
        />
      );
    } else if (index == 1) {
      return (
        <MaterialCommunityIcons
          name="music"
          size={25}
          color="#6f6f6f"
          style={{
            marginLeft: Metrics.HEIGHT * 0.06
          }}
        />
      );
    } else if (index == 2) {
      return (
        <MaterialCommunityIcons
          name="calendar-multiple-check"
          size={25}
          color="#6f6f6f"
          style={{
            marginLeft: Metrics.HEIGHT * 0.06
          }}
        />
      );
    } else if (index == 3) {
      return (
        <MaterialCommunityIcons
          name="file-document-box"
          size={25}
          color="#6f6f6f"
          style={{
            marginLeft: Metrics.HEIGHT * 0.06
          }}
        />
      );
    } else if (index == 6) {
      return (
        <MaterialCommunityIcons
          name="format-list-bulleted"
          size={25}
          color="#6f6f6f"
          style={{
            marginLeft: Metrics.HEIGHT * 0.06
          }}
        />
      );
    } else if (index == 4) {
      return (
        <MaterialCommunityIcons
          name="cash-usd"
          size={25}
          color="#6f6f6f"
          style={{
            marginLeft: Metrics.HEIGHT * 0.06
          }}
        />
      );
    } else if (index == 5) {
      return (
        <MaterialCommunityIcons
          name="account-edit"
          size={25}
          color="#6f6f6f"
          style={{
            marginLeft: Metrics.HEIGHT * 0.06
          }}
        />
      );
    }
    // else if (index == 7) {
    //   return (
    //     <MaterialCommunityIcons
    //       name="bell-ring"
    //       size={25}
    //       color="#6f6f6f"
    //       style={{
    //         marginLeft: Metrics.HEIGHT * 0.06
    //       }}
    //     />
    //   );
    // }
    else if (index == 7) {
      return (
        <Entypo
          name="log-out"
          size={25}
          color="#6f6f6f"
          style={{
            marginLeft: Metrics.HEIGHT * 0.06
          }}
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
  }

  render() {
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(Colors.backgroundcolor, true);
      StatusBar.setTranslucent(true);
    }
    return (
      <View style={styles.mainView}>
        <View style={styles.headerView}>
          <Image
            source={require('../../images/logo.png')}
            style={styles.imageProfile}
          />
        </View>
        <View
          style={{
            height: 2,
            width: Metrics.WIDTH * 0.7,
            backgroundColor: '#dcdde1',
          }}
        />
        <View style={styles.menuView}>
          <Content >
            {MenuItems.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => this.getStorage(index)}
                  style={{
                    flexDirection: "row",
                    marginTop: Metrics.HEIGHT * 0.05
                  }}
                >
                  {this.renderIcon(index)}
                  <Text style={styles.menuName}>{item.name}</Text>
                </TouchableOpacity>
              );
            })}
          </Content>
        </View>
      </View>
    );
  }
}
