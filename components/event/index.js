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

import { ListItem, SearchBar } from 'react-native-elements';
import { Images, Metrics, Fonts, Colors } from "../../themes";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, HelperText, withTheme } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import firebase from "react-native-firebase";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { FireBaseApp } from "../config";
import AsyncStorage from '@react-native-community/async-storage';
//----------get user data----------
var token = "";
var decoded = [];

//----------Api config ---------
import Ip from "../apihost";

const api_host = Ip.api_host;

let headers = new Headers();

var songList = [];

headers.append('Access-Control-Allow-Origin', api_host);
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append('Content-Type', 'application/json');
headers.append('authorization', 'Bearer ' + token);

var jwtDecode = require('jwt-decode');
var team_id = 0;

export default class Event extends Component {
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

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    };

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    };

    handleDatePicked = date => {
        console.log("A date has been picked: ", date);
        this.hideDateTimePicker();
    };

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                token = value;
                decoded = jwtDecode(value);
                // this.readTeamInfo();
            }

            if (this.state.data != '') {
                this.setState({
                    eventId: this.state.data.id,
                    title: this.state.data.title,
                    description: this.state.data.desc,
                    startDate: this.state.data.start,
                    endDate: this.state.data.end
                })
            } else {
                var date = new Date()
                date.setHours(12, 0, 0)
                this.setState({
                    eventId: '',
                    title: '',
                    description: '',
                    startDate: date,
                    endDate: date
                })
            }

            if (this.state.data != '') {
                this.readSongList();
            }
        } catch (error) {
            // Error retrieving data
        }
    };

    async readSBEList() {
        var eid = 0
        if (this.state.data != '')
            await fetch(api_host + '/sbe/' + this.state.data.id, {
                method: 'GET',
                headers: headers
            })
                .then(response => {
                    response.json().then(data => {
                        this.setState({
                            sbeList: data.data
                        })
                    })
                })
                .catch(error => {
                    console.log(error)
                })

    }

    // get data by song_id 
    async getSongData() {
        await this.state.songList.forEach(data => {
            if (this.state.selectedSong == data.value) {
                this.setState({
                    // song_id: this.state.selectedSong,
                    song_name: data.label,
                    song_artist: data.artist,
                })
            }
        });
    }

    async addSBE() {
        // this.setState({
        //     songList: []
        // })
        if (this.state.selectedSong == '' || this.state.selectedSong == null) {
            alert("Please select a song.")
            return true;
        }

        await this.getSongData();
        await fetch(api_host + '/sbe', {
            method: 'POST',
            body: JSON.stringify({
                event_id: this.state.eventId,
                song_id: this.state.selectedSong,
                song_name: this.state.song_name,
                song_artist: this.state.song_artist,
            }),
            headers: headers
        })
            .then((response) => {
                response.json().then(data => {
                    addData = {
                        event_id: this.state.eventId,
                        song_id: this.state.selectedSong,
                        song_name: this.state.song_name,
                        song_artist: this.state.song_artist,
                    }
                    const { sbeList } = this.state;
                    this.setState({
                        sbeList: sbeList.concat({ id: data, ...addData })
                    })
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    async deleteSBE(id) {
        fetch(api_host + '/sbe/' + id, {
            method: 'DELETE',
            headers: headers
        })
            .then((response) => {
                const { sbeList } = this.state;
                this.setState({
                    sbeList: sbeList.filter(info => info.id !== id)
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    async readSongList() {
        try {
            songList = [];
            console.log("songlist = ", songList)
            this.setState({
                loading: true,
            })
            fetch(api_host + '/user/get/' + decoded.user.id, {
                method: 'GET',
                headers: headers,
            }).then(response => {
                response.json().then(data => {
                    var limit = 10;
                    if (data[0].membership != null && data[0].membership != 'free') {
                        limit = "unlimit";
                    } else {
                        limit = 10;
                    }

                    fetch(api_host + '/song/' + limit + '/getByTeam/' + team_id, {
                        method: 'GET',
                        headers: headers,
                    }).then(response => {
                        response.json().then(data => {
                            this.arrayholder = data;
                            data.forEach(data => {
                                console.log(data.name, data.id, data.artist)
                                songList.push(
                                    {
                                        label: data.name,
                                        value: data.id,
                                        artist: data.artist,
                                    }
                                );
                            });

                            this.setState({
                                songList: songList
                            })

                            this.readSBEList();
                        });
                    });
                })
            })
                .catch(error => {
                    this.setState({
                        //   loading:false,
                        //   refreshing: false
                    })
                })
        } catch (e) {
            console.log(e)
            history.push('/login');
        }

    }

    removeEvent(event) {
        const request = fetch(api_host + '/event/' + event, {
            method: 'DELETE',
            body: JSON.stringify({
                event
            }),
            headers: headers
        })
            .then((response) =>
                this.props.navigation.navigate("Calendar")
            );
    }

    async addEvent() {
        if (this.state.title == '') {
            alert("Title shouldn't be empty.")
            this.refs.title.focus()
            return true;
        }

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
                this.setState({
                    isEditable: true,
                })
                this.props.navigation.navigate("Event")
            });
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 2,
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

    handleRefresh = () => {
        this.setState({
            refreshing: true,
        })
        this.readSBEList()
    }

    async updateEvent() {
        var updateUrl = api_host + '/event/' + this.state.eventId + "/?title=" + this.state.title
            + "&start=" + this.setDate(this.state.startDate) + "&end=" + this.setDate(this.state.endDate) + "&desc=" + this.state.description;

        await fetch(updateUrl, {
            method: 'PUT',
            body: JSON.stringify({
                title: this.state.title,
                start: this.setDate(this.state.startDate),
                end: this.setDate(this.state.endDate),
                description: this.state.description,
            }),
            headers: headers
        })
            .then((response) =>
                this.props.navigation.navigate("Calendar")
            );
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

        try {
        this.checkPermission();
        this.createNotificationListeners();
        this._retrieveData()
        }catch(e) {} 
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

    editEvent() {
        this.setState({
            isEditable: true
        })
        return true;
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
        console.log("error --->>",e);
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
        const placeholder = {
            label: 'Select a Song...',
            value: null,
            color: '#9EA0A4',
        };

        var date = Moment(this.state.startDate)
        var start = new Date()
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
                    {this.state.data == '' ? (
                        // Add Event
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
                        </View>
                    ) : (
                            // View Event
                            !this.state.isEditable ? (
                                <View style={styles.contentOne}>
                                    <Text style={{ textAlign: 'center', fontSize: 22, color: 'black', marginBottom: 10 }}>View Event</Text>
                                    <TextInput
                                        disabled={true}
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

                                    <View style={{ alignItems: 'center' }}>
                                        <DatePicker
                                            disabled={true}
                                            style={{ width: Metrics.WIDTH * 0.9 }}
                                            date={this.state.startDate}
                                            mode="datetime"
                                            minDate={new Date()}
                                            maxDate={this.state.endDate}
                                            ref="startDate"
                                            autoFocus
                                            // format="YYYY-MM-DD HH:mm"
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
                                            onDateChange={(datetime) => { this.setState({ startDate: Moment(datetime).format() }); }}
                                        />
                                    </View>

                                    <View style={{ height: 10 }} />

                                    <View style={{ alignItems: 'center' }}>
                                        <DatePicker
                                            disabled={true}
                                            style={{ width: Metrics.WIDTH * 0.9 }}
                                            date={this.state.endDate}
                                            mode="datetime"
                                            ref="endDate"
                                            autoFocus
                                            minDate={this.state.startDate}
                                            // format="YYYY-MM-DD HH:mm"
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
                                        disabled={true}
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

                                    <FlatList
                                        data={this.state.sbeList}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.props.navigation.navigate("ViewSong", { key: this.state.data, song_id: item.song_id, team_id: team_id })}>
                                                <View style={styles.rowMain}>
                                                    <Text style={styles.addSongText}>{item.song_name} by {item.song_artist}</Text>
                                                    <Image
                                                        source={Images.RightIcon}
                                                        style={{
                                                            height: Metrics.WIDTH * 0.05,
                                                            width: Metrics.WIDTH * 0.05,
                                                            resizeMode: "contain"
                                                        }}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                        ItemSeparatorComponent={this.renderSeparator}
                                    // ListHeaderComponent={this.renderHeader}
                                    />
                                </View>
                            ) : (
                                    // Edit Event
                                    <View style={styles.contentOne}>
                                        <Text style={{ textAlign: 'center', fontSize: 22, color: 'black', marginBottom: 10 }}>Edit Event</Text>
                                        <TextInput
                                            mode="outlined"
                                            label="Title *"
                                            placeholder="Type something"
                                            value={this.state.title}
                                            onChangeText={title => this.setState({ title })}
                                            ref="title"
                                            returnKeyType="next"
                                        />

                                        <View style={{ height: 10 }} />

                                        <View style={{ alignItems: 'center' }}>
                                            <DatePicker
                                                style={{ width: Metrics.WIDTH * 0.9 }}
                                                date={this.state.startDate}
                                                mode="datetime"
                                                ref="startDate"
                                                autoFocus
                                                minDate={new Date()}
                                                maxDate={this.state.endDate}
                                                // format="YYYY-MM-DD HH:mm"
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
                                                onDateChange={(datetime) => this.setState({ startDate: Moment(datetime).format() })}
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
                                                // format="YYYY-MM-DD HH:mm"
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
                                                onDateChange={(datetime) => this.setState({ endDate: Moment(datetime).format() })}
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
                                            <View style={{ width: Metrics.WIDTH * 0.8, justifyContent: 'center' }}>
                                                <RNPickerSelect
                                                    placeholder={placeholder}
                                                    items={songList}
                                                    onValueChange={(value) => {
                                                        this.setState({
                                                            selectedSong: value,
                                                        });
                                                    }}
                                                    style={Platform.OS === 'ios'
                                                        ? styles.inputIOS
                                                        : styles.inputAndroid}
                                                    value={this.state.selectedSong}
                                                />
                                            </View>
                                            <View style={{ width: Metrics.WIDTH * 0.14, justifyContent: 'center', alignItems: 'center' }}>
                                                <TouchableOpacity
                                                    onPress={() => this.addSBE()}
                                                >
                                                    <MaterialCommunityIcons
                                                        name="plus-circle-outline"  //music-note-plus
                                                        size={25}
                                                        color={"#636e72"}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{ height: 10 }} />

                                        <FlatList
                                            data={this.state.sbeList}
                                            renderItem={({ item }) => (
                                                <View style={styles.rowMain}>
                                                    <TouchableOpacity onPress={() => this.deleteSBE(item.id)}>
                                                        <Image
                                                            source={Images.DeleteIcon}
                                                            style={{
                                                                marginLeft: 0,
                                                                marginRight: 15,
                                                                height: Metrics.WIDTH * 0.06,
                                                                width: Metrics.WIDTH * 0.06,
                                                                resizeMode: "contain"
                                                            }}
                                                        />
                                                    </TouchableOpacity>
                                                    <Text style={styles.addSongText}>{item.song_name} by {item.song_artist}</Text>
                                                </View>
                                            )}
                                            keyExtractor={(item, index) => index.toString()}
                                            ItemSeparatorComponent={this.renderSeparator}
                                        />
                                    </View>
                                )
                        )}
                </KeyboardAwareScrollView>
                {this.state.data == '' ? (
                    null
                )
                    :
                    (
                        !this.state.isEditable ? (
                            <View style={{ flexDirection: 'row', margin: 15 }}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.editEvent()
                                        }
                                        style={[
                                            styles.loginBg
                                        ]}>
                                        <Text style={styles.activeTab}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.editEvent()}
                                        style={[
                                            styles.loginBg,
                                            { marginLeft: 10, backgroundColor: '#2ecc71' }
                                        ]}>
                                        <Text style={styles.activeTab}>Add Songs</Text>
                                    </TouchableOpacity>
                                </View>
                        ) : (
                                <View style={{ flexDirection: 'row', margin: 15 }}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.updateEvent()
                                        }
                                        style={[
                                            styles.loginBg
                                        ]}>
                                        <Text style={styles.activeTab}>SAVE</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.removeEvent(this.state.eventId)}
                                        style={[
                                            styles.loginBg,
                                            { marginLeft: 10, backgroundColor: '#747d8c' }
                                        ]}>
                                        <Text style={styles.activeTab}>DELETE</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                    )}
                <FlashMessage ref="fmLocalInstance" position="top" animated={true} autoHide={true} />
            </Container>
        );
    }

}
