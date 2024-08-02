import { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "./useStore";
import { sendConsumerSDP } from "./http/http.service";
import { message } from "antd";
import Chat from "./Chat";
import { Socket, io } from "socket.io-client";

const Student = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const studentApiResponse = useStore(state => state.studentApiResponse);
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [chatMessages, setChatMessages] = useState<string[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const [commentsEnabled, setCommentsEnabled] = useState<boolean>(true);

    useEffect(() => {
        if (socketRef.current == null) socketRef.current = io("http://localhost:5000");
        init();
    }, []);

    useEffect(() => {
        if (!studentApiResponse) {
            navigate('/');
        }
    }, [studentApiResponse, navigate]);

    useEffect(() => {
        if (roomId && socketRef.current) {
            socketRef.current.on('connect', () => {
                console.log('hello2')
                if (socketRef.current) {
                    socketRef.current.emit("join-room", roomId, "student");

                    socketRef.current.on("chat-message", (message: string) => {
                        setChatMessages((prevMessages) => [...prevMessages, message]);
                    });
                }
                if (socketRef.current) {
                    socketRef.current.on("chat-message", (message: string) => {
                        console.log(message)
                        setChatMessages((prevMessages) => [...prevMessages, message]);
                    });
                }

                if (socketRef.current) {
                    socketRef.current.on("comments-status", (status: boolean) => {
                        setCommentsEnabled(status);
                    });
                }

                if (socketRef.current) {
                    socketRef.current.on("force-disconnect", () => {
                        socketRef.current?.disconnect();
                        message.warning("کلاس به پایان رسیده است .");
                        navigate("/");
                    });
                }
                if (socketRef.current) {
                    socketRef.current.on("disconnect", () => {
                        console.log("Disconnected from server");
                    });
                }
            })
        }
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [navigate, roomId]);

    const init = async () => {
        const peer = createPeer();
        peer.addTransceiver("video", { direction: "recvonly" });
    };

    const createPeer = () => {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stunprotocol.org"
                }
            ]
        });
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
        return peer;
    };

    const handleNegotiationNeededEvent = async (peer: RTCPeerConnection) => {
        try {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);
            const payload = {
                sdp: peer.localDescription!,
                roomId: roomId!,
            };

            const { sdp } = await sendConsumerSDP(payload);
            const desc = new RTCSessionDescription(sdp);
            peer.setRemoteDescription(desc).catch(e => console.log(e));
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                message.error("کلاس مورد نظر موجود نمی باشد");
                navigate('/');
            } else {
                console.error('Error during negotiation:', error);
            }
        }
    };

    const handleTrackEvent = (e: RTCTrackEvent) => {
        if (videoRef.current) {
            videoRef.current.srcObject = e.streams[0];
        }
    };

    const handleSendMessage = (messageText: string) => {
        const sendername = "دانشجو";
        const message = messageText;
        if (socketRef.current) {
            socketRef.current.emit("chat-message", roomId, sendername, message);
        }
    };

    return (
        <div className="grid grid-cols-5 grid-rows-5 h-screen">
            <div className="col-span-2 row-span-5 border">
                <Chat chatMessages={chatMessages} handleSendMessage={handleSendMessage} commentsEnabled={commentsEnabled} />
            </div>
            <div className="col-span-3 row-span-5 col-start-3 flex items-center justify-center border">
                <video id="video" ref={videoRef} autoPlay></video>
            </div>
        </div>

    );
};

export default Student;
