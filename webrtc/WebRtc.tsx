import React, { useEffect } from "react";
import { View } from "react-native";
import { RTCView } from "react-native-webrtc";
import { useWebRTC } from "./useWebRTC";

export default function WebRtc() {
  const { localStream, remoteStream } = useWebRTC();

  useEffect(() => {
    console.log("remote stream ---  ", remoteStream);
  }, [remoteStream]);

  return (
    <View style={{ flex: 1, backgroundColor: "blue" }}>
      {localStream && (
        <RTCView
          streamURL={localStream.toURL()}
          style={{ flex: 1, backgroundColor: "red" }}
        />
      )}
      {remoteStream && (
        <RTCView
          key={remoteStream?.toURL()} // forces React to remount the component
          streamURL={remoteStream?.toURL()}
          style={{ flex: 1, backgroundColor: "green" }}
        />
      )}
    </View>
  );
}
