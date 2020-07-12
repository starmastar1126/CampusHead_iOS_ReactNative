import { Platform, StyleSheet, Dimensions, I18nManager } from "react-native";
import { Images, Metrics, Fonts, Colors } from "../../themes/";
import colors from "../../themes/Colors";


const styles = StyleSheet.create({
  mainview: {
    flex: 1,
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
    left: 0,
    ...Platform.select({
      ios: {},
      android: {
        paddingTop: Metrics.HEIGHT * 0.04,
        paddingBottom: Metrics.HEIGHT * 0.015
      }
    }),
    elevation: 0
  },

  Dashboardtext: {
    marginTop: 2,
    color: "white",
    fontSize: Fonts.moderateScale(18),
    fontFamily: Fonts.type.SFUIDisplaySemibold,
    fontWeight: "bold"
  },

  HorizontalDivider: {
    backgroundColor: "#d4d4d4",
    height: 1
  },

  listContent: {
    alignItems: 'center',
    marginHorizontal: Metrics.WIDTH * 0.01,
    flexDirection: "row"
  },

  profile: {
    height: Metrics.WIDTH * 0.1,
    width: Metrics.WIDTH * 0.1,
    borderRadius: Metrics.HEIGHT * 0.035,
    // marginRight: 10,
    marginTop: 5,
    alignItems: "flex-start"
  },

  avatar: {
    height: 40,
    width: 40,
    borderRadius: 200,
    // marginRight: 10,
    alignItems: "center"
  },

  profileSearch: {
    height: 42,
    width: 42,
    borderRadius: Metrics.HEIGHT * 0.035,
    // marginRight: 10,
    // marginTop: 5,
    // alignItems: "flex-start"
  },

  subRowPost: {
    borderRadius: 10,
    padding: 10,
    marginLeft: 10,
  },

  headerContent: {
    // width: Metrics.WIDTH * 0.7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  headerText: {
    fontFamily: Fonts.type.sfuiDisplaySemibold,
    fontSize: Fonts.moderateScale(17),
    color: Colors.black
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center"
  },

  time: {
    fontFamily: Fonts.type.sfuiDisplayRegular,
    fontSize: Fonts.moderateScale(14),
    color: "#8f8f94",
    marginRight: Metrics.WIDTH * 0.02
  },

  arrowForward: {
    fontSize: Fonts.moderateScale(22),
    color: "#c7c7cc"
  },

  recentMsg: {
    fontFamily: Fonts.type.sfuiDisplayRegular,
    fontSize: Fonts.moderateScale(14),
    color: "#8f8f94",
    marginLeft: 10,
    // marginTop: Platform.OS === "ios" ? Metrics.HEIGHT * 0.003 : 0,
    textAlign: "left"
  },

  recentCommentMsg: {
    // width: Metrics.WIDTH * 0.7,
    fontFamily: Fonts.type.sfuiDisplayRegular,
    fontSize: Fonts.moderateScale(14),
    color: "black",
    // marginTop: Platform.OS === "ios" ? Metrics.HEIGHT * 0.003 : 0,
    textAlign: "left"
  },

  titleName: {
    textAlign: 'center',
    fontSize: 22,
    color: 'black'
  },

  floatingView: {
    alignSelf: 'center',
    width: Metrics.WIDTH * 0.94,
    justifyContent: 'center',
    marginTop: Metrics.HEIGHT * 0.015,
  },

  container: {
    height: 300,
    justifyContent: 'flex-end',
    paddingTop: 100
  },

  suggestionsRowContainer: {
    flexDirection: 'row',
  },

  userAvatarBox: {
    width: 35,
    paddingTop: 2
  },

  userIconBox: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#54c19c'
  },

  usernameInitials: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14
  },

  userDetailsBox: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 15
  },

  displayNameText: {
    fontSize: 13,
    fontWeight: '500'
  },

  usernameText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)'
  },

  fab: {
    position: 'absolute',
    marginRight: Metrics.WIDTH * 0.03,
    marginBottom: Metrics.HEIGHT * 0.08,
    backgroundColor: "#1188DA",
    right: 0,
    bottom: 0,
    ...Platform.select({
      ios: {
        marginBottom: Metrics.HEIGHT * 0.12,
      },
      android: {
        marginBottom: Metrics.HEIGHT * 0.08,
      }
    }),

  },

  viewComment: {
    flexDirection: 'row',
    // paddingTop: 10,
    justifyContent: 'center',
  },

  buttonSignIn: {
    backgroundColor: Colors.backgroundcolor,
    borderRadius: 5,
    alignSelf: 'center',
    alignItems: 'center',
    width: (Metrics.WIDTH * 0.07),
    height: Metrics.HEIGHT * 0.025,
    shadowOffset: { width: 0, height: 3 },
    shadowColor: Colors.shadows,
    shadowOpacity: 1.0,
    shadowRadius: 5,
    justifyContent: 'center'
  },

  commentText: {
    color: 'white',
    textAlign: 'center'
  },

  viewModalTitle: {

    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    ...Platform.select({
      ios: {
        height: Metrics.HEIGHT * 0.14,
      },
      android: {
        height: Metrics.HEIGHT * 0.06,
      }
    }),

  },


  closeButton: {
    width: 35,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  viewModalPost: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'flex-end'
  },

  postButton: {
    backgroundColor: colors.backgroundcolor,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 5,
    width: "100%",
    // paddingHorizontal: 0.01 
  },

});

export default styles;
