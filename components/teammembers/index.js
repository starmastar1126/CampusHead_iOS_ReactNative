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
  SafeAreaView,
  Modal
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

import { TextInput } from 'react-native-paper';
import styles from "./styles";
import { Images, Metrics, Fonts, Colors } from "../../themes";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ListItem, SearchBar } from 'react-native-elements';
import firebase from "react-native-firebase";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-community/async-storage';
import BottomBar from "../bottombar/index"
import Ip from "../apihost";
import { FireBaseApp } from "../config";
const api_host = Ip.api_host;
var decoded = [];

let headers = new Headers();

var token = "";
// var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMTQsImVtYWlsIjoid2FuZ3dlaUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6Indhbmd3ZWkiLCJwYXNzd29yZCI6IiQyYSQwOCRDSFNBQ1lxM2UxOWxHS3BMb082WWxlN0ttSjlDbE1BSUUxcjc2eDFOeXpCdXpSS1lhc3h1QyIsInBpYyI6bnVsbCwiZGF0ZV9yZWdpc3RyYXRpb24iOiIyMDE5LTA2LTEzVDEwOjE5OjAwLjAwMFoiLCJtZW1iZXJzaGlwIjpudWxsLCJ0ZWFtX2lkIjpudWxsLCJyb2xlIjpudWxsLCJwb3NpdGlvbiI6bnVsbH0sImlhdCI6MTU2MDUxNDkyMiwiZXhwIjoxNTYzMTA2OTIyfQ.xiPDzY1c_lC_qlIgxtGc5aTJioICV9MSdK4NFKpadrc";
headers.append('Access-Control-Allow-Origin', api_host);
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append('Content-Type', 'application/json');
headers.append('authorization', 'Bearer ' + token);

var jwtDecode = require('jwt-decode');
var team_id = ''
var team_name = ''
var team = {
  'id': 0,
  'name': '',
  'position': '',
  'isJoined': false,
};
var isExistTeam = false;

export default class TeamMembers extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      data: [],
      owner: '',
      joinState: 0,
      refreshing: false,
      loading: false,
      modalVisible: false,
      teamName: ''
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
      this.setState({
        refreshing: true,
      })
      const value = await AsyncStorage.getItem('token');
      team_id = await AsyncStorage.getItem('team_id');
      team_name = await AsyncStorage.getItem('team_name');
      if (team_id == 0 || team_id == null) {
        isExistTeam = false;
        this.setState({
          listRefreshing: true,
        })
        return true;
      } else
        isExistTeam = true;
      this.setState({
        teamName: team_name
      })
      if (value !== null) {
        token = value;
        decoded = jwtDecode(value);
        this.getUserInfo();
        this.getOwnerInfo(team_id);
        this.readTeamInfo();
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  async getUserInfo() {
    await fetch(api_host + '/user/get/' + decoded.user.id, {
      method: 'GET',
      headers: headers,
    })
      .then(response => {
        response.json().then(data => {
          this.setState({
            joinState: data[0].join_state
          })
        })
      })
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
            console.log("what is your id = " + data[0].created_by)
          })
        })
  }

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
              // body: body,
              headers: headers
            }).then(response => {
              response.json().then(data => {
                console.log(data)
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
    this.readTeamInfo()
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
    console.log("owner " + this.state.owner)
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
          .get()
          .then(querySnapShot => {
            querySnapShot.forEach(user => {
              console.log("firebase user data.teamId = ", user.data().teamId)
              if (user.data().userId != null && user.data().userId != 0)
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
    console.log("why did you clicked?")
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
            // console.log(querySnapShot)
            querySnapShot.forEach(user => {
              console.log("firebase user data.teamId = ", user.data().teamId)
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
    console.log("id = " + id)
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

  setModalVisible(visible) {

    this.setState({ modalVisible: visible });
  }

  cancelTeamName() {
    this.setModalVisible(!this.state.modalVisible);
    this.setState({
      teamName: team_name
    })
  }

  saveTeamName() {
    fetch(api_host + '/team/' + team_id, {
      method: 'POST',
      body: JSON.stringify({
        name: this.state.teamName,
      }),
      headers: headers
    })
      .then(response => {
        this.setModalVisible(!this.state.modalVisible);
      })
      .catch(error => {
        this.setModalVisible(!this.state.modalVisible);
        this.setState({
          teamName: team_name
        })
      })
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
            <Text style={styles.Dashboardtext}>Team</Text>
          </Body>

          <Right style={styles.right}>
            {this.state.owner == 'owner' ? (
              <TouchableOpacity
                onPress={() =>
                  this.setModalVisible(true)
                }
              >
                <MaterialCommunityIcons
                  name="pencil"  //music-note-plus
                  size={25}
                  color={"#fff"}
                />
              </TouchableOpacity>
            ) : (
                null
              )}

          </Right>
        </Header>
        <View style={{ backgroundColor: Colors.backgroundcolor, height: Metrics.HEIGHT * 0.01, width: Metrics.WIDTH }} />
        {isExistTeam ? (
          <View style={{ flex: 1 }}>
            <FlatList
              data={this.state.data}
              renderItem={({ item }) => (
                <View style={styles.rowMain}>
                  {this.state.owner == 'owner' ?
                    <View>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate("ViewProfile", { user: item.id })}>
                        <View style={styles.listContent}>
                          {item.pic == null || item.pic == '' ?
                            <Image source={Images.Profile} style={styles.profile} />
                            :
                            <Image source={{ uri: item.pic }} style={styles.profile} />
                          }
                          <View style={styles.subRow1}>
                            <View style={styles.headerContent}>
                              <Text style={styles.headerText}>{item.username}</Text>
                            </View>
                            <Text numberOfLines={2} style={styles.recentMsg}>
                              {item.position}
                            </Text>
                          </View>
                          <View style={styles.joinView}>
                            <Button disabled={false} style={[styles.joinBtn, {}]} onPress={() => this.declineClick(item.id)}>
                              <Text style={styles.joinText}>Decline</Text>
                            </Button>
                            {this.viewButton(item.id, item.join_state)}
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    :
                    <View>
                      {item.join_state == 2 ?
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("ViewProfile", { user: item.id })}>
                          {console.log("item.pic = " + item.pic)}
                          <View style={styles.listContent}>
                            {item.pic == null || item.pic == '' ?
                              <Image source={Images.Profile} style={styles.profile} />
                              :
                              <Image source={{ uri: item.pic }} style={styles.profile} />
                            }
                            <View style={styles.subRow}>
                              <View style={styles.headerContent}>
                                <Text style={styles.headerText}>{item.username}</Text>
                              </View>
                              <Text numberOfLines={2} style={styles.recentMsg}>
                                {item.position}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                        : null
                      }
                    </View>
                  }
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
        ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ textAlign: 'center', marginHorizontal: 20, color:'black', fontSize: 18 }}>You have to be on a team to use app features</Text>
            </View>
          )}
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Modal
            animationType="fade"
            transparent={true}
            presentationStyle="overFullScreen"
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={styles.modal}>
              <View style={styles.modalView}>
                <View style={styles.modalTitleView}>
                  <Text style={styles.modalTitle}>Edit Team's Name</Text>
                </View>

                <View style={styles.separator} />

                <View style={styles.modalTextInputView}>
                  <TextInput
                    ref="name"
                    mode="outlined"
                    label="Team Name"
                    multiline={false}
                    rows="1"
                    style={styles.modalTextInput}
                    value={this.state.teamName}
                    placeholder="Enter your Team's Name"
                    autoCapitalize="none"
                    returnKeyType="done"
                    onChangeText={teamName => this.setState({ teamName })}
                  />
                </View>

                <View style={styles.separator} />

                <View style={styles.modalButtons}>
                  <TouchableHighlight
                    style={styles.modalButtonSave}
                    onPress={() => {
                      this.saveTeamName()
                    }}>
                    <Text style={styles.modalButtonText}>Save</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={styles.modalButtonCancel}
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <BottomBar navigation={this.props.navigation} />
        <FlashMessage ref="fmLocalInstance" position="top" animated={true} autoHide={true} />
      </View>
    );
  }

}
