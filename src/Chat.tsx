import { Button, Input, List } from 'antd';
import React, { useState } from 'react';

interface ChatProps {
    chatMessages: string[];
    handleSendMessage: (message: string) => void;
    commentsEnabled: boolean;
}

const Chat: React.FC<ChatProps> = ({ chatMessages, handleSendMessage, commentsEnabled }) => {
    const [chatInput, setChatInput] = useState<string>("");

    const handleMessageSend = () => {
        if (chatInput.trim()) {
            handleSendMessage(chatInput);
            setChatInput("");
        }
    };

    return (
        <div className='p-2 h-full flex flex-col items-center justify-between'>
            <List
                className='w-full h-full'
                size="small"
                header={<div>چت</div>}
                bordered
                dataSource={chatMessages}
                renderItem={(message, i) => <List.Item key={i}>{message}</List.Item>}
            />

            <form className='mt-2 flex items-center justify-center gap-2 w-full' onSubmit={(e) => { e.preventDefault(); handleMessageSend() }}>
                <Input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="پیام خود را بنویسید"
                    className='w-full'
                    disabled={!commentsEnabled}
                />
                <Button onClick={handleMessageSend} htmlType="submit" disabled={!commentsEnabled}>ارسال</Button>
            </form>
        </div>
    );
};

export default Chat;
