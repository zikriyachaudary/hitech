// File: useWebRTC.js (React Native hook with ICE queue fix)

import { useEffect, useRef, useState } from "react";
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
  MediaStream,
} from "react-native-webrtc";
import io from "socket.io-client";

const socket = io("ws://192.168.1.108:3000", {
  transports: ["websocket"],
  forceNew: true,
});

export const useWebRTC = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [myId, setMyId] = useState(null);
  const [remoteId, setRemoteId] = useState(null);
  const pc = useRef(null);
  const remoteMediaStream = useRef(new MediaStream());
  const pendingCandidates = useRef([]);

  useEffect(() => {
    socket.on("connect", () => {
      setMyId(socket.id);
      console.log("✅ Connected as", socket.id);
      socket.emit("join-room", { id: socket.id, room: "room123" });
    });

    socket.on("user-joined", ({ id }) => {
      if (id !== socket.id) {
        console.log("🔗 New user joined:", id);
        console.log("📡 Connecting to:", id);
        setRemoteId(id);
      }
    });

    socket.on("offer", async ({ sdp, caller }) => {
      console.log("📨 Received offer from", caller);
      setRemoteId(caller);
      await createPeer(false);
      await pc.current.setRemoteDescription(new RTCSessionDescription(sdp));

      // Apply queued ICE candidates
      for (const candidate of pendingCandidates.current) {
        try {
          await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("✅ Applied queued ICE");
        } catch (err) {
          console.error("Failed to apply queued ICE", err);
        }
      }
      pendingCandidates.current = [];

      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      socket.emit("answer", { sdp: answer, target: caller });
    });

    socket.on("answer", async ({ sdp }) => {
      console.log("📨 Received answer");
      await pc.current.setRemoteDescription(new RTCSessionDescription(sdp));

      // Apply queued ICE candidates
      for (const candidate of pendingCandidates.current) {
        try {
          await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("✅ Applied queued ICE");
        } catch (err) {
          console.error("Failed to apply queued ICE", err);
        }
      }
      pendingCandidates.current = [];
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      console.log("❄️ Received ICE candidate");
      if (pc.current?.remoteDescription) {
        try {
          await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("ICE error", e);
        }
      } else {
        console.log("🕓 Queuing ICE candidate");
        pendingCandidates.current.push(candidate);
      }
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (remoteId && !pc.current) {
      console.log("⚡ remoteId just set:", remoteId);
      createPeer(true);
    }
  }, [remoteId]);

  const startLocalStream = async () => {
    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    console.log("🎙️ Local tracks:", stream.getTracks());
    setLocalStream(stream);
    return stream;
  };

  const createPeer = async (isCaller) => {
    pc.current = new RTCPeerConnection();
    const local = await startLocalStream();

    local.getTracks().forEach((track) => {
      console.log("🎙️ Adding local track:", track.kind);
      pc.current.addTrack(track, local);
    });

    pc.current.ontrack = (event) => {
      console.log("📥 ontrack fired:", event.track.kind);
      const inboundStream = event.streams?.[0];
      if (inboundStream) {
        setRemoteStream(inboundStream);
        console.log("🎥 Set remote stream:", inboundStream.getTracks());
      }
    };

    pc.current.onicecandidate = ({ candidate }) => {
      if (candidate && remoteId) {
        console.log("❄️ Sending ICE candidate");
        socket.emit("ice-candidate", { candidate, target: remoteId });
      }
    };

    if (isCaller && remoteId) {
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      console.log("🚀 Sending offer to", remoteId);
      socket.emit("offer", { sdp: offer, target: remoteId });
    }
  };

  return { localStream, remoteStream, myId };
};
