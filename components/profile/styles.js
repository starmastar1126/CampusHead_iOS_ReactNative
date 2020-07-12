import { Platform, StyleSheet, Dimensions, I18nManager, PixelRatio, } from "react-native";
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
    marginLeft: Metrics.WIDTH * 0.03,
    marginRight: Metrics.WIDTH * 0.03,
    marginVertical: Metrics.WIDTH * 0.01,
    // justifyContent:'center',
    alignItems: 'center',
    flexDirection: 'row'
  },

  time: {
    fontSize: Fonts.moderateScale(14),
    color: "#8f8f94",
    marginRight: Metrics.WIDTH * 0.02
  },

  editcontainer: {
    height: Metrics.HEIGHT,
    width: Metrics.WIDTH,
    backgroundColor: Colors.snow,
  },

  contentOne: {
    width: Metrics.WIDTH,
    height: Metrics.HEIGHT,
  },

  floatingView: {
    alignSelf: 'center',
    width: Metrics.WIDTH * 0.94,
    justifyContent: 'center',
    marginTop: Metrics.HEIGHT * 0.015,
  },

  activeTab: {
    color: Colors.snow,
    fontSize: Fonts.moderateScale(14),
  },

  loginBg: {
    backgroundColor: colors.backgroundcolor,
    width: Metrics.WIDTH * 0.94,
    alignSelf: 'center',
    height: Metrics.HEIGHT * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },

  uploadImage: {
    alignSelf: 'center',
    // borderRadius: 5,
  },

  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    borderRadius: Metrics.WIDTH * 0.3,
    width: Metrics.WIDTH * 0.25,
    height: Metrics.WIDTH * 0.25,
  },

  titleName: {
    textAlign: 'center',
    fontSize: 22,
    color: 'black'
  }
});

export default styles;
