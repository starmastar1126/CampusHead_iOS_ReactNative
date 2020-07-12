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
import AsyncStorage from '@react-native-community/async-storage';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput, HelperText, withTheme } from 'react-native-paper';

import firebase from "react-native-firebase";
import { FireBaseApp } from "../config";
import Ip from "../apihost";
const api_host = Ip.api_host;

var decoded = [];

let headers = new Headers();

var token = "";
var team_id = "";
// var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMTQsImVtYWlsIjoid2FuZ3dlaUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6Indhbmd3ZWkiLCJwYXNzd29yZCI6IiQyYSQwOCRDSFNBQ1lxM2UxOWxHS3BMb082WWxlN0ttSjlDbE1BSUUxcjc2eDFOeXpCdXpSS1lhc3h1QyIsInBpYyI6bnVsbCwiZGF0ZV9yZWdpc3RyYXRpb24iOiIyMDE5LTA2LTEzVDEwOjE5OjAwLjAwMFoiLCJtZW1iZXJzaGlwIjpudWxsLCJ0ZWFtX2lkIjpudWxsLCJyb2xlIjpudWxsLCJwb3NpdGlvbiI6bnVsbH0sImlhdCI6MTU2MDUxNDkyMiwiZXhwIjoxNTYzMTA2OTIyfQ.xiPDzY1c_lC_qlIgxtGc5aTJioICV9MSdK4NFKpadrc";
headers.append('Access-Control-Allow-Origin', api_host);
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append('Content-Type', 'application/json');
headers.append('authorization', 'Bearer ' + token);

var jwtDecode = require('jwt-decode');
export default class EditSong extends Component {
    constructor(props) {
        super(props);
        this._retrieveData()
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            name: '',
            location: '',
            isLoading: false,
            userMenu: null,
            user: {
                'role': 'guest',
                'data': {
                    displayName: '',
                    photoURL: '',
                }
            }
        };
    }

    componentDidMount() {

    }

    async teamCreate() {
        try {
            decoded = jwtDecode(token);
            console.log(token)
            await fetch(api_host + '/team', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    uid: decoded.user.id,
                    name: this.state.name,
                    location: this.state.location,
                    token: token
                }),
            })
                .then(response => {
                    response.json().then(data => {
                        team_id = data;
                        console.log("teamid ---------------- teamcreate")
                        console.log(team_id)
                        fetch(api_host + '/user/' + decoded.user.id + '/joinTeam/' + team_id, {
                            method: 'POST',
                            body: JSON.stringify({
                                uid: decoded.user.id,
                                name: this.state.name,
                                position: "Owner",
                            }),
                            headers: headers
                        })
                            .then(response => { 
                                AsyncStorage.removeItem('team_id')
                                AsyncStorage.removeItem('team_name')
                                AsyncStorage.setItem('team_id', JSON.stringify(team_id))
                                AsyncStorage.setItem('team_name', this.state.name)
                                this.props.navigation.navigate("TeamList")
                                
                                FireBaseApp
                                    .firestore()
                                    .collection("users")
                                    .doc(FireBaseApp.auth().currentUser.uid)
                                    .update({
                                        teamId: team_id,
                                    })
                            });
                    })
                });
        } catch (e) {
            console.log(e);
        }
    }

    _retrieveData = async () => {
        try {
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
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
    }

    handleBackButtonClick = () => {
        // this.props.navigation.navigate("Login");
        this.props.navigation.navigate("TeamList");
        // Actions.pop();
        return true;
    };

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
                            onPress={() => this.props.navigation.navigate("TeamList")}
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
                        <Text style={styles.Dashboardtext}>Teams</Text>
                    </Body>

                    <Right style={styles.right}>

                    </Right>
                </Header>
                <View style={{backgroundColor:Colors.backgroundcolor,  height:Metrics.HEIGHT*0.01, width:Metrics.WIDTH}} />
                <KeyboardAwareScrollView>
                    <View style={styles.contentOne}>
                        {/* <Content> */}
                        <View style={styles.floatingView}>

                            {/* <View style={styles.floatingView}> */}
                            <Text style={{ textAlign: 'center', fontSize: 22, color: 'black', marginBottom: 10 }}>Create your own Team!</Text>
                            {/* </View> */}
                            <TextInput
                                mode="outlined"
                                // style={styles.inputContainerStyle}
                                label="Team Name *"
                                placeholder="Type something"
                                value={this.state.name}
                                onChangeText={name => this.setState({ name })}
                                ref="name"
                                onSubmitEditing={event => {
                                    this.refs.location.focus();
                                }}
                                returnKeyType="next"
                            />

                            <View style={{ height: 10 }} />

                            <TextInput
                                mode="outlined"
                                // style={styles.inputContainerStyle}
                                label="Location"
                                placeholder="Type something"
                                value={this.state.location}
                                onChangeText={location => this.setState({ location })}
                                ref="location"
                                // onSubmitEditing={event => {
                                //   this.refs.key.focus();
                                // }}
                                returnKeyType="go"
                            />

                            <TouchableOpacity
                                onPress={() =>
                                    this.teamCreate()}
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

            </Container>
        );
    }

}
