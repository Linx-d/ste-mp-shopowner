//客户信息相关接口
import Service from './service';


class ClientService extends Service {

	// report
	static all(params, callback) {
		let url = `/rest/clients`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}
	static save(data, callback) {
		let url = `/rest/clients`;
		super.post(url, data, callback);
	}

	// id
	static byId(params, callback) {
		let url = `/rest/clients/${params}`;
		super.get(url, callback);
	}
	static putById(params, data, callback) {
		let url = `/rest/clients/${params}`;
		super.put(url, data, callback);
	}
	static saveById(params, data, callback) {
		let url = `/rest/clients/${params}`;
		super.patch(url, data, callback);
	}
	static delById(params, callback) {
		let url = `/rest/clients/${params}`;
		super.del(url, callback);
	}


	static includeId(params, callback) {
		let url = `/rest/clients/${params.id}/${params.name}`;
		super.request(url, params.method, params.data, params.header, callback);
	}


	static byBrokerId(params,callback){
		let url =`/rest/clients/search/findByBrokerId`
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	static query(params,callback){
		let url =`/client/query`
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	static byBrokerIdAndKeyword(params,callback){
		let url =`/rest/clients/search/findByBrokerIdAndKeyword`
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	static byBrokerIdAndPhone(brokerId, phone, callback) {
		let url = `/rest/clients/search/findByBrokerIdAndPhone?brokerId=${brokerId}&phone=${phone}`;
		super.get(url, callback);
	}
}

export default ClientService;
