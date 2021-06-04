//消息相关接口
import Service from './service';

class MessageService extends Service{
	
	static query(params,callback){
	    let url = `/message/query`;
	    if(params){
	        url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
	    }
	    super.get(url,callback);
	}
	static signReaded(params,callback){
	    let url = `/message/read`;
		if(params){
		    url += '?id='+params 
		}
	    super.put(url,{},callback);
	}
}

export default MessageService;