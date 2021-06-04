//报备信息相关接口
import Service from './service';


class ReportService extends Service {

	// report
	static all(params, callback) {
		let url = `/rest/reports`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	static saveReport(data, callback) {
		let url = `/rest/reports`
		super.post(url, data, callback)
	}
	// id
	static byId(id, callback) {
		let url = `/rest/reports/${id}?projection=withAll`;
		super.get(url, callback);
	}
	static putById(params, data, callback) {
		let url = `/rest/reports/${params}`;
		super.put(url, data, callback);
	}
	static saveById(params, callback) {
		let url = `/rest/reports/${params.id}`;
		super.patch(url, params.data, callback);
	}
	static delById(params, callback) {
		let url = `/rest/reports/${params}`;
		super.del(url, callback);
	}

	// include
	static includeId(params, callback) {
		let url = `/rest/reports/${params.id}/${params.name}`;
		super.request(url, params.method, params.data, params.header, callback);
	}

	// report-status
	static byStatus(params, callback) {
		let url = `/rest/reports/search/findByStatus`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	static query(params, callback) {
		let url = `/report/query`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	// report-HouseId
	static byHouseId(params, callback) {
		let url = `/rest/reports/search/findByByTaskHouseId`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	// qrCode
	static qrCode(id, callback) {
		let url = `/report/${id}/qr`
		super.get(url, callback)
	}
	
	static getStat(params, callback) {
		let url = `/report/stat/broker`
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback)
	}
	static getStatDashboard(params, callback) {
		let url = `/report/stat/broker/dashboard`
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback)
	}
	static dashboardNoRepeat(params, callback) {
		let url = `/report/stat/broker/dashboardNoRepeat`
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback)
	}
	// report-TaskId
	static byTaskId(params, callback) {
		let url = `/rest/reports/search/findByTaskId`;
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
	}

	static byStatusAndBrokerId(params, callback) {
		let url = `/rest/reports/search/findByStatusAndBrokerId`
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback)
	}

	//上传证据链
	static putEvidence(id,data,callback){
		let url = `/rest/reports/${id}/evidence`
		super.put(url,data,callback,{
			'Content-Type':'text/uri-list'
		})
	}

	//置业顾问
	static getConsultant(id,callback){
		let url = `/rest/reports/${id}/consultant`
		super.get(url,callback)
	}

	// 根据任务和时间统计报备情况
	static getShopDate(params, callback) {
		let url = '/report/stat/shopDate'
		url = Service.requestFormat(url, params)
		console.log(url, 'getShopDate url');
		super.get(url, callback)
	}
}

export default ReportService;
