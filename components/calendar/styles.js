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
				paddingBottom: Metrics.HEIGHT * 0.01,
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

  redcircle: {
    backgroundColor: "red",
    height: Metrics.HEIGHT * 0.008,
    width: Metrics.HEIGHT * 0.008,
    borderRadius: Metrics.HEIGHT * 0.004,
    position: "absolute",
    top: 5,
    right: 3,
    justifyContent: "flex-end",
    alignSelf: "flex-end"
  },

  mainSwiperView: {
    width: Metrics.WIDTH,
    marginTop: Metrics.HEIGHT * 0.02,
    ...Platform.select({
      ios: {
        height: Metrics.HEIGHT * 0.4
      },
      android: {
        height: Metrics.HEIGHT * 0.4
      }
    })
  },
  slide1: {
    width: Metrics.WIDTH,
    alignSelf: "center",
    ...Platform.select({
      ios: {
        height: Metrics.HEIGHT * 0.4
      },
      android: {
        height: Metrics.HEIGHT * 0.4
      }
    })
  },

  dot: {
    backgroundColor: "#aee7bb",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  },

  activeDot: {
    backgroundColor: "#fff",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  },

  FORDEDGEText: {
    color: "white",
    fontSize: Fonts.moderateScale(40),
    fontWeight: "bold",
    alignSelf: "center"
  },

  CarBg: {
    height: Metrics.HEIGHT * 0.2,
    width: Metrics.WIDTH * 0.6,
    alignSelf: "center",
    resizeMode: "contain"
  },

  AddressText: {
    color: "#fff",
    fontSize: Fonts.moderateScale(14),

    alignSelf: "center"
  },

  FuelSec: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },

  FuelText: {
    fontSize: Fonts.moderateScale(14),
    color: "#fff"
  },

  FuelCount: {
    fontSize: Fonts.moderateScale(15),
    color: "#fff"
  },

  verticalSeparator: {
    height: Metrics.HEIGHT * 0.06,
    width: 0.5,
    backgroundColor: "#d7d7d7",
    alignSelf: "center"
  },

  fuelIcon: {
    height: Metrics.HEIGHT * 0.05,
    width: Metrics.HEIGHT * 0.05,
    resizeMode: "contain"
  },

  MainDestailSec: {
    width: Metrics.WIDTH,
    ...Platform.select({
      ios: {
        height: Metrics.HEIGHT * 0.39
      },
      android: {
        height: Metrics.HEIGHT * 0.37
      }
    }),
    backgroundColor: "#fff"
  },

  AirConditionerText: {
    fontSize: Fonts.moderateScale(15),
    color: "#363636",
    marginLeft: Metrics.HEIGHT * 0.02
  },

  AirConditionrIcon: {
    height: Metrics.HEIGHT * 0.04,
    width: Metrics.HEIGHT * 0.04,
    resizeMode: "contain"
  },

  NumberText: {
    fontSize: Fonts.moderateScale(20),
    color: "#4cc58c",
    marginRight: Metrics.HEIGHT * 0.02
  },

  HorizontalDivider: {
    backgroundColor: "#d4d4d4",
    height: 1,
    width: Metrics.WIDTH,
    marginTop: Metrics.HEIGHT * 0.02
  },

  AutoText: {
    height: Metrics.HEIGHT * 0.11,
    width: Metrics.HEIGHT * 0.11,
    resizeMode: "contain",
    right: Metrics.HEIGHT * 0.02
  },
  
  icLockRed: {
    width: 13 / 2,
    height: 9,
    position: 'absolute',
    top: 2,
    left: 1
  },
  
  rowMain: {
    marginLeft: Metrics.WIDTH * 0.05,
    marginRight: Metrics.WIDTH * 0.05
  },

  listContent: {
    // height: Metrics.HEIGHT * 0.09,
    marginVertical: Metrics.HEIGHT * 0.01,
    flexDirection: "row"
  },

  recentMsg: {
		fontSize: Fonts.moderateScale(14),
		color: "#8f8f94",
		// marginTop: Platform.OS === "ios" ? Metrics.HEIGHT * 0.003 : 0,
		textAlign: "left"
  },
	
  subRow: {
    justifyContent:'center',
    width: Metrics.WIDTH * 0.75
  },

  profile: {
    height: Metrics.WIDTH * 0.12,
    width: Metrics.WIDTH * 0.12,
    borderRadius: Metrics.HEIGHT * 0.035,
    marginRight: Metrics.WIDTH * 0.03,
    alignSelf: "center"
  },

  headerContent: {
    flex:1,
    flexDirection: "row",
    // justifyContent: "center",
  },

  headerText: {
    width:Metrics.WIDTH * 0.74,
    fontSize: Fonts.moderateScale(17),
    color: Colors.black
  },

});

export default styles;
