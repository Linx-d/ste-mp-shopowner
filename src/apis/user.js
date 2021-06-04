import Service from './service';
import base64 from '../plugins/base64'
import { APP_ID } from '@/common/const';

class UserService extends Service{

    // openid
    // wx
    // wx
    // wx

    static getWxInfo(code,callback){
        let url = `/wx/new/login/${code}?appid=${APP_ID}`;
        this.get(url, callback);
    }

    // 获取当前sessino 信息
    static getSession(code, callback) {
        let url = `/wx/session/${code}`;
        this.get(url, callback);
    }
    // 解密用户
    static decrypteUserInfo(key, raw, iv, callback) {
        let url = `/wx/user/decrypt?sessionKey=${base64.encode(key)}&iv=${base64.encode(iv)}`;
        this.post(url, raw, callback);
    }
    static geWxUserBySessionKey(key, callback) {
        let url = `/wx/user/session?key=${key}`;
        this.get(url, callback);
    }

    // wx user
    // wx user
    // wx user

    static saveWxUser(payload,callback){
        let url = `/wx/new/user`;
        this.post(url,payload,callback);
    }


    // user
    // user
    // user
    static getUserByOpenid(openid, callback) {
        let url = `/rest/brokers/search/findByWxOpenId?openId=${openid}&projection=withWx`;
        this.get(url, callback);
    }

    static checkInviteCode(code,callback){
        let url = `/invite-code/check?code=${code}`;
        this.get(url,callback);
    }

    static decryptPhone(key,raw,iv,callback){
        let url = `/wx/new/user/decrypt/phone?sessionKey=${base64.encode(key)}&iv=${base64.encode(iv)}&appid=${APP_ID}`;
        this.post(url, raw, callback);
    }

    static registerOwner(payload,callback){
        let url = `/shopOwner/register`;
        this.post(url,payload,callback);
    }
	
	static brokerUpdate(payload,callback){
	    let url = `/broker/update`;
	    this.put(url,payload,callback);
	}

    static getTokenByOpenId(openId,callback){
        let url = `/user/token/wx?openId=${openId}`;
        this.post(url,null,callback)
    }

    static getBrokerInfo(callback){
        let url = `/broker/me`;
        this.get(url,callback)
    }
    
    static byIdBroker(id,callback){
        let url = `/rest/brokers/${id}`
        this.get(url,callback)
    }
	
	static byIdCheckBroker(id,callback){
	    let url = `/broker/check?brokerId=${id}`
	    this.get(url,callback)
	}

    static byId(userId,callback){
        let url = `/rest/users/${userId}`
        this.get(url,callback)
    }

    static update(data,callback){
        let url =`/user/update`
        super.put(url,data,callback)
    }
}

export default UserService;