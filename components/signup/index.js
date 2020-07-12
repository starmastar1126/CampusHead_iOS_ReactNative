import React, { PropTypes, Component } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  Platform,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  BackHandler,
  // AsyncStorage,
  Alert,
  ActivityIndicator,
  I18nManager
} from "react-native";
import {
  Container,
} from "native-base";

import FontAwesome from "react-native-vector-icons/FontAwesome";
// import {Actions} from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
// import NavigationScreen from '../../navigation/appnavigation';

// Screen Styles
import styles from "./styles";
// import console = require("console");
import Ip from "../apihost";
import Spinner from 'react-native-loading-spinner-overlay';
const api_host = Ip.api_host;


// firebase
import firebase from "react-native-firebase";
import Toast from "react-native-easy-toast";
import { FireBaseApp } from "../config";

var jwtDecode = require('jwt-decode');

export default class SignUp extends Component {
  UNSAFE_componentWillMount() {
    var that = this;
    BackHandler.addEventListener("hardwareBackPress", function () {
      this.props.navigation.navigate("SignUp");
      return true;
    });
  }

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    
     

    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      isLoading: false,
      dataSource: [],
    };
  }
  _storeData = async () => {
    try {
      await AsyncStorage.setItem('token', data);
    } catch (error) {
      // Error saving data
    }
  };

  _removeData = async () => {
    try {
      const value = await AsyncStorage.removeItem('token');
      if (value !== null) {
        // We have data!!
        console.log("value" + value);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  errorSignUp(error) {
    this.refs.toast.show(error.message);
    this.setState({
      isLoading: false,
      error: error
    });
    return;
  }

  async success(res) {
    await fetch(api_host + '/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        username: this.state.username,
        password: this.state.password
      }),
      // headers: headers
    })
      .then(response => {
        response.json().then(data => {
          console.log("userdata = ", data)
          decoded = jwtDecode(data);
          AsyncStorage.setItem('token', JSON.stringify(data));
          FireBaseApp
            .firestore()
            .collection("users")
            .doc(res.user.uid)
            .set(
              {
                authId: FireBaseApp.auth().currentUser.uid,
                userId: 0,
                teamId: 0,
                email: this.state.email,
                username: this.state.username,
                profileURL: "",
                position: "",
                nickname: decoded.user.nickname
              },
              { merge: true }
            );
          // this._retrieveData()
          this.props.navigation.navigate("Teams")
        })
          .catch(function (error) {
            console.log("error ---->>>", error);
            alert(error.message);
            // ADD THIS THROW error
            throw error;
          });
      })
      .catch(error => {
        try {
          error.json().then(body => {
            //Here is already the payload from API
            console.log(body);
            console.log("message = " + body.message);
            this.setState({
              isLoading: false,
              error: body
            });
          });
        } catch (e) {
          console.log("Error parsing promise");
          console.log(error);
          this.setState({
            isLoading: false,
            error: error
          });
          alert(error);
        }
        // ADD THIS THROW error
        // throw error;
      });
  }

  handleClick() {
    if (this.state.password !== this.state.passwordConfirm) {
      alert("Password is not matched. Please try again.")
      // this.refs.password.focus()
      return true
    }

    console.log(this.state.username, this.state.email, this.state.password);
    if (this.state.username == '') {
      alert('Please Enter you name.')
      // this.refs.username.focus()
      return true;
    }
    if (this.state.email === '') {
      alert('Please enter your email.')
      // this.refs.email.focus()
      return true;
    }

    if (this.state.password == '') {
      alert('Please enter your password.')
      return true;
    }

    this.setState({
      isLoading: true,
    })

    FireBaseApp
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(res => this.success(res))
      .catch(error => this.errorSignUp(error))
  };

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    // BackHandler.exitApp()
    return true;
  };

  render() {
    StatusBar.setBarStyle("light-content", true);

    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("#222f3e", true);
      StatusBar.setTranslucent(true);
    }
    // if (!this.state.isLoading) {
    //   return (
    //     <ActivityIndicator
    //       animating={true}
    //       style={styles.indicator}
    //       size="large"
    //     />
    //   );
    // }
    return (
      <Container style={styles.container}>
        <Spinner
          visible={this.state.isLoading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.logo}>
          <Image style={styles.logoimage} source={require('../../images/logo.png')} />
        </View>
        <ScrollView>
          <View style={{ marginTop: 0 }}>
            <TextInput
              style={styles.textInput}
              placeholder="Username"
              placeholderTextColor="#b7b7b7"
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              keyboardType="default"
              value={this.state.username}
              onChangeText={username => this.setState({ username })}
              textAlign={I18nManager.isRTL ? "right" : "left"}
              tintColor="#0691ce"
              returnKeyType='next'
              ref='name'
              onSubmitEditing={() => this.refs.email.focus()}
            />

            <TextInput
              style={styles.textInput}
              placeholder="Email"
              placeholderTextColor="#b7b7b7"
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              keyboardType="email-address"
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
              textAlign={I18nManager.isRTL ? "right" : "left"}
              tintColor="#0691ce"
              returnKeyType='next'
              ref='email'
              onSubmitEditing={() => this.refs.password.focus()}
            />

            <TextInput
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor="#b7b7b7"
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              keyboardType="default"
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
              textAlign={I18nManager.isRTL ? "right" : "left"}
              secureTextEntry={true}
              tintColor="#0691ce"
              returnKeyType='next'
              ref='password'
              onSubmitEditing={() => this.refs.passwordConfirm.focus()}
            />

            <TextInput
              style={styles.textInput}
              placeholder="Confirm Password"
              placeholderTextColor="#b7b7b7"
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType='go'
              value={this.state.passwordConfirm}
              onChangeText={passwordConfirm => this.setState({ passwordConfirm })}
              textAlign={I18nManager.isRTL ? "right" : "left"}
              secureTextEntry={true}
              tintColor="#0691ce"
              ref='passwordConfirm'
            />

            <TouchableOpacity
              style={styles.buttonSignUp}
              onPress={() => this.handleClick()}
            >
              <Text style={styles.textWhite}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.tcview}>
              <Text style={styles.textPolicyDescription}>
                Clicking register means that you agree to the
              </Text>
              <View style={styles.tandcView}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("TermsAndCondition")}>
                  <Text style={styles.textTermsCondition}>
                    Terms & Conditions
                  </Text>
                </TouchableOpacity>
                <Text style={styles.ands}> and Privacy Policy</Text>
                {/* <TouchableOpacity onPress={() => alert("Privacy Policy")}>
                  <Text style={styles.textTermsCondition}>Privacy Policy</Text>
                </TouchableOpacity> */}
              </View>
            </View>
            <TouchableOpacity
              style={styles.viewAlreadyHaveAccount}
              onPress={() => this.props.navigation.navigate("SignIn")}
            >
              <Text style={styles.textAlreadyHaveAccount}>
                Already have an Account?
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Toast ref="toast" style={{ maxWidth: "80%" }} />
      </Container>
    );
  }
}
