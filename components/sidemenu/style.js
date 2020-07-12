import { StyleSheet, Platform } from "react-native";
import { Metrics, Fonts, Colors } from "../../themes";
import colors from "../../themes/Colors";

const styles = StyleSheet.create({
  mainView: {
    height: Metrics.HEIGHT,
    justifyContent: 'center',
    backgroundColor: colors.backgroundcolor
  },

  headerView: {
    height: Metrics.HEIGHT * 0.2,
    // backgroundColor: "#262628",
    backgroundColor: colors.backgroundcolor,
    paddingTop: Metrics.WIDTH * 0.08,
    alignItems: "center",
    paddingLeft: 20,
    flexDirection: "row"
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
    justifyContent: 'center',
    // marginVertical: Metrics.HEIGHT * 0.01
  },

  menuName: {
    color: "#fff",
    fontSize: Fonts.moderateScale(18),
    marginLeft: Metrics.HEIGHT * 0.03
  },

  BGRoadTrip: {
    backgroundColor: "#6f6f6f",
    height: Metrics.HEIGHT * 0.035,
    width: Metrics.WIDTH * 0.06,
    borderRadius: 3,
    marginLeft: Metrics.HEIGHT * 0.08
  }
});

export default styles;
