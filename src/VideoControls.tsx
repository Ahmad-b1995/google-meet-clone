import React from 'react';
import { Button, message } from 'antd';
import { CopyOutlined, DesktopOutlined, CameraOutlined, PhoneOutlined, CommentOutlined } from '@ant-design/icons';

interface VideoControlProps {
    roomId: string;
    handleShareScreen: () => void;
    isScreenSharing: boolean;
    handleHangup: () => void;
    handleToggleComments: () => void;
    commentsEnabled: boolean;
}

const VideoControl: React.FC<VideoControlProps> = ({ roomId, handleShareScreen, isScreenSharing, handleHangup, handleToggleComments, commentsEnabled }) => {
    const copyRoomIdToClipboard = () => {
        const text = `${window.location.origin}/join/${roomId}`;
        navigator.clipboard.writeText(text)
            .then(() => {
                message.success("شناسه کلاس کپی شد");
            })
            .catch(err => {
                message.error("دسترسی مجاز نیست");
                console.error('Could not copy text: ', err);
            });
    };

    return (
        <div className="flex items-center justify-center gap-1">
            <Button onClick={copyRoomIdToClipboard} icon={<CopyOutlined />} />
            <Button icon={isScreenSharing ? <CameraOutlined /> : <DesktopOutlined />} onClick={handleShareScreen} />
            <Button onClick={handleToggleComments} icon={<CommentOutlined />} type={commentsEnabled ? "default" : "primary"} />
            <Button onClick={handleHangup} icon={<PhoneOutlined />} danger />
        </div>
    );
};

export default VideoControl;
