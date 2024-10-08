import axios from "axios";
import { IApiResponse } from "../types";

const API_URL = "https://bitfa.io/api";
const API_URL2 = "https://api.bitfa.com";

export const joinCall = async (mobile: number): Promise<IApiResponse> => {
  const response = await axios.get<IApiResponse>(`${API_URL}/ask-join`, {
    params: { mobile },
  });
  return response.data;
};

export const startCall = async (password: string): Promise<IApiResponse> => {
  const response = await axios.get<IApiResponse>(`${API_URL}/ask-start`, {
    params: { token: password },
  });
  return response.data;
};

interface SDPResponse {
  sdp: RTCSessionDescriptionInit;
}

export const sendBroadcastSDP = async (payload: {
  sdp: RTCSessionDescriptionInit;
  roomId: string;
}): Promise<SDPResponse> => {
  const response = await axios.post<SDPResponse>(
    `${API_URL2}/broadcast`,
    payload
  );
  return response.data;
};

export const sendConsumerSDP = async (payload: {
  sdp: RTCSessionDescriptionInit;
  roomId: string;
}): Promise<SDPResponse> => {
  const response = await axios.post<SDPResponse>(
    `${API_URL2}/consumer`,
    payload
  );
  return response.data;
};
