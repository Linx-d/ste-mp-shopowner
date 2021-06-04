//房屋信息相关接口
import Service from './service';

class AnonymousService extends Service {

    static getTask(id,callback){
        let url = `/anonymous/task/${id}`;
        super.get(url,callback);
        
    }

}

export default AnonymousService;