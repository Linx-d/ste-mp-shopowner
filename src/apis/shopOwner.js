// 门店信息相关接口
import Service from './service'
const shopOwnerApi = {
    base: '/rest/shopOwners',
    findAllShop: '/rest/findAllShop',
    findByShopId: '/rest/shopOwners/search/findByShopId',
    findByPhone: '/shopOwner/findByPhone'
}

class shopOwnerService extends Service{
    static get(id, callback) {
        const url = shopOwnerApi.base + `/${id}`
        super.get(url, callback)
    }
    static findByShopId(param, callback) {
        const url = Service.requestFormat(shopOwnerApi.findByShopId, param)
        super.get(url, callback)
    }
    static findByPhone(param, callback) {
        const url = Service.requestFormat(shopOwnerApi.findByPhone, param)
        super.get(url, callback)
    }
    static findAllShop(param, callback) {
        const url = Service.requestFormat(shopOwnerApi.findAllShop, param)
        super.get(url, callback)
    }
    static phoneValidator(cb) {
        const phone = uni.getStorageSync('phone' + Service.KEY_SUFFIX)
        const param = {
            phone
        }
        shopOwnerService.findByPhone(param, (res) => {
            if (res) {
                cb(res)
            } else {
                cb(false)
            }
        })
    }
}

export default shopOwnerService