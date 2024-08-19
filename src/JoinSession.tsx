import React, { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Input, Button, Typography, message } from "antd";
import { joinCall } from "./http/http.service";
import { useStore } from "./useStore";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface JoinSessionFormData {
    url: string;
    phone?: number;
    roomId: string;
}

const JoinSession: React.FC<{ role: string; prefilledUrl?: string }> = ({ role, prefilledUrl }) => {
    const { handleSubmit, control, setValue } = useForm<JoinSessionFormData>();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const setTeacherApiResponse = useStore(state => state.setTeacherApiResponse);
    const setStudentApiResponse = useStore(state => state.setStudentApiResponse);
    const navigate = useNavigate();

    useEffect(() => {
        if (prefilledUrl) {
            setValue("roomId", prefilledUrl);
        }
    }, [prefilledUrl, setValue]);

    const join: SubmitHandler<JoinSessionFormData> = async (data) => {
        setLoading(true);
        try {
            const { phone, roomId } = data;
            const response = await joinCall(phone!);

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
            <Text>پیوستن به جلسه</Text>
            <form className="mt-2" onSubmit={handleSubmit(join)}>
                <Controller
                    name="roomId"
                    control={control}
                    render={({ field }) => <Input placeholder="شناسه کلاس" {...field} />}
                />
                <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => <Input placeholder="شماره تلفن" type="number" {...field} />}
                />
                {error && <Text className="text-red-400">{error}</Text>}
                <Button type="primary" className="mt-3" htmlType="submit" loading={loading}>
                    برو
                </Button>
            </form>
        </div>
    );
};

export default JoinSession;
