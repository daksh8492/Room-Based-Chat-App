import { httpClient } from "../config/AxiosHelper"

export const createRoomAPI = async (roomDetail) => {
    const response = await httpClient.post(`/api/v1/rooms`,roomDetail,{ headers: { "Content-Type": "application/json" } });
    return response.data;
}

export const joinRoomAPI = async (roomId) => {
    const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
    return response.data;
}

export const getMessagesAPI = async (roomId,size=50,page=0) => {
    const response = await httpClient.get(`/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`);
    return response.data;
}