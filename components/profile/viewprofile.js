import React, { Component } from "react";
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    StatusBar,
    Platform,
    PixelRatio,
    BackHandler,
    ScrollView
} from "react-native";
import {
    Container,
    Header,
    Left,
    Right,
    Card,
    Body,
} from "native-base";

import styles from "./styles";

import { Images, Metrics, Fonts, Colors } from "../../themes";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, HelperText, withTheme } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import { FireBaseApp } from "../config";
import firebase from "react-native-firebase";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

import AsyncStorage from '@react-native-community/async-storage';
//----------get user data----------
var token = ""

// var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMTQsImVtYWlsIjoid2FuZ3dlaUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6Indhbmd3ZWkiLCJwYXNzd29yZCI6IiQyYSQwOCRDSFNBQ1lxM2UxOWxHS3BMb082WWxlN0ttSjlDbE1BSUUxcjc2eDFOeXpCdXpSS1lhc3h1QyIsInBpYyI6bnVsbCwiZGF0ZV9yZWdpc3RyYXRpb24iOiIyMDE5LTA2LTEzVDEwOjE5OjAwLjAwMFoiLCJtZW1iZXJzaGlwIjpudWxsLCJ0ZWFtX2lkIjpudWxsLCJyb2xlIjpudWxsLCJwb3NpdGlvbiI6bnVsbH0sImlhdCI6MTU2MDUxNDkyMiwiZXhwIjoxNTYzMTA2OTIyfQ.xiPDzY1c_lC_qlIgxtGc5aTJioICV9MSdK4NFKpadrc";
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

export default class ViewProfile extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            pictures: [],
            avatarSource: null,
            videoSource: null,
            team: {
                'name': '',
                'position': '',
            },
            user: {
                'role': '',
                'data': {
                    username: '',
                    email: '',
                    photoURL: '',
                    password: '',
                }
            },
        };
    }

    onDrop(picture) {
        this.setState({
            pictures: this.state.pictures.concat(picture),
        });
    }

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                token = value;
                decoded = jwtDecode(value);
                this.readUserInfo();
            }
        } catch (error) {
            // Error retrieving data
        }
    };

    UNSAFE_componentWillMount() {
        this._retrieveData()
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners();
    }

    componentWillUnmount() {
        this.notificationListener && typeof this.notificationListener == 'function' && this.notificationListener();
        this.notificationOpenedListener && typeof this.notificationOpenedListener == 'function' && this.notificationOpenedListener();
        this.messageListener && typeof this.messageListener == 'function' && this.messageListener();
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate("TeamMembers");
        // Actions.pop();
        return true;
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
        const enabled = await FireBaseApp.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
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
            console.log("open ------------ ", notificationOpen)
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

    readUserInfo() {
        var team = {
            'name': '',
            'email': '',
            'position': '',
            'photoURL': '',
        };

        const { state } = this.props.navigation;
        fetch(api_host + '/user/getById/' + state.params.user, {
            method: 'GET',
            headers: headers
        })
            .then(response => {
                response.json().then(data => {
                    //console.log("getData = " + JSON.stringify(data));

                    console.log("data.username = " + data[0].pic)
                    if (data.length > 0) {
                        var user = {
                            'role': data[0].role,
                            'data': {
                                'username': data[0].username,
                                'email': data[0].email,
                                'photoURL': data[0].pic,
                                'position': data[0].position,
                                'membership': data[0].membership,
                            }
                        }
                        team = {
                            'name': data.name,
                        }
                        this.setState({ user: user, team: team });
                    }
                })
            });

    }

    render() {
        StatusBar.setBarStyle("light-content", true);
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor(Colors.backgroundcolor, true);
            StatusBar.setTranslucent(true);
        }
        const { user, team } = this.state;
        return (
            <Container style={styles.editcontainer}>
                <Header androidStatusBarColor={"transparent"} style={styles.header}>
                    <Left style={styles.left}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("TeamMembers")}
                        >
                            <Image
                                source={Images.BackIcon}
                                style={{
                                    height: Metrics.WIDTH * 0.06,
                                    width: Metrics.WIDTH * 0.06,
                                    resizeMode: "contain"
                                }}
                            />
                        </TouchableOpacity>
                    </Left>

                    <Body style={styles.body}>
                        <Text style={styles.Dashboardtext}>Profile</Text>
                    </Body>

                    <Right style={styles.right}>

                    </Right>
                </Header>
                <View style={{ backgroundColor: Colors.backgroundcolor, height: Metrics.HEIGHT * 0.01, width: Metrics.WIDTH }} />
                {/* <ScrollView> */}
                {/* <View style={styles.contentOne}> */}
                {/* <Content> */}
                {/* <Card style={{justifyContent: "center", alignItems:'center'}}> */}
                <View style={[styles.floatingView, {}]}>
                    <Text style={styles.titleName}>View Profile</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Left style={{ flex: 1 }} />
                        <Body
                            style={styles.uploadImage}
                        // onPress={this.selectPhotoTapped.bind(this)}
                        >
                            <View
                                style={[
                                    styles.avatar,
                                    styles.avatarContainer,
                                    { marginBottom: 20 },
                                    { marginTop: 10 },
                                ]}
                            >
                                {this.state.user.data.photoURL == '' || this.state.user.data.photoURL == null ? (
                                    <Image style={styles.avatar} source={require('../../images/profile.png')} />
                                ) : (
                                        <Image style={styles.avatar} source={{ uri: this.state.user.data.photoURL }} />
                                    )}
                            </View>
                        </Body>
                        <Right style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                            {this.state.user.data.membership == 'free' || this.state.user.data.membership == null ?
                                (
                                    null
                                ) : (
                                    <Image
                                        source={Images.MemberShip}
                                        style={{
                                            height: Metrics.WIDTH * 0.2,
                                            width: Metrics.WIDTH * 0.2,
                                            resizeMode: "contain"
                                        }}
                                    />
                                )}
                        </Right>
                    </View>

                    <TextInput
                        mode="outlined"
                        label="User Name *"
                        disabled={true}
                        placeholder=""
                        value={this.state.user.data.username}
                        onChangeText={username => this.setState({ username })}
                        ref="name"
                        onSubmitEditing={event => {
                            this.refs.email.focus();
                        }}
                        returnKeyType="next"
                    />

                    <View style={{ height: 10 }} />

                    <TextInput
                        mode="outlined"
                        label="Email *"
                        placeholder=""
                        disabled={true}
                        value={this.state.user.data.email}
                        onChangeText={email => this.setState({ email })}
                        ref="email"
                        onSubmitEditing={event => {
                            this.refs.position.focus();
                        }}
                        returnKeyType="next"
                    />

                    <View style={{ height: 10 }} />

                    <TextInput
                        mode="outlined"
                        label="Position"
                        placeholder=""
                        disabled={true}
                        value={this.state.user.data.position}
                        onChangeText={position => this.setState({ position })}
                        ref="position"
                        // onSubmitEditing={event => {
                        //   this.refs.tempo.focus();
                        // }}
                        returnKeyType="done"
                    />

                    <View style={{ height: 10 }} />

                    {/* <TouchableOpacity
                                    onPress={() =>
                                        this.props.navigation.navigate("Home", {
                                          screenName: "Home"
                                        })}
                                    style={[
                                        styles.loginBg,
                                        {
                                            marginTop: 10,
                                            marginBottom: Metrics.WIDTH * 0.02,
                                        },
                                    ]}>
                                    <Text style={styles.activeTab}>Update</Text>
                                </TouchableOpacity> */}
                </View>
                {/* </Card> */}
                {/* </View> */}

                {/* </ScrollView> */}
                <FlashMessage ref="fmLocalInstance" position="top" animated={true} autoHide={true} />
            </Container>
        );
    }

}
