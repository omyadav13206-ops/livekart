/**
 * Web/SSR stub for react-native-agora
 * Agora is a native-only module — to prevent crashes on web/node.
 */

const noop = () => {};
const noopAsync = async () => {};

const createAgoraRtcEngine = () => ({
  initialize: noop,
  registerEventHandler: noop,
  unregisterEventHandler: noop,
  setChannelProfile: noop,
  setClientRole: noop,
  enableVideo: noop,
  disableVideo: noop,
  startPreview: noop,
  stopPreview: noop,
  joinChannel: noopAsync,
  leaveChannel: noop,
  release: noop,
  muteLocalAudioStream: noop,
  muteLocalVideoStream: noop,
});

const ChannelProfileType = {
  ChannelProfileCommunication: 0,
  ChannelProfileLiveBroadcasting: 1,
};

const ClientRoleType = {
  ClientRoleBroadcaster: 1,
  ClientRoleAudience: 2,
};

const RtcSurfaceView = () => null;
const RtcTextureView = () => null;

module.exports = {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  RtcSurfaceView,
  RtcTextureView,
};
