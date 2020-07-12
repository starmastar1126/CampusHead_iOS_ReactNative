import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
  StatusBar,
  Platform,
  FlatList,
  ToastAndroid,
  ScrollView
} from "react-native";
import {
  Content,
  Container,
  Icon,
  Right,
  Header,
  Left,
  Body
} from "native-base";

import styles from "./styles";

import { Images, Metrics, Fonts, Colors } from "../../themes";
import DateTime from '../DateTime/index';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import _ from 'lodash'
import { FireBaseApp } from "../config";
import firebase from "react-native-firebase";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

import AsyncStorage from '@react-native-community/async-storage';
import images from "../../themes/Images";
import BottomBar from "../bottombar/index"
//----------get user data----------
var token = "";
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
var isExistTeam = false;
var team_id = '';

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: '',
      team_id: '',
      selectedDate: '',
      data: [],
      events: [],
      arrayDate: [],
      startDate: new Date(),
    };
  }

  _retrieveData = async () => {
    try {
      team_id = await AsyncStorage.getItem('team_id');
      if (team_id == 0 || team_id == null) {
        isExistTeam = false;
        return true;
      } else
        isExistTeam = true;

      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        token = value;
        decoded = jwtDecode(value);

        this.getTeamID("");
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  UNSAFE_componentWillMount() {
    this._retrieveData()
    BackHandler.addEventListener("hardwareBackPress", this.backPressed);
  }

  componentWillUnmount() {
    this.notificationListener && typeof this.notificationListener == 'function' && this.notificationListener();
    this.notificationOpenedListener && typeof this.notificationOpenedListener == 'function' && this.notificationOpenedListener();
    this.messageListener && typeof this.messageListener == 'function' && this.messageListener();
    BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
  }

  backPressed = () => {
    this.props.navigation.navigate("Calendar");
    return true;
  };

  onChangeDate(date) {
    this.getTeamID(date)
    this.setState({ startDate: date })
  }

  componentDidMount() {
    try {
    this.checkPermission();
    this.createNotificationListeners();
    } catch(err) {
      console.log("error---->>", err);
    }
  }

  renderChildDay(day) {
    let array = []
    if (this.state.arrayDate && this.state.arrayDate.length != 0) {
      for (i = 0; i < this.state.arrayDate.length; i++) {
        for (j = 0; j < this.state.arrayDate[i].length; j++) {
          if (!array.includes(this.state.arrayDate[i][j]))
            array.push(this.state.arrayDate[i])
        }
      }
    }

    if (_.includes(array, day)) {
      return <Image source={Images.LockRed} style={styles.icLockRed} />
    }
  }

  async getTeamID(date) {
    try {
      await fetch(api_host + '/user/' + decoded.user.id + '/getTeam', {
        method: 'GET',
        headers: headers
      }).then(response => {

        response.json().then(data => {

          if (data.teamInfo.length > 0) {
            this.setState({ team_id: data.teamInfo[0].id });
            this.readEventData(this.state.team_id, date)
          } else {

          }
        })
      });

    } catch (e) {
      console.log(e);
      // history.push('/login');
    }
  }

  // get Events according to date
  async readEventData(team_id, date) {
    var events = [];

    const request = await fetch(api_host + '/event/getByTeamId/' + team_id, {
      method: 'GET',
      headers: headers,
    })
      .then(response => {
        response.json().then(data => {
          if (data.data.length > 0) {
            var tags = [
              {
                value: data.data[0].song_id,
                label: data.data[0].name
              }
            ];

            events = [
              {
                id: data.data[0].id,
                title: data.data[0].title,
                desc: data.data[0].description,
                allDay: true,
                start: new Date(data.data[0].start),
                end: new Date(data.data[0].end),
                tags: tags
              }
            ];

            for (var i = 1; i < data.data.length; i++) {
              if (data.data[i].id == data.data[i - 1].id) {
                tags.push({
                  value: data.data[i].song_id,
                  label: data.data[i].name
                });
              } else {

                if (data.data[i - 1].id != data.data[0].id) {
                  events.push({
                    id: data.data[i - 1].id,
                    title: data.data[i - 1].title,
                    desc: data.data[i - 1].description,
                    allDay: true,
                    start: new Date(data.data[i - 1].start),
                    end: new Date(data.data[i - 1].end),
                    tags: tags
                  });
                }
                tags = [
                  {
                    value: data.data[i].song_id,
                    label: data.data[i].name
                  }
                ];
              }
            }
          }

          // if events is empty, show null....
          if (data.data.length > 1) {
            events.push({
              id: data.data[data.data.length - 1].id,
              title: data.data[data.data.length - 1].title,
              desc: data.data[data.data.length - 1].description,
              allDay: true,
              start: new Date(data.data[data.data.length - 1].start),
              end: new Date(data.data[data.data.length - 1].end),
              // tags: tags
            })
          };

          if (date == '') {
            var day = new Date()
            date = this.formatDate(day)
          }
          this.setState({ events: events })
          this.getEventDates(events, date)
        });
      });

  }

  getEventDates(events, day) {
    let array = [];
    let dates = [];
    let eventlists = [];
    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        array = this.getDates(events[i].start, events[i].end)
        var eventday = 0;
        for (j = 0; j < array.length; j++) {
          data = this.formatDate(array[j])
          if (data == day)
            eventday = 1;
          if (!dates.includes(data)) {
            if (dates.length > 0) {
              dates = dates.concat(data)
            } else {
              dates.push(data)
            }
          }
        }
        if (eventday > 0)
          if (eventlists.length > 0) {
            eventlists = eventlists.concat(events[i])
          } else {
            eventlists.push(events[i])
          }

      }
    }
    this.setState({
      arrayDate: dates,
      data: eventlists
    })
  }

  getDates(startDate, endDate) {
    for (var arr = [], dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt));
    }
    return arr;
  }

  formatDate(date) {
    var d = ''
    if (date == '')
      d = new Date()
    else
      d = new Date(date)
    month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  formatTime(date) {
    var date = new Date(date);
    var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var am_pm = date.getHours() >= 12 ? "PM" : "AM";
    // var hours = date.getHours();
    hours = hours < 10 ? "0" + hours : hours;
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return time = hours + ":" + minutes + " " + am_pm;
    // return time = hours + ":" + minutes;
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
    console.log("messagePressed")
    this.setState({ hasPressed: true });
    this.refs.fmLocalInstance.hideMessage();
    // this.props.navigation.navigate("Songs")
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

    console.log(message);
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
    }
  }catch(e) {
    console.log("error --->>", e);
  }
  }

  showAlert(notification) {
    Alert.alert(
      notification.title,
      notification.body,
      [{ text: "OK", onPress: () => console.log("OK") }],
      { cancelable: false }
    );
  }

  render() {
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(Colors.backgroundcolor, true);
      StatusBar.setTranslucent(true);
    }
    return (
      <View style={styles.mainview}>
        <Header androidStatusBarColor={"transparent"} style={styles.header}>
          <Left style={styles.left}>
            {/* <TouchableOpacity
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Image
                source={Images.MenuIcon}
                style={{
                  height: Metrics.HEIGHT * 0.07,
                  width: Metrics.WIDTH * 0.07,
                  resizeMode: "contain"
                }}
              />
            </TouchableOpacity> */}
          </Left>

          <Body style={styles.body}>
            <Text style={styles.Dashboardtext}>Calendar</Text>
          </Body>

          <Right style={styles.right}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("AddEvent", { key: this.state, team_id: this.state.team_id })
              }
            >
              <MaterialCommunityIcons
                name="plus-circle-outline"  //music-note-plus
                size={32}
                color={"#fff"}
              />
            </TouchableOpacity>
          </Right>
        </Header>
        {/* <View style={{backgroundColor:Colors.backgroundcolor,  height:Metrics.HEIGHT*0.01, width:Metrics.WIDTH}} /> */}
        {isExistTeam ? (
          <ScrollView>
            <View style={{ marginTop: 0, backgroundColor: '#2efff0', }}>
              <DateTime
                date={this.state.time}
                changeDate={(date) => this.onChangeDate(date)}
                format='YYYY-MM-DD'
                renderChildDay={(day) => this.renderChildDay(day)}
              />
            </View>
            {this.state.data < 1 ? (
              <View style={{ flex: 1 }}>
                <Text style={{ textAlign: 'center', fontSize: 18, marginTop: 15 }}>No Event</Text>
              </View>
            ) : (
                <View style={{ flex: 1 }}>
                  <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => (
                      <View style={styles.rowMain}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Event", { key: item, team_id: this.state.team_id })}>
                          <View style={styles.listContent} key={item.id}>
                            <Image source={images.EventTime} style={styles.profile} />
                            <View style={styles.subRow}>
                              <View style={styles.headerContent}>
                                <Text style={styles.headerText}>{item.title}</Text>
                                <Image
                                  source={Images.RightIcon}
                                  style={{
                                    height: Metrics.WIDTH * 0.05,
                                    width: Metrics.WIDTH * 0.05,
                                    resizeMode: "contain"
                                  }}
                                />
                              </View>
                              <Text numberOfLines={2} style={styles.recentMsg}>
                                {this.formatTime(item.start)}
                              </Text>
                              <Text style={styles.recentMsg}>
                                {item.desc}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={this.renderSeparator}
                  />
                </View>
              )}
          </ScrollView>
        ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ textAlign: 'center', marginHorizontal: 20, color:'black', fontSize: 18 }}>You have to be on a team to use app features</Text>
            </View>
          )}
        <BottomBar navigation={this.props.navigation} />
        <FlashMessage ref="fmLocalInstance" position="top" animated={true} autoHide={true} />
      </View>
    );
  }
}
