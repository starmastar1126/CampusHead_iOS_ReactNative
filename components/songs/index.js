import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
  BackHandler,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  Container,
  Header,
  Left,
  Right,
  Body,
} from "native-base";
import { FireBaseApp } from "../config";
import styles from "./styles";
import { Images, Metrics, Fonts, Colors } from "../../themes";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import firebase from "react-native-firebase";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { ListItem, SearchBar } from 'react-native-elements';
import Moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import Ip from "../apihost";
import BottomBar from "../bottombar/index"
const api_host = Ip.api_host;
var decoded = [];

let headers = new Headers();

var token = "";
// var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMTQsImVtYWlsIjoid2FuZ3dlaUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IldhbmcgV2VpIiwicGFzc3dvcmQiOiIkMmEkMDgkQVZXRS5EVEp5dHMvdEJpOXNoa3hLTzZsdk8yZS9YeEZ2QVkzajVhWjc2OGlyZThLcWwxelciLCJwaWMiOiJodHRwOi8vMTkyLjE2OC4xLjExMjo4MDgwL3B1YmxpYy91cGxvYWRzL3Byb2ZpbGUvMV8wajZOeGxVNDYwWkRqLUpReXc3X1V3LmpwZyIsImRhdGVfcmVnaXN0cmF0aW9uIjoiMjAxOS0wNi0xM1QxMDoxOTowMC4wMDBaIiwibWVtYmVyc2hpcCI6bnVsbCwidGVhbV9pZCI6MzQsInJvbGUiOm51bGwsInBvc2l0aW9uIjoiRnVpIHlvIGRhIHhpYSBCaW4gSmlhbmcgemhvbmcgbHUgZGFuZG9uZyBsaWFvIG5pbmcgQ2hpbmEifSwiaWF0IjoxNTYwNzEyOTUzLCJleHAiOjE1NjMzMDQ5NTN9.dqf9ilvEtDnwPHBN0QW1VH_OSR1QtNKQVvowi7lyV3k";
headers.append('Access-Control-Allow-Origin', api_host);
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append('Content-Type', 'application/json');
headers.append('authorization', 'Bearer ' + token);

var jwtDecode = require('jwt-decode');

let song = [];
let limit = 0;
var team_id = '';
var isExistTeam = false;
var song_length = 0;

export default class Songs extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    limit = 0;
    this.state = {
      basic: true,
      data: [],
      refreshing: false,
      loading: false,
    };
  }

  componentDidMount() {
    try {
    this.checkPermission();
    this.createNotificationListeners();
    } catch(err) {
      console.log("error---->>", err);
    }
    this._retrieveData()
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#dcdde1',
        }}
      />
    );
  };

  searchFilterFunction = text => {
    this.setState({
      value: text,
    });

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.name.toUpperCase()}`;
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

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  componentWillUnmount() {
    try {
    this.notificationListener && typeof this.notificationListener == 'function' && this.notificationListener();
    this.notificationOpenedListener && typeof this.notificationOpenedListener == 'function' && this.notificationOpenedListener();
    this.messageListener && typeof this.messageListener == 'function' && this.messageListener();
    } catch(e) {}
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    // this.props.navigation.navigate("Login");
    // this.props.navigation.goBack(null);
    // Actions.pop();
    return true;
  };

  _retrieveData = async () => {
    try {
      this.setState({
        refreshing: true,
      })
      team_id = await AsyncStorage.getItem('team_id');
      if (team_id == 0 || team_id == null) {
        isExistTeam = false;
        this.setState({
          refreshing: true,
        })
        return true;
      } else
        isExistTeam = true;

      const value = await AsyncStorage.getItem('token');
      team_id = await AsyncStorage.getItem('team_id');
      console.log(value, team_id)
      if (value !== null && team_id !== '') {
        token = value;
        decoded = jwtDecode(value);
        this.readSongList();
      } else {
        this.state.navigation.navigate("TeamList")
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  handleRefresh = () => {
    this.setState({
      refreshing: true,
    })
    this.readSongList()
  }
  compare_dates(date1, date2) {
    console.log(date1, date2)
    if (date1 == "Invalid date")
      return 'finished'
    console.log(new Date(date1), new Date(date2))
    var firstDay = new Date(date1).getTime();
    var secondDay = new Date(date2).getTime();
    console.log(firstDay, secondDay);
    var oneDay = 24 * 60 * 60 * 1000;
    if (firstDay < secondDay) {
      diffDays = Math.round(Math.abs((firstDay - secondDay) / (oneDay)));
      if (diffDays > 30)
        return "finished"
      else
        return "processing"
    }
    else return ("reservation");
  }

  setDate(date) {
    var time = Moment(date).format();
    var time = Moment.utc(time).format("YYYY-MM-DDTHH:mm:ss.SSS")
    return time
  }

  async readSongList() {
    try {
      console.log("team_id = " + team_id)
      this.setState({
        loading: true
      })
      await fetch(api_host + '/user/get/' + decoded.user.id, {
        method: 'GET',
        headers: headers,
      }).then(response => {
        response.json().then(data => {
          var pDate = data[0].purchased_date;
          var curDate = new Date();
          var purchase_state = this.compare_dates(pDate, this.setDate(curDate));
          console.log(purchase_state, data[0].membership);
          if (data[0].membership == 'individual') {
            if (purchase_state == 'finished') {
              this.donePurchase();
              limit = 10;
            }
            else if (purchase_state == 'processing') {
              limit = 'unlimit'
            } else {
              alert("You've already made a reservation.")
            }
          } else {
            limit = 10;
          }
          fetch(api_host + '/song/' + limit + '/getByTeam/' + team_id, {
            method: 'GET',
            headers: headers,
          }).then(response => {
            response.json().then(data => {
              console.log(data.length);
              song_length = data.length;
              song = data;
              this.setState({
                data: song,
                loading: false,
                refreshing: false
              });
              this.arrayholder = song;
              // console.log("state:", this.state.data)
            });
          });
        })
      })
        .catch(error => {
          this.setState({
            loading: false,
            refreshing: false
          })
        })
      //   });
      // });
    } catch (e) {
      console.log(e)
      history.push('/login');
    }

  }

  async donePurchase() {
    await fetch(api_host + '/user/membership/' + decoded.user.id, {
      method: 'POST',
      body: JSON.stringify({
        membership: 'free',
        purchased_date: this.setDate(new Date())
      }),
      headers: headers
    })
      .then(response => {
        response.json().then(data => {
          if (Platform.OS === 'ios') {
            RNIap.finishTransactionIOS(this.state.receipt.purchaseToken)
          } else if (Platform.OS === 'android') {
            console.log("purchaseToken = " + token)
          }
        })
      })
      .catch(error => {
        alert(error)
      })

  }
  async createSong() {
    await fetch(api_host + '/team/getOwnerByTeamId/' + team_id, {
      method: 'GET',
      headers: headers,
    })
      .then(response => {
        response.json().then(data => {

          fetch(api_host + '/user/get/' + data[0].created_by, {
            method: 'GET',
            headers: headers,
          })
            .then(response => {
              response.json().then(data => {
                var membership = data[0].membership
                console.log("membership = " + membership)
                var limit = ''
                if (membership == 'individual') {
                  limit = 'unlimit'
                } else
                  limit = 10
                console.log("limit = " + limit)
                fetch(api_host + '/song/' + limit + '/getByTeam/' + team_id, {
                  method: 'GET',
                  headers: headers,
                }).then(response => {
                  response.json().then(data => {
                    if (data.length > 9 && limit == 10)
                      this.props.navigation.navigate("Pricing")
                    else
                      this.props.navigation.navigate("CreateSong", { team_id: team_id })
                  });
                });
              })
            })
        })
      })
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

    this.notificationOpenedListener = FireBaseApp
      .notifications()
      .onNotificationOpened(notificationOpen => {
        console.log("opened")
        this.props.navigation.navigate("Songs")
      });

    const notificationOpen = await FireBaseApp
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
    }
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
            <Text style={styles.Dashboardtext}>Songs</Text>
          </Body>

          <Right style={styles.right}>
            <TouchableOpacity
              onPress={() =>
                this.createSong()
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
        <View style={{ backgroundColor: Colors.backgroundcolor, height: Metrics.HEIGHT * 0.01, width: Metrics.WIDTH }} />
        {isExistTeam ? (
          <View style={{ flex: 1 }}>
            <FlatList
              data={this.state.data}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.rowMain} onPress={() => this.props.navigation.navigate("ViewSong", { key: '', song_id: item.id, team_id: team_id })}>
                  <View style={styles.subRow}>
                    <View style={styles.headerContent}>
                      {item.songkey == '' || item.songkey == null ?
                        <Text style={styles.headerText}>{item.name}</Text>
                        :
                        <Text style={styles.headerText}>{item.name}({item.songkey})</Text>
                      }

                    </View>
                    <Text numberOfLines={2} style={styles.recentMsg}>
                      {item.artist}
                    </Text>
                  </View>
                </TouchableOpacity>
              )
              }
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={this.renderSeparator}
              ListHeaderComponent={this.renderHeader}
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
              onEndReachedThreshold={0}
            />
          </View>
        ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ textAlign: 'center', marginHorizontal: 20, color:'black', fontSize: 18 }}>You have to be on a team to use app features</Text>
            </View>
          )}

        {limit == 10 && song_length > 9 ? (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.upgradeText}>Your team has more songs! Upgrade your account to see more.</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Pricing')}
              style={styles.upgrade}>
              <Text style={styles.activeTab}>UPGRADE</Text>
            </TouchableOpacity>
          </View>
        ) : (
            null
          )}
        <BottomBar navigation={this.props.navigation} />
        <FlashMessage ref="fmLocalInstance" position="top" animated={true} autoHide={true} />
      </Container>
    );
  }

  removeItem(key) {
    let data = this.state.data
    data = data.filter((item) => item.key !== key)
    this.setState({ data })
  }
}
