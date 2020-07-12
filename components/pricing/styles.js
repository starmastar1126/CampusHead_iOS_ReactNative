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

  Border: {
    // flex: 1,
    width: Metrics.WIDTH * 0.7,
    height: Metrics.HEIGHT * 0.5,
    borderColor: '#b2bec3',
    borderWidth: 2,
    marginTop: Metrics.HEIGHT * 0.05,
    marginHorizontal: Metrics.WIDTH * 0.15,
    // justifyContent: 'center',
    alignItems: 'center'
  },

  Title: {
    width: Metrics.WIDTH * 0.69,
    height: Metrics.HEIGHT * 0.08,
    backgroundColor: colors.backgroundcolor,
    justifyContent: 'center',
  },

  TitleText: {
    textAlign: 'center',
    color: 'white',
    fontSize: Fonts.moderateScale(18),
  },

  ViewPrice: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: Metrics.HEIGHT * 0.15
  },

  ViewBenefit: {
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: Metrics.HEIGHT * 0.17
  },

  TextPrice: {
    color: 'black', 
    fontSize: 50
  },
  TextMonth: {
    // flex: 1, 
    // textAlign: 'center', 
    marginTop:5
  },

  ViewTitleBenefit: {
    flex:1,
    flexDirection: 'row', 
    justifyContent:'flex-end', 
    alignItems:'flex-end'
  },

  TitleBenefit: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: Fonts.moderateScale(15),
  },

  ContentBenefit: {
    color: 'black',
    fontSize: Fonts.moderateScale(15),
  },

  Separator: {
    borderBottomColor: '#b2bec3', 
    width:Metrics.WIDTH * 0.5, 
    alignItems:'center', 
    justifyContent:'center', 
    borderBottomWidth: 1,
  },

  ViewUpgrade: {
    width: Metrics.WIDTH * 0.59,
    height: Metrics.HEIGHT * 0.1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  ButtonUpgrade: {
    flex:1,
		backgroundColor: colors.backgroundcolor,
		width: Metrics.WIDTH * 0.4,
    // height: 10,
    alignSelf: 'center', 
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
		borderRadius: 5,
  }, 
  
  TextUpgrade: {
    color: 'white',
    fontSize: Fonts.moderateScale(18),
  }
});

export default styles;
