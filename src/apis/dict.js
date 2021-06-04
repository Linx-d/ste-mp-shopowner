//房屋信息相关接口
import Service from './service';

class DictService extends Service {

    static getAll(callback){
        let url = `/rest/dicts`;
        super.get(url,callback);
    }

}

export default DictService;