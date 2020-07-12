
import { Platform, StyleSheet, Dimensions } from 'react-native';
import { Fonts, Metrics, Colors } from '../../themes';
import colors from "../../themes/Colors";

const styles = StyleSheet.create({

  container: {
    width: Metrics.WIDTH,
    height: Metrics.HEIGHT,
    backgroundColor: colors.backgroundcolor
  },
  header: {
    backgroundColor:Colors.loginBlue ,
    height: 56,
    borderBottomWidth: 0,
    ...Platform.select({
      ios: {},
      android: {
				paddingTop: Metrics.HEIGHT * 0.035,
				paddingBottom: Metrics.HEIGHT * 0.015
      }
    }),
    elevation: 0,
    alignItems: 'center'

  },
  backArrow: {
    width: 30,
    alignItems: 'center',
  },
  left: {
    flex: 0.5,
     backgroundColor: 'transparent',
  },

  body: {
    flex: 2,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },

  right: {
    flex: 0.5
  },

  headerTitle: {
    color: Metrics.BLACK,
    fontSize: Fonts.moderateScale(18),
  },

  main: {
    width: Metrics.WIDTH,
    height: Metrics.HEIGHT,
    backgroundColor: 'white'
  },

  titleBar: {
    width: (Metrics.WIDTH),
    height: 40,
    backgroundColor:Colors.loginBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },

  textTitle: {
    color: "white",
    fontSize: Fonts.moderateScale(16),
    alignSelf: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.greys,
    borderRadius: 5,
    height:Metrics.HEIGHT*0.07,
    alignSelf: 'center',
    width: (Metrics.WIDTH * 0.90),
    fontSize: Fonts.moderateScale(14),
    color: 'white',
    // color: Colors.loginBlue,
    // marginLeft: 15,
    paddingLeft: 15,
    marginTop: Metrics.HEIGHT*0.02,
  },
  ands:{
    color: Colors.darktext,
    fontSize: Fonts.moderateScale(12),
  },
  buttonSignUp: {
    backgroundColor: Colors.loginGreen,
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
    width: (Metrics.WIDTH * 0.90),
    height: Metrics.HEIGHT*0.065,
    marginTop: Metrics.HEIGHT*0.04,
    shadowOffset:{width: 0,  height: 3},
    shadowColor: Colors.shadows,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    justifyContent: 'center'
  },

  textWhite: {
    color: "white",
    fontSize: Fonts.moderateScale(14),
  },

  textPolicyDescription:
  {
    color: Colors.darktext,
    fontSize: Fonts.moderateScale(11),
    alignSelf: 'center'
  },

  textTermsCondition:
  {
    color: Colors.loginBlue,
    fontSize: Fonts.moderateScale(12),
  },

  textAlreadyHaveAccount: {
    color:Colors.darktext,
    backgroundColor: "transparent",
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  
  viewAlreadyHaveAccount: {
    borderWidth: 1,
    borderColor: Colors.greys,
    borderRadius: 20,
    backgroundColor: "transparent",
    alignSelf: 'center',
    width: (Metrics.WIDTH * 0.85),
    height: (Metrics.HEIGHT * 0.065),
    marginTop: (Metrics.HEIGHT * 0.03),
    marginBottom: (Metrics.HEIGHT * 0.03),
    justifyContent: 'center',
    alignItems: 'center'
  },

  tandcView:{
    flexDirection: 'row',
    width: (Metrics.WIDTH),
    justifyContent: 'center'
  },
  inputsv:{
    marginTop: Metrics.HEIGHT*0.1,
  },
  tcview:{
    marginTop: Metrics.HEIGHT*0.04,
  },
  logo:{
    // marginTop: Metrics.HEIGHT*0.07,
    height: 150,
    marginTop: Metrics.HEIGHT*0.035,
    marginBottom: Metrics.HEIGHT*0.01,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoimage:{
    // marginTop: Metrics.HEIGHT*0.07,
    height: Metrics.WIDTH * 0.25,
    width: Metrics.WIDTH * 0.8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  spinnerTextStyle: {
    color: '#FFF',
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  }
});


export default styles;
