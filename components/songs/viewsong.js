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
    ActivityIndicator,
    ToastAndroid,
    ScrollView,
    Modal,
    RefreshControl
} from "react-native";
import {
    Container,
    Header,
    Left,
    Right,
    Body,
    Card,
    CardItem,
} from "native-base";
import YouTube, {
    YouTubeStandaloneIOS,
    YouTubeStandaloneAndroid,
} from "react-native-youtube";
import styles from "./styles";
import firebase from "react-native-firebase";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import { Images, Metrics, Fonts, Colors } from "../../themes";
import PopupMenu from "./popupmenu";
import { TextInput, HelperText, withTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import Ip from "../apihost";
import { FAB } from 'react-native-paper';
import MentionsTextInput from "../mentions/index"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Textarea from 'react-native-textarea';
import ImagePicker from 'react-native-image-picker'
import superagent from 'superagent';
import { FireBaseApp } from "../config";

const api_host = Ip.api_host;
var decoded = [];
let headers = new Headers();
var token = "";
var jwtDecode = require('jwt-decode');
var posts = []
var comments = [];
var pic = "";

headers.append('Access-Control-Allow-Origin', api_host);
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append('Content-Type', 'application/json');
headers.append('authorization', 'Bearer ' + token);

var temp_data = [];
var sendUsers = [];
export default class ViewSong extends Component {
    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            name: '',
            artist: '',
            media: '',
            posts: [],
            collapsed: [],
            Textdata: [],
            song_id: 0,
            postContent: '',
            listRefreshing: false,
            team_id: 0,
            key: [],
            keyword: "",
            data: [],
            sendUsers: ['start'],
            modalVisible: false,
            isPost: false,
            isNote: false,
            curPostId: 0,
            curContent: [],
            isPC: false,
            text: "",
            preText: "",
            photo: null,
            uid: 0
        };
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
            const value = await AsyncStorage.getItem('token');
            pic = await AsyncStorage.getItem('user_pic');
            if (value !== null) {
                token = value;
                decoded = jwtDecode(value);

                this.readSongDetail(this.state.song_id);
                this.readTeamInfo(this.state.team_id);
            }
        } catch (error) {
            // Error retrieving data
        }
    };

    UNSAFE_componentWillMount() {
        const { state } = this.props.navigation;
        this.setState({ key: state.params.key })
        this.setState({ song_id: state.params.song_id, team_id: parseInt(state.params.team_id) })
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    componentWillUnmount() {
        this.notificationListener && typeof this.notificationListener == 'function' && this.notificationListener();
        this.notificationOpenedListener && typeof this.notificationOpenedListener == 'function' && this.notificationOpenedListener();
        this.messageListener && typeof this.messageListener == 'function' && this.messageListener();
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners();
        this._retrieveData()
    }
    handleBackButtonClick = () => {
        if (this.state.key == '' || this.state.key == null)
            this.props.navigation.navigate("Songs");
        else
            this.props.navigation.navigate("Event", { key: this.state.key, team_id: this.state.team_id })
        // this.props.navigation.goBack(null);
        // Actions.pop();
        return true;
    };

    onPopupEvent = (eventName, index) => {

        if (eventName !== 'itemSelected') return
        if (index === 0) this.onEdit()
        else if (index === 1) this.onDelete()
        else if (index === 2) this.onLyrics()
        else if (index === 3) this.onMedia()
    }

    onEdit = () => {
        this.props.navigation.navigate("EditSong", { song_id: this.state.song_id, team_id: this.state.team_id })
        return true;
    }

    onDelete() {
        fetch(api_host + '/song/' + this.state.song_id, {
            method: 'DELETE',
            // body: JSON.stringify({
            //     song
            // }),
            headers: headers
        })
            .then(response => {
                this.props.navigation.navigate("ViewSong")
                alert("Delete SuccessFully");
                this.props.navigation.navigate("Songs");
                
            });
    }

    onLyrics = () => {
        this.props.navigation.navigate("Lyrics", { song_id: this.state.song_id })
        // return true;
    }

    onMedia() {
        this.props.navigation.navigate("Media", { song_id: this.state.song_id })
    }

    async readSongDetail(id) {
        this.setState({ listRefreshing: true })
        //-----read song detail-----
        await fetch(api_host + '/song/getByID/' + id, {
            method: 'GET',
            headers: headers,
        })
            .then(response => {
                response.json().then(data => {
                    if (data.length != 0) {
                        temp_data = data;
                        this.readPostComment()
                    }
                });
            })
            .catch(error => {
                this.setState({ listRefreshing: false })
            })
    }

    async readPostComment() {
        // this.setState({
        //     activities: null,
        //     posts: [],
        //     content: '',
        // });

        posts = [];
        comments = [];
        //-----read posts/comments------    
        await fetch(api_host + '/song/getPostByID/' + this.state.song_id, {
            method: 'GET',
            headers: headers,
        })
            .then(response => {
                response.json().then(data => {
                    if (data.length != 0) {
                        data.data.forEach(post => {
                            if (data.comment.length != 0) {
                                data.comment.forEach(comment => {
                                    if (comment.pid == post.id) {
                                        comments.push(
                                            {
                                                id: comment.id,
                                                user: {
                                                    name: comment.username,
                                                    avatar: comment.pic,
                                                },
                                                time: comment.created_date,
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
                                comments: comments
                            });
                            comments = [];
                        });
                        this.setState({
                            posts: posts,
                            listRefreshing: false,
                            Textdata: [],
                            name: temp_data[0].name,
                            artist: temp_data[0].artist,
                            songkey: temp_data[0].songkey,
                            tempo: temp_data[0].tempo,
                            link: temp_data[0].link,
                            text: temp_data[0].notes,
                            sendUsers: [],
                            commentContent: '',
                            postContent: '',
                            modalVisible: false,
                            isPC: false,
                            isComment: false,
                            isPost: false,
                            isNote: false,
                            curPostId: 0,
                            curContent: [],
                        });
                    }
                })
                    .catch(error => {
                        this.setState({
                            listRefreshing: false,
                            sendUsers: [],
                            commentContent: '',
                            postContent: '',
                            modalVisible: false,
                            isPC: false,
                            isComment: false,
                            isPost: false,
                            isNote: false,
                            curPostId: 0,
                            curContent: [],
                        })
                    })
            })
            .catch(error => {
                this.setState({
                    listRefreshing: false,
                    sendUsers: [],
                    commentContent: '',
                    postContent: '',
                    modalVisible: false,
                    isPC: false,
                    isComment: false,
                    isPost: false,
                    isNote: false,
                    curPostId: 0,
                    curContent: [],
                })
            })
    }

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

    async createPost() {
        if (this.state.postContent == '' || this.state.postContent == null || this.state.listRefreshing == true)
            return true;

        this.setState({
            listRefreshing: true
        })

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
                'team_id': this.state.team_id,
                'content': this.state.postContent,
                'created_by': decoded.user.id,
                'pic': pic,
                'song_id': this.state.song_id,
                'song_name': this.state.name,
                'width': this.state.photo.width,
                'height': this.state.photo.height,
                'username': decoded.user.username,
                'pc_type': 3,
                'mention_id': JSON.stringify(users),
                'is_mention': 1,
                file
            }
        } else {
            data = {
                'title': '',
                'photo': path,
                'team_id': this.state.team_id,
                'content': this.state.postContent,
                'created_by': decoded.user.id,
                'pic': pic,
                'song_id': this.state.song_id,
                'song_name': this.state.name,
                'width': this.state.photo.width,
                'height': this.state.photo.height,
                'username': decoded.user.username,
                'pc_type': 3,
                'mention_id': JSON.stringify([]),
                'is_mention': 0,
                file
            }
        }

        let uploadRequest = superagent.post(api_host + '/song/postFile')
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
                teamId: this.state.team_id,
                users: users,
                name: this.state.name
            }

            const httpsCallable = FireBaseApp.functions().httpsCallable('songPost');

            httpsCallable({ some: JSON.stringify(body) })
                .then(({ data }) => {
                    // console.log(data);
                })
                .catch(httpsError => {
                    console.log("httpsError.code - ", httpsError.code); // invalid-argument
                    console.log("httpsError.message - ", httpsError.message); // Your error message goes here
                })

            this.readSongDetail(this.state.song_id);
        })
    }

    async createPostNoFile() {
        var users = await this.getSendIds(this.state.postContent, sendUsers);
        var body = [];
        if (users.length > 0) {
            body = JSON.stringify({
                title: '',
                team_id: this.state.team_id,
                content: this.state.postContent,
                created_by: decoded.user.id,
                pic: pic,
                song_id: this.state.song_id,
                song_name: this.state.name,
                username: decoded.user.username,
                pc_type: 3,
                mention_id: JSON.stringify(users),
                is_mention: 1,
            });
        } else {
            body = JSON.stringify({
                title: '',
                team_id: this.state.team_id,
                content: this.state.postContent,
                created_by: decoded.user.id,
                pic: pic,
                song_id: this.state.song_id,
                song_name: this.state.name,
                username: decoded.user.username,
                pc_type: 3,
                mention_id: JSON.stringify([]),
                is_mention: 0,
            });
        }
        await fetch(api_host + '/song/post', {
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
                        teamId: this.state.team_id,
                        users: users,
                        name: this.state.name
                    }

                    const httpsCallable = FireBaseApp.functions().httpsCallable('songPost');

                    httpsCallable({ some: JSON.stringify(body) })
                        .then(({ data }) => {
                            // console.log(data);
                        })
                        .catch(httpsError => {
                            console.log("httpsError.code - ", httpsError.code); // invalid-argument
                            console.log("httpsError.message - ", httpsError.message); // Your error message goes here
                        })

                    // this.setState({
                    //     postContent: '',
                    // })
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
                            isNote: false,
                            curPostId: 0,
                            curContent: [],
                        })
                    })
            })
            .catch(error => {
                this.setState({
                    Textdata: [],
                    listRefreshing: false,
                    postContent: '',
                    sendUsers: [],
                    commentContent: '',
                    modalVisible: false,
                    isPC: false,
                    isComment: false,
                    isPost: false,
                    isNote: false,
                    curPostId: 0,
                    curContent: [],
                })
            })
        this.readSongDetail(this.state.song_id);

    }

    updateState = (text, index) => {
        const Textdata = [...this.state.Textdata]; //make a copy of array
        Textdata[index] = text;
        this.setState({ Textdata: Textdata });
    }

    async createComment(pid, type) {
        var key = 'key' + pid;

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
        var users = await this.getSendIds(this.state.commentContent, sendUsers);
        const file = {
            uri: "file://" + this.state.photo.path,
            type: this.state.photo.type,
            name: this.state.photo.fileName,
            path: this.state.photo.path,
        }
        var data = [];
        if (users.length > 0) {
            data = {
                'pid': pid,
                'type': type,
                'photo': path,
                'team_id': this.state.team_id,
                'song_id': this.state.song_id,
                'song_name': this.state.name,
                'content': this.state.commentContent,
                'created_by': decoded.user.id,
                'pic': pic,
                'width': this.state.photo.width,
                'height': this.state.photo.height,
                'username': decoded.user.username,
                'mention_id': JSON.stringify(users),
                'is_mention': 1,
                'pc_type': 4,
                'uid': this.state.uid,
                file
            }
        } else {
            data = {
                'pid': pid,
                'type': type,
                'photo': path,
                'team_id': this.state.team_id,
                'song_id': this.state.song_id,
                'song_name': this.state.name,
                'content': this.state.commentContent,
                'created_by': decoded.user.id,
                'pic': pic,
                'width': this.state.photo.width,
                'height': this.state.photo.height,
                'username': decoded.user.username,
                'mention_id': JSON.stringify([]),
                'is_mention': 0,
                'pc_type': 4,
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
                teamId: this.state.team_id,
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
            this.readPostComment();      // 34 is for testing
        })
    }

    async createCommentNoFile(pid, type) {
        var users = await this.getSendIds(this.state.commentContent, sendUsers);
        var body = [];
        if (users.length > 0) {
            body = JSON.stringify({
                pid: pid,
                type: type,
                team_id: this.state.team_id,
                song_id: this.state.song_id,
                song_name: this.state.name,
                content: this.state.commentContent,
                created_by: decoded.user.id,
                pic: pic,
                username: decoded.user.username,
                mention_id: JSON.stringify(users),
                is_mention: 1,
                uid: this.state.uid,
                pc_type: 4,
            })
        } else {
            body = JSON.stringify({
                pid: pid,
                type: type,
                team_id: this.state.team_id,
                song_id: this.state.song_id,
                song_name: this.state.name,
                content: this.state.commentContent,
                created_by: decoded.user.id,
                pic: pic,
                username: decoded.user.username,
                pc_type: 4,
                mention_id: JSON.stringify([]),
                uid: this.state.uid,
                is_mention: 0,
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
                        teamId: this.state.team_id,
                        users: users,
                        name: this.state.name
                    }

                    const httpsCallable = FireBaseApp.functions().httpsCallable('songComment');

                    httpsCallable({ some: JSON.stringify(body) })
                        .then(({ data }) => {
                            console.log("data.someResponse"); // hello world
                            // console.log(data); // hello world
                        })
                        .catch(httpsError => {
                            console.log("httpsError.code - ", httpsError.code); // invalid-argument
                            console.log("httpsError.message - ", httpsError.message); // Your error message goes here
                        })

                    // this.setState({
                    //     Textdata: []
                    // })
                })
                    .catch(error => {
                        this.setState({
                            Textdata: [],
                            listRefreshing: false,
                            postContent: '',
                            sendUsers: [],
                            commentContent: '',
                            modalVisible: false,
                            isPC: false,
                            isComment: false,
                            isPost: false,
                            isNote: false,
                            curPostId: 0,
                            curContent: [],
                        })
                    })
                this.readSongDetail(this.state.song_id);
            })
            .catch(error => {
                this.setState({
                    Textdata: [],
                    listRefreshing: false,
                    postContent: '',
                    sendUsers: [],
                    commentContent: '',
                    modalVisible: false,
                    isPC: false,
                    isComment: false,
                    isPost: false,
                    isNote: false,
                    curPostId: 0,
                    curContent: [],
                })
            })
    }

    // ------ delete song ------ //
    removeSong(song) {
        return (dispatch, getState) => {

            const request = fetch(api_host + '/song/' + song, {
                method: 'DELETE',
                body: JSON.stringify({
                    song
                }),
                headers: headers
            });

            return request.then(response => {
                this.props.showMessage({
                    message: "Deleted Successful",
                    autoHideDuration: 6000,//ms
                    anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'//success error info warning null
                });
            });
        };
    };

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
    } catch(e) {}   
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

            const notificationOpen = await FireBaseApp.notifications().getInitialNotification();
            if (notificationOpen) {
                // App was opened by a notification
                // Get the action triggered by the notification being opened
                const action = notificationOpen.action;
                const notification = notificationOpen.notification;
                console.log("action = " + action)
                console.log("notification = ", notification)
            }
        } catch (e) { }
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

    thumbnail_url(video_id) {
        return "https://img.youtube.com/vi/" + video_id + "/mqdefault.jpg";
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

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    async getNote(sid) {
        await fetch(api_host + '/song/getByID/' + sid, {
            method: 'GET',
            headers: headers,
        })
            .then(response => {
                response.json().then(data => {
                    if (data.length != 0) {
                        this.setState({
                            text: data[0].notes,
                            preText: data[0].note,
                        })
                    }
                    this.setState({
                        modalVisible: true,
                        isNote: true,
                    })
                });
            })
            .catch(error => {
                this.setState({ listRefreshing: false })
            })
    }

    saveNote() {
        // var temp = this.state.text
        // if (temp.length != 0) {
        //     temp = temp.slice(1, temp.length - 1);
        // }

        fetch(api_host + '/song/updateNote/' + this.state.song_id, {
            method: 'PUT',
            body: JSON.stringify({
                notes: this.state.text,
            }),
            headers: headers
        })
            .then(response => {
                this.setState({
                    preText: this.state.text,
                    isNote: false,
                    modalVisible: false,
                    text: ''
                })
            })
            .catch(error => {
                alert("Network Error.")
            })
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
                            isNote: false,
                            curPostId: 0,
                            curContent: [],
                        })
                    }}>
                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <View style={{
                            flexDirection: 'row', alignItems: 'center',
                            ...Platform.select({
                                ios: {
                                    height: Metrics.HEIGHT * 0.10,
                                    top: 20

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
                                            height: Metrics.WIDTH * 0.05,
                                            width: Metrics.WIDTH * 0.05,
                                            resizeMode: "contain"
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: 'flex-end' }}>
                                <View style={{ flex: 1 }} />
                                {/* <TouchableOpacity style={[styles.viewComment, { width: 35, justifyContent: 'flex-end', marginRight: 10 }]}
                                    onPress={() => this.setState({ modalVisible: false, isPC: false, commentContent: '' })}>
                                    <MaterialCommunityIcons
                                        name="close"
                                        size={35}
                                        color="white"
                                    />
                                </TouchableOpacity> */}
                            </View>
                        </View>

                        <View style={[styles.HorizontalDivider]} />

                        <ScrollView>
                            <View style={{ flex: 1, marginHorizontal: 10 }}>
                                <View style={styles.listContent}>
                                    {post.user.avatar == null || post.user.avatar == '' ?
                                        <Image source={Images.Profile} style={styles.profile} />
                                        :
                                        <Image source={{ uri: post.user.avatar }} style={styles.profile} />
                                    }
                                    <View style={styles.subRowPost}>
                                        <View >
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
                                    <View>
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
                            <View style={{ width: Metrics.WIDTH * 0.7 }}>
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
                            <View style={{ flex: 1, width: (Metrics.WIDTH * 0.27 - 40), alignItems: 'center' }}>
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
                            isNote: false,
                            curPostId: 0,
                            curContent: [],
                        })
                    }}>
                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <View style={styles.viewModalTitle}>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity
                                    onPress={() => this.setState({ modalVisible: false, isPost: false, listRefreshing: false, postContent: '' })}
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
                    </View >
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
                </Modal >
            )
        } else if (this.state.isNote) {
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
                            isNote: false,
                            curPostId: 0,
                            curContent: [],
                            text: this.state.preText
                        })
                    }}>
                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <View style={styles.viewModalTitle}>
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity
                                    onPress={() => this.setState({ modalVisible: false, isNote: false, text: this.state.preText })}
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
                                <View style={{ width: (Metrics.WIDTH * 0.27 - 40), alignItems: 'center' }}>
                                    <TouchableOpacity style={styles.postButton}
                                        onPress={() => this.saveNote()}>
                                        <Text style={styles.commentText}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={{ marginVertical: 10 }} />

                        <ScrollView>
                            <View style={{ flex: 1, marginHorizontal: Metrics.WIDTH * 0.05 }}>
                                {/* <View style={{ width: Metrics.WIDTH * 0.1, justifyContent: 'flex-start', marginBottom: 10 }}>
                                    <Image source={{ uri: pic }} style={styles.avatar} />
                                </View> */}
                                <View style={{ width: Metrics.WIDTH * 0.9, height: '100%' }}>

                                    <Textarea
                                        containerStyle={styles.textareaContainer}
                                        style={styles.textarea}
                                        onChangeText={(val) => { this.setState({ text: val }) }}
                                        defaultValue={this.state.text}
                                        maxLength={3000}
                                        placeholder={'Take down notes...'}
                                        placeholderTextColor={'#c7c7c7'}
                                        underlineColorAndroid={'transparent'}
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

    getPhotoUri(photo) {
        console.log("photo = ", api_host + "/" + photo)
        return api_host + "/" + photo;
    }

    render() {
        StatusBar.setBarStyle("light-content", true);
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor(Colors.backgroundcolor, true);
            StatusBar.setTranslucent(true);
        }
        var video_id = '';
        if (this.state.link != '' && this.state.link != null) {
            if (this.state.link.includes("watch")) {
                video_id = this.state.link.split('watch?v=')[1];
            } else {
                video_id = this.state.link.split('youtu.be/')[1];
            }
        }
        var thumbnail_url = this.thumbnail_url(video_id);

        const { posts } = this.state;
        return (
            <Container style={styles.mainview}>
                <Header androidStatusBarColor={"transparent"} style={styles.header}>
                    <Left style={styles.left}>
                        <TouchableOpacity
                            onPress={() => this.handleBackButtonClick()}
                        >
                            <Image
                                source={Images.BackIcon}
                                style={{
                                    height: Metrics.WIDTH * 0.05,
                                    width: Metrics.WIDTH * 0.05,
                                    resizeMode: "contain"
                                }}
                            />
                        </TouchableOpacity>
                    </Left>

                    <Body style={styles.body}>
                        <Text style={styles.Dashboardtext}>Songs</Text>
                    </Body>

                    <Right style={styles.right}>
                        <PopupMenu actions={['Edit', 'Delete']} onPress={this.onPopupEvent} />
                    </Right>
                </Header>
                <View style={{ backgroundColor: Colors.backgroundcolor, height: Metrics.HEIGHT * 0.01, width: Metrics.WIDTH }} />
                <View style={{ flex: 1 }}>
                    <ScrollView
                        style={styles.container}
                        refreshControl={
                            <RefreshControl
                                style={{ backgroundColor: 'transparent' }}
                                tintColor="#CED0CE"
                                onRefresh={() => this.readSongDetail(this.state.song_id)}
                                refreshing={this.state.listRefreshing}
                            />
                        }>
                        {video_id == '' || video_id == null ? (
                            <TouchableHighlight>
                                <View style={styles.vids}>
                                    <Image
                                        source={Images.NoVideo}
                                        style={{ width: Metrics.WIDTH, height: Metrics.WIDTH * (9 / 16) }} />
                                </View>
                            </TouchableHighlight>
                        ) : (
                                <TouchableHighlight
                                    onPress={() => this.props.navigation.navigate('YouTubeVideo', { youtubeId: video_id })}>
                                    <View style={styles.vids}>
                                        <Image
                                            source={{ uri: thumbnail_url }}
                                            style={{ width: Metrics.WIDTH, height: Metrics.WIDTH * (9 / 16) }} />
                                    </View>
                                </TouchableHighlight>
                            )}

                        <View style={styles.viewName}>
                            <Text style={[styles.titleName, { textAlign: 'left' }]}>{this.state.name}</Text>
                        </View>
                        <View style={[styles.viewName, { marginTop: 5 }]}>
                            <Text style={styles.keyName}>Artist: {this.state.artist}</Text>
                        </View>
                        <View style={[styles.viewName, { marginTop: 5 }]}>
                            {/* <View style={{ flex: 1, flexDirection: 'row' }}> */}
                            <Text style={styles.keyName}>Key: {this.state.songkey}  |  </Text>
                            <Text style={styles.keyName}>Tempo: {this.state.tempo}</Text>
                        </View>
                        <View style={{ flex: 1, marginHorizontal: Metrics.WIDTH * 0.05, marginTop: 10, flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate("Lyrics", { song_id: this.state.song_id })}
                                style={[
                                    styles.commentBtn,
                                ]}>
                                <MaterialCommunityIcons
                                    name="file-document"
                                    size={20}
                                    color="white"
                                />
                                <Text style={[styles.commentText, { marginLeft: 5 }]}>Lyrics</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate("Media", { song_id: this.state.song_id })}
                                style={[
                                    styles.commentBtn,
                                    { marginHorizontal: 10 }
                                ]}>
                                <MaterialCommunityIcons
                                    name="folder-multiple-image"
                                    size={20}
                                    color="white"
                                />
                                <Text style={[styles.commentText, { marginLeft: 5 }]}>Media</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    this.getNote(this.state.song_id)}
                                style={[
                                    styles.commentBtn,
                                ]}>
                                <MaterialCommunityIcons
                                    name="notebook"
                                    size={20}
                                    color="white"
                                />
                                <Text style={[styles.commentText, { marginLeft: 5 }]}>Notes</Text>
                            </TouchableOpacity>
                        </View>
                        {/* </View> */}
                        <View style={{ height: 5 }} />

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
                                            <TouchableOpacity style={styles.headerContent}
                                                onPress={() =>
                                                    this.setState({ modalVisible: true, isPC: true, curContent: post, curPostId: post.id, uid: post.user.id })}>
                                                {post.message && (
                                                    <Text style={[styles.recentMsg, { color: 'black' }]}>
                                                        {post.message}
                                                    </Text>
                                                )}
                                            </TouchableOpacity>
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
                </View>
                {this.postCommentPage()}
                <FAB
                    style={styles.fab}
                    large
                    color="white"
                    icon="add"
                    onPress={() =>
                        this.setState({ modalVisible: true, isPost: true })}
                />
                <FlashMessage ref="fmLocalInstance" position="top" animated={true} autoHide={true} />
            </Container>
        );
    }

}
