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
    marginLeft: Metrics.WIDTH * 0.03,
    marginRight: Metrics.WIDTH * 0.03,
    marginVertical: Metrics.WIDTH * 0.01,
    // justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },

  listContent: {
    height: Metrics.HEIGHT * 0.1,
    width: Metrics.WIDTH * 0.7,
    
    // marginVertical: Metrics.HEIGHT * 0.01,
    // flexDirection: "row"
  },

  joinView: {
    flex: 1,
    height: Metrics.HEIGHT * 0.06,
    width: Metrics.WIDTH * 0.2,
    justifyContent:'center',
    alignItems:'center',
    // marginVertical: Metrics.HEIGHT * 0.04,
  },

  joinBtn: {
    flex: 1, 
    justifyContent:'center', 
    alignItems:'center', 
    backgroundColor: colors.backgroundcolor
  },

  joinText: {
    flex:1,
    textAlign: 'center',
    // justifyContent: 'center',
    // alignItems: 'center',
    color: 'white',
    fontSize: 16
  },

  profile: {
    height: Metrics.HEIGHT * 0.07,
    width: Metrics.HEIGHT * 0.07,
    borderRadius: Metrics.HEIGHT * 0.035,
    marginRight: Metrics.WIDTH * 0.03,
    alignSelf: "center"
  },

  subRow: {
    width: Metrics.WIDTH * 0.7
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
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

  spinnerTextStyle: {
    color: '#FFF',
  },
  
  separatorStyle: {
    height: 0.5,
    backgroundColor: "#c8c7cc"
  }
});

export default styles;
