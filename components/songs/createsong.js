import React, { Component } from "react";
import {
    // Text,
    View,
    Image,
    TouchableOpacity,
    StatusBar,
    Platform,
    BackHandler,
    Modal
} from "react-native";
import {
    Container,
    Header,
    Left,
    Right,
    Body,
    Text
} from "native-base";

import styles from "./styles";

import { Images, Metrics, Fonts, Colors } from "../../themes";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, HelperText, withTheme } from 'react-native-paper';
import { FireBaseApp } from "../config";
import firebase from "react-native-firebase";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

import ImageViewer from 'react-native-image-zoom-viewer';
import AsyncStorage from '@react-native-community/async-storage';
//----------get user data----------
var token = "";
// var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMTQsInVzZXJuYW1lIjoid2FuZ3dlaSIsImVtYWlsIjoid2FuZ3dlaUBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYSQwOCRBVldFLkRUSnl0cy90Qmk5c2hreEtPNmx2TzJlL1h4RnZBWTNqNWFaNzY4aXJlOEtxbDF6VyJ9LCJpYXQiOjE1NjA2NzkzODMsImV4cCI6MTU2MzI3MTM4M30.mp72lzIxZKGYuxCyZqrEEKZkGOqFdkwa5loRrSRojIQ";
var decoded = [];

//----------Api config ---------
import Ip from "../apihost";
const api_host = Ip.api_host;

const images = [{
    url: 'http://api.campushead.com:8080/public/uploads/assets/youtube_help1.jpg'
}, {
    url: 'http://api.campushead.com:8080/public/uploads/assets/youtube_help2.jpg'
}]
let headers = new Headers();

headers.append('Access-Control-Allow-Origin', api_host);
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append('Content-Type', 'application/json');
headers.append('authorization', 'Bearer ' + token);

var jwtDecode = require('jwt-decode');
var team_id = ''
export default class CreateSong extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            artist: '',
            key: '',
            tempo: '',
            link: '',
            name: '',
            lyrics: '',
            isLoading: false,
            modalVisible: false
        };
    }

    _retrieveData = async () => {
        try {
            const { state } = this.props.navigation
            team_id = state.params.team_id
            const value = await AsyncStorage.getItem('token');

            if (value !== null) {
                token = value;
                decoded = jwtDecode(value);
                // this.readTeamInfo();
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
            // history.push('/login');
        }
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    componentDidMount() {
        try {
        this.checkPermission();
        this.createNotificationListeners();
        } catch(e) {}
    }

    componentWillUnmount() {
        try {
        this.notificationListener && typeof this.notificationListener == 'function' && this.notificationListener();
        this.notificationOpenedListener && typeof this.notificationOpenedListener == 'function' && this.notificationOpenedListener();
        this.messageListener && typeof this.messageListener == 'function' && this.messageListener();
        }catch(e) {}
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate("Songs");
        // this.props.navigation.goBack(null);
        // Actions.pop();
        return true;
    };

    createSong = model => {
        var sharp = this.state.key.split('#')
        console.log(sharp)
        var key = ''
        if (sharp.length > 1)
            for (i = 0; i < sharp.length; i++) {
                if (i == 0)
                    key = sharp[0]
                else
                    key = key.concat("Sharp", sharp[i])
            }
        this.setState({
            key: key
        })

        if (this.state.name == '') {
            alert("Name of song shouldn't be empty.")
            this.refs.name.focus()
            return true;
        }
        // window.location.replace('/activity');
        // this.props.submitLogin(model);
        fetch(api_host + '/song', {
            method: 'POST',
            body: JSON.stringify({
                name: this.state.name,
                artist: this.state.artist,
                key: this.state.key,
                tempo: this.state.tempo,
                link: this.state.link,
                lyrics: this.state.lyrics,
                uid: team_id,
            }),
            headers: headers
        }).then(response => {
            response.json().then(data => {
                console.log(data);
                // history.push('/songs');
                this.props.navigation.navigate("Songs")
            })
        });
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

        // this.notificationListener = FireBaseApp.notifications().onNotification((notification) => {
        //   const { title, body } = notification;
        //   console.log('onNotification');

        //   const localNotification = new FireBaseApp.notifications.Notification({
        //     sound: 'notification',
        //     show_in_foreground: true,
        //   })
        //   .setNotificationId(notification.notificationId)
        //   .setTitle(notification.title)
        //   .setBody(notification.body)
        //   .android.setChannelId('fcm_default_channel')
        //   .android.setSmallIcon('@drawable/ic_launcher')
        //   .android.setColor('#000000')
        //   .android.setPriority(FireBaseApp.notifications.Android.Priority.High)

        //   FireBaseApp.notifications()
        //     .displayNotification(localNotification)
        //     .catch(err => console.error(err))
        // });

        // const channel = new FireBaseApp.notifications.Android.Channel('fcm_default_channel', 'CampusHead', FireBaseApp.notifications())
        // .setDescription('Demo app description')
        // .setSound('../../images/notification.mp3');
        // FireBaseApp.notifications().android.createChannel(channel);

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
    }catch(e) {}
        /*
        * Triggered for data only payload in foreground
        * */
    }

    showAlert(notification) {
        Alert.alert(
            notification.title,
            notification.body,
            [{ text: "OK", onPress: () => console.log("OK") }],
            { cancelable: false }
        );
    }

    viewHelp() {
        return (
            <Modal visible={this.state.isHelp} transparent={true}>
                <ImageViewer imageUrls={images} />
            </Modal>
        )
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        StatusBar.setBarStyle("light-content", true);
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor(Colors.backgroundcolor, true);
            StatusBar.setTranslucent(true);
        }
        return (
            <Container style={styles.editcontainer}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <ImageViewer imageUrls={images}/>
                </Modal>
                <Header androidStatusBarColor={"transparent"} style={styles.header}>
                    <Left style={styles.left}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("Songs")}
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
                        <Text style={styles.Dashboardtext}>Songs</Text>
                    </Body>

                    <Right style={styles.right}>

                    </Right>
                </Header>
                <View style={{ backgroundColor: Colors.backgroundcolor, height: Metrics.HEIGHT * 0.01, width: Metrics.WIDTH }} />
                <KeyboardAwareScrollView>
                    <View style={styles.contentOne}>
                        {/* <Content> */}
                        <View style={styles.floatingView}>

                            {/* <View style={styles.floatingView}> */}
                            <Text style={{ textAlign: 'center', fontSize: 22, color: 'black', marginBottom: 10 }}>Create Song!</Text>
                            {/* </View> */}
                            <TextInput
                                mode="outlined"
                                // style={styles.inputContainerStyle}
                                label="Name of Song *"
                                placeholder="Type something"
                                value={this.state.name}
                                onChangeText={name => this.setState({ name })}
                                ref="name"
                                onSubmitEditing={event => {
                                    this.refs.artist.focus();
                                }}
                                returnKeyType="next"
                            />

                            <View style={{ height: 10 }} />

                            <TextInput
                                mode="outlined"
                                // style={styles.inputContainerStyle}
                                label="Artist Name"
                                placeholder="Type something"
                                value={this.state.artist}
                                onChangeText={artist => this.setState({ artist })}
                                ref="artist"
                                onSubmitEditing={event => {
                                    this.refs.key.focus();
                                }}
                                returnKeyType="next"
                            />

                            <View style={{ height: 10 }} />

                            <TextInput
                                mode="outlined"
                                // style={styles.inputContainerStyle}
                                label="Key (Spell out 'sharp' or 'flat')"
                                placeholder="Type something"
                                value={this.state.key}
                                onChangeText={key => this.setState({ key })}
                                ref="key"
                                onSubmitEditing={event => {
                                    this.refs.tempo.focus();
                                }}
                                returnKeyType="next"
                            />

                            <View style={{ height: 10 }} />

                            <TextInput
                                mode="outlined"
                                // style={styles.inputContainerStyle}
                                label="Tempo"
                                placeholder="Type something"
                                value={this.state.tempo}
                                onChangeText={tempo => this.setState({ tempo })}
                                ref="tempo"
                                onSubmitEditing={event => {
                                    this.refs.link.focus();
                                }}
                                returnKeyType="next"
                            />

                            <View style={{ height: 10 }} />
                            <View style={{ flexDirection: 'row' }}>
                                <TextInput
                                    mode="outlined"
                                    style={{ flex: 1 }}
                                    label="Youtube link"
                                    placeholder="Type something"
                                    value={this.state.link}
                                    onChangeText={link => this.setState({ link })}
                                    ref="link"
                                    onSubmitEditing={event => {
                                        this.refs.lyrics.focus();
                                    }}
                                    returnKeyType="next"
                                />

                                <TouchableOpacity
                                    style={{ alignItems: 'flex-end', justifyContent: 'center', marginLeft: 10 }}
                                    onPress={() => this.setModalVisible(true)}
                                >
                                    <Image
                                        source={Images.Help}
                                        style={{
                                            height: Metrics.WIDTH * 0.06,
                                            width: Metrics.WIDTH * 0.06,
                                            resizeMode: "contain"
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={{ height: 10 }} />

                            <TextInput
                                ref="lyrics"
                                mode="outlined"
                                label="Lyrics"
                                multiline={true}
                                rows="6"
                                placeholder="Type something"
                                value={this.state.lyrics}
                                autoCapitalize="none"
                                returnKeyType="done"
                                numberOfLines={6}
                                onChangeText={lyrics => this.setState({ lyrics })}
                                style={{ height: 150 }}
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    this.createSong()}
                                style={[
                                    styles.loginBg,
                                    {
                                        marginTop: Metrics.HEIGHT * 0.04,
                                        marginBottom: Metrics.WIDTH * 0.02,
                                    },
                                ]}>
                                <Text style={styles.activeTab}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </KeyboardAwareScrollView>
                <FlashMessage ref="fmLocalInstance" position="top" animated={true} autoHide={true} />
            </Container>
        );
    }

}
