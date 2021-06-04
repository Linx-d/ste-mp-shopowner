//房屋信息相关接口
import Service from './service';

class BankService extends Service {

    static save(payload,callback){
        let url = `/bank-account`;
        super.post(url,payload,callback);
    }

    static getMe(callback){
        let url = `/bank-account/me`;
        super.get(url,callback);
    }

}

export default BankService;