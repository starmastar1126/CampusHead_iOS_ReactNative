import React, { Component } from "react";
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    StatusBar,
    Platform,
    BackHandler,
    ToastAndroid,
    ScrollView,
} from "react-native";
import {
    Container,
    Header,
    Content,
    Button,
    Left,
    Right,
    Body,
} from "native-base";

import styles from "./styles";

import { Images, Metrics, Fonts, Colors } from "../../themes";
import { FireBaseApp } from "../config";
import firebase from "react-native-firebase";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

import AsyncStorage from '@react-native-community/async-storage';
import Ip from "../apihost";
const api_host = Ip.api_host;
var decoded = [];

let headers = new Headers();

var token = "";
headers.append('Access-Control-Allow-Origin', api_host);
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append('Content-Type', 'application/json');
headers.append('authorization', 'Bearer ' + token);

export default class Lyrics extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            lyrics: '',
            songName: '',
            song_id: 0,
            isLoading: false,
        };
    }

    UNSAFE_componentWillMount() {
        const { state } = this.props.navigation;
        this.setState({ song_id: state.params.song_id })
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
        this.props.navigation.navigate("ViewSong")
        // Actions.pop();
        return true;
    };

    componentDidMount() {
        try {
        this.checkPermission();
        this.createNotificationListeners();
        } catch(e) {}
    
        try {
            console.log(this.state.song_id)

            this.readSongDetail(this.state.song_id);
        } catch (e) {
            console.log(e);
        }
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
                    console.log('Song Details', data[0].name);
                    if (data.length !== 0) {
                        this.setState({
                            lyrics: data[0].lyrics,
                            songName: data[0].name,
                        });
                    }

                });
            });

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

    render() {
        StatusBar.setBarStyle("light-content", true);
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor(Colors.backgroundcolor, true);
            StatusBar.setTranslucent(true);
        }
        const { lyrics } = this.state;
        var lyrics_array = [];
        console.log(this.state.lyrics)
        // if (lyrics === null)
        //     lyrics = [];
        if (lyrics !== '' && lyrics !== null) {
            if (lyrics.indexOf('\\n') > -1)
                lyrics_array = lyrics.split('\\n');
            else
                lyrics_array = lyrics.split('\n');
        } else
            lyrics_array = []
        console.log(lyrics_array)
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
                <View style={{backgroundColor:Colors.backgroundcolor,  height:Metrics.HEIGHT*0.01, width:Metrics.WIDTH}} />
                <ScrollView style={{ flex: 1, margin: 10 }}>
                    <View style={{ flex: 1, margin: 10 }}>
                        <Text style={styles.LyricsTitle}>{this.state.songName}</Text>
                        {lyrics_array &&
                            lyrics_array.map((lyric, i) => (
                                <Text key={i}>{lyric}</Text>
                            ))}

                    </View>
                </ScrollView>
                {/* </View> */}
                <FlashMessage ref="fmLocalInstance" position="top" animated={true} autoHide={true} />
            </Container>
        );
    }

}
