import React, { Component } from "react";
import {
    View,
    Image,
    TouchableOpacity,
    StatusBar,
    Platform,
    BackHandler,
    FlatList
} from "react-native";
import {
    Container,
    Header,
    Left,
    Right,
    Body,
    Text,
} from "native-base";

import styles from "./styles";

import { Images, Metrics, Fonts, Colors } from "../../themes";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, HelperText, withTheme } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import { FireBaseApp } from "../config";
import firebase from "react-native-firebase";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

import AsyncStorage from '@react-native-community/async-storage';
//----------get user data----------
var token = "";
var decoded = [];

//----------Api config ---------
import Ip from "../apihost";
import { throwStatement } from "@babel/types";

const api_host = Ip.api_host;

let headers = new Headers();

var songList = [];

headers.append('Access-Control-Allow-Origin', api_host);
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append('Content-Type', 'application/json');
headers.append('authorization', 'Bearer ' + token);

var jwtDecode = require('jwt-decode');
var team_id = 0;

export default class AddEvent extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            data: [],
            eventId: '',
            title: '',
            description: '',
            isEditable: false,
            time: '12:00',
            startDate: new Date(),
            endDate: new Date(),
            isDateTimePickerVisible: false,
            selectedSong: '',
            songList: [],
            sbeList: [],
            song_id: '',
            song_name: '',
            song_artist: ''
        };

        this.inputRefs = {
            selectedSong: null,
        };

    }

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                token = value;
                decoded = jwtDecode(value);
                // this.readTeamInfo();
            }

            var date = new Date()
            date.setHours(12, 0, 0)
            this.setState({
                eventId: '',
                title: '',
                description: '',
                startDate: date,
                endDate: date
            })

        } catch (error) {
            // Error retrieving data
        }
    };

    async addEvent() {
        if (this.state.title == '') {
            alert("Title shouldn't be empty.")
            this.refs.title.focus()
            return true;
        }

        console.log(this.state.title, this.setDate(this.state.startDate), this.setDate(this.state.endDate),this.state.description, decoded.user.id,token)
        await fetch(api_host + '/event', {
            method: 'POST',
            body: JSON.stringify({
                title: this.state.title,
                start: this.setDate(this.state.startDate),
                end: this.setDate(this.state.endDate),
                description: this.state.description,
                song_id: '',
                uid: decoded.user.id,
            }),
            headers: headers
        })
            .then((response) => {
                response.json().then(data => {
                    console.log(data)
                    var data = {
                        id: data,
                        title: this.state.title,
                        desc: this.state.description,
                        start: this.state.startDate,
                        end: this.state.endDate
                    }
                    this.props.navigation.navigate("Event",{ key: data, team_id: team_id})
                })
                // this.setState({
                //     isEditable: true,
                // })
                // this.props.navigation.navigate("Event")
            });
    }

    UNSAFE_componentWillMount() {
        // this._retrieveData()
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

    componentDidMount() {
        const { state } = this.props.navigation
        this.setState({ data: state.params.key })
        team_id = state.params.team_id

        // if (state.params.date_start != '' && state.params.date_start != null) {
        //     this.setState({ startDate: state.params.date_start })
        //     this.setState({ endDate: state.params.date_end })
        // }
        try {
        this.checkPermission();
        this.createNotificationListeners();
        this._retrieveData()
        } catch(e) {}
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate("Calendar");
        // Actions.pop();
        return true;
    };

    setDate(date) {
        var time = Moment.utc(date).format("YYYY-MM-DDTHH:mm:ss.SSS")
        return time
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
    }catch(e) {
        console.log("errors ---->>>", e);
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

    getEndDate() {
        var s = Moment.utc(this.state.startDate).toDate("YYYY-MM-DDTHH:mm:ss.SSS");
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
                            onPress={() => this.props.navigation.navigate("Calendar")}
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
                        <Text style={styles.Dashboardtext}>Calendar</Text>
                    </Body>

                    <Right style={styles.right}>

                    </Right>
                </Header>
                <View style={{backgroundColor:Colors.backgroundcolor,  height:Metrics.HEIGHT*0.01, width:Metrics.WIDTH}} />
                <KeyboardAwareScrollView>
                    <View style={styles.contentOne}>
                        <Text style={{ textAlign: 'center', fontSize: 22, color: 'black', marginBottom: 10 }}>New Event</Text>
                        <TextInput
                            mode="outlined"
                            // style={styles.inputContainerStyle}
                            label="Title *"
                            placeholder="Type something"
                            value={this.state.title}
                            onChangeText={title => this.setState({ title })}
                            ref="title"
                            // onSubmitEditing={event => {
                            //     this.refs.startDate.focus();
                            // }}
                            returnKeyType="next"
                        />

                        <View style={{ height: 10 }} />

                        <Text style={{ textAlign: 'center', fontSize: 14, color: 'black' }}>*If future event, choose ending date first</Text>

                        <View style={{ height: 10 }} />

                        <View style={{ alignItems: 'center' }}>
                            <DatePicker
                                style={{ width: Metrics.WIDTH * 0.9 }}
                                date={this.state.startDate}
                                mode="datetime"
                                minDate={new Date()}
                                maxDate={this.state.endDate}
                                ref="startDate"
                                autoFocus
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 0
                                    },
                                    dateInput: {
                                        marginLeft: 36
                                    }
                                }}
                                minuteInterval={10}
                                onDateChange={(datetime) => {
                                    this.setState({
                                        startDate: Moment(datetime).format(),
                                        // endDate: this.getEndDate()
                                    });
                                }}
                            />
                        </View>

                        <View style={{ height: 10 }} />

                        <View style={{ alignItems: 'center' }}>
                            <DatePicker
                                style={{ width: Metrics.WIDTH * 0.9 }}
                                date={this.state.endDate}
                                mode="datetime"
                                ref="endDate"
                                autoFocus
                                minDate={this.state.startDate}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 0
                                    },
                                    dateInput: {
                                        marginLeft: 36
                                    }
                                }}
                                minuteInterval={10}
                                onDateChange={(datetime) => { this.setState({ endDate: Moment(datetime).format() }); }}
                            />
                        </View>

                        <View style={{ height: 10 }} />

                        <TextInput
                            mode="outlined"
                            label="Description"
                            multiline={true}
                            rows="6"
                            ref="description"
                            placeholder="Add Description, Songs, Notes, etc."
                            value={this.state.description}
                            autoCapitalize="none"
                            returnKeyType="done"
                            numberOfLines={6}
                            onChangeText={description => this.setState({ description })}
                            style={{ height: 150 }}
                        />

                        <View style={{ height: 10 }} />

                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() =>
                                    this.addEvent()}
                                style={[
                                    styles.loginBg
                                ]}>
                                <Text style={styles.activeTab}>ADD</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: 10 }} />

                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'black' }}>*Press 'ADD' to add Songs to Event</Text>

                    </View>
                </KeyboardAwareScrollView>

                <FlashMessage ref="fmLocalInstance" position="top" animated={true} autoHide={true} />
            </Container>
        );
    }

}
