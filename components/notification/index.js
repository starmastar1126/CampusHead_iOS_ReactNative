import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  StatusBar,
  Platform,
  BackHandler,
  I18nManager,
  FlatList,
  ActivityIndicator,
  ToastAndroid,
  SafeAreaView
  // ListView
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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { ListItem, SearchBar } from 'react-native-elements';
import { FireBaseApp } from "../config";
import firebase from "react-native-firebase";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

import AsyncStorage from '@react-native-community/async-storage';
import Ip from "../apihost";
import { decode } from "punycode";
const api_host = Ip.api_host;
var decoded = [];

let headers = new Headers();

var token = "";
headers.append('Access-Control-Allow-Origin', api_host);
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append('Content-Type', 'application/json');
headers.append('authorization', 'Bearer ' + token);

var jwtDecode = require('jwt-decode');
var team_id = ''
var team = {
  'id': 0,
  'name': '',
  'position': '',
  'isJoined': false,
};

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      data: [],
      owner: '',
      joinState: 0,
      refreshing: false,
      loading: false,
      teamData: []
      // dataSource: dataObjects
    };
  }

  componentDidMount() {
    try {
    this.checkPermission();
    this.createNotificationListeners();
    } catch(err) {
      console.log("error---->>", err);
    }

    try {
      this._retrieveData()
    } catch (e) {
      console.log(e);
    }
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      team_id = await AsyncStorage.getItem('team_id');
      this.setState({
        refreshing: true
      })
      var temp = []
      if (value !== null) {
        token = value;
        decoded = jwtDecode(value);
        await fetch(api_host + '/team/' + team_id, {
          method: 'GET',
          headers: headers,
        })
          .then(response => {
            response.json().then(data => {
              data.forEach(item => {
                if (item.is_mention == 1) {
                  var t = item.mention_id.slice(1, item.mention_id.length - 1)
                  if (this.mention(t, decoded.user.nickname).length > 0) {
                    if (temp.length > 0) {
                      temp = temp.concat(item)
                    } else {
                      temp.push(item)
                    }
                  }
                } else {
                  if (temp.length > 0) {
                    temp = temp.concat(item)
                  } else {
                    temp.push(item)
                  }
                }
              })
              this.setState({
                teamData: temp,
                refreshing: false
              })
            })
          })
          .catch(error => {
            this.setState({
              refreshing: false
            })
          })
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  readTeamInfo() {
    this.setState({ loading: true })
    fetch(api_host + '/user/' + decoded.user.id + '/getTeam', {
      method: 'GET',
      headers: headers
    })
      .then(response => {
        response.json().then(data => {
          if (data.teamInfo.length > 0) {
            fetch(api_host + '/team/getById/' + data.teamInfo[0].team_id, {
              method: 'GET',
              headers: headers
            }).then(response => {
              response.json().then(data => {
                team = data.members;
                this.setState({ data: team, loading: false, refreshing: false });
                this.arrayholder = team;
              })
            });
          } else {
            this.setState({ loading: false, refreshing: false });
            AsyncStorage.removeItem('team_id')
            AsyncStorage.removeItem('team_name')
            this.props.navigation.navigate("TeamList")
          }
        })
      })
      .catch(error => {
        this.setState({ loading: false, refreshing: false });
      })
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 2,
          marginLeft: Metrics.WIDTH * 0.17,
          width: Metrics.WIDTH * 0.83,
          backgroundColor: '#CED0CE',
        }}
      />
    );
  };

  searchFilterFunction = text => {
    this.setState({
      value: text,
    });

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.username.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Search..."
        lightTheme
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
      />
    );
  };

  renderFooter = () => {
    if (!this.state.loading || this.state.refreshing) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true,
    })
    this._retrieveData()
  }

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  componentWillUnmount() {
    this.notificationListener && typeof this.notificationListener == 'function' && this.notificationListener();
    this.notificationOpenedListener && typeof this.notificationOpenedListener == 'function' && this.notificationOpenedListener();
    this.messageListener && typeof this.messageListener == 'function' && this.messageListener();
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    // this.props.navigation.navigate("Login");
    // this.props.navigation.goBack(null);
    // Actions.pop();
    return true;
  };

  async acceptClick(id) {
    fetch(api_host + '/user/' + id + '/joinTeam/' + team_id, {
      method: 'POST',
      body: JSON.stringify({
        position: 'Member',
        join_state: 2
      }),
      headers: headers
    })
      .then(response => {
        this.setState({
          joinState: 2
        })
        FireBaseApp
          .firestore()
          .collection("users")
          .where("userId", "==", id)
          .onSnapshot(querySnapShot => {
            querySnapShot.forEach(user => {
              if (user.data().id != null || user.data().id != 0)
              FireBaseApp
                  .firestore()
                  .collection("users")
                  .doc(user.data().authId)
                  .update({
                    teamId: parseInt(team_id)
                  })
            });
          }
          );
        this.readTeamInfo()
      });
  }

  async declineClick(id, name) {
    await fetch(api_host + '/user/' + id + '/exitTeam/' + team_id, {
      method: 'POST',
      body: JSON.stringify({
        join_state: 0,
        position: 'none-member'
      }),
      headers: headers
    })
      .then(response => {
        this.setState({
          joinState: 0,
          // owner: ''
        })
        FireBaseApp
          .firestore()
          .collection("users")
          .where("userId", "==", id)
          .get()
          .then(querySnapShot => {
            querySnapShot.forEach(user => {
              if (user.data().userId != null && user.data().userId != 0)
              FireBaseApp
                  .firestore()
                  .collection("users")
                  .doc(user.data().authId)
                  .update({
                    teamId: 0
                  })
            });
          }
          );
        this.readTeamInfo()
      });
  }

  connectedClick(id) {
    return true
  }

  viewButton(id, join_state) {
    if (join_state == 1) {
      return <Button disabled={false} style={styles.joinBtn} onPress={() => this.acceptClick(id)}>
        <Text style={styles.joinText}>Accept</Text>
      </Button>
    }
    if (join_state == 2) {
      return <Button disabled={false} style={[styles.joinBtn, color = "secondary", { backgroundColor: "#b2bec3" }]} onPress={() => this.connectedClick(id)}>
        <Text style={styles.joinText}>Connected</Text>
      </Button>
    }
  }

  updateDeviceToken(fcmToken) {
    FireBaseApp
      .firestore()
      .collection("users")
      .doc(FireBaseApp.auth().currentUser.uid)
      .update({
        fcmToken: fcmToken
      });
  }

  /*********** Notification Part **************/

  //1
  async checkPermission() {
   try {
    const enabled = await FireBaseApp.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }catch(e) {
    console.log("error ---->>>", e);
  }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    if (!fcmToken) {
      try {
      fcmToken = await FireBaseApp.messaging().getToken();
      } catch(e) {
        console.log("error ---->>",e);
      }
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem("fcmToken", fcmToken);
      }
    }

    if (fcmToken) {
      this.updateDeviceToken(fcmToken);
    }
  }

  //2
  async requestPermission() {
    try {
      await FireBaseApp.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log("permission rejected");
    }
  }

  messagePress() {
    this.setState({ hasPressed: true });
    this.refs.fmLocalInstance.hideMessage();
  }

  messageShow() {
    this.setState({ hasShown: true });
  }

  messageHide() {
    this.setState({ hasHidden: true });
  }

  showSimpleMessage(type = "default", notification) {
    const message = {
      message: notification.title,
      description: notification.body,
      type: "success",
      hideStatusBar: true,
      onPress: this.messagePress.bind(this),
      onShow: this.messageShow.bind(this),
      onHide: this.messageHide.bind(this),
    };

    this.refs.fmLocalInstance.showMessage(message);
  }
  async createNotificationListeners() {
    try {
    this.messageListener = FireBaseApp.messaging().onMessage(message => {
      //process data message
      alert("messageListner")
      console.log("messageListener", JSON.stringify(message));
    });

    this.notificationListener = FireBaseApp
      .notifications()
      .onNotification(notification => {
        console.log("showalert")
        // this.showAlert(notification);
        var type = "default"
        this.setState({ hasPressed: false, hasShown: false, hasHidden: false });
        this.showSimpleMessage(type, notification)
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = FireBaseApp
      .notifications()
      .onNotificationOpened(notificationOpen => {
        console.log("opened")
        this.props.navigation.navigate("Songs")
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await FireBaseApp
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      // this.showAlert(notificationOpen.notification);
      // this.props.navigation.navigate("Songs")
    }
    /*
    * Triggered for data only payload in foreground
    * */
  }catch(e) {}
}

  showAlert(notification) {
    Alert.alert(
      notification.title,
      notification.body,
      [{ text: "OK", onPress: () => console.log("OK") }],
      { cancelable: false }
    );
  }

  mention(mention, text) {
    var data = mention.split(',')
    if (data.length > 0) {
      var newData = data.filter(item => {
        const itemData = `${item.toUpperCase()}`;
        const textData = text.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });
      return newData;
    } else
      return [];
  }
  
  formatTime(date) {
    var date = new Date(date);
    var year = date.getFullYear()
    var month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var am_pm = date.getHours() >= 12 ? "PM" : "AM";
    // var hours = date.getHours();
    hours = hours < 10 ? "0" + hours : hours;
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return time = month + '/' + day + '/' + year + " " + hours + ":" + minutes + " " + am_pm;
    // return time = hours + ":" + minutes;
  }

  notification(item) {
    // if (item.is_mention == 0) {
    if (item.pc_type == 1) {
      return <View style={styles.subRow}>
        <Text style={styles.headerContent}>
          <Text style={[styles.headerText, { fontWeight: "bold" }]}>{item.username}</Text>
          <Text style={styles.headerText}> posted on your team.</Text>
          <Text style={[styles.headerText, { flex: 1 }]}></Text>
        </Text>
        <View style={styles.headerContent}>
          <Text style={styles.time}>{this.formatTime(item.created_date)}</Text>
        </View>
      </View>
    } else if (item.pc_type == 2) {
      return <View style={styles.subRow}>
        <Text style={styles.headerContent}>
          <Text style={[styles.headerText, { fontWeight: "bold" }]}>{item.username}</Text>
          <Text style={styles.headerText}> commented on your post.</Text>
          <Text style={[styles.headerText, { flex: 1 }]}></Text>
        </Text>
        <View style={styles.headerContent}>
          <Text style={styles.time}>{this.formatTime(item.created_date)}</Text>
        </View>
      </View>
    } else if (item.pc_type == 3) {
      return <View style={styles.subRow}>
        <Text style={styles.headerContent}>
          <Text style={[styles.headerText, { fontWeight: "bold" }]}>{item.username}</Text>
          <Text style={styles.headerText}> posted on "</Text>
          <Text style={[styles.headerText, { fontWeight: "bold" }]}>{item.song_name}".</Text>
          <Text style={[styles.headerText, { flex: 1 }]}></Text>
        </Text>
        <View style={styles.headerContent}>
          <Text style={styles.time}>{this.formatTime(item.created_date)}</Text>
        </View>
      </View>
    } else if (item.pc_type == 4) {
      return <View style={styles.subRow}>
        <Text style={styles.headerContent}>
          <Text style={[styles.headerText, { fontWeight: "bold" }]}>{item.username}</Text>
          <Text style={styles.headerText}> commented on your post in "</Text>
          <Text style={[styles.headerText, { fontWeight: "bold" }]}>{item.song_name}".</Text>
          <Text style={[styles.headerText, { flex: 1 }]}></Text>
        </Text>
        <View style={styles.headerContent}>
          <Text style={styles.time}>{this.formatTime(item.created_date)}</Text>
        </View>
      </View>
    }
  }

  getMention(item) {
    if (item.pc_type == 1) {
      return <View style={styles.subRow}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerText, { fontWeight: "bold" }]}>{item.username}</Text>
          <Text style={styles.headerText}> mentioned you in a post.</Text>
          <Text style={[styles.headerText, { flex: 1 }]}></Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.time}>{this.formatTime(item.created_date)}</Text>
        </View>
      </View>
    } else if (item.pc_type == 2) {
      return <View style={styles.subRow}>
        <Text style={styles.headerContent}>
          <Text style={[styles.headerText, { fontWeight: "bold" }]}>{item.username}</Text>
          <Text style={styles.headerText}> mentioned you in a comment.</Text>
          <Text style={[styles.headerText, { flex: 1 }]}></Text>
        </Text>
        <View style={styles.headerContent}>
          <Text style={styles.time}>{this.formatTime(item.created_date)}</Text>
        </View>
      </View>
    } else if (item.pc_type == 3) {
      return <View style={styles.subRow}>
        <Text style={styles.headerContent}>
          <Text style={[styles.headerText, { fontWeight: "bold" }]}>{item.username}</Text>
          <Text style={styles.headerText}> mentioned you on "</Text>
          <Text style={[styles.headerText, { fontWeight: "bold" }]}>{item.song_name}".</Text>
          <Text style={[styles.headerText, { flex: 1 }]}></Text>
        </Text>
        <View style={styles.headerContent}>
          <Text style={styles.time}>{this.formatTime(item.created_date)}</Text>
        </View>
      </View>
    } else if (item.pc_type == 4) {
      return <View style={styles.subRow}>
        <Text style={styles.headerContent}>
          <Text style={[styles.headerText, { fontWeight: "bold" }]}>{item.username}</Text>
          <Text style={styles.headerText}> mentioned you in a comment on "</Text>
          <Text style={[styles.headerText, { fontWeight: "bold" }]}>{item.song_name}".</Text>
          <Text style={[styles.headerText, { flex: 1 }]}></Text>
        </Text>
        <View style={styles.headerContent}>
          <Text style={styles.time}>{this.formatTime(item.created_date)}</Text>
        </View>
      </View>
    }
  }

  hasMention(item) {
    return <TouchableOpacity onPress={() => this.goPage(item)}>
      <View style={styles.listContent}>
        {item.pic == null || item.pic == '' ?
          <Image source={Images.Profile} style={styles.profile} />
          :
          <Image source={{ uri: item.pic }} style={styles.profile} />
        }
        {this.getMention(item)}
      </View>
    </TouchableOpacity>
  }

  goPage(item) {
    if (item.pc_type == 1) {
      return this.props.navigation.navigate('Home', { pid: item.pid, user_id: item.user_id })
    } else if (item.pc_type == 2) {
      return this.props.navigation.navigate('Home', { pid: item.pid, user_id: item.user_id })
    } else if (item.pc_type == 3) {
      return this.props.navigation.navigate('ViewSong', { song_id: item.song_id, team_id: item.team_id })
    } else if (item.pc_type == 4) {
      return this.props.navigation.navigate('ViewSong', { song_id: item.song_id, team_id: item.team_id })
    }
  }

  render() {
    StatusBar.setBarStyle("light-content", true);
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(Colors.backgroundcolor, true);
      StatusBar.setTranslucent(true);
    }
    return (
      <View style={styles.mainview}>
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
            <Text style={styles.Dashboardtext}>Notification</Text>
          </Body>

          <Right style={styles.right}>
            {/*  */}
          </Right>
        </Header>
        <View style={{ backgroundColor: Colors.backgroundcolor, height: Metrics.HEIGHT * 0.01, width: Metrics.WIDTH }} />
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.teamData}
            renderItem={({ item }) => (
              <>
                {item.is_mention == 0 ? (
                  <View style={styles.rowMain}>
                    <View>
                      <TouchableOpacity onPress={() => this.goPage(item)}>
                        <View style={styles.listContent}>
                          {item.pic == null || item.pic == '' ?
                            <Image source={Images.Profile} style={styles.profile} />
                            :
                            <Image source={{ uri: item.pic }} style={styles.profile} />
                          }
                          {this.notification(item)}
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                    this.hasMention(item)
                  )}

              </>
            )}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={this.renderSeparator}
            // ListHeaderComponent={this.renderHeader}
            // ListFooterComponent={this.renderFooter}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            // onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0}
          />
        </View>
        <FlashMessage ref="fmLocalInstance" position="top" animated={true} autoHide={true} />
      </View>
    );
  }

}
