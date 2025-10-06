const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

const { assetExts, sourceExts } = config.resolver;

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...config.resolver,
  assetExts: assetExts.filter((ext) => ext !== "svg"), 
  sourceExts: [...sourceExts, "svg"], 
};

module.exports = withNativeWind(config, { input: "./global.css" });
