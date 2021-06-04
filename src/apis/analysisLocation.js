//高德地址逆解析
class LocationService {

    static analysisLocation(location,callback){
       	let url=`https://restapi.amap.com/v3/geocode/regeo?key=50963b3c752531b0f7f3524cd2e40b9a&s=rsv3&language=zh_cn&location=${location}&output=JSON`;
		uni.request({
        	method:"GET",
			url,
			success(res) {
				callback(res.data)
			},
			fail(res){
				callback(res)
				uni.showModal({
					content:res
				})
			}
        })
    }
}

export default LocationService;