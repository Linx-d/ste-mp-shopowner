//房屋信息相关接口
import Service from './service';

class HouseService extends Service {
    static byId(id,callback){
        // let url = `/rest/houses/${id}&projection=withAll`;
        let url = `/rest/houses/${id}`
        super.get(url,callback);
    }
    static getResidents(id,callback){
        // let url = `/rest/houses/${id}&projection=withAll`;
        let url = `/rest/houses/${id}/residents`
        super.get(url,callback);
    }
    static getLicenseByHouseId(id,callback){
        let url = `/rest/licences/search/findByHouseId?houseId=${id}&size=5`
        super.get(url,callback);
    }

    //楼盘动态
    static getNewsByHouseId(params,callback){
        let url = `/rest/news/search/findByHouseId`;
        if(params){
            url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
        }
        super.get(url,callback);
    }
	
	static brokerHouses(params,callback){
	    let url = `/rest/brokerHouses`;
	    super.post(url,params,callback);
	}
	
	static checkByBrokerIdAndHouseId(params,callback){
	    let url = `/rest/houses/search/checkByBrokerIdAndHouseId`;
		if(params){
		    url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
		}
	    super.get(url,callback);
	}
	static delectBrokerHouses(id,callback){
	    let url = `/rest/brokerHouses/${id}`;
	    super.del(url,callback);
	}
	
	static findByBrokerId(params,callback){
	    let url = `/rest/houses/search/findByBrokerId`;
		if(params){
		    url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
		}
	    super.get(url,callback);
	}
	
	static findSubscribeHouse(params,callback){
	    let url = `/house/findSubscribeHouse`;
		if(params){
		    url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
		}
	    super.get(url,callback);
	}
	
    //户型
    static getRoomsByHouseId(params,callback){
        let url = `/rest/rooms/search/findByHouseId`;
        if(params){
            url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
        }
        super.get(url,callback);
    }
	
	// 楼盘下的代理商
		static houseAgentQuery(params,callback){
		    let url = `/houseAgent/query`;
		    super.post(url,params,callback);
		}
	
    //图片
    static mediaArea(id,callback){
        let url = `/rest/houses/${id}/mediaArea`
        super.get(url,callback)
    }
    static mediaBuilding(id,callback){
        let url = `/rest/houses/${id}/mediaBuilding`
        super.get(url,callback)
    }
    static mediaDesign(id,callback){
        let url = `/rest/houses/${id}/mediaDesign`
        super.get(url,callback)
    }
    static mediaSale(id,callback){
        let url = `/rest/houses/${id}/mediaSale`
        super.get(url,callback)
    }
    static mediaSand(id,callback){
        let url = `/rest/houses/${id}/mediaSand`
        super.get(url,callback)
    }
    static mediaScene(id,callback){
        let url = `/rest/houses/${id}/mediaScene`
        super.get(url,callback)
    }
    static mediaSocial(id,callback){
        let url = `/rest/houses/${id}/mediaSocial`
        super.get(url,callback)
    }

    static allMedia(params,callback){
        let url = `/rest/medias`
        if(params){
            url += '?' + Object.keys(params).map(k=>`${k}=${params[k]}`).join('&')
        }
        super.get(url,callback)
    }
    
}

export default HouseService;