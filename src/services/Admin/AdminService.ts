import axios from '../axios'

export class AdminService{

    public async getServerList(): Promise<any>{
            const {data} = await axios.get(`/admin/servers`)
            return data;
    }
    public async getServerListPublic(): Promise<any>{
        const {data} = await axios.get(`/admin/servers_public`)
        return data;
    }
    public async deleteServer(serverid : number) : Promise<any>{
        const {data} = await axios.delete(`/admin/servers/${serverid}`)
        return data;
    }
    public async newServer(ip : string, descripcion : string, port : number) : Promise<any>{
        const {data} = await axios.post(`/admin/servers/add`,
            {
                ip,
                descripcion,
                port
            })
        return data;
    }


}

export const adminService = new AdminService();