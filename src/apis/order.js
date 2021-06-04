//置业顾问信息相关接口
import Service from './service';

class OrderService extends Service {

    //获取所有订单

    static commissionApply(id,bankId,callback){
        let url = `/order/commission/apply?id=${id}&bankId=${bankId}`;
		super.put(url,{},callback)	
    }

    //获取所有订单

    static query(params,callback){
        let url = `/order/query`;
        if(params){
			url +='?'+Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
		}
        super.get(url,callback);
    }
    static getStat(id, callback) {
		let url = `/order/stat/broker?brokerId=${id}`
		super.get(url, callback)
	}

    //通过订单id获取当前订单的信息
    static getOrderById(orderId,callback){
        let url = `/rest/orders/${orderId}`
        super.get(url,callback)
    }
    static getPhotos(orderId,callback){
        let url = `/rest/orders/${orderId}/photos`
        super.get(url,callback)
    }
    static getContractPhotos(orderId,callback){
        let url = `/rest/orders/${orderId}/contractPhotos`
        super.get(url,callback)
    }

    //通过所属任务Id查询订单
    static byStatusAndBrokerId(params,callback){
        let url = `/rest/orders/search/findByStatusAndBrokerId`;
        if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
        super.get(url,callback);
    }

    static byStatusAndTaskId(params, callback){
		let url = `/rest/orders/search/findByStatusAndTaskId`;
		if(params){
			url +='?'+Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
		}
		super.get(url, callback);
    }
    

    // 获取订单日志
    static getLog(id,sort, callback) {
        let url = `/rest/orderLogs/search/findByOrderId?orderId=${id}`
        if(sort){
            url += '&sort='+sort;
        }
		super.get(url, callback)
	}
    
    //search phone or name
	static queryOrder(params, callback) {
		let url = '/order/query'
		if (params) {
			url += '?' + Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
		}
		super.get(url, callback)
	}
}

export default OrderService;