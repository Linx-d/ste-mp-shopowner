//协议相关接口
import Service from './service';

class AgreementsService extends Service {

    static getAgreements(params,callback){
        let url = `/rest/agreements/${params}`;
        super.get(url,callback);
    }

}

export default AgreementsService;