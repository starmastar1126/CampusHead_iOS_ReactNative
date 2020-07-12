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
    height: Metrics.HEIGHT * 0.06,
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
    justifyContent: "center",
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

  modal: {
    zIndex: 9,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    top: 0,
    left: 0,
    position: 'absolute',
  },

  modalView: {
    flex:1,
    justifyContent: 'space-between',
    top: Metrics.HEIGHT * 0.35,
    left: Metrics.WIDTH * 0.15, 
    alignItems: 'center',
    // justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 15,
    width: Metrics.WIDTH * 0.7, 
    height: Metrics.WIDTH * 0.5
  },

  modalTitleView: {
    flex:1,
    justifyContent: 'center',
  },

  modalTitle: {
		fontFamily: Fonts.type.sfuiDisplayRegular,
		fontSize: Fonts.moderateScale(16),
    textAlign: 'center', 
    justifyContent: 'center',
    color: 'black', 
  },

  modalTextInputView: {
    flex:1,
    width: '95%',
    justifyContent: 'center',
  },

  modalTextInput: {
    justifyContent: 'center',
  },

  modalButtons: {
    flex:1, 
    flexDirection: 'row', 
    width: '95%', 
    justifyContent:'center',
    alignItems:'center' 
  },

  modalButtonSave: {
    flex:1, 
    backgroundColor: colors.backgroundcolor,
    alignItems: 'center',
    width: '100%',
    height: '60%',
    marginRight: 5,
    borderRadius: 5,
    justifyContent: 'center'
  },

  modalButtonCancel: {
    flex:1, 
    backgroundColor: '#747d8c',
    alignItems: 'center',
    width: '100%',
    height: '60%',
    marginLeft: 5,
    borderRadius: 5,
    justifyContent: 'center'
  },

  modalButtonText: {
		fontFamily: Fonts.type.sfuiDisplayRegular,
		fontSize: Fonts.moderateScale(14),
    color: 'white',
    textAlign: 'center'
  },
  
  separator: {
    borderBottomColor: '#b2bec3', 
    width:'100%', 
    alignItems:'center', 
    justifyContent:'center', 
    borderBottomWidth: 1,
  },

});

export default styles;
