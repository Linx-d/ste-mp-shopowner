export const cuIconList = [
    {
        key: "news",
        name: "楼盘动态",
        explain: "掌握楼盘动态",
        url: "@/static/home/dynamic.png",
    },
    {
        key: "consultant",
        name: "置业顾问",
        explain: "案场负责人",
        url: "@/static/home/counselor.png",
    },
]

export const reportList = [
    {
        id: 0,
        name: "待审批",
        number: "0",
        current: false,
        loading: false,
    },
    {
        id: 1,
        name: "报备",
        number: "0",
        current: false,
        loading: false,
    },
    {
        id: 9,
        name: "到访",
        number: "0",
        current: false,
        loading: false,
    },
    {
        id: -2,
        name: "失效",
        number: "0",
        current: false,
        loading: false,
    },
]

export const records = [
    {
        title: "日",
        current: true,
        date: "day",
    },
    {
        title: "周",
        current: false,
        date: "week",
    },
    {
        title: "月",
        current: false,
        date: "month",
    },
    {
        title: "季",
        current: false,
        date: "season",
    },
    {
        title: "年",
        current: false,
        date: "year",
    },
]

export const buy = {
    status: 0,
    len: 0,
    money: 0,
}
export const sign = {
    status: 1,
    len: 0,
    money: 0,
}
export const commission = {
    status: -1,
    len: 0,
    money: 0,
}