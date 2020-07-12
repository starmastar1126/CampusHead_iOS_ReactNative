import React, { Component } from 'react'
import { StyleSheet, Text, View, Image, Dimensions, StatusBar } from 'react-native'
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
// var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxMTQsImVtYWlsIjoid2FuZ3dlaUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IldhbmcgV2VpIiwicGFzc3dvcmQiOiIkMmEkMDgkQVZXRS5EVEp5dHMvdEJpOXNoa3hLTzZsdk8yZS9YeEZ2QVkzajVhWjc2OGlyZThLcWwxelciLCJwaWMiOiJodHRwOi8vMTkyLjE2OC4xLjExMjo4MDgwL3B1YmxpYy91cGxvYWRzL3Byb2ZpbGUvMV8wajZOeGxVNDYwWkRqLUpReXc3X1V3LmpwZyIsImRhdGVfcmVnaXN0cmF0aW9uIjoiMjAxOS0wNi0xM1QxMDoxOTowMC4wMDBaIiwibWVtYmVyc2hpcCI6bnVsbCwidGVhbV9pZCI6MzQsInJvbGUiOm51bGwsInBvc2l0aW9uIjoiRnVpIHlvIGRhIHhpYSBCaW4gSmlhbmcgemhvbmcgbHUgZGFuZG9uZyBsaWFvIG5pbmcgQ2hpbmEifSwiaWF0IjoxNTYwNzE4Mzc5LCJleHAiOjE1NjMzMTAzNzl9.RMra43HOjNlKisrJRFBb8NVtVJfGnvBQJx3jFPOviIw"
var jwtDecode = require('jwt-decode');
// AsyncStorage.setItem('token', token)
const { width, height } = Dimensions.get('window')
const decoded = []
export default class Splash extends Component {
    constructor(props) {
        super(props);
        // this._retrieveData()
        setTimeout(() => {
            this._bootstrapAsync();
        }, 3000)
    }

    _retrieveData = async () => {
        try {
            var value = await AsyncStorage.getItem('token');
            var team_id = await AsyncStorage.getItem('team_id');
            var team_name = await AsyncStorage.getItem('team_name');

            this.props.navigation.navigate(value !== null ? 'Home' : 'SignIn');
            if (value !== null) {
                if (team_id !== null) {
                    this.props.navigation.navigate('Home')
                } else {
                    this.props.navigation.navigate('TeamList')
                }
            } else {
                this.props.navigation.navigate('SignIn')
            }
        } catch (error) {
            // Error retrieving data
        }
    };

    _bootstrapAsync = async () => {
        this._retrieveData()
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
    };
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.logo} source={require('../images/logo.png')}  ></Image>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#222f3e',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        fontWeight: 'bold',
        fontSize: 18
    },

    logo: {
        width: width * 0.7,
        height: width * 0.21
    }
})
