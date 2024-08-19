import React from 'react';
import { Button, Modal as AntdModal } from 'antd';

interface ApprovalModalProps {
    visible: boolean;
    currentRequestId: string | null;
    approveUser: (userId: string) => void;
    denyUser: (userId: string) => void;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ visible, currentRequestId, approveUser, denyUser }) => (
    <AntdModal
        title="درخواست پیوستن کاربر"
        visible={visible}
        onCancel={() => denyUser(currentRequestId!)}
        footer={[
            <Button key="deny" onClick={() => denyUser(currentRequestId!)}>
                رد کردن
            </Button>,
            <Button key="allow" type="primary" onClick={() => approveUser(currentRequestId!)}>
                تایید
            </Button>,
        ]}
    >
        <p>کاربر {currentRequestId} می‌خواهد بپیوندد. آیا تایید می‌کنید؟</p>
    </AntdModal>
);

export default ApprovalModal;
