import { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "./useStore";
import { sendBroadcastSDP } from "./http/http.service";
import { List, message } from "antd";
import VideoControl from "./VideoControls";
import Chat from "./Chat";
import { Socket, io } from "socket.io-client";


const Teacher = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const teacherApiResponse = useStore(state => state.teacherApiResponse);
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [students, setStudents] = useState<string[]>([]);
    const [chatMessages, setChatMessages] = useState<string[]>([]);
    const peerRef = useRef<RTCPeerConnection | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
    const [commentsEnabled, setCommentsEnabled] = useState<boolean>(true);

    useEffect(() => {
        if (socketRef.current == null) socketRef.current = io("http://localhost:5000");
        init();
    }, []);



    useEffect(() => {
        if (!teacherApiResponse) {
            navigate('/');
        }
    }, [teacherApiResponse, navigate]);

    useEffect(() => {
        if (roomId && socketRef.current) {
            socketRef.current.on('connect', () => {
                if (socketRef.current) {
                    socketRef.current.emit("join-room", roomId, "teacher");

                    socketRef.current.on("student-list", (students: string[]) => {
                        setStudents(students);
                    });
                }
                if (socketRef.current) {
                    socketRef.current.on("student-list", (students: string[]) => {
                        setStudents(students);
                    });
                }
                if (socketRef.current) {
                    socketRef.current.on("student-joined", (student: { id: string }) => {
                        setStudents((prevStudents) => [...prevStudents, student.id]);
                    });
                }

                if (socketRef.current) {
                    socketRef.current.on("chat-message", (message: string) => {
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

            })
        }
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [navigate, roomId]);


    const init = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        const peer = createPeer();
        stream.getTracks().forEach(track => peer.addTrack(track, stream));
        peerRef.current = peer;
    };

    const createPeer = () => {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stunprotocol.org"
                }
            ]
        });
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
        return peer;
    };

    const handleNegotiationNeededEvent = async (peer: RTCPeerConnection) => {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        const payload = {
            sdp: peer.localDescription!,
            roomId: roomId!
        };

        const { sdp } = await sendBroadcastSDP(payload);
        const desc = new RTCSessionDescription(sdp!);
        peer.setRemoteDescription(desc).catch(e => console.log(e));
    };

    const handleShareScreen = async () => {
        if (isScreenSharing) {
            // Switch back to camera
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);

            const videoTrack = stream.getVideoTracks()[0];
            const sender = peerRef.current?.getSenders().find(s => s.track?.kind === "video");
            if (sender) {
                sender.replaceTrack(videoTrack);
            }

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } else {
            // Share screen
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

                const videoTrack = screenStream.getVideoTracks()[0];
                const sender = peerRef.current?.getSenders().find(s => s.track?.kind === "video");
                if (sender) {
                    sender.replaceTrack(videoTrack);
                }

                // Stop the original video stream
                localStream?.getVideoTracks().forEach(track => track.stop());

                if (videoRef.current) {
                    videoRef.current.srcObject = screenStream;
                }
            } catch (error) {
                message.error("Screen sharing failed");
                console.error("Error sharing screen: ", error);
                return;
            }
        }

        setIsScreenSharing(!isScreenSharing);
    };

    const handleToggleComments = () => {
        if (socketRef.current) {
            socketRef.current.emit("toggle-comments", roomId);
        }
    };

    const handleSendMessage = (messageText: string) => {
        const sendername = "استاد";
        const message = messageText
        if (socketRef.current) {
            socketRef.current.emit("chat-message", roomId, sendername, message);
        }
    };

    const handleHangup = () => {
        if (socketRef.current) {
            socketRef.current.emit("hangup", roomId);
            navigate("/");
        }
    };

    return (
        <div className="grid grid-cols-8 grid-rows-10 h-screen">
            <div className="col-span-2 row-span-5 p-2 border">
                <List
                    className='w-full h-full'
                    size="small"
                    header={<div>لیست دانشجویان</div>}
                    bordered
                    dataSource={students}
                    renderItem={(student, i) => <List.Item key={i}>{student}</List.Item>}
                />
            </div>
            <div className="col-span-6 row-span-1 col-start-3 row-start-10 flex items-center justify-center border">
                <VideoControl
                    roomId={roomId!}
                    handleShareScreen={handleShareScreen}
                    isScreenSharing={isScreenSharing}
                    handleHangup={handleHangup}
                    handleToggleComments={handleToggleComments}
                    commentsEnabled={commentsEnabled}
                />
            </div>
            <div className="col-span-6 row-span-9 col-start-3 row-start-1 flex items-center justify-center border">
                <video id="video" className="h-full" ref={videoRef} autoPlay />
            </div>
            <div className="col-span-2 row-span-5 col-start-1 row-start-6 border">
                <Chat chatMessages={chatMessages} handleSendMessage={handleSendMessage} commentsEnabled={commentsEnabled} />
            </div>
        </div>
    );
};

export default Teacher;
