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
import Ip from "../apihost";
const api_host = Ip.api_host;
// Screen Styles
import styles from "./styles";
import Spinner from 'react-native-loading-spinner-overlay';

// firebase
import firebase from "react-native-firebase";
import Toast from "react-native-easy-toast";
import { Metrics } from "../../themes";
import { FireBaseApp } from "../config";
// import { LoginManager } from 'react-native-fbsdk';
const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  AccessToken
} = FBSDK;
export default class SignIn extends Component {
  UNSAFE_componentWillMount() {
    
    var that = this;
    BackHandler.addEventListener("hardwareBackPress", function () {
      this.props.navigation.navigate("SignIn");
      return true;
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  componentDidMount() {
    this.fireBaseListener = FireBaseApp.auth().onAuthStateChanged(auth => {
      if (auth) {
        this.firebaseRef = FireBaseApp.database().ref('users')
        this.firebaseRef.child(auth.uid).on('value', snap => {
          const user = snap.val()
          if (user != null) {
            this.firebaseRef.child(auth.uid).off('value')
            this.goHome(user)
          }
        })
      } else {
        this.setState({ showSpinner: false })
      }
    })
  }

  handleBackButtonClick = () => {
    // BackHandler.exitApp()
    return true;
  };

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      username: '',
      email: '',
      password: '',
      isLoading: false,
    };
  }

  signup() {
    this.props.navigation.navigate("SignUp")
  }

  callApi() {
    fetch(api_host + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // email: this.state.email,
        username: this.state.email,
        password: this.state.password
      }),
      // headers: headers
    })
      .then(response => {
        response.json().then(data => {
          AsyncStorage.setItem('token', JSON.stringify(data));

          console.log("navigation Home")
          this.setState({
            isLoading: false,
          })
          this.props.navigation.navigate('Home');
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
        }
        alert(error.message);
        // ADD THIS THROW error
        // throw error;
      });
  }

  handleClick() {

    if (this.state.email === '') {
      alert('Please enter your email.')
      this.refs.email.focus()
      return true;
    }

    if (this.state.password === '') {
      alert('Please enter your password.')
      return true;
    }

    this.setState({
      isLoading: true,
    })

    FireBaseApp
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        this.callApi();
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
        this.refs.toast.show(error.message);
      });
  };

  getTerms() {
    return "Terms and Conditions"
  }

  onPressLogin() {
    this.setState({ showSpinner: true })
    LoginManager.logInWithPermissions(['public_profile', 'email'])
      .then((result) => this._handleCallBack(result),
        function (error) {
          alert('Login fail with error: ' + error);
        }
      )
  }
  
  _handleCallBack(result) {
    let _this = this
    console.log("result = ", result)
    if (result.isCancelled) {
      alert('Login cancelled');
    } else {
      AccessToken.getCurrentAccessToken().then(
        (data) => {

          const token = data.accessToken
          console.log("token ============ ", token)
          fetch('https://graph.facebook.com/v2.8/me?fields=id,email,name&access_token=' + token)
            .then((response) => response.json())
            .then((json) => {

              console.log("json ==== ", json )
              // const imageSize = 120
              // const facebookID = json.id
              // const fbImage = `https://graph.facebook.com/${facebookID}/picture?height=${imageSize}`
              this.authenticate(token)
                .then(function (result) {
                  const { uid } = result
                  console.log(result, json, token, )
                  // _this.createUser(uid, json, token, fbImage)
                })
                .catch(error => {
                  console.log(error)
                })


            })
            .catch(function (err) {
              
              console.log("err ============= ", err);
            });
        }
      )

    }
  }

  authenticate = (token) => {
    const provider = FireBaseApp.auth.FacebookAuthProvider
    const credential = provider.credential(token)
    console.log("credential = ", credential)
    let ret = FireBaseApp.auth().signInWithCredential(credential)
    return ret;
  }

  createUser = (uid, userData, token, dp) => {
    const defaults = {
      uid,
      token,
      dp,
      ageRange: [20, 30]
    }
    FireBaseApp.database().ref('users').child(uid).update({ ...userData, ...defaults })

  }
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
          <View style={{ marginTop: 20 }}>
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
              returnKeyType='go'
              ref='password'
            // onSubmitEditing={()=> this.refs.password.focus()}
            />

            <TouchableOpacity
              style={styles.buttonSignIn}
              onPress={() =>
                this.handleClick()}
            >
              <Text style={styles.textWhite}>Sign In</Text>
            </TouchableOpacity>

            <View style={{ flex: 1, alignItems: 'center', borderRadius: 50, marginTop: Metrics.HEIGHT * 0.01, }}>
              <FontAwesome.Button
                style={styles.facebookLogIn}
                name='facebook'
                onPress={this.onPressLogin.bind(this)}
              >
                <Text style={styles.textWhite}>Login with FaceBook</Text>
              </FontAwesome.Button>
            </View>

            {/* <View style={{ flex: 1, width: Metrics.WIDTH * 0.9, alignItems: 'center', marginHorizontal: Metrics.WIDTH * 0.05, marginTop: 10 }}>
              <LoginButton
                publishPermissions={["publish_actions"]}
                onLoginFinished={
                  (error, result) => {
                    if (error) {
                      alert("login has error: " + result.error);
                    } else if (result.isCancelled) {
                      alert("login is cancelled.");
                    } else {
                      AccessToken.getCurrentAccessToken().then(
                        (data) => {
                          alert(data.accessToken.toString())
                        }
                      )
                    }
                  }
                }
                onLogoutFinished={() => alert("logout.")} />
            </View> */}

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
              onPress={() => this.props.navigation.navigate("SignUp")}
            >
              <Text style={styles.textAlreadyHaveAccount}>
                Create an account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Toast ref="toast" style={{ maxWidth: "80%" }} />
      </Container>
    );
  }
}
