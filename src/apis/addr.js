//房屋信息相关接口
import Service from './service';

class AddrService extends Service {

    static getOpen(callback){
        let url = `/addr/open`;
        super.get(url,callback);
    }
	
	static addrQuery(params,callback){
	    let url = `/addr/query`;
		if(params){
		    url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
		}
	    super.get(url,callback);
	}
}

export default AddrService;