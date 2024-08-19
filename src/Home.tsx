import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "antd";
import RoleSelection from "./RoleSelection";
import JoinSession from "./JoinSession";
import StartSession from "./StartSession";
import Webcam from "react-webcam";

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const { url } = useParams<{ url: string }>();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (url) {
      setRole("student");
    }
  }, [url]);

  return (
    <div className="flex flex-col-reverse lg:flex-row w-full items-start lg:items-center justify-center h-screen gap-14 lg:gap-20 px-3">
      <div>
        <div className="w-full max-w-96">
          <Title level={1}>جلسه ویدیویی</Title>
          <Paragraph>کنفرانس ویدیویی بین دانشجویان و اساتید</Paragraph>
        </div>
        <div>
          {!role ? (
            <RoleSelection setRole={setRole} />
          ) : role === "student" ? (
            <JoinSession role={role} prefilledUrl={url} />
          ) : (
            <StartSession role={role} />
          )}
        </div>
      </div>
      <Webcam audio={false} width={880} screenshotFormat="image/jpeg" />
    </div>
  );
};

export default Home;
