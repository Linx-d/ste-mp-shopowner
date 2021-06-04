// 门店信息相关接口
import Service from './service'

const shopApi = {
    base: '/rest/shops',
    shop: '/shop',
    query: '/shop/query',
    delete: '/shop/delete',
    conutAudit: '/shop/countAudit',
    findByShopOwnerId: '/rest/shops/search/findByShopOwnerId'
}

class shopService extends Service{
    static get(id, callback) {
        const url = shopApi.base + `/${id}`
        super.get(url, callback)
    }
    static query(param, callback) {
        const url = Service.requestFormat(shopApi.query, param)
        super.get(url, callback)
    }
    static conutAudit(param, callback) {
        const url = Service.requestFormat(shopApi.conutAudit, param)
        super.get(url, callback)
    }
    static qrcode(id, callback) {
        const url = shopApi.shop + `/${id}/qr`
        super.get(url, callback)
    }
    static findByShopOwnerId(param, callback) {
        const url = Service.requestFormat(shopApi.findByShopOwnerId, param)
        super.get(url, callback)
    }
}

export default shopService