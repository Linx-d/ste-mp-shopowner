
import Store from '@/store';

/**
 * API服务调用
 */
class Service {

    // request uri
    static URI_API = '';
    static URI_OSS = ''; // "https://ste-dev.oss-cn-chengdu.aliyuncs.com";

    static KEY_SUFFIX =  "_dev";

    static BROKER_APPID = 'wxc3b3dafcfb81d0d0'

    // init uri    

    /**
     * GET 
     * @param {*} path 
     * @param {*} callback 
     */
    static get(path, callback) {
        Service.request(path, 'GET', null, null, callback)
    }
    /**
     * DELETE 
     * @param {*} path 
     * @param {*} callback 
     */
    static del(path, callback) {
        Service.request(path, 'DELETE', null, null, callback)
    }
    /**
     * POST 
     * @param {*} path 
     * @param {*} data 
     * @param {*} callback 
     */
    static post(path, data, callback) {
        Service.request(path, 'POST', data, null, callback)
    }
    /**
     * PUT 
     * @param {*} path 
     * @param {*} data 
     * @param {*} callback 
     */
    static put(path, data, callback,header) {
        Service.request(path, 'PUT', data, header, callback)
    }

    /**
     * 发出请求
     * @param {*} path 
     * @param {*} method 
     * @param {*} data 
     * @param {*} header 
     * @param {*} callback 
     */
    static request(path, method, data, header, callback) {
        let url = Service.URI_API + path;
        let params = {
            url,
            success: (res) => {
                callback && callback(res)
            },
            fail(e) {
                console.log("request fail ", path, e);
                callback && callback({ data: { success: false, message: '网络错误', statusCode: 500 } })
            }
        }
        if (method) {
            params.method = method
        }
        if (data) {
            params.data = data;
        }
        // 通过 header: openid : xxx 授权
        let auth = {};
        // if (Service.token) {
        //     auth.Authorization = `Bearer ${Service.token}`;
        // }
        if (Store.state.token) {
            auth.Authorization = `Bearer ${Store.state.token}`;
        }
        header = Object.assign({}, header, auth);

        params.header = header;

        uni.request(params)
    }

    // OSS 批量上传
    static uploadOssBatch(arr, prefix = 'upload') {
        return new Promise(resolve => {
            Service.getOssAuth(res => {
                if (res) {
                    Service.uploadOss(res, arr, prefix,media => {
                        resolve(media);
                    });
                } else {
                    resolve(false);
                }
            });
        });
    }
    // 获取OSS授权
    static getOssAuth(callback) {

        let url = `/cloud/aliyun/oss/sign`;
        Service.get(url, res => {
            if (res.statusCode === 200) {
                callback(res.data.data);
            } else {
                callback(false);
            }
        })
    }
    // 递归上传多个附件
    static uploadOss(auth, arr, prefix, callback,index = 0, saved = []) {

       
            let { policy, signature, accessKeyId } = auth;

            let item = arr[index];
            let path = item.path;
            let type = item.type ||  'image/jpeg';

            prefix = (prefix.startsWith("/") ? prefix.substring(1) : prefix)

            let key = prefix + '/' + path.split('/').pop();
            let formData = {
                "key": key,
                "success_action_status": 200,
                "OSSAccessKeyId": accessKeyId,
                "policy": policy,
                "Signature": signature
            }

            uni.uploadFile({
                url: Service.URI_OSS,
                filePath: path,
                name: 'file',
                header: {
                    "Content-Type": "multipart/form-data"
                },
                formData,
                dataType: 'json',
                responseType: 'text',
                success: (res) => {
                    if (res.statusCode === 200) {
                        Service.saveMedia({
                            type,
                            path: '/' + key
                        }, res2 => {
                            if (res2.statusCode === 201) {
                                saved.push(res2.data);
                                if (saved.length === arr.length) {
                                    callback(saved);
                                } else {
                                    Service.uploadOss(auth, arr, prefix,callback, index + 1, saved);
                                }
                            }
                        })
                    }
                },
                fail: (res) => {
                    console.error("updateToOss fail : " + JSON.stringify(res))
                    callback(false)
                }
            });
    }
    // 保存MEDIA对象
    static saveMedia(payload, callback) {
        let url = `/rest/medias`;
        Service.post(url, payload, callback);
    }
    static requestFormat(url, param) {
        if (param) {
            url += '?' + Object.keys(param).map(item => `${item}=${param[item]}`).join('&')
        }
        return url
    }

}

export default Service;