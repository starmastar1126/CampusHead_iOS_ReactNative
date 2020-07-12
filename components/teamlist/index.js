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
  Alert,
  ToastAndroid,
  SafeAreaView
} from "react-native";
import {
  Container,
  Header,
  Content,
  Button,
  Left,
  Right,
  Body,
  SwipeRow
} from "native-base";
import styles from "./styles";
import { Images, Metrics, Fonts, Colors } from "../../themes";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SearchBar } from 'react-native-elements';
import firebase from "react-native-firebase";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-community/async-storage';
import Ip from "../apihost";
import { ActivityIndicator } from "react-native-paper";
import BottomBar from "../bottombar/index"
import { FireBaseApp } from "../config";
const api_host = Ip.api_host;
var decoded = [];

let headers = new Headers();

var token = "";
headers.append('Access-Control-Allow-Origin', api_host);
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append('Content-Type', 'application/json');
headers.append('authorization', 'Bearer ' + token);

var jwtDecode = require('jwt-decode');

var team = {
  'id': 0,
  'name': '',
  'position': '',
  'isJoined': false,
};
var team_id = ''
var notiFlag = 0
export default class TeamList extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.joinClick = this.joinClick.bind(this)
    this.exitClick = this.exitClick.bind(this)
    this.updateDeviceToken = this.updateDeviceToken.bind(this)
    this.uid =null;
    this.state = {
      basic: true,
      hasTeam: false,
      curTeamId: 0,
      ownerId: 0,
      loading: false,
      owner: '',
      joinState: 0,
      data: [],
      user: [],
      refreshing: false
      // dataSource: dataObjects
    };

  }

  _retrieveData = async () => {
    try {
      this.setState({
        refreshing: true,
      })
      const value = await AsyncStorage.getItem('token');
      team_id = await AsyncStorage.getItem('team_id');
      const team_name = await AsyncStorage.getItem('team_name');
      console.log('create teamID = ' + team_id)
      // this.setState({
      //   curTeamId: team_id,
      //   curTeamName: team_name
      // });
      if (value !== null) {
        token = value;
        decoded = await jwtDecode(value);
        this.getUserInfo();
        // console.log("team id = " + team_id)
        // this.getOwnerInfo(team_id);
        // this.readTeamInfo();
      }
    }
    catch (error) {
      // Error retrieving data
    }
  };

  componentDidMount() {
    try {
    this.checkPermission();
    this.createNotificationListeners();
    FireBaseApp.auth().onAuthStateChanged(user => {
      if (user) { 
        console.log("--------user ------->>", user.uid);
        this.uid = user.uid; 
      }
    });
    } catch(err) {
      console.log("error---->>", err);
    }
    notiFlag = 1;
    this._retrieveData()


  }

  async getUserInfo() {
    // setTimeout(() => {
    await fetch(api_host + '/user/get/' + decoded.user.id, {
      method: 'GET',
      headers: headers,
    })
      .then(response => {
        response.json().then(data => {
          this.setState({
            joinState: data[0].join_state,
            curTeamId: data[0].team_id
          })
          team_id = data[0].team_id;

          this.getOwnerInfo(data[0].team_id);
        })
      })
    // }, 1500)

  }

  async getOwnerInfo(team_id) {
    if (team_id !== null && team_id != '')
      await fetch(api_host + '/team/getOwnerByTeamId/' + team_id, {
        method: 'GET',
        headers: headers,
      })
        .then(response => {
          response.json().then(data => {
            if (decoded.user.id == data[0].created_by)
              this.setState({
                owner: "owner"
              })
            else
              this.setState({
                owner: "user"
              })

            // AsyncStorage.setItem('team_id', JSON.stringify(data[0].id))
            // AsyncStorage.setItem('team_name', data[0].name)
            this.readTeamInfo()
            console.log("what is your id = " + data[0].created_by)
          })
        })
    else {
      AsyncStorage.removeItem('team_id')
      AsyncStorage.removeItem('team_name')
      this.readTeamInfo()
    }
  }

  async readTeamInfo() {
    this.setState({ loading: true });
    await fetch(api_host + '/team', {
      method: 'GET',
      headers: headers
    })
      .then(response => {
        response.json().then(data => {
          if (data.teamInfo.length != 0) {
            team = data.teamInfo;
            var isTeam = false;
            var curTeamId = 0;
            team.forEach(team => {
              if (team.id == this.state.curTeamId) {
                isTeam = true;
                curTeamId = team.id;
              }
            });
            this.setState({
              data: team,
              loading: false,
              refreshing: false,
              hasTeam: isTeam,
              curTeamId: curTeamId,
            });
            this.arrayholder = team;
          }
        })
      })
      .catch(error => {
        this.setState({
          loading: false,
          refreshing: fasle
        })
      })
  }

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

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  componentWillUnmount() {
    if (notiFlag == 1) {
      try {
      this.notificationListener && typeof this.notificationListener == 'function' && this.notificationListener();
      this.notificationOpenedListener && typeof this.notificationOpenedListener == 'function' && this.notificationOpenedListener();
      this.messageListener && typeof this.messageListener == 'function' && this.messageListener();
      }catch(e) {}
    }
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    console.log("back")
    // this.props.navigation.navigate("Teams");
    // this.props.navigation.goBack(null);
    // Actions.pop();
    return true;
  };

  async joinClick(id, name) {
    console.log(id + "          " + name)
    if (id !== null && name != '')
      await fetch(api_host + '/team/getOwnerByTeamId/' + id, {
        method: 'GET',
        headers: headers,
      })
        .then(response => {
          response.json().then(data => {
            if (decoded.user.id == data[0].created_by)
              this.setState({
                owner: "owner"
              })
            else
              this.setState({
                owner: "user"
              })

            if (this.state.owner == "owner") {
              console.log("owner " + this.state.owner)
              fetch(api_host + '/user/' + decoded.user.id + '/joinTeam/' + id, {
                method: 'POST',
                body: JSON.stringify({
                  position: 'Owner',
                  join_state: 2
                }),
                headers: headers
              })
                .then(response => {
                  this.setState({ hasTeam: true })
                  // });
                  this.setState({
                    value: '',
                    curTeamId: id,
                    joinState: 2
                  })

                  console.log("JoinClick_start")
                  if(this.uid) {
                  FireBaseApp
                    .firestore()
                    .collection("users")
                    .doc(this.uid)
                    .update({
                      teamId: id,
                    })
                  }
                  console.log("JoinClick_end")
                  AsyncStorage.setItem('team_id', JSON.stringify(id))
                  AsyncStorage.setItem('team_name', name)
                  console.log("id = " + id)
                  console.log("name = " + name)
                  this.readTeamInfo();
                });
            } else if (this.state.owner == 'user') {
              console.log("user " + this.state.owner)
              fetch(api_host + '/user/' + decoded.user.id + '/joinTeam/' + id, {
                method: 'POST',
                body: JSON.stringify({
                  position: 'none-member',
                  join_state: 1
                }),
                headers: headers
              })
                .then(response => {
                  this.setState({ hasTeam: true })
                  // });
                  this.setState({
                    value: '',
                    curTeamId: id,
                    joinState: 1
                  })
                  var ownerId = 0;
                  this.state.data.forEach(team => {
                    if (team.id == this.state.curTeamId) {
                      ownerId = team.uid;
                    }
                  });
                  console.log("name = " + ownerId)
                  var body = {
                    title: '',
                    ownerId: ownerId,
                    username: decoded.user.username,
                  }
                  console.log(JSON.stringify(body))
                  const httpsCallable = FireBaseApp.functions().httpsCallable('joinNotify');

                  // console.log(FireBaseApp.auth().currentUser.uid)
                  httpsCallable({ some: JSON.stringify(body) })
                    .then(({ data }) => {
                      console.log("data.someResponse"); // hello world
                      console.log(data); // hello world
                    })
                    .catch(httpsError => {
                      console.log("httpsError.code - ", httpsError.code); // invalid-argument
                      console.log("httpsError.message - ", httpsError.message); // Your error message goes here
                    })
                  this.readTeamInfo();
                });
            }
          })
        })

  }

  async exitClick(id, name) {
    await fetch(api_host + '/user/' + decoded.user.id + '/exitTeam/' + id, {
      method: 'POST',
      body: JSON.stringify({
        position: 'none-member',
        join_state: 0
      }),
      headers: headers
    })
      .then(response => {
        this.setState({ hasTeam: false })
        AsyncStorage.removeItem('team_id')
        AsyncStorage.removeItem('team_name')

          if (this.uid) {
              // user = fbUser
            FireBaseApp
            .firestore()
            .collection("users")
            .doc(this.uid)
            .update({
              teamId: 0,
            })
          } 
        console.log("exitClick button clicked")
      });

    this.setState({
      value: '',
      curTeamId: 0,
      joinState: 0,
      owner: ''
    })
    this.readTeamInfo();
  }

  // user can create only one team
  async createSong() {
    await fetch(api_host + '/team/getByUserId/' + decoded.user.id, {
      method: 'GET',
      headers: headers,
    })
      .then(response => {
        response.json().then(data => {
          if (data[0].rowNum > 0)
            alert("You can create only one Team.")
          else {
            this.props.navigation.navigate("CreateTeam")
          }
        })
      })
  }

  updateDeviceToken(fcmToken) {
    if(this.uid) {
    FireBaseApp
      .firestore()
      .collection("users")
      .doc(this.uid)
      .update({
        fcmToken: fcmToken
      });
    }
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

  viewButton(id, name) {
    if (id != parseInt(this.state.curTeamId)) {
      return <Button disabled={true} style={[styles.joinBtn, color = "secondary", { backgroundColor: "#b2bec3" }]} onPress={() => this.joinClick(id, name)}>
        <Text style={styles.joinText}>Join Team</Text>
      </Button>
    } else if (this.state.owner == 'user') {
      switch (this.state.joinState) {
        case 0:
          console.log("case 0")
          return <Button disabled={false} style={[styles.joinBtn, color = "secondary"]} onPress={() => this.joinClick(id, name)}>
            <Text style={styles.joinText}>Join Team</Text>
          </Button>
        // return true;
        case 1:
          return <Button disabled={false} style={[styles.joinBtn, color = "secondary"]} onPress={() => this.exitClick(id, name)}>
            <Text style={styles.joinText}>Cancel Request</Text>
          </Button>
        case 2:
          console.log("case 2")
          return <Button disabled={false} style={[styles.joinBtn, color = "secondary"]} onPress={() => this.exitClick(id, name)}>
            <Text style={styles.joinText}>Exit Team</Text>
          </Button>
        default: return "#FFFFFF";
      }
    } else {
      console.log("else")
      return <Button disabled={false} style={[styles.joinBtn, color = "secondary"]} onPress={() => this.exitClick(id, name)}>
        <Text style={styles.joinText}>Exit Team</Text>
      </Button>
    }
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true,
    })
    this._retrieveData()
  }

  render() {
    StatusBar.setBarStyle("light-content", true);
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(Colors.backgroundcolor, true);
      StatusBar.setTranslucent(true);
    }
    console.log("hasTeam = " + this.state.hasTeam)
    return (
      <Container style={styles.mainview}>
        {/* <Spinner
          visible={this.state.loading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        /> */}
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
            <Text style={styles.Dashboardtext}>List of Teams</Text>
          </Body>

          <Right style={styles.right}>
            <TouchableOpacity
              onPress={() =>
                this.createSong()
              }
            >
              <MaterialCommunityIcons
                name="plus-circle-outline"  //music-note-plus
                size={25}
                color={"#fff"}
              />
            </TouchableOpacity>
          </Right>
        </Header>
        <View style={{ backgroundColor: Colors.backgroundcolor, height: Metrics.HEIGHT * 0.01, width: Metrics.WIDTH }} />
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <View style={styles.rowMain}>
                {/* <View style={styles.listContent}> */}
                {/* <TouchableOpacity onPress={() => ToastAndroid.show(item.name, ToastAndroid.SHORT)}> */}
                <View style={styles.subRow}>
                  <View style={styles.headerContent}>
                    <Text style={styles.headerText}>{item.name}</Text>
                  </View>
                  <Text numberOfLines={2} style={styles.recentMsg}>
                    {item.location}
                  </Text>
                </View>
                {this.state.hasTeam ? (
                  <View style={styles.joinView}>
                    {this.viewButton(item.id, item.name)}
                  </View>
                ) : (
                    <View style={styles.joinView}>
                      <Button disabled={false} style={styles.joinBtn} onPress={() => this.joinClick(item.id, item.name)}>
                        <Text style={styles.joinText}>Join Team</Text>
                      </Button>
                    </View>
                  )}

              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            // onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0}
          />
        </View>
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
