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
import firebase from "react-native-firebase";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { Badge } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import superagent from 'superagent';
import BottomBar from "../bottombar/index"
import { FireBaseApp } from "../config";
//----------get user data----------
var token = ""
// var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMTQsInVzZXJuYW1lIjoid2FuZ3dlaSIsImVtYWlsIjoid2FuZ3dlaUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYSQwOCRBVldFLkRUSnl0cy90Qmk5c2hreEtPNmx2TzJlL1h4RnZBWTNqNWFaNzY4aXJlOEtxbDF6VyJ9LCJpYXQiOjE1NjA2NzkzODMsImV4cCI6MTU2MzI3MTM4M30.mp72lzIxZKGYuxCyZqrEEKZkGOqFdkwa5loRrSRojIQ";
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
// const Express = require('express')
// const multer = require('multer')
// const bodyParser = require('body-parser')
const createFormData = (photo, body) => {
    const data = new FormData();

    data.append("photo", {
        name: photo.fileName,
        type: photo.type,
        uri:
            Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
    });

    Object.keys(body).forEach(key => {
        data.append(key, body[key]);
    });

    return data;
};
export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            pictures: [],
            avatarSource: null,
            username: '',
            email: '',
            position: '',
            password: '',
            passwordConfirm: '',
            curPassword: '',
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
            selectedFile: '',
        };
        this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
        this.onDrop = this.onDrop.bind(this);
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
        try {
            this._retrieveData()
        } catch (e) {
            console.log(e);
        }
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    componentDidMount() {
        try {
        this.checkPermission();
        this.createNotificationListeners();
        }catch(e) {}
    }

    componentWillUnmount() {
        this.notificationListener && typeof this.notificationListener == 'function' && this.notificationListener();
        this.notificationOpenedListener && typeof this.notificationOpenedListener == 'function' && this.notificationOpenedListener();
        this.messageListener && typeof this.messageListener == 'function' && this.messageListener();
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        // this.props.navigation.navigate("Login");
        return true;
    };

    _onPress = () => {
        alert(this.props.id);
    }

    selectPhotoTapped() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            noData: true,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
        };

        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let source = { uri: response.uri };

                this.setState({
                    avatarSource: source,
                    selectedFile: response
                });
            }
        });
    }

    readUserInfo() {
        console.log(decoded.user.id)
        var team = {
            'name': '',
            'email': '',
            'position': '',
            'photoURL': '',
        };

        fetch(api_host + '/user/getById/' + decoded.user.id, {
            method: 'GET',
            headers: headers
        })
            .then(response => {
                response.json().then(data => {
                    //console.log("getData = " + JSON.stringify(data));

                    // console.log("data.username = " + data[0].pic)
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
                        this.setState({
                            user: user,
                            team: team,
                            avatarSource: data[0].pic,
                            email: data[0].email,
                            username: data[0].username,
                            position: data[0].position
                        });
                    }
                })
            });
    }

    getAvatar() {
        if (typeof this.state.avatarSource == "string") {
            return { uri: this.state.avatarSource }
        } else {
            return this.state.avatarSource
        }
    }

    updateProfile() {
        const file = {
            uri: this.state.selectedFile.uri,
            type: this.state.selectedFile.type,
            name: this.state.selectedFile.fileName,
            path: this.state.selectedFile.path,
        }

        var position = this.state.position

        if (this.state.position == null) {
            position = ''
        }
        const data = {
            'username': this.state.username,
            'email': this.state.email,
            'position': position,
            file
        }

        if (this.state.username == '' || this.state.username == null) {
            alert("Name shouldn't be empty.")
            this.refs.username.focus()
            return true;
        }
        if (this.state.email == '' || this.state.email == null) {
            alert("Email shouldn't be empty.")
            this.refs.email.focus()
            return true;
        }

        var editProfileUrl = api_host + '/user/' + decoded.user.id;
        const superagent = require('superagent');
        let uploadRequest = superagent.put(editProfileUrl)
            .set('authorization', 'Bearer ' + token)
            .field(data)

        uploadRequest.end((err, res) => {
            if (err) {
                console.log("there is some error in this case------->>>>>",err)
                return;
            }
            // this.readUserInfo()
        });
        console.log("!!!!!!!!------>>>>",FireBaseApp.auth().currentUser.uid)
        FireBaseApp
            .firestore()
            .collection("users")
            .doc(FireBaseApp.auth().currentUser.uid)
            .update({
                email: this.state.email,
                username: this.state.username,
                profileURL:this.state.selectedFile? this.state.selectedFile.fileName:"",
                position: position
            }
            );
        this.props.navigation.navigate("Home")
    };

    reauthenticate = (currentPassword) => {
        var user = FireBaseApp.auth().currentUser;
        console.log("the user is-------->>>>>",user)
        var cred =
        FireBaseApp.auth.EmailAuthProvider.credential(user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }

    reauthenticate = (currentPassword) => {
        var user = FireBaseApp.auth().currentUser;
        var cred =
        FireBaseApp.auth.EmailAuthProvider.credential(user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }

    changePassword() {
        if (this.state.password == '') {
            alert("Invalid password.")
            this.refs.password.focus()
            return true;
        }
        if (this.state.passwordConfirm == '') {
            alert("Verify your password.")
            this.refs.passwordConfirm.focus()
            return true;
        }
        if (this.state.passwordConfirm.length < 6) {
            alert("Your password must be at least 5 characters.")
            this.refs.passwordConfirm.focus()
            return true;
        }

        this.reauthenticate(this.state.curPassword).then(() => {
            var user = FireBaseApp.auth().currentUser;
            user.updatePassword(this.state.password).then(() => {
                var editProfileUrl = api_host + '/user/' + decoded.user.id;
                fetch(editProfileUrl, {
                    method: 'PUT',
                    body: JSON.stringify({
                        password: this.state.password
                    }),
                    headers: headers
                })
                    .then(response => {
                        response.json().then(data => {
                            // console.log(data.token);      

                            console.log(jwtDecode(data.token));
                            AsyncStorage.setItem('token', data.token);
                            // this.readUserInfo()
                            this.props.navigation.navigate("Home")
                        });
                    });
            }).catch((error) => { alert(error.message) });
        }).catch((error) => { alert(error.message) });
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
    }catch(e) {}
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
                        <Text style={styles.Dashboardtext}>Profile</Text>
                    </Body>

                    <Right style={styles.right}>

                    </Right>
                </Header>
                <View style={{ backgroundColor: Colors.backgroundcolor, height: Metrics.HEIGHT * 0.01, width: Metrics.WIDTH }} />
                <ScrollView>
                    {/* <View style={styles.contentOne}> */}
                    {/* <Content> */}
                    <Card>
                        <View style={styles.floatingView}>
                            <Text style={styles.titleName}>Edit Profile</Text>

                            <View style={{ flexDirection: 'row' }}>
                                <Left style={{ flex: 1 }} />
                                <Body style={{ flex: 1 }} >
                                    <TouchableOpacity
                                        style={styles.uploadImage}
                                        onPress={this.selectPhotoTapped.bind(this)}
                                    >
                                        <View
                                            style={[
                                                styles.avatar,
                                                styles.avatarContainer,
                                                { marginBottom: 20 },
                                                { marginTop: 10 },
                                            ]}
                                        >
                                            {this.state.avatarSource === null ? (
                                                <Text>Select a Photo</Text>
                                            ) : (
                                                    <Image style={styles.avatar} source={this.getAvatar()} />
                                                )}
                                        </View>
                                        {/* <Badge
                                            status="success"
                                            badgeStyle={{ width: 30, height: 30, borderRadius: 50 }}
                                            containerStyle={{ position: 'absolute', top: Metrics.WIDTH * 0.02, right: Metrics.WIDTH * 0.02 }}
                                        /> */}
                                    </TouchableOpacity>
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
                                placeholder=""
                                value={this.state.username}
                                onChangeText={username => this.setState({ username })}
                                ref="username"
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
                                value={this.state.email}
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
                                value={this.state.position}
                                onChangeText={position => this.setState({ position })}
                                ref="position"
                                // onSubmitEditing={event => {
                                //   this.refs.tempo.focus();
                                // }}
                                returnKeyType="done"
                            />

                            <View style={{ height: 10 }} />

                            <TouchableOpacity
                                onPress={() =>
                                    this.updateProfile()}
                                style={[
                                    styles.loginBg,
                                    {
                                        marginTop: 10,
                                        marginBottom: Metrics.WIDTH * 0.02,
                                    },
                                ]}>
                                <Text style={styles.activeTab}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                    <Card>
                        <View style={styles.floatingView}>
                            <Text style={styles.titleName}>Change Password</Text>
                            <TextInput
                                mode="outlined"
                                label="Current Password *"
                                placeholder=""
                                secureTextEntry={true}
                                value={this.state.curPassword}
                                onChangeText={curPassword => this.setState({ curPassword })}
                                ref="curPassword"
                                onSubmitEditing={event => {
                                    this.refs.password.focus();
                                }}
                                returnKeyType="next"
                            />

                            <TextInput
                                mode="outlined"
                                label="New Password *"
                                placeholder=""
                                secureTextEntry={true}
                                value={this.state.password}
                                onChangeText={password => this.setState({ password })}
                                ref="password"
                                onSubmitEditing={event => {
                                    this.refs.passwordConfirm.focus();
                                }}
                                returnKeyType="next"
                            />

                            <TextInput
                                mode="outlined"
                                label="Confirm Password *"
                                placeholder=""
                                secureTextEntry={true}
                                value={this.state.passwordConfirm}
                                onChangeText={passwordConfirm => this.setState({ passwordConfirm })}
                                ref="passwordConfirm"
                                // onSubmitEditing={event => {
                                //   this.refs.position.focus();
                                // }}
                                returnKeyType="done"
                            />

                            <View style={{ height: 10 }} />

                            <TouchableOpacity
                                onPress={() =>
                                    this.changePassword()}
                                style={[
                                    styles.loginBg,
                                    {
                                        marginTop: 10,
                                        marginBottom: Metrics.WIDTH * 0.02,
                                    },
                                ]}>
                                <Text style={styles.activeTab}>CHANGE</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                    {/* </View> */}

                </ScrollView>
                <BottomBar navigation={this.props.navigation} />
                <FlashMessage ref="fmLocalInstance" position="top" animated={true} autoHide={true} />
            </Container>
        );
    }

}
