import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const type = {
  base: "Avenir-Book",
  bold: "Avenir-Black",
  emphasis: "HelveticaNeue-Italic",
  helveticaNeueLight: "HelveticaNeue-Light",
  helveticaNeueBold: "HelveticaNeue-Bold",
  helveticaNeueRegular: "HelveticaNeue-Regular",
  helveticaRegular: "Helvetica",
  helveticaBold: "Helvetica-Bold",
  robotoRegular: "Roboto-Regular",
  robotoMedium: "Roboto-Medium",
  LatoBold: "Lato-Bold",
  LatoRegular: "Lato-Regular",
  RalewayBold: "Raleway-Bold",
  SFProTextBold: "SFProText-Bold",
  SFProTextMedium: "SFProText-Medium",
  SFProTextRegular: "SFProText-Regular",
  SFProTextSemibold: "SFProText-Semibold"
};

const size = {
  h1: 38,
  h2: 34,
  h3: 30,
  h4: 26,
  h5: 20,
  h6: 19,
  input: 18,
  regular: 17,
  medium: 14,
  small: 12,
  tiny: 8.5
};

const style = {
  h1: {
    fontFamily: type.base,
    fontSize: size.h1
  },
  h2: {
    fontWeight: "bold",
    fontSize: size.h2
  },
  h3: {
    fontFamily: type.emphasis,
    fontSize: size.h3
  },
  h4: {
    fontFamily: type.base,
    fontSize: size.h4
  },
  h5: {
    fontFamily: type.base,
    fontSize: size.h5
  },
  h6: {
    fontFamily: type.emphasis,
    fontSize: size.h6
  },
  normal: {
    fontFamily: type.base,
    fontSize: size.regular
  },
  description: {
    fontFamily: type.base,
    fontSize: size.medium
  }
};

export default {
  type,
  size,
  style,
  scale,
  verticalScale,
  moderateScale
};
