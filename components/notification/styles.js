import { Platform, StyleSheet, Dimensions, I18nManager } from "react-native";
import { Images, Metrics, Fonts, Colors } from "../../themes/";
import colors from "../../themes/Colors";


const styles = StyleSheet.create({
  mainview: {
    height: Metrics.HEIGHT,
    width: Metrics.WIDTH
  },

  mainGradiyantView: {
    width: Metrics.WIDTH,
    ...Platform.select({
      ios: {
        height: Metrics.HEIGHT * 0.61
      },
      android: {
        height: Metrics.HEIGHT * 0.63
      }
    }),
    shadowColor: "#89c68d",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    borderColor: "#89ca90"
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

  content: {
    backgroundColor: Colors.snow
  },

  rowMain: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: Metrics.HEIGHT * 0.01,
    // marginHorizontal: Metrics.WIDTH * 0.01
  },

  listContent: {
    flex:1,
    marginVertical: Metrics.HEIGHT * 0.01,
    marginHorizontal: Metrics.HEIGHT * 0.01,
    flexDirection: "row",
    justifyContent: 'center'
  },

  recentMsg: {
		fontSize: Fonts.moderateScale(14),
		color: "#8f8f94",
		// marginTop: Platform.OS === "ios" ? Metrics.HEIGHT * 0.003 : 0,
		textAlign: "left"
  },
	
  profile: {
    height: Metrics.HEIGHT * 0.07,
    width: Metrics.HEIGHT * 0.07,
    borderRadius: Metrics.HEIGHT * 0.035,
    marginRight: Metrics.WIDTH * 0.03,
    alignSelf: "center"
  },

  subRow: {
    justifyContent:'center',
    width: Metrics.WIDTH * 0.76
  },

  subRow1: {
    justifyContent:'center',
    width: Metrics.WIDTH * 0.38
  },

  headerContent: {
    flexDirection: "row",
    width: Metrics.WIDTH * 0.75,
    justifyContent: "flex-start",
  },

  headerText: {
    fontSize: Fonts.moderateScale(17),
    color: Colors.black
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center"
  },

  time: {
    fontSize: Fonts.moderateScale(14),
    color: "#8f8f94",
    marginRight: Metrics.WIDTH * 0.02
  },

  iconSize: {
    height: Metrics.HEIGHT * 0.035,
    width: Metrics.HEIGHT * 0.035,
    resizeMode: "contain"
  },

  swipeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: Metrics.HEIGHT * 0.09,
    marginVertical: Metrics.HEIGHT * 0.01,
  },

  buttonStyle: {
    alignItems: "center",
    justifyContent: "center",
    height: Metrics.HEIGHT * 0.12
  },

  separatorStyle: {
    height: 0.5,
    backgroundColor: "#c8c7cc"
  },
  
  joinView: {
    height: Metrics.HEIGHT * 0.06,
    width: Metrics.WIDTH * 0.42,
    flexDirection: 'row',
    // marginRight: 10,
    justifyContent:'center',
    alignItems:'center',
    // marginVertical: Metrics.HEIGHT * 0.04,
  },

  joinBtn: {
    width: Metrics.WIDTH * 0.18,
    marginHorizontal: Metrics.WIDTH * 0.01,
    paddingHorizontal: 10,
    justifyContent:'center', 
    backgroundColor: colors.backgroundcolor
  },

  joinText: {
    flex:1,
    textAlign: 'center',
    // justifyContent: 'center',
    // alignItems: 'center',
    color: 'white',
    fontSize: 13
  },

});

export default styles;
