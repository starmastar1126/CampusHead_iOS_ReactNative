import React, { Component } from "react";
import {
    // Text,
    View,
    Image,
    TouchableOpacity,
    StatusBar,
    Platform,
    BackHandler,
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

import AsyncStorage from '@react-native-community/async-storage';
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

export default class EditSong extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            artist: '',
            songkey: '',
            tempo: '',
            link: '',
            name: '',
            lyrics: '',
            song_id: 0,
            isLoading: false,
            team_id: 0
        };
    }

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                token = value;
                decoded = jwtDecode(value);
                this.readSongDetail(this.state.song_id);
            }
        } catch (error) {
            // Error retrieving data
        }
    };

    UNSAFE_componentWillMount() {
        const { state } = this.props.navigation
        this.setState({ song_id: state.params.song_id, team_id: state.params.team_id })
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    componentWillUnmount() {
        // alert('editsong this.notificaiton')
        try {
        this.notificationListener && typeof this.notificationListener == 'function' && this.notificationListener();
        this.notificationOpenedListener && typeof this.notificationOpenedListener == 'function' && this.notificationOpenedListener();
        this.messageListener && typeof this.messageListener == 'function' && this.messageListener();
        } catch(e) {}
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate("ViewSong");
        return true;
    };

    componentDidMount() {
        try {
        this.checkPermission();
        this.createNotificationListeners();
        this._retrieveData()
        } catch(e) {}
    }

    readSongDetail(id) {
        //-----read song detail-----
        fetch(api_host + '/song/getByID/' + id, {
            method: 'GET',
            headers: headers,
        })
            .then(response => {
                response.json().then(data => {
                    console.log(data);
                    if (data.length != 0) {
                        this.setState({
                            name: data[0].name,
                            artist: data[0].artist,
                            songkey: data[0].songkey,
                            tempo: data[0].tempo,
                            link: data[0].link,
                            lyrics: data[0].lyrics,
                        });
                    }
                });
            });

    }

    editSong() {
        var sharp = this.state.songkey.split('#')
        console.log(sharp)
        var key = ''
        if (sharp.length > 1) {
            for (i = 0; i < sharp.length; i++) {
                if (i == 0)
                    key = sharp[0]
                else
                    key = key.concat("Sharp", sharp[i])
            }
            console.log("key = " + key)
        }
        var k = ''
        if (key != '')
            k = key
        else
            k = this.state.songkey
        // this.setState({
        //     songkey: key
        // })
        console.log("key = " + this.state.songkey)
        console.log("lyrics = " + JSON.stringify(this.state.lyrics))
        var temp = JSON.stringify(this.state.lyrics)
        if (temp.length != 0) {
            temp = temp.slice(1, temp.length - 1)
        }
        console.log("lyrics = " + temp)

        var editSongUrl = api_host + '/song/' + this.state.song_id;
        // " + ?name=" + this.state.name + "&artist=" + this.state.artist + "&songkey=" + k + "&tempo=" + this.state.tempo +
        // "&link=" + this.state.link + "&lyrics=" + temp + "&uid=" + this.state.uid;
        fetch(editSongUrl, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({
                name: this.state.name,
                artist: this.state.artist,
                songkey: k,
                tempo: this.state.tempo,
                link: this.state.link,
                lyrics: temp,
                // uid: decoded.user.id,
            }),
        })
            .then(response => {
                this.props.navigation.navigate("ViewSong", { song_id: this.state.song_id, team_id: this.state.team_id })
                // console.log(response);
                // const { id } = this.props.match.params
                // this.setState({ song_id: id });
                // window.location = 'songs/details/' + id
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
    } catch(e) {}
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

        return (
            <Container style={styles.editcontainer}>
                <Header androidStatusBarColor={"transparent"} style={styles.header}>
                    <Left style={styles.left}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("ViewSong")}
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
                            <Text style={{ textAlign: 'center', fontSize: 22, color: 'black', marginBottom: 10 }}>Edit Song!</Text>
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
                                value={this.state.songkey}
                                onChangeText={songkey => this.setState({ songkey })}
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

                            <TextInput
                                mode="outlined"
                                // style={styles.inputContainerStyle}
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

                            <View style={{ height: 10 }} />

                            <TextInput
                                ref="lyrics"
                                mode="outlined"
                                label="Lyrics"
                                multiline={true}
                                rows="6"
                                value={this.state.lyrics}
                                placeholder="Type something"
                                autoCapitalize="none"
                                returnKeyType="done"
                                numberOfLines={6}
                                onChangeText={lyrics => this.setState({ lyrics })}
                                style={{ height: 150 }}
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    this.editSong()}
                                style={[
                                    styles.loginBg,
                                    {
                                        marginTop: Metrics.HEIGHT * 0.04,
                                        marginBottom: Metrics.WIDTH * 0.02,
                                    },
                                ]}>
                                <Text style={styles.activeTab}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </KeyboardAwareScrollView>
                <FlashMessage ref="fmLocalInstance" position="top" animated={true} autoHide={true} />
            </Container>
        );
    }

}
