//任务信息相关接口
import Service from './service';


class TaskService extends Service{

    // /rest/tasks/{id}/brokerRecords
	static records(id, callback) {
		let url = `/rest/tasks/${id}/brokerRecords`;
		super.get(url, callback);
	}
    
    static query(params,callback){
        let url = `/task/query`;
        if(params){
            url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
        }
        super.get(url,callback);
    }

    static load(params,callback){
        let url = `/rest/tasks`;
        if(params){
            url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
        }
        super.get(url,callback);
    }

    static getRecommend(params,callback){
        let url = `/task/recommend`
        if(params){
            url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
        }
        this.get(url, callback);
    }

    static byId(id,callback){
        let url = `/rest/tasks/${id}`
        super.get(url,callback);
    }

    static getTaskByBrokerId(params,callback){
        let url = `/rest/tasks/search/findByBrokerId`;
        if(params){
            url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
        }
        super.get(url,callback);
    }
	
	static getTaskByByKeyword(params,callback){
	    let url = `/rest/tasks/search/findByKeyword`;
	    if(params){
	        url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
	    }
	    super.get(url,callback);
	}
    
    static acceptTask(data,callback){
        let url = `/rest/taskBrokers`;
        super.request(url, 'post', data, null, callback);
    }


    static getBrokerTaskId(brokerId,callback){
        let url = `/task/getId?brokerId=${brokerId}`
        super.get(url,callback)
    }
	
	static findAllTask(params,callback){
	    let url = `/rest/tasks`;
	    if(params){
	        url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
	    }
	    super.get(url,callback);
	}
}

export default TaskService;