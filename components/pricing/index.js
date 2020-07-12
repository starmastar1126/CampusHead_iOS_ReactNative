import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
  StatusBar,
  Platform,
  Alert
} from "react-native";

import {
  Right,
  Header,
  Left,
  Body
} from "native-base";
import styles from "./styles";
import firebase from "react-native-firebase";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import Moment from 'moment';
import { Images, Metrics, Fonts, Colors } from "../../themes";
import AsyncStorage from '@react-native-community/async-storage';
import BottomBar from "../bottombar/index"
import { FireBaseApp } from "../config";
var jwtDecode = require('jwt-decode');

var token = ""
var decoded = [];

//----------Api config ---------
import Ip from "../apihost";
const api_host = Ip.api_host;

let headers = new Headers();

headers.append('Access-Control-Allow-Origin', 'http://192.168.1.112:8080');
headers.append('Access-Control-Allow-Credentials', 'true');
headers.append('Content-Type', 'application/json');
headers.append('authorization', 'Bearer ' + token);

//In App Purchase
import RNIap, {
  Product,
  ProductPurchase,
  acknowledgePurchaseAndroid,
  purchaseUpdatedListener,
  purchaseErrorListener,
  PurchaseError,
} from 'react-native-iap';

// import * as RNIap from "react-native-iap";

const itemSkus = Platform.select({
  ios: [
    'com.cooni.point1000', 'com.cooni.point5000', // dooboolab
  ],
  android: [
    'individual'
  ],
});

const itemSubs = Platform.select({
  ios: [
    'com.cooni.point1000', 'com.cooni.point5000', // dooboolab
  ],
  android: [
    'test.subcription', // subscription
  ],
});

let purchaseUpdateSubscription;
let purchaseErrorSubscription;


export default class Pricing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorFalseSwitchIsOn: "",
      switchOn1: true,
      switchOn2: false,

      //in app purchase
      productList: [],
      receipt: '',
      availableItemsMessage: '',
    };
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      const team_id = await AsyncStorage.getItem('team_id');
      console.log("token")
      if (value !== null && team_id !== null) {
        token = value;
        console.log("token")
        decoded = jwtDecode(value);
        console.log(decoded)
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  UNSAFE_componentWillMount() {
    this._retrieveData()
    BackHandler.addEventListener("hardwareBackPress", this.backPressed);
  }

  async componentDidMount() {
    try {
    this.checkPermission();
    this.createNotificationListeners();
    } catch(err) {
      console.log("error---->>", err);
    }
    try {
      console.log("didmount start===============>>>>>");
      await RNIap.initConnection();
      console.log("initConnection");
      // await RNIap.consumeAllItemsAndroid();
      const products = await RNIap.getSubscriptions(itemSkus);
      console.log("finished call to get products--------->>>>>",products);
      console.log("!!!!!!!!!!",products[0]);
      this.setState({ productList: products[0] });
    } catch (err) {
      console.warn("err -------------------------");
      console.warn(err);
    }

    purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      console.log('purchaseUpdatedListener', purchase);
      if (purchase.purchaseStateAndroid === 1 && !purchase.isAcknowledgedAndroid) {
        try {
          const ackResult = await acknowledgePurchaseAndroid(purchase.purchaseToken);
          console.log('ackResult', ackResult);
        } catch (ackErr) {
          console.warn('ackErr', ackErr);
        }
      }
      this.setState({ receipt: purchase.transactionReceipt }, () => this.goNext(purchase.purchaseToken));
    });

    purchaseErrorSubscription = purchaseErrorListener((error) => {
      console.log('purchaseErrorListener', error);
      // Alert.alert('purchase error', JSON.stringify(error));
    });
  }

  setDate(date) {
    var time = Moment(date).format();
    var time = Moment.utc(time).format("YYYY-MM-DDTHH:mm:ss.SSS")
    return time
  }

  async goNext(token) {
    var purchased_date = this.setDate(new Date())
    console.log(purchased_date)
    await fetch(api_host + '/user/membership/' + decoded.user.id, {
      method: 'POST',
      body: JSON.stringify({
        membership: 'individual',
        purchased_date: purchased_date
      }),
      headers: headers
    })
      .then(response => {
        response.json().then(data => {
          if (Platform.OS === 'ios') {
            RNIap.finishTransactionIOS(this.state.receipt.purchaseToken)
          } else if (Platform.OS === 'android') {
            console.log("purchaseToken = " + token)
          }
        })
      })
      .catch(error => {
        alert(error)
      })

  }
  /* In app purchase code Start */

  getItems = async () => {
    try {
      console.log('Products -------------------------------------');
      const products = await RNIap.getProducts("com.campushead.individual");
      // const products = await RNIap.getSubscriptions(itemSkus);
      console.log('Products', products);
      this.setState({ productList: products });
    } catch (err) {
      console.warn("getProducts errors");
      console.warn(err.code, err.message);
    }
  }

  getSubscriptions = async () => {
    try {
      const products = await RNIap.getSubscriptions(itemSubs);
      console.log('Products', products);
      this.setState({ productList: products });
    } catch (err) {

      console.warn(err.code, err.message);
    }
  }

  getAvailablePurchases = async () => {
    try {
      console.info('Get available purchases (non-consumable or unconsumed consumable)');
      const purchases = await RNIap.getAvailablePurchases();
      console.info('Available purchases :: ', purchases);
      if (purchases && purchases.length > 0) {
        this.setState({
          availableItemsMessage: `Got ${purchases.length} items.`,
          receipt: purchases[0].transactionReceipt,
        });
        alert(purchases[0].transactionReceipt)
      }
    } catch (err) {
      console.warn(err.code, err.message);
      Alert.alert(err.message);
    }
  }

  // Version 3 apis
  requestPurchase = async (sku) => {
    try {
      await RNIap.requestPurchase(sku);
    } catch (err) {
      alert("You already own this item.")
      return true;
      // console.warn(err.code, err.message);
    }
  }

  requestSubscription = async (sku) => {
    console.log("in the request subscription",sku)
    try {
      RNIap.requestSubscription(sku);
    } catch (err) {
      Alert.alert("err.message");
    }
  }

  // Deprecated apis
  buyItem = async (sku) => {
    try {
      const purchase = await RNIap.buyProduct(sku);
      this.setState({ receipt: purchase.transactionReceipt }, () => this.goNext());
    } catch (err) {
      console.warn(err.code, err.message);
      const subscription = RNIap.addAdditionalSuccessPurchaseListenerIOS(async (purchase) => {
        this.setState({ receipt: purchase.transactionReceipt }, () => this.goNext());
        subscription.remove();
      });
    }
  }

  buySubscribeItem = async (sku) => {
    try {
      console.log('buySubscribeItem: ' + sku);
      const purchase = await RNIap.buySubscription(sku);
      console.info(purchase);
      this.setState({ receipt: purchase.transactionReceipt }, () => this.goNext());
    } catch (err) {
      console.warn(err.code, err.message);
      Alert.alert(err.message);
    }
  }

  /* In app purchase code End */


  componentWillUnmount() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
    this.notificationListener && typeof this.notificationListener == 'function' && this.notificationListener();
    this.notificationOpenedListener && typeof this.notificationOpenedListener == 'function' && this.notificationOpenedListener();
    this.messageListener && typeof this.messageListener == 'function' && this.messageListener();
    BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
  }

  backPressed = () => {
    // this.props.navigation.navigate("Pricing");
    return true;
  };

  async upgrade(sku) {
    // const purchases = await RNIap.getAvailablePurchases();
    // // alert(purchases)
    // if (purchases && purchases.length > 0)
    //   alert("You already own itme.")
    // else 
    // this.goNext("token");
    return this.requestSubscription(sku);
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
  }catch(e) {
    console.log("error ---->>>", e);
  }
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
    /*
    * Triggered for data only payload in foreground
    * */
  }catch(e) {

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

  render() {
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(Colors.backgroundcolor, true);
      StatusBar.setTranslucent(true);
    }

    //in app purchase
    const { productList, receipt, availableItemsMessage } = this.state;
    const receipt100 = receipt.substring(0, 100);
    console.log("productList",productList);
    return (
      <View style={styles.mainview}>
        <Header androidStatusBarColor={"transparent"} style={styles.header}>
          <Left style={styles.left}>
            {/* <TouchableOpacity
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Image
                source={Images.MenuIcon}
                style={{
                  height: Metrics.HEIGHT * 0.07,
                  width: Metrics.WIDTH * 0.07,
                  resizeMode: "contain"
                }}
              />
            </TouchableOpacity> */}
          </Left>

          <Body style={styles.body}>
            <Text style={styles.Dashboardtext}>Pricing</Text>
          </Body>

          <Right style={styles.right}>
          </Right>
        </Header>
        <View style={{backgroundColor:Colors.backgroundcolor,  height:Metrics.HEIGHT*0.01, width:Metrics.WIDTH}} />
        <View style={{flex:1}}>
        <View style={{ marginTop: 10, height: Metrics.HEIGHT * 0.1 }}>
          <Text style={{ color: 'black', textAlign: 'center', fontSize: Fonts.moderateScale(16) }}>
            {/* This app is free up to 10 songs. Take out 'created' to have access to unlimited created songs! */}
          </Text>
        </View>
        <View style={styles.Border}>
          <View style={styles.Title}>
            <Text style={styles.TitleText}>
              INDIVIDUAL MEMBER
            </Text>
          </View>
          <View style={styles.ViewPrice}>
            <View>
              <Text style={{}}>$ </Text>
              <Text style={{}}></Text>
            </View>
            <Text style={styles.TextPrice}>1.99</Text>
            {/* <View> */}
            {/* <Text style={{ flex: 1 }}></Text> */}
            <Text style={{}}>/ month</Text>
            {/* </View> */}
          </View>
          <View style={styles.Separator} />
          <View style={styles.ViewBenefit}>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.ViewTitleBenefit}>
                <Text style={[styles.TitleBenefit, { marginBottom: 3 }]}>Unlimited</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={[styles.ContentBenefit, { marginBottom: 3 }]}>Songs</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.ViewTitleBenefit}>
                <Text style={[styles.TitleBenefit, { marginBottom: 3 }]}>Individual</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={[styles.ContentBenefit, { marginBottom: 3 }]}>Subscription</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.ViewTitleBenefit}>
                <Text style={styles.TitleBenefit}>Unlimited</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.ContentBenefit}>space for</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.ViewTitleBenefit}>
                <Text style={styles.TitleBenefit}></Text>
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <Text style={styles.ContentBenefit}>media uploads</Text>
              </View>
            </View>

          </View>
          <View style={styles.ViewUpgrade}>

            <TouchableOpacity style={styles.ButtonUpgrade}
              onPress={() => {productList && productList.productId && his.upgrade(productList.productId)}}>
              <Text style={styles.TextUpgrade}>
                UPGRADE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
        <BottomBar navigation={this.props.navigation} />
        <FlashMessage ref="fmLocalInstance" position="top" animated={true} autoHide={true} />
      </View>
    );
  }
}
