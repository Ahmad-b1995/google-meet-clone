import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Input, Button, Typography, message } from "antd";
import { startCall } from "./http/http.service";
import { useStore } from "./useStore";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface StartSessionFormData {
    password: string;
}

const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 7);
}

const StartSession: React.FC<{ role: string }> = ({ role }) => {
    const { handleSubmit, control } = useForm<StartSessionFormData>();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const setTeacherApiResponse = useStore(state => state.setTeacherApiResponse);
    const setStudentApiResponse = useStore(state => state.setStudentApiResponse);
    const navigate = useNavigate();

    const start: SubmitHandler<StartSessionFormData> = async (data) => {
        setLoading(true);
        try {
            const { password } = data;
            const roomId = generateRoomId();
            const response = await startCall(password);

            if (response?.result === "success" && response.access) {
                if (role === 'teacher') {
                    setTeacherApiResponse(response);
                    navigate(`/teacher/${roomId}`);
                } else {
                    setStudentApiResponse(response);
                    navigate(`/student/${roomId}`);
                }
            } else {
                setError("دسترسی مجاز نیست");
                message.error("دسترسی مجاز نیست");
            }
        } catch (error) {
            setError("خطایی رخ داده است");
            message.error("خطایی رخ داده است");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Text>شروع به جلسه</Text>
            <form className="mt-2" onSubmit={handleSubmit(start)}>
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => <Input.Password placeholder="رمز عبور" {...field} className="mt-1" />}
                />
                {error && <Text className="text-red-400">{error}</Text>}
                <Button type="primary" className="mt-3" htmlType="submit" loading={loading}>
                    برو
                </Button>
            </form>
        </div>
    );
};

export default StartSession;
