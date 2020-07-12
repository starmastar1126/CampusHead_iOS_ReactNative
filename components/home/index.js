import React, { Component } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  BackHandler,
  StatusBar,
  Platform,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Keyboard
} from "react-native";
import {
  Container,
  Icon,
  Right,
  Header,
  Left,
  Card,
  CardItem,
  Text,
  Body
} from "native-base";
import styles from "./styles";
import { FAB } from 'react-native-paper';
import { Images, Metrics, Fonts, Colors } from "../../themes";
import firebase from "react-native-firebase";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-community/async-storage';
import BottomBar from "../bottombar/index"
import MentionsTextInput from "../mentions/index"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ImagePicker from 'react-native-image-picker'
import superagent from 'superagent';
import { FireBaseApp } from "../config";
var token = ""
var decoded = [];

//----------Api config ---------
import Ip from "../apihost";
const api_host = Ip.api_host;

let headers = new Headers();

headers.append('Access-Control-Allow-Origin', 'http://192.168.1.112:8080');
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append('Content-Type', 'application/json');
headers.append('authorization', 'Bearer ' + token);
var jwtDecode = require('jwt-decode');

var posts = [];
var comments = [];
var team_id = "";
var isExistTeam = false;
var pic = "";
var isKeyboard = "";

const initialState = {
  activities: null,
  posts: [],
  content: '',
};

var sendUsers = [];
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      colorFalseSwitchIsOn: "",
      postContent: '',
      collapsed: [],
      commentContent: '',
      Textdata: [],
      items: [],
      hasPressed: false,
      hasShown: false,
      hasHidden: false,
      listRefreshing: false,
      keyword: "",
      data: [],
      sendUsers: ['start'],
      modalVisible: false,
      isPost: false,
      curPostId: 0,
      curContent: [],
      isPC: false,
      photo: null,
      uid: 0,
      pid: 0,
      user_id: 0
    };
    this.reqTimer = 0;
  }

  renderSuggestionsRowPost({ item }, hidePanel) {
    return (
      <TouchableOpacity onPress={() => this.onSuggestionTapPost(item.nickname, hidePanel)}>
        <View style={styles.suggestionsRowContainer}>
          <View style={styles.userIconBox}>
            <Image source={{ uri: item.pic }} style={styles.profileSearch} />
          </View>
          <View style={styles.userDetailsBox}>
            <Text style={styles.displayNameText}>{item.username}</Text>
            <Text style={styles.usernameText}>@{item.nickname.split('-')[0]}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  onSuggestionTapPost(nickname, hidePanel) {
    hidePanel();
    const comment = this.state.postContent.slice(0, - this.state.keyword.length)
    sendUsers = sendUsers.concat('@' + nickname)
    this.setState({
      data: [],
      postContent: comment + '@' + nickname.split('-')[0],
    })
  }

  renderSuggestionsRowComment({ item }, hidePanel) {
    return (
      <TouchableOpacity onPress={() => this.onSuggestionTapComment(item.nickname, hidePanel)}>
        <View style={styles.suggestionsRowContainer}>
          <View style={styles.userIconBox}>
            <Image source={{ uri: item.pic }} style={styles.profileSearch} />
          </View>
          <View style={styles.userDetailsBox}>
            <Text style={styles.displayNameText}>{item.username}</Text>
            <Text style={styles.usernameText}>@{item.nickname.split('-')[0]}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  onSuggestionTapComment(nickname, hidePanel) {
    hidePanel();
    const comment = this.state.commentContent.slice(0, - this.state.keyword.length)
    sendUsers = sendUsers.concat('@' + nickname)
    this.setState({
      data: [],
      commentContent: comment + '@' + nickname.split('-')[0],
    })
  }

  callback(keyword) {
    if (this.reqTimer) {
      clearTimeout(this.reqTimer);
    }

    this.reqTimer = setTimeout(() => {
      var text = keyword.slice(1)
      const newData = team.filter(item => {
        const itemData = `${item.nickname.toUpperCase()}`;
        const textData = text.toUpperCase();

        return itemData.indexOf(textData) > -1;
      });
      this.setState({
        keyword: keyword,
        data: [...newData]
      })
    }, 200);
  }

  _retrieveData = async () => {
    try {
      this.setState({
        listRefreshing: true,
      })
      const value = await AsyncStorage.getItem('token');
      // team_id = await AsyncStorage.getItem('team_id');

      if (value !== null) {
        token = value;
        decoded = jwtDecode(value);
      }
      await fetch(api_host + '/user/get/' + decoded.user.id, {
        method: 'GET',
        headers: headers,
      })
        .then(response => {
          response.json().then(data => {
            console.log("home data = ", data)
            if (data[0].team_id != null && data[0].team_id != '') {
              pic = data[0].pic
              AsyncStorage.setItem('user_pic', data[0].pic);
              AsyncStorage.setItem('team_id', JSON.stringify(data[0].team_id));
              team_id = data[0].team_id;
              if (team_id == 0 || team_id == null) {
                isExistTeam = false;
                this.setState({
                  listRefreshing: true,
                })
                return true;
              } else
                isExistTeam = true;
              this.readPostData(team_id)
              this.readTeamInfo(team_id)
            } else {
              console.log("go teamlist")
              AsyncStorage.removeItem('team_id')
              AsyncStorage.removeItem('team_name')
              this.props.navigation.navigate('TeamList')
            }
          })
        })
    } catch (error) {
      // Error retrieving data
    }
  };

  UNSAFE_componentWillMount() {
    // const { state } = this.props.navigation
    // if (state.params !== undefined)
    //   if (state.params.pid !== 0 && state.params.user_id !== 0) {
    //     this.setState({
    //       pid: state.params.pid,
    //       posted_id: state.params.user_id,
    //     })
    //   }
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.notificationListener && typeof this.notificationListener == 'function' && this.notificationListener();
    this.notificationOpenedListener && typeof this.notificationOpenedListener == 'function' && this.notificationOpenedListener();
    this.messageListener && typeof this.messageListener == 'function' && this.messageListener();
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  _keyboardDidShow() {
    isKeyboard = true;
  }

  _keyboardDidHide() {
    isKeyboard = false;
  }

  handleBackButtonClick = () => {
    // this.props.navigation.navigate("Teams");
    return true;
  };

  componentDidMount() {
    this._retrieveData()
    //Notification Parts
    try {
      this.checkPermission();
      this.createNotificationListeners();
    } catch (err) {
      console.log("error---->>", err);
    }
    notiFlag = 1;
  }
  state = initialState;

  //----------read data----------
  readPostData(id) {
    // this.setState({
    //   activities: null,
    //   posts: [],
    //   content: '',
    // });

    posts = [];
    comments = [];
    this.setState({
      listRefreshing: true,
    })
    fetch(api_host + '/team/getPostById/' + id, {
      method: 'GET',
      headers: headers,
    })
      .then(response => {
        response.json().then(data => {
          if (data.data.length != 0) {

            data.data.forEach(post => {
              if (data.comment.length != 0) {
                data.comment.forEach(comment => {
                  if (comment.pid == post.id) {
                    var datetime = new Date(comment.created_date);
                    datetime = datetime.toLocaleDateString() + " " + datetime.toLocaleTimeString();
                    comments.push(
                      {
                        id: comment.id,
                        user: {
                          name: comment.username,
                          avatar: comment.pic,
                        },
                        time: datetime,
                        message: comment.content,
                        photo: comment.photo,
                        width: comment.width,
                        height: comment.height,
                      }
                    );
                  }
                });
              }

              var datetime = new Date(post.created_date);
              datetime = datetime.toLocaleDateString() + " " + datetime.toLocaleTimeString();

              posts.push({
                id: post.id,
                user: {
                  id: post.created_by,
                  name: post.username,
                  avatar: post.pic,
                },
                message: post.content,
                time: datetime,
                type: 'post',
                photo: post.photo,
                width: post.width,
                height: post.height,
                comments: comments,
              });

              comments = [];
            });
            this.setState({
              posts: posts,
              listRefreshing: false,
              Textdata: [],
              postContent: '',
              sendUsers: [],
              commentContent: '',
              modalVisible: false,
              isPC: false,
              isComment: false,
              isPost: false,
              curPostId: 0,
              curContent: [],
            });
          } else {
            this.setState({
              posts: posts,
              listRefreshing: false,
              Textdata: [],
              postContent: '',
              sendUsers: [],
              commentContent: '',
              modalVisible: false,
              isPC: false,
              isComment: false,
              isPost: false,
              curPostId: 0,
              curContent: [],
            });
          }
        })
          .catch(error => {
            this.setState({
              listRefreshing: false,
              Textdata: [],
              postContent: '',
              sendUsers: [],
              commentContent: '',
              modalVisible: false,
              isPC: false,
              isComment: false,
              isPost: false,
              curPostId: 0,
              curContent: [],
            });
          })
      })
      .catch(error => {
        this.setState({
          listRefreshing: false,
          Textdata: [],
          postContent: '',
          sendUsers: [],
          commentContent: '',
          modalVisible: false,
          isPC: false,
          isComment: false,
          isPost: false,
          curPostId: 0,
          curContent: [],
        });
      })
  }

  componentWillReceiveProps(nextProps) {
    team_id = nextProps.team_id;
    this.readPostData(team_id);    // 34 is for testing 
  }

  // toUTF16(codePoint) {
  //   var TEN_BITS = parseInt('1111111111', 2);
  //   function u(codeUnit) {
  //     return '\\u'+codeUnit.toString(16).toUpperCase();
  //   }

  //   if (codePoint <= 0xFFFF) {
  //     return u(codePoint);
  //   }
  //   codePoint -= 0x10000;

  //   // Shift right to get to most significant 10 bits
  //   var leadSurrogate = 0xD800 + (codePoint >> 10);

  //   // Mask to get least significant 10 bits
  //   var tailSurrogate = 0xDC00 + (codePoint & TEN_BITS);

  //   return u(leadSurrogate) + u(tailSurrogate);
  // }
  //-----------------post part------------

  async getSendIds(content, nickname) {
    var c = content.split(' ')
    var d = nickname
    var users = []
    await c.forEach(data => {
      var temp = data.split('@')
      if (temp[1] != '' && temp[1] != undefined) {
        temp = temp[1]
        const newData = d.filter(item => {
          const itemData = `${item.split('-')[0].toUpperCase()}`;
          const textData = temp.toUpperCase();

          return itemData.indexOf(textData) > -1;
        });
        if (newData.length != 0)
          users = users.concat(newData[0].split('@')[1])
      }
    })
    var u = users.filter(function (item, index) {
      return users.indexOf(item) >= index;
    });
    return u
  }

  async createPost() {
    if (this.state.postContent == '' || this.state.postContent == null || this.state.listRefreshing == true)
      return true;

    this.setState({
      listRefreshing: true
    })

    // console.log(
    //   "🤑".codePointAt(0)
    // );
    // var temp = this.state.postContent
    // var t = temp.codePointAt(0)
    // t = String.fromCharCode(0xD83E, 0xDD11)
    // // t = this.toUTF16(t)
    // console.log(t);

    if (this.state.photo !== null && this.state.photo !== '') {
      this.createPostWithFile()
    } else {
      this.createPostNoFile()
    }
  }

  async createPostWithFile() {
    var path = 'public/uploads/post/' + this.state.photo.fileName;
    var users = await this.getSendIds(this.state.postContent, sendUsers);
    const file = {
      uri: "file://" + this.state.photo.path,
      type: this.state.photo.type,
      name: this.state.photo.fileName,
      path: this.state.photo.path,
    }
    var data = [];
    if (users.length > 0) {
      data = {
        'title': '',
        'photo': path,
        'content': this.state.postContent,
        'created_by': decoded.user.id,
        'pic': pic,
        'team_id': team_id,
        'song_id': 0,
        'width': this.state.photo.width,
        'height': this.state.photo.height,
        'username': decoded.user.username,
        'pc_type': 1,
        'mention_id': JSON.stringify(users),
        'is_mention': 1,
        file
      }
    } else {
      data = {
        'title': '',
        'photo': path,
        'content': this.state.postContent,
        'created_by': decoded.user.id,
        'pic': pic,
        'team_id': team_id,
        'song_id': 0,
        'width': this.state.photo.width,
        'height': this.state.photo.height,
        'username': decoded.user.username,
        'pc_type': 1,
        'mention_id': JSON.stringify([]),
        'is_mention': 0,
        file
      }
    }
    let uploadRequest = superagent.post(api_host + '/post/createFile')
      .set('authorization', 'Bearer ' + token)
      .field(data);
    uploadRequest.end((err, res) => {
      if (err) {
        alert(err);
        this.setState({
          listRefreshing: false,
          modalVisible: false,
        })
        return;
      }
      this.setState({
        photo: null
      })
      var body = {
        title: '',
        content: this.state.postContent,
        created_by: decoded.user.id,
        username: decoded.user.username,
        teamId: team_id,
        users: users,
        name: 0
      }
      const httpsCallable = FireBaseApp.functions().httpsCallable('homePost');

      httpsCallable({ some: JSON.stringify(body) })
        .then(({ data }) => {
          console.log("data.someResponse"); // hello world
          console.log(data); // hello world
        })
        .catch(httpsError => {
          console.log("httpsError.code - ", httpsError.code); // invalid-argument
          console.log("httpsError.message - ", httpsError.message); // Your error message goes here
        })
      this.readPostData(team_id);
    })
  }

  async createPostNoFile() {
    var users = await this.getSendIds(this.state.postContent, sendUsers);
    var decoded = jwtDecode(token);
    var body = [];
    if (users.length > 0) {
      body = JSON.stringify({
        title: '',
        content: this.state.postContent,
        created_by: decoded.user.id,
        pic: pic,
        team_id: team_id,
        song_id: 0,
        username: decoded.user.username,
        pc_type: 1,
        mention_id: JSON.stringify(users),
        is_mention: 1
      });
    } else {
      body = JSON.stringify({
        title: '',
        content: this.state.postContent,
        created_by: decoded.user.id,
        pic: pic,
        team_id: team_id,
        song_id: 0,
        username: decoded.user.username,
        pc_type: 1,
        mention_id: JSON.stringify([]),
        is_mention: 0
      });
    }
    await fetch(api_host + '/post', {
      method: 'POST',
      body,
      headers: headers
    })
      .then(response => {
        response.json().then(data => {
          var body = {
            title: '',
            content: this.state.postContent,
            created_by: decoded.user.id,
            username: decoded.user.username,
            teamId: team_id,
            users: users,
            name: 0
          }

          const httpsCallable = FireBaseApp.functions().httpsCallable('homePost');

          httpsCallable({ some: JSON.stringify(body) })
            .then(({ data }) => {
              console.log("data.someResponse"); // hello world
              console.log(data); // hello world
            })
            .catch(httpsError => {
              console.log("httpsError.code - ", httpsError.code); // invalid-argument
              console.log("httpsError.message - ", httpsError.message); // Your error message goes here
            })
          this.readPostData(team_id);
        })
          .catch(error => {
            this.setState({
              postContent: '',
              listRefreshing: false,
              sendUsers: [],
              commentContent: '',
              modalVisible: false,
              isPC: false,
              isComment: false,
              isPost: false,
              curPostId: 0,
              curContent: [],
            })
          })
      })
      .catch(error => {
        this.setState({
          listRefreshing: false,
          postContent: '',
          sendUsers: [],
          commentContent: '',
          modalVisible: false,
          isPC: false,
          isComment: false,
          isPost: false,
          curPostId: 0,
          curContent: [],
        })
      })
  }

  updateState = (text, index) => {
    const Textdata = [...this.state.Textdata]; //make a copy of array
    Textdata[index] = text;
    this.setState({ Textdata: Textdata });
  }

  async createComment(pid, type) {
    if (this.state.commentContent == '' || this.state.commentContent == null || this.state.listRefreshing == true)
      return true;

    this.setState({
      listRefreshing: true
    })

    if (this.state.photo !== null && this.state.photo !== '') {
      this.createCommentWithFile(pid, type)
    } else {
      this.createCommentNoFile(pid, type)
    }

  }

  async createCommentWithFile(pid, type) {
    var path = 'public/uploads/comment/' + this.state.photo.fileName;
    const file = {
      uri: "file://" + this.state.photo.path,
      type: this.state.photo.type,
      name: this.state.photo.fileName,
      path: this.state.photo.path,
    }
    var data = [];
    var users = await this.getSendIds(this.state.commentContent, sendUsers);
    if (users.length > 0) {
      data = {
        'pid': pid,
        'type': type,
        'photo': path,
        'team_id': team_id,
        'song_id': 0,
        'song_name': '',
        'content': this.state.commentContent,
        'created_by': decoded.user.id,
        'pic': pic,
        'width': this.state.photo.width,
        'height': this.state.photo.height,
        'username': decoded.user.username,
        'mention_id': JSON.stringify(users),
        'is_mention': 1,
        'pc_type': 2,
        'uid': this.state.uid,
        file
      }
    } else {
      data = {
        'pid': pid,
        'type': type,
        'photo': path,
        'team_id': team_id,
        'song_id': 0,
        'song_name': '',
        'content': this.state.commentContent,
        'created_by': decoded.user.id,
        'pic': pic,
        'width': this.state.photo.width,
        'height': this.state.photo.height,
        'username': decoded.user.username,
        'mention_id': JSON.stringify([]),
        'is_mention': 0,
        'pc_type': 2,
        'uid': this.state.uid,
        file
      }
    }
    let uploadRequest = superagent.post(api_host + '/comment/createFile')
      .set('authorization', 'Bearer ' + token)
      .field(data);
    uploadRequest.end((err, res) => {
      if (err) {
        alert(err);
        this.setState({
          listRefreshing: false,
          modalVisible: false,

        })
        return;
      }
      this.setState({
        photo: null
      })
      var body = {
        title: '',
        content: this.state.commentContent,
        created_by: decoded.user.id,
        username: decoded.user.username,
        teamId: team_id,
        users: users,
        name: 0
      }

      const httpsCallable = FireBaseApp.functions().httpsCallable('homeComment');

      httpsCallable({ some: JSON.stringify(body) })
        .then(({ data }) => {
          console.log("data.someResponse"); // hello world
          console.log(data); // hello world
        })
        .catch(httpsError => {
          console.log("httpsError.code - ", httpsError.code); // invalid-argument
          console.log("httpsError.message - ", httpsError.message); // Your error message goes here
        })
      // this.setState({
      //   Textdata: []
      // })
      this.readPostData(team_id);      // 34 is for testing
    })
  }

  async createCommentNoFile(pid, type) {
    var users = await this.getSendIds(this.state.commentContent, sendUsers);
    var body = [];
    if (users.length > 0) {
      body = JSON.stringify({
        pid: pid,
        type: type,
        team_id: team_id,
        content: this.state.commentContent,
        created_by: decoded.user.id,
        pic: pic,
        username: decoded.user.username,
        pc_type: 2,
        song_id: 0,
        song_name: '',
        mention_id: JSON.stringify(users),
        is_mention: 1,
        uid: this.state.uid,
      })
    } else {
      body = JSON.stringify({
        pid: pid,
        type: type,
        team_id: team_id,
        content: this.state.commentContent,
        created_by: decoded.user.id,
        pic: pic,
        username: decoded.user.username,
        pc_type: 2,
        song_id: 0,
        song_name: '',
        mention_id: JSON.stringify([]),
        is_mention: 0,
        uid: this.state.uid,
      })
    }
    await fetch(api_host + '/comment', {
      method: 'POST',
      body,
      headers: headers
    })
      .then(response => {
        response.json().then(data => {
          var body = {
            title: '',
            content: this.state.commentContent,
            created_by: decoded.user.id,
            username: decoded.user.username,
            teamId: team_id,
            users: users,
            name: 0
          }

          const httpsCallable = FireBaseApp.functions().httpsCallable('homeComment');

          httpsCallable({ some: JSON.stringify(body) })
            .then(({ data }) => {
              console.log("data.someResponse"); // hello world
              console.log(data); // hello world
            })
            .catch(httpsError => {
              console.log("httpsError.code - ", httpsError.code); // invalid-argument
              console.log("httpsError.message - ", httpsError.message); // Your error message goes here
            })
          // this.setState({
          //   Textdata: []
          // })
          this.readPostData(team_id);      // 34 is for testing
        })
          .catch(error => {
            this.setState({
              commentContent: '',
              listRefreshing: false
            })
          })
      })
      .catch(error => {
      })
  }

  async collapse(id) {
    var collapsed = [];
    collapsed[id] = !this.state.collapsed[id];
    await this.setState({ collapsed: collapsed })
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
    } catch (e) {
      console.log("error ---->>>", e);
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    if (!fcmToken) {
      try {
        fcmToken = await FireBaseApp.messaging().getToken();
      } catch (e) {
        console.log("error ---->>", e);
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
          this.props.navigation.navigate("Songs")
        });

      /*
       * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
       * */

      const notificationOpen = await FireBaseApp.notifications().getInitialNotification();
      if (notificationOpen) {
        // App was opened by a notification
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        const notification = notificationOpen.notification;
      }
      /*
      * Triggered for data only payload in foreground
      * */
    } catch (e) { }
  }

  showAlert(notification) {
    Alert.alert(
      notification.title,
      notification.body,
      [{ text: "OK", onPress: () => console.log("OK") }],
      { cancelable: false }
    );
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

  readTeamInfo(team_id) {
    fetch(api_host + '/team/getById/' + team_id, {
      method: 'GET',
      // body: body,
      headers: headers
    })
      .then(response => {
        response.json().then(data => {
          team = data.members;
          this.setState({ data: team });
          // this.arrayholder = team;
        })
      })
      .catch(error => {
        team = []
      })
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  handleChoosePhoto = () => {
    const options = {
      noData: false,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ photo: response })
      }
    })
  }

  getImageRate(width, height) {
    return height / width;
  }

  postCommentPage() {
    if (this.state.isPC) {
      var post = this.state.curContent;
      return (
        // <View style={{ flex: 1 }}>
        <Modal
          animationType="fade"
          transparent={true}
          presentationStyle="overFullScreen"
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({
              listRefreshing: false,
              postContent: '',
              sendUsers: [],
              commentContent: '',
              modalVisible: false,
              isPC: false,
              isComment: false,
              isPost: false,
              curPostId: 0,
              curContent: [],
            })
          }}>
          <View style={{ flex: 1, backgroundColor: 'white', }}>
            <View style={{
              flexDirection: 'row', alignItems: 'center', ...Platform.select({
                ios: {
                  height: Metrics.HEIGHT * 0.10,
                  top: 25

                },
                android: {
                  height: Metrics.HEIGHT * 0.05,
                }
              }),
            }}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity style={[styles.viewComment, { width: 35, justifyContent: 'flex-start', marginLeft: 10 }]}
                  onPress={() => this.setState({ modalVisible: false, isPC: false, curContent: [], commentContent: '' })}>
                  <Image
                    source={Images.LeftIcon}
                    style={{
                      height: Metrics.WIDTH * 0.06,
                      width: Metrics.WIDTH * 0.05,
                      resizeMode: "contain"
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: 'flex-end' }}>
                <View style={{ flex: 1 }} />
                {/* <Touchasdf sdfsdfdfsDf{c, hableOpacity> */}
              </View>
            </View>

            <View style={styles.HorizontalDivider} />

            <ScrollView>
              <View style={{ flex: 1, marginHorizontal: 10 }}>
                <View style={styles.listContent}>
                  {post.user.avatar == null || post.user.avatar == '' ?
                    <Image source={Images.Profile} style={styles.profile} />
                    :
                    <Image source={{ uri: post.user.avatar }} style={styles.profile} />
                  }
                  <View style={styles.subRowPost}>
                    <View>
                      <Text style={styles.headerText}>{post.user.name}</Text>
                    </View>
                    <View>
                      <Text style={styles.time}>{this.formatTime(post.time)}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.headerContent}>
                  {post.message && (
                    <Text style={[styles.recentMsg, { color: 'black' }]}>
                      {post.message}
                    </Text>
                  )}
                </View>
                {post.photo !== '' && post.photo !== null && (
                  <View >
                    {/* <View style={{ width: Metrics.WIDTH * 0.1, justifyContent: 'flex-start', marginBottom: 10 }}>
                      <Image source={{ flex: 1 }} style={styles.avatar} />
                    </View> */}
                    <View style={{ width: Metrics.WIDTH - 20 }}>
                      <Image
                        source={{ uri: api_host + "/" + post.photo }}
                        style={{ flex: 1, height: (Metrics.WIDTH - 20) * this.getImageRate(post.width, post.height), }}
                      />
                    </View>
                  </View>
                )}
              </View>

              <View style={[styles.HorizontalDivider, { marginVertical: 10 }]} />

              {post.comments && post.comments.length > 0 && (
                <View style={{ flexDirection: 'row' }}>
                  <Image style={{ width: Metrics.WIDTH * 0.1 }} />
                  <View style={{ flex: 1 }}>
                    {post.comments.map(comment => (
                      <View style={{ flex: 1 }} key={comment.id}>
                        <View style={[styles.listContent]}>
                          {comment.user.avatar == null || comment.user.avatar == '' ?
                            <Image source={Images.Profile} style={styles.profile} />
                            :
                            <Image source={{ uri: comment.user.avatar }} style={styles.profile} />
                          }
                          <View style={styles.subRowPost}>
                            <View style={styles.headerContent}>
                              <Text style={styles.headerText}>{comment.user.name}</Text>
                            </View>
                            <View style={styles.headerContent}>
                              <Text style={styles.time}>{this.formatTime(comment.time)}</Text>
                            </View>
                            <View style={styles.headerContent}>
                              <Text style={styles.recentCommentMsg}>
                                {comment.message}
                              </Text>
                            </View>
                          </View>
                        </View>
                        {comment.photo !== '' && comment.photo !== null && (
                          <View style={{ flexDirection: 'row', marginHorizontal: Metrics.WIDTH * 0.025 }}>
                            {/* <View style={{ width: Metrics.WIDTH * 0.1, justifyContent: 'flex-start', marginBottom: 10 }}>
                              <Image source={{ flex: 1 }} style={styles.avatar} />
                            </View> */}
                            <View style={{ width: '100%' }}>
                              <Image
                                source={{ uri: api_host + "/" + comment.photo }}
                                style={{ flex: 1, height: Metrics.WIDTH * 0.9 * this.getImageRate(comment.width, comment.height), }}
                              />
                            </View>
                          </View>
                        )}
                        <View style={[styles.HorizontalDivider, { marginVertical: 5 }]} />
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={[styles.HorizontalDivider, { marginVertical: 5 }]} />

            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5, marginHorizontal: Metrics.WIDTH * 0.015 }}>
              <View style={{ width: 40, alignItems: 'center' }}>
                <Image source={{ uri: pic }} style={styles.avatar} />
              </View>
              <View style={{ width: Metrics.WIDTH * 0.7, alignItem: 'center' }}>
                <MentionsTextInput
                  textInputStyle={{ width: Metrics.WIDTH * 0.7, borderColor: '#576574', borderWidth: 0, paddingVertical: 5, paddingHorizontal: 15, fontSize: 18 }}
                  suggestionsPanelStyle={{ backgroundColor: 'rgba(100,100,100,0.1)' }}
                  loadingComponent={() => <View style={{ flex: 1, width: Metrics.WIDTH * 0.7, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View>}
                  textInputMinHeight={35}
                  textInputMaxHeight={80}
                  trigger={'@'}
                  triggerLocation={'anywhere'} // 'new-word-only', 'anywhere'
                  value={this.state.commentContent}
                  onChangeText={(val) => { this.setState({ commentContent: val }) }}
                  triggerCallback={this.callback.bind(this)}
                  renderSuggestionsRow={this.renderSuggestionsRowComment.bind(this)}
                  suggestionsData={this.state.data} // array of objects
                  keyExtractor={(item, index) => item.nickname}
                  suggestionRowHeight={45}
                  horizontal={false} // defaut is true, change the orientation of the list
                  MaxVisibleRowCount={3} // this is required if horizontal={false}
                />
              </View>
              <View style={{ width: (Metrics.WIDTH * 0.27 - 40), alignItems: "center" }}>
                <TouchableOpacity style={styles.postButton}
                  onPress={() => this.createComment(this.state.curPostId, "post")}>
                  <Text style={styles.commentText}>Post</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ marginLeft: 0, marginRight: 0, backgroundColor: "#d4d4d4", height: 2 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: 'white', paddingHorizontal: Metrics.WIDTH * 0.05 }} >
              <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.handleChoosePhoto()}>
                <Image
                  source={Images.ImageIcon}
                  style={{ width: 25, height: 25, paddingHorizontal: 10 }}
                />
              </TouchableOpacity>
              {/* <TouchableOpacity style={{ marginLeft: Metrics.WIDTH * 0.05, alignItems: 'center' }} onPress={() => this.handleChoosePhoto()}>
                <Image
                  source={Images.GifIcon}
                  style={{ width: 25, height: 25 }}
                />
              </TouchableOpacity> */}
            </View>
          </View>
        </Modal>
        // </View>
      )
    } else if (this.state.isPost) {
      return (
        <Modal
          animationType="fade"
          transparent={true}
          presentationStyle="overFullScreen"
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({
              listRefreshing: false,
              postContent: '',
              sendUsers: [],
              commentContent: '',
              modalVisible: false,
              isPC: false,
              isComment: false,
              isPost: false,
              curPostId: 0,
              curContent: [],
            })
          }}>
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.viewModalTitle}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  onPress={() => this.setState({ modalVisible: false, isPost: false, postContent: '' })}
                  style={styles.closeButton}>
                  <MaterialCommunityIcons
                    name="close"
                    size={35}
                    color={Colors.backgroundcolor}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.viewModalPost}>
                <View style={{ flex: 1 }} />
                <View style={{ width: (Metrics.WIDTH * 0.27 - 40), alignItems: 'center' }} >
                  <TouchableOpacity style={styles.postButton}
                    onPress={() => this.createPost()}>
                    <Text style={styles.commentText}>Post</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{ marginVertical: 5 }} />

            <ScrollView>
              <View style={{ flexDirection: 'row', marginHorizontal: Metrics.WIDTH * 0.025 }}>
                <View style={{ width: Metrics.WIDTH * 0.1, justifyContent: 'flex-start', marginBottom: 10 }}>
                  <Image source={{ uri: pic }} style={styles.avatar} />
                </View>
                <View style={{ width: Metrics.WIDTH * 0.85 }}>
                  <MentionsTextInput
                    textInputStyle={{ width: Metrics.WIDTH * 0.7, borderColor: '#576574', borderWidth: 0, paddingVertical: 5, paddingHorizontal: 15, fontSize: 18 }}
                    suggestionsPanelStyle={{ backgroundColor: 'rgba(100,100,100,0.1)' }}
                    loadingComponent={() => <View style={{ flex: 1, width: Metrics.WIDTH * 0.85, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View>}
                    textInputMinHeight={35}
                    textInputMaxHeight={Metrics.HEIGHT * 0.5}
                    trigger={'@'}
                    triggerLocation={'anywhere'} // 'new-word-only', 'anywhere'
                    value={this.state.postContent}
                    onChangeText={(val) => { this.setState({ postContent: val }) }}
                    triggerCallback={this.callback.bind(this)}
                    renderSuggestionsRow={this.renderSuggestionsRowPost.bind(this)}
                    suggestionsData={this.state.data} // array of objects
                    keyExtractor={(item, index) => item.nickname}
                    suggestionRowHeight={45}
                    horizontal={false} // defaut is true, change the orientation of the list
                    MaxVisibleRowCount={3} // this is required if horizontal={false}
                  />
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginHorizontal: Metrics.WIDTH * 0.025 }}>
                <View style={{ width: Metrics.WIDTH * 0.1, justifyContent: 'flex-start', marginBottom: 10 }}>
                  <Image source={{ flex: 1 }} style={styles.avatar} />
                </View>
                <View style={{ width: Metrics.WIDTH * 0.85 }}>
                  {this.state.photo && (
                    <Image
                      source={{ uri: this.state.photo.uri }}
                      style={{ flex: 1, height: Metrics.WIDTH * 0.85 * this.getImageRate(this.state.photo.width, this.state.photo.height), }}
                    />
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
          <View style={{ marginLeft: 0, marginRight: 0, backgroundColor: "#d4d4d4", height: 2 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: 'white', paddingHorizontal: Metrics.WIDTH * 0.05 }} >
            <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this.handleChoosePhoto()}>
              <Image
                source={Images.ImageIcon}
                style={{ width: 25, height: 25, paddingHorizontal: 10 }}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity style={{ marginLeft: Metrics.WIDTH * 0.05, alignItems: 'center' }} onPress={() => this.handleChoosePhoto()}>
              <Image
                source={Images.GifIcon}
                style={{ width: 25, height: 25 }}
              />
            </TouchableOpacity> */}
          </View>
        </Modal>
      )
    } else if (this.state.isComment) {
      return (
        <Modal
          animationType="fade"
          transparent={true}
          presentationStyle="overFullScreen"
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({
              listRefreshing: false,
              postContent: '',
              sendUsers: [],
              commentContent: '',
              modalVisible: false,
              isPC: false,
              isComment: false,
              isPost: false,
              curPostId: 0,
              curContent: [],
            })
          }}>
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.viewModalTitle}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  onPress={() => this.setState({ modalVisible: false, isComment: false, commentContent: '' })}
                  style={styles.closeButton}>
                  <MaterialCommunityIcons
                    name="close"
                    size={35}
                    color={Colors.backgroundcolor}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.viewModalPost}>
                <View style={{ flex: 1 }} />
                <View style={{ width: (Metrics.WIDTH * 0.27 - 40), alignItems: 'center' }} >
                  <TouchableOpacity style={styles.postButton}
                    onPress={() => this.createComment(this.state.curPostId, "post")}>
                    <Text style={styles.commentText}>Post</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{ marginVertical: 10 }} />

            <ScrollView>
              <View style={{ flexDirection: 'row', marginHorizontal: Metrics.WIDTH * 0.025 }}>
                <View style={{ width: Metrics.WIDTH * 0.1, justifyContent: 'flex-start', marginBottom: 10 }}>
                  <Image source={{ uri: pic }} style={styles.avatar} />
                </View>
                <View style={{ width: Metrics.WIDTH * 0.85 }}>
                  <MentionsTextInput
                    textInputStyle={{ width: Metrics.WIDTH * 0.7, borderColor: '#576574', borderWidth: 0, paddingVertical: 5, paddingHorizontal: 15, fontSize: 18 }}
                    suggestionsPanelStyle={{ backgroundColor: 'rgba(100,100,100,0.1)' }}
                    loadingComponent={() => <View style={{ flex: 1, width: Metrics.WIDTH * 0.85, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View>}
                    textInputMinHeight={35}
                    textInputMaxHeight={Metrics.HEIGHT * 0.5}
                    trigger={'@'}
                    triggerLocation={'anywhere'} // 'new-word-only', 'anywhere'
                    value={this.state.commentContent}
                    onChangeText={(val) => { this.setState({ commentContent: val }) }}
                    triggerCallback={this.callback.bind(this)}
                    renderSuggestionsRow={this.renderSuggestionsRowComment.bind(this)}
                    suggestionsData={this.state.data} // array of objects
                    keyExtractor={(item, index) => item.nickname}
                    suggestionRowHeight={45}
                    horizontal={false} // defaut is true, change the orientation of the list
                    MaxVisibleRowCount={3} // this is required if horizontal={false}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )
    } else {
      return null;
    }
  }

  goPost(post) {
    const { pid, user_id } = this.state
    if (pid == 0) {
      // this.setState({
      //   modalVisible: true,
      //   isPC: true,
      //   curContent: post,
      //   curPostId: post.id,
      //   uid: post.user.id
      // })
    } else {
      if (pid != 0 && user_id != 0) {
        this.setState({
          modalVisible: true,
          isPC: true,
          curContent: post,
          curPostId: post.id,
          uid: post.user.id
        })
      } else {
        this.setState({
          modalVisible: true,
          isPC: true,
          curContent: post,
          curPostId: post.id,
          uid: post.user.id
        })
      }
    }
  }

  getPhotoUri(photo) {
    console.log("photo = ", api_host + "/" + photo)
    return api_host + "/" + photo;
  }

  render() {
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(Colors.backgroundcolor, true);
      StatusBar.setTranslucent(true);
    }
    const { posts, content } = this.state;
    // var isCollapsed = false;
    return (
      <Container style={styles.mainview}>
        <Header androidStatusBarColor={"transparent"} style={styles.header}>
          <Left style={styles.left}>
          </Left>
          <Body style={styles.body}>
            <Text style={styles.Dashboardtext}>Home</Text>
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
        <View style={{ backgroundColor: Colors.backgroundcolor, height: Metrics.HEIGHT * 0.01, width: Metrics.WIDTH }} />
        {isExistTeam ? (
          <ScrollView
            // style={{ backgroundColor: '#ebf1f5' }}
            refreshControl={
              <RefreshControl
                style={{ backgroundColor: 'transparent', flex: 1 }}
                tintColor="#CED0CE"
                onRefresh={() => this.readPostData(team_id)}
                refreshing={this.state.listRefreshing}
              />
            }
          >
            {posts &&
              posts.map(post => (
                <Card key={post.id}>
                  <CardItem>
                    <View style={{ flex: 1 }}>
                      <View style={styles.listContent}>
                        {post.user.avatar == null || post.user.avatar == '' ?
                          <Image source={Images.Profile} style={styles.profile} />
                          :
                          <Image source={{ uri: post.user.avatar }} style={styles.profile} />
                        }
                        <View style={styles.subRowPost}>
                          <View style={styles.headerContent}>
                            <Text style={styles.headerText}>{post.user.name}</Text>
                          </View>
                          <View style={styles.headerContent}>
                            <Text style={styles.time}>{this.formatTime(post.time)}</Text>
                          </View>
                        </View>
                      </View>
                      <View>
                        <TouchableOpacity style={styles.headerContent}
                          onPress={() =>
                            this.setState({ modalVisible: true, isPC: true, curContent: post, curPostId: post.id, uid: post.user.id })}>
                          {post.message && (
                            <Text style={[styles.recentMsg, { color: 'black' }]}>
                              {post.message}
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                      <View style={{ marginVertical: 5 }} />
                      {post.photo != '' && post.photo != null && (
                        <View style={{ width: '100%' }}>
                          <Image
                            source={{ uri: this.getPhotoUri(post.photo) }}
                            style={{ flex: 1, height: Metrics.WIDTH * 0.9 * this.getImageRate(post.width, post.height), }}
                          />
                        </View>
                      )}
                      <View style={[styles.HorizontalDivider, { marginVertical: 10 }]} />
                      <TouchableOpacity style={styles.viewComment}
                        onPress={() =>
                          // this.setState({ modalVisible: true, isComment: true, curPostId: post.id })}>
                          this.setState({ modalVisible: true, isPC: true, curContent: post, curPostId: post.id, uid: post.user.id })}>
                        <MaterialCommunityIcons
                          name="message-reply-text"
                          size={25}
                          color="gray"
                        />
                        <Text style={[styles.time, { marginLeft: 10 }]}>
                          {post.comments.length > 0 ? post.comments.length + " Comments" : "Comment"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </CardItem>
                </Card>
              ))}
          </ScrollView>
        ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ textAlign: 'center', marginHorizontal: 20, color: 'black', fontSize: 18 }}>You have to be on a team to use app features</Text>
            </View>
          )}
        {this.postCommentPage()}
        <BottomBar navigation={this.props.navigation} />
        <FlashMessage ref="fmLocalInstance" position="top" animated={true} autoHide={true} />
        {isExistTeam ? (
          <FAB
            style={styles.fab}
            large
            color="white"
            icon="add"
            onPress={() =>
              this.setState({ modalVisible: true, isPost: true })}
          />
        ) : (
            null
          )}
      </Container>
    );
  }
}
