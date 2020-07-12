import { StyleSheet, Platform } from "react-native";
import { Metrics, Fonts, Colors } from "../../themes";
import colors from "../../themes/Colors";

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    left: 0,
  },

  header: {
    backgroundColor: colors.backgroundcolor,
    borderBottomColor: "transparent",
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    ...Platform.select({
      ios: {},
      android: {
				paddingTop: Metrics.HEIGHT * 0.035,
				paddingBottom: Metrics.HEIGHT * 0.015
      }
    }),
    elevation: 0
  },

  left: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'flex-start'
  },

  body: {
    flex: 3,
    alignItems: "center"
  },

  right: {
    flex: 1
  },

  Dashboardtext: {
    marginTop: 2,
    color: "white",
    fontSize: Fonts.moderateScale(18),
    fontFamily: Fonts.type.SFUIDisplaySemibold,
    fontWeight: "bold"
  },

  imageProfile: {
    // height: Metrics.HEIGHT * 0.08,
    width: 200,
    height: 60,
    // borderRadius: Metrics.HEIGHT * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 2,
    // borderColor: "#fff",
    marginLeft: Metrics.HEIGHT * 0.02
  },

  nameText: {
    color: Colors.snow,
    fontSize: Fonts.moderateScale(18),
    alignSelf: "center",
    justifyContent: "center"
  },

  menuView: {
    flex: 1,
    // justifyContent: 'flex-start',
    marginHorizontal: Metrics.WIDTH * 0.03
  },

  menuName: {
    color: "black",
    fontSize: Fonts.moderateScale(17),
    marginLeft: Metrics.HEIGHT * 0.03
  },

});

export default styles;
