import React from "react";
import { Button, Typography } from "antd";

const { Text } = Typography;

const RoleSelection: React.FC<{ setRole: (role: string) => void }> = ({ setRole }) => {
    const selectRole = (selectedRole: string) => {
        setRole(selectedRole);
    };

    return (
        <div>
            <Text>دانش آموز هستید یا معلم؟</Text>
            <div className="flex items-center justify-start gap-2 mt-2">
                <Button type="primary" onClick={() => selectRole("student")}>
                    دانش آموز
                </Button>
                <Button type="default" onClick={() => selectRole("teacher")}>
                    معلم
                </Button>
            </div>
        </div>
    );
};

export default RoleSelection;
