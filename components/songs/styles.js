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
		fontFamily: Fonts.type.sfuiDisplayRegular,
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

	viewName: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 0,
		width: Metrics.WIDTH * 0.9,
		marginLeft: Metrics.WIDTH * 0.05,
		marginRight: Metrics.WIDTH * 0.05
	},

	titleName: {
		flex: 1,
		textAlign: 'center',
		left: 0,
		fontSize: 22,
		color: "black"
	},

	LyricsTitle: {
		flex: 1,
		textAlign: 'center',
		left: 0,
		marginBottom: 10,
		fontSize: 22,
		color: "black"
	},

	keyName: {
		// flex: 1,
		left: 0,
		right: 0,
		fontSize: 16,
		color: "grey"
	},

	container: {
		backgroundColor: 'white',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	buttonGroup: {
		flexDirection: 'row',
		alignSelf: 'center',
	},
	button: {
		paddingVertical: 4,
		paddingHorizontal: 8,
		alignSelf: 'center',
	},
	buttonText: {
		fontSize: 18,
		color: 'blue',
	},
	buttonTextSmall: {
		fontSize: 15,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
	player: {
		alignSelf: 'stretch',
		marginVertical: 10,
	},
	mainView: {
		height: Metrics.HEIGHT * 0.9,
	},

	mainRow: {
		flexDirection: 'row',
		paddingTop: Metrics.HEIGHT * 0.018,
		paddingBottom: Metrics.HEIGHT * 0.025,
		paddingLeft: Metrics.WIDTH * 0.045,
		paddingRight: Metrics.WIDTH * 0.045
	},

	labelText: {
		color: '#a3a3a3',
		width: Metrics.WIDTH * 0.4,
		fontSize: Fonts.moderateScale(16),
		fontFamily: Fonts.type.helveticaNeueLight,
		textAlign: 'left'
	},

	infoText: {
		width: Metrics.WIDTH * 0.5,
		fontSize: Fonts.moderateScale(16),
		fontFamily: Fonts.type.helveticaNeueLight,
		textAlign: 'left'
	},

	lyricsText: {
		alignItems: "center",
		fontSize: Fonts.moderateScale(16),
		color: "#757575",
		fontFamily: Fonts.type.nunitoRegular,
		...Platform.select({
			ios: {
				padding: 12
			},
			android: {
				paddingTop: 5,
				paddingBottom: 9,
				paddingHorizontal: 12
			}
		})
	},

	infoBgView: {
		marginTop: Metrics.HEIGHT * 0.02,
		backgroundColor: "#f5f5f5",
		marginHorizontal: 15
	},

	editcontainer: {
		height: Metrics.HEIGHT,
		width: Metrics.WIDTH,
		backgroundColor: Colors.snow,
	},

	textTitle: {
		color: Colors.snow,
		fontSize: Fonts.moderateScale(20),
		alignSelf: 'center',
		fontFamily: Fonts.type.helveticaNeueLight,
		...Platform.select({
			ios: {},
			android: {
				paddingTop: Metrics.WIDTH * 0.02,
			},
		}),
	},

	heartBg: {
		width: Metrics.WIDTH * 0.054,
		height: Metrics.WIDTH * 0.054,
		borderRadius: Metrics.WIDTH * 0.027,
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: Colors.snow,
		alignItems: 'center',
		justifyContent: 'center',
	},

	bagIcon: {
		marginLeft: Metrics.WIDTH * 0.04,
		color: Colors.snow,
	},

	heartIcon: {
		color: Colors.snow,
		alignSelf: 'center',
	},

	content: {
		width: Metrics.WIDTH,
		height: Metrics.HEIGHT * 0.8,
	},

	bottomView: {
		width: Metrics.WIDTH,
		alignItems: 'center',
		justifyContent: 'center',
		height: Metrics.HEIGHT * 0.097,
	},

	divider: {
		backgroundColor: '#d8d8d8',
		width: Metrics.WIDTH,
		height: Metrics.WIDTH * 0.003,
	},

	loginSignUpTxt: {
		fontSize: Fonts.moderateScale(16),
		fontFamily: Fonts.type.sfuiDisplayRegular,
	},

	facebookBtnBg: {
		backgroundColor: '#0054a6',
		width: Metrics.WIDTH * 0.94,
		alignSelf: 'center',
		borderRadius: 5,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: Metrics.WIDTH * 0.025,
		paddingBottom: Metrics.WIDTH * 0.025,
	},

	loginWithFacebookTxt: {
		color: Colors.snow,
		fontSize: Fonts.moderateScale(17),
		// fontFamily: Fonts.type.sfuiDisplayLight,
		marginLeft: Metrics.WIDTH * 0.03,
	},

	loginSignUpContent: {
		...Platform.select({
			ios: {
				height: Metrics.HEIGHT * 0.714,
			},
			android: {
				height: Metrics.HEIGHT * 0.7,
			},
		}),
		width: Metrics.WIDTH * 0.94,
		alignSelf: 'center',
	},

	textInput: {
		height: Metrics.HEIGHT * 0.07,
		alignSelf: 'center',
		width: Metrics.WIDTH * 0.9,
		fontSize: Fonts.moderateScale(14),
		fontFamily: Fonts.type.SFUIDisplayRegular,
		color: '#959595',
		marginLeft: 15,
		paddingLeft: 15,
		marginTop: Metrics.HEIGHT * 0.02,
		backgroundColor: 'red',
	},

	item: {
		alignSelf: 'center',
		width: Metrics.WIDTH * 0.94,
		justifyContent: 'center',
	},

	floatingView: {
		alignSelf: 'center',
		width: Metrics.WIDTH * 0.94,
		justifyContent: 'center',
		marginTop: Metrics.HEIGHT * 0.015,
	},

	inputemail: {
		fontFamily: Fonts.type.SFUIDisplayRegular,
		color: '#959595',
		fontSize: Fonts.moderateScale(15),
	},
	textLabel: {
		fontFamily: Fonts.type.SFUIDisplayRegular,
		color: '#959595',
		fontSize: Fonts.moderateScale(15),
		marginLeft: 10,
		fontSize: 10,
	},

	forgotPasswordTxt: {
		color: '#0691ce',
		fontSize: Fonts.moderateScale(16),
		fontFamily: Fonts.type.sfuiDisplayRegular,
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

	alertBg: {
		width: Metrics.WIDTH * 0.03,
		height: Metrics.WIDTH * 0.03,
		borderRadius: Metrics.WIDTH * 0.015,
		backgroundColor: '#ff0000',
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: -(Metrics.WIDTH * 0.018),
	},

	alertTxt: {
		fontSize: Fonts.moderateScale(8),
		fontFamily: Fonts.type.sfuiDisplayMedium,
		color: Colors.snow,
	},

	dropdown: {
		width: Metrics.WIDTH * 0.94,
		alignSelf: 'center',
		height: Metrics.HEIGHT * 0.07,
		backgroundColor: 'red',
	},

	picker: {
		width: Metrics.WIDTH * 0.94,
		alignSelf: 'center',
		height: Metrics.HEIGHT * 0.07,
		backgroundColor: 'green',
	},

	activeTab: {
		color: Colors.snow,
		fontFamily: Fonts.type.sfuiDisplayRegular,
		fontSize: Fonts.moderateScale(14),
	},

	normalTab: {
		color: '#0691ce',
		fontFamily: Fonts.type.sfuiDisplayRegular,
		fontSize: Fonts.moderateScale(14),
	},

	segmentTab: {
		...Platform.select({
			ios: {
				width: Metrics.WIDTH * 0.467,
				height: 31,
			},
			android: {
				width: Metrics.WIDTH * 0.465,
				height: 29,
			},
		}),
		backgroundColor: '#FFF',
		borderColor: '#0691ce',
		justifyContent: 'center',
		alignSelf: 'center',
	},

	segmentSelectedTab: {
		...Platform.select({
			ios: {
				width: Metrics.WIDTH * 0.467,
				height: 31,
			},
			android: {
				width: Metrics.WIDTH * 0.465,
				height: 29,
			},
		}),
		backgroundColor: '#0691ce',
		borderColor: '#0691ce',
		justifyContent: 'center',
		alignSelf: 'center',
	},

	contentOne: {
		width: Metrics.WIDTH,
		height: Metrics.HEIGHT,
	},

	segmentSelectedTabOne: {
		width: Metrics.WIDTH * 0.47,
		height: Metrics.HEIGHT * 0.05,
		backgroundColor: '#0691ce',
		borderColor: '#0691ce',
		justifyContent: 'center',
		alignSelf: 'center',
		borderRadius: Metrics.HEIGHT * 0.007,
	},

	segmentTabOne: {
		width: Metrics.WIDTH * 0.47,
		height: Metrics.HEIGHT * 0.05,
		backgroundColor: 'transparent',
		borderColor: '#0691ce',
		justifyContent: 'center',
		alignSelf: 'center',
	},

	segmentTabSecOne: {
		width: Metrics.WIDTH * 0.94,
		height: Metrics.HEIGHT * 0.05,
		marginVertical: Metrics.HEIGHT * 0.03,
		borderRadius: Metrics.HEIGHT * 0.007,
		backgroundColor: Colors.snow,
		borderColor: '#0691ce',
		padding: 0,
		borderWidth: 1,
		alignSelf: 'center',
	},

	activeTabOne: {
		color: Colors.snow,
		//  fontFamily: Fonts.type.helveticaNeueLight,
		fontSize: Fonts.moderateScale(15),
	},

	normalTabOne: {
		color: '#0691ce',
		//  fontFamily: Fonts.type.helveticaNeueLight,
		fontSize: Fonts.moderateScale(15),
	},

	segmentTabSec: {
		padding: 0,
		marginTop: 0,
		backgroundColor: Colors.snow,
		borderWidth: 1,
		borderRadius: 5,
		borderColor: '#0691ce',
		width: Metrics.WIDTH * 0.94,
		height: 32,
		alignSelf: 'center',
		marginTop: Metrics.WIDTH * 0.02,
	},

	forgotPasswordBg: {
		alignSelf: 'flex-end',
		marginTop: Metrics.HEIGHT * 0.015,
		marginRight: Metrics.HEIGHT * 0.015,
	},

	commentBtn: {
		flex: 1,
		paddingVertical: 7,
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: colors.backgroundcolor
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

	subRow: {
		flex: 1,
		// width: Metrics.WIDTH * 0.8,
		borderRadius: 10,
		padding: 10,
		marginLeft: 10,
	},

	headerContent: {
		// width: Metrics.WIDTH * 0.7,
		flexDirection: "row",
		// alignItems: "center",
		// justifyContent: "space-between"
	},

	headerText: {
		width: Metrics.WIDTH * 0.78,
		fontFamily: Fonts.type.sfuiDisplaySemibold,
		fontSize: Fonts.moderateScale(17),
		color: Colors.black
	},

	headerRight: {
		flexDirection: "row",
		alignItems: "center"
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
		fontFamily: Fonts.type.sfuiDisplayRegular,
		fontSize: Fonts.moderateScale(14),
		color: "black",
		textAlign: "left"
	},

	vids: {
		paddingBottom: 10,
		width: Metrics.WIDTH,
		alignItems: 'center',
		backgroundColor: '#fff',
		justifyContent: 'center',
		// borderBottomWidth: 0.6,
		// borderColor: '#aaa'
	},

	joinBtn: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.backgroundcolor
	},

	joinText: {
		// flex:1,
		textAlign: 'center',
		// justifyContent: 'center',
		// alignItems: 'center',
		color: 'white',
		fontSize: 16
	},

	upgradeText: {
		marginTop: 10,
		textAlign: 'center',
		color: colors.backgroundcolor,
		width: Metrics.WIDTH * 0.7,
		fontFamily: Fonts.type.sfuiDisplaySemibold,
		fontSize: Fonts.moderateScale(17),
	},

	upgrade: {
		backgroundColor: colors.backgroundcolor,
		width: Metrics.WIDTH * 0.3,
		alignSelf: 'center',
		marginBottom: Metrics.WIDTH * 0.02,
		height: Metrics.HEIGHT * 0.06,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
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

	HorizontalDivider: {
		backgroundColor: "#d4d4d4",
		height: 1,
	},

	avatar: {
		height: 40,
		width: 40,
		borderRadius: 200,
		// marginRight: 10,
		alignItems: "center"
	},

	fab: {
		position: 'absolute',
		marginRight: Metrics.WIDTH * 0.03,
		marginBottom: Metrics.WIDTH * 0.05,
		backgroundColor: "#1188DA",
		right: 0,
		bottom: 0,
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
		textAlign: 'center',
		fontSize: 18
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

	textareaContainer: {
		height: '100%',
		padding: 5,
		backgroundColor: '#F5FCFF',
	},
	textarea: {
		textAlignVertical: 'top',  // hack android
		height: '100%',
		fontSize: 16,
		color: '#333',
	},
});

export default styles;
