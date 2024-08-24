import axios from '../axios'
import IApiResponse from "@/interface/Extras/IApiResponse";

export class ChatService {

     public async sendMessage(messageObject: any): Promise<any> {
          try {
               const response = await axios.post(`/messages/send`, messageObject)
               return response.data
          } catch ({ response }) {
               return response
          }
     }

     public async deleteMessageAsAdmin(chatid: number): Promise<any> {
          try {
               const response = await axios.delete(`/messages/delete/${chatid}`)
               return response.data
          } catch ({ response }) {
               return response
          }
     }

     /**
      * ROOM 1 : SOLO
      * ROOM 2 : RANKED
      * ROOM 3 : TEAMS
      */

     public async getMessageUnranked(room: number): Promise<any> {
          const { data } = await axios.get(`/messages/${room}`)
          return data;
     }

     /**
      * TODO GET MESSAGES RANKED + TEAMS
      */


}

export const chatService = new ChatService();