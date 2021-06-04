// 门店信息相关接口
import Service from './service'
const shopBrokerApi = {
    base: '/rest/shopBrokers',
    shopBroker: '/shopBroker',
    query: '/shopBroker/query',
    delete: '/shopBroker/delete',
    audit: '/shopBroker/audit',
    edit: '/shopBroker/edit',
    scanJoin: '/shopBroker/scanJoin'
}

class shopBrokerService extends Service{
    static get(id, callback) {
        const url = shopBrokerApi.base + `/${id}`
        super.get(url, callback)
    }
    static query(param, callback) {
        const url = Service.requestFormat(shopBrokerApi.query, param)
        super.get(url, callback)
    }
    static delete(param, callback) {
        const url = Service.requestFormat(shopBrokerApi.delete, param)
        super.get(url, callback)
    }
    static audit(param, callback) {
        const url = Service.requestFormat(shopBrokerApi.audit, param)
        super.get(url, callback)
    }
    static qrcode(id, callback) {
        const url = shopBrokerApi.shopBroker + `/${id}/qr`
        super.get(url, callback)
    }
    static edit(param, callback) {
        const url = Service.requestFormat(shopBrokerApi.edit, param)
        super.get(url, callback)
    }
    static scanJoin(param, callback) {
        const url = Service.requestFormat(shopBrokerApi.scanJoin, param)
        super.get(url, callback)
    }
}

export default shopBrokerService