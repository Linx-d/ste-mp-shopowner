//驻场人员相关接口
import Service from './service';

class ResidentService extends Service {

    static getResidentByHouseId(params,callback){
        let url = `/rest/residents/search/findByHouses_Id/${params}?projection=withAll`;
        super.get(url,callback);
    }

    static findByHousesId(houseId,callback){
        let url = `/rest/residents/search/findByHouses_Id?houseId=${houseId}`
        super.get(url,callback);
    }
}

export default ResidentService;