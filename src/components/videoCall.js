import React, { useEffect, useRef, useState, useCallback } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const VideoCall = () => {
  const [peerConnection, setPeerConnection] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isPeerConnectionClosed, setIsPeerConnectionClosed] = useState(false);

  useEffect(() => {
    const socket = new SockJS("https://ws-backend-btq4.onrender.com/ws");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setStompClient(client);
      client.subscribe("/topic/signals", (message) => {
        const signalMessage = JSON.parse(message.body);
        handleSignalMessage(signalMessage);
      });
    });

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignalMessage({
          type: "ice-candidate",
          data: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    setPeerConnection(pc);

    return () => {
      if (client) client.disconnect();
      if (pc) {
        pc.close();
        setIsPeerConnectionClosed(true);
      }
    };
  }, []);

  const handleSignalMessage = useCallback(
    async (message) => {
      if (!peerConnection || isPeerConnectionClosed) return;

      try {
        switch (message.type) {
          case "offer":
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(message.data)
            );
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            sendSignalMessage({ type: "answer", data: answer });
            break;
          case "answer":
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(message.data)
            );
            break;
          case "ice-candidate":
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(message.data)
            );
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Error handling signal message:", error);
      }
    },
    [peerConnection, isPeerConnectionClosed]
  );

  const sendSignalMessage = useCallback(
    (message) => {
      if (stompClient && stompClient.connected) {
        stompClient.send(
          "/app/signal",
          {},
          JSON.stringify({ ...message, sender: "user1", receiver: "user2" })
        );
      } else {
        console.error("STOMP client is not connected.");
      }
    },
    [stompClient]
  );

  const startCall = async () => {
    if (!peerConnection || isPeerConnectionClosed) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = stream;
    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    sendSignalMessage({ type: "offer", data: offer });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <video ref={localVideoRef} autoPlay muted style={{ width: "300px" }} />
        <video ref={remoteVideoRef} autoPlay style={{ width: "300px" }} />
      </div>
      <button onClick={startCall}>Start Call</button>
    </div>
  );
};

export default VideoCall;
