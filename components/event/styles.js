import { Platform, StyleSheet, Dimensions, I18nManager } from "react-native";
import { Images, Metrics, Fonts, Colors } from "../../themes/";
import colors from "../../themes/Colors";


const styles = StyleSheet.create({
  mainview: {
    height: Metrics.HEIGHT,
    width: Metrics.WIDTH
  },

  left: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center'
  },

  body: {
    flex: 3,
    alignItems: "center"
  },

  right: {
    flex: 1
  },

  header: {
    backgroundColor: colors.backgroundcolor,
    borderBottomColor: "transparent",
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {},
      android: {
				paddingTop: Metrics.HEIGHT * 0.035,
				paddingBottom: Metrics.HEIGHT * 0.015
      }
    }),
    elevation: 0
  },

  Dashboardtext: {
    marginTop: 2,
    color: "white",
    fontSize: Fonts.moderateScale(18),
    fontWeight: "bold"
  },

  editcontainer: {
    height: Metrics.HEIGHT,
    width: Metrics.WIDTH,
    backgroundColor: Colors.snow,
  },

  loginBg: {
    flex: 1,
    backgroundColor: colors.backgroundcolor,
    width: Metrics.WIDTH * 0.4,
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: 5,
  },

  activeTab: {
    color: Colors.snow,
    textAlign: 'center',
    fontSize: Fonts.moderateScale(14),
  },

  contentOne: {
    width: Metrics.WIDTH * 0.9,
    height: Metrics.HEIGHT,
    marginTop: 20,
    marginHorizontal: Metrics.WIDTH * 0.05,
  },
  
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },

  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  
	rowMain: {
		marginLeft: Metrics.WIDTH * 0.03,
		marginRight: Metrics.WIDTH * 0.03,
		marginVertical: Metrics.WIDTH * 0.01,
		// justifyContent:'center',
		alignItems: 'center',
		flexDirection: 'row'
	},

	addSongText: {
		width:Metrics.WIDTH * 0.8,
		fontFamily: Fonts.type.sfuiDisplaySemibold,
		fontSize: Fonts.moderateScale(17),
		color: Colors.black
	},

});

export default styles;
