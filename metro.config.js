const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Use react-native-agora stub for Web + SSR (node)
// Platform can be 'web', 'node', or null during SSR render
const agoraMock = path.resolve(__dirname, "mocks/react-native-agora.js");

const originalResolver = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isNative = platform === "android" || platform === "ios";

  if (!isNative && moduleName === "react-native-agora") {
    return {
      filePath: agoraMock,
      type: "sourceFile",
    };
  }

  if (originalResolver) {
    return originalResolver(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
