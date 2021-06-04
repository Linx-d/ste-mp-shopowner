import { format } from 'fecha';

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

export default {
    log(obj) {
        console.log(JSON.stringify(obj))
    },
    random(num) {
        return Math.floor(Math.random() * num);
    },
    findIdxInArr(arr, key, val) {
        let idx = -1;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][key] == val[key]) {
                return i;
            }
        }
        return idx;
    },
    findItemInArr(arr, key, val) {
        let idx = this.findIdxInArr(arr, key, val);
        return idx >= 0 ? arr[idx] : null;
    },
    checkPhone(phone) {
        let reg = /\d{11}/g
        return reg.test(phone);
    },


    // a and b are javascript Date objects
    dateDiffInDays(a, b) {
        // Discard the time and time-zone information.
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc1 - utc2) / _MS_PER_DAY);
    },

    formatDate(date = new Date(), pattern = 'YYYY-MM-DD') {
        return format(date, pattern);
    },
    formatTime(date = new Date()) {
        return this.formatDate(date, 'YYYY-MM-DD HH:mm:ss');
    },

    formatHoursMinutes(date = new Date()) {
        let Minutes = new Date(date).getMinutes();
        Minutes = Minutes.toString().length < 2 ? '0' + Minutes : Minutes
        return new Date(date).getHours() + ":" + Minutes
    },

    getSaleStatus(status) {
        return status === 0 ? '未销售' : status === 1 ? '在售' : '停售'
    },

    getHeadTail(str) {
        let rs = "-";
        if (str) {
            let arr = str.split(',').sort((a, b) => {
                return a - b
            });
            if (arr.length == 1) {
                rs = arr[0]
            } else if (arr.length > 1) {
                rs = arr[0] + '-' + arr[arr.length - 1]
            }
        }

        return rs;
    },
    timeText(str) {
        return !str ? '-' : str.substring(0, 16);
    },
    hideLen(str, len = 8) {
        if (str && str.length > len) {
            let half = len / 2;
            let head = str.substring(0, half);
            let tail = str.substring(str.length - half);

            return head + " **** " + tail;

        } else {
            return str;
        }
    },
    numberWithCommas(x) {
        return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-';
    },
    commissionLabel(st) {
        return st === 1 ? '待结佣' :
            st === 2 ? '开发商回款中' :
                st === 3 ? '可结佣' :
                    st === 4 ? '结佣中' :
                        st === 5 ? '已结佣' :
                            st === -2 ? '结佣异议' : '-';
    },
    // 得到今日日期 getDate(dates)
    getDate() {
        let dd = new Date();
        dd.setDate(dd.getDate());
        let y = dd.getFullYear();
        let m = dd.getMonth() + 1;
        let d = dd.getDate();
        m = m < 10 ? "0" + m : m;
        d = d < 10 ? "0" + d : d;
        let day = y + "-" + m + "-" + d;
        return day;
    },
    // 得到本周时间 getMonday("s",1)
    // type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，
    // dates为数字类型，不传或0代表本周，-1代表上周，1代表下周
    getMonday(type, dates) {
        let now = new Date();
        let nowTime = now.getTime();
        let day = now.getDay();
        let longTime = 24 * 60 * 60 * 1000;
        let n = longTime * 7 * (dates || 0);
        if (type == "s") {
            var dd = nowTime - (day - 1) * longTime + n;
        };
        if (type == "e") {
            var dd = nowTime + (7 - day) * longTime + n;
        };
        dd = new Date(dd);
        let y = dd.getFullYear();
        let m = dd.getMonth() + 1;
        let d = dd.getDate();
        m = m < 10 ? "0" + m : m;
        d = d < 10 ? "0" + d : d;
        day = y + "-" + m + "-" + d;
        return day;
    },
    // 得到本月时间  getMonth("s",1)
    //type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，
    //months为数字类型，不传或0代表本月，-1代表上月，1代表下月

    getMonth(type, months) {
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        if (Math.abs(months) > 12) {
            months = months % 12;
        };
        if (months != 0) {
            if (month + months > 12) {
                year++;
                month = (month + months) % 12;
            } else if (month + months < 1) {
                year--;
                month = 12 + month + months;
            } else {
                month = month + months;
            };
        };
        month = month < 10 ? "0" + month : month;
        var date = d.getDate();
        var firstday = year + "-" + month + "-" + "01";
        var lastday = "";
        if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12") {
            lastday = year + "-" + month + "-" + 31;
        } else if (month == "02") {
            if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
                lastday = year + "-" + month + "-" + 29;
            } else {
                lastday = year + "-" + month + "-" + 28;
            };
        } else {
            lastday = year + "-" + month + "-" + 30;
        };
        var day = "";
        if (type == "s") {
            day = firstday;
        } else {
            day = lastday;
        };
        return day;
    },

    // 得到今年的开始结束日期  getYear("s",0)
    //type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，
    //dates为数字类型，不传或0代表今年，-1代表去年，1代表明年
    getYear(type, dates) {
        var dd = new Date();
        var n = dates || 0;
        var year = dd.getFullYear() + Number(n);
        if (type == "s") {
            var day = year + "-01-01";
        };
        if (type == "e") {
            var day = year + "-12-31";
        };
        if (!type) {
            var day = year + "-01-01/" + year + "-12-31";
        };
        return day;
    },
    // 得到本季度的开始、结束日期 
    // getQuarterMonth("s",1)
    getQuarterMonth(type) {
        var now = new Date();
        var nowMonth = now.getMonth();
        var year = now.getFullYear();
        var quarterStartMonth = 1;
        if (nowMonth < 3) {
            quarterStartMonth = 1;
        }
        if (2 < nowMonth && nowMonth < 6) {
            quarterStartMonth = 4;
        }
        if (5 < nowMonth && nowMonth < 9) {
            quarterStartMonth = 7;
        }
        if (nowMonth > 8) {
            quarterStartMonth = 10;
        }
        if (type == "s") {
            var day = year + "-" + quarterStartMonth + "-01";
        };//1-3 4-6 7-9 10-12
        if (type == "e") {
            if (quarterStartMonth == 1) {
                var day = year + "-" + (quarterStartMonth + 2) + "-31";
            }
            if (quarterStartMonth == 10) {
                var day = year + "-" + (quarterStartMonth + 2) + "-31";
            }
            if (quarterStartMonth == 4) {
                var day = year + "-" + (quarterStartMonth + 2) + "-30";
            }
            if (quarterStartMonth == 7) {
                var day = year + "-" + (quarterStartMonth + 2) + "-30";
            }
        };
        return day;
    }
}