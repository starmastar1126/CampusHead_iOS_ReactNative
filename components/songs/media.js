import ImageViewer from 'react-native-image-zoom-viewer';
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
    Modal,
    SafeAreaView
    // ListView
} from "react-native";
import {
    Container,
    Header,
    Content,
    Button,
    Left,
    Right,
    Body,
    Title,
    Icon,
    List,
    // ListItem,
    Separator,
    SwipeRow
} from "native-base";

import styles from "./styles";

import { Images, Metrics, Fonts, Colors } from "../../themes";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import ImagePicker from 'react-native-image-picker';
import { ListItem, SearchBar } from 'react-native-elements';
import { FireBaseApp } from "../config";
import firebase from "react-native-firebase";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

import superagent from 'superagent';
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

export default class Media extends React.Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            basic: true,
            data: [],
            media: [],
            song_id: 0,
            selectedFile: '',
            // dataSource: dataObjects
        };
        this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
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

    componentDidMount() {
        try {
        this.checkPermission();
        this.createNotificationListeners();
        this.readMediaInfo(this.state.song_id)
        } catch(e) {}
    }

    handleBackButtonClick = () => {
        this.props.navigation.navigate("ViewSong");
        // this.props.navigation.goBack(null);
        // Actions.pop();
        return true;
    };

    readMediaInfo(id) {
        const media = [];
        fetch(api_host + '/song/getMediaByID/' + id, {
            method: 'GET',
            headers: headers,
        })
            .then(response => {
                response.json().then(data => {
                    if (data.data.length != 0) {
                        data.data.forEach(singleMedia => {
                            media.push({
                                id: singleMedia.id,
                                name: singleMedia.name,
                                path: singleMedia.path,
                                // description: singleMedia.description,
                            });
                        });
                        this.setState({
                            data: media,
                        });
                        this.arrayholder = media
                    }
                })
                .catch(error => {
                    this.arrayholder = []
                })
            });
    }

    uploadMedia() {
        var path = 'public/uploads/media/' + this.state.selectedFile.fileName;
        const file = {
            uri: this.state.selectedFile.uri,
            type: this.state.selectedFile.type,
            name: this.state.selectedFile.fileName,
            path: this.state.selectedFile.path,
        }
        const data = {
            'name': this.state.selectedFile.fileName,
            'path': path,
            'sid': this.state.song_id,
            file
        }

        console.log("data = ", data)
        let uploadRequest = superagent.post(api_host + '/media')
            .set('authorization', 'Bearer ' + token)
            .field(data);
        // uploadRequest.attach('image', this.state.selectedFile);
        uploadRequest.end((err, res) => {
            if (err) {
                alert(res.body.message);
                return;
            }
            console.log(res);
            this.readMediaInfo(this.state.song_id)
        });
    };

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 2,
                    width: '100%',
                    backgroundColor: '#CED0CE',
                }}
            />
        );
    };

    searchFilterFunction = text => {
        this.setState({
            value: text,
        });

        if (this.arrayholder != null) {
            const newData = this.arrayholder.filter(item => {
                const itemData = `${item.name.toUpperCase()}`;
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            this.setState({
                data: newData,
            });
        }
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
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {

                this.setState({
                    selectedFile: response
                });
                // console.log(selectedFile)
                this.uploadMedia()
            }
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

    deleteSong(id){
        fetch(api_host + '/media/' + id, {
            method: 'DELETE',
            // body: JSON.stringify({
            //     song
            // }),
            headers: headers
        })
            .then(response => {
                this.props.navigation.navigate("ViewSong")
                ToastAndroid.show("Deleted Successful", ToastAndroid.SHORT)
            });
    }
    render() {
        StatusBar.setBarStyle("light-content", true);
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor(Colors.backgroundcolor, true);
            StatusBar.setTranslucent(true);
        }
        console.log('this.state.data')
        console.log(this.state.data)
        return (
            <Container style={styles.mainview}>
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
                        <Text style={styles.Dashboardtext}>Media</Text>
                    </Body>

                    <Right style={styles.right}>
                        <TouchableOpacity
                            onPress={this.selectPhotoTapped.bind(this)}
                        >
                            <MaterialCommunityIcons
                                name="upload"  //music-note-plus
                                size={25}
                                color={"#fff"}
                            />
                        </TouchableOpacity>
                    </Right>
                </Header>
                <View style={{backgroundColor:Colors.backgroundcolor,  height:Metrics.HEIGHT*0.01, width:Metrics.WIDTH}} />
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item }) => (
                            <View style={styles.rowMain}>
                                <TouchableOpacity onPress={() =>
                                    this.props.navigation.navigate("ViewMedia", { imageUrl: item.path })}>
                                    <Text style={styles.headerText}>{item.name}</Text>
                                </TouchableOpacity>
                                {/* <View style={{ width: Metrics.WIDTH * 0.15, alignItems: 'flex-end' }}> */}
                                    <Button disabled={false} style={[styles.joinBtn, color = "secondary"]} onPress={() => this.deleteSong(item.id)}>
                                        <Text style={styles.joinText}>Delete</Text>
                                    </Button>
                                {/* </View> */}
                                {/* </View> */}
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListHeaderComponent={this.renderHeader}
                    />
                </View>
                <FlashMessage ref="fmLocalInstance" position="top" animated={true} autoHide={true} />
            </Container>
        )
    }
}