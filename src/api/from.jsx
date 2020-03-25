import axios from '.';
export function Download(values) {
    return axios.get(`/api/downLoad?sym=${values.sym}&date=${values.date}&exchange=${values.exchange}&group=${values.group}`)
}

export function DownloadStatus(group) {
    return axios.get(`/api/downLoadStatus?group=${group}`)
}

export function Execute(values) {
    return axios.get(`api/execute?group=${values.group}&symbol=${values.symbol}`)
}

export function getTable(values) {
    if (!values) {
        return axios.get('api/reportForm?type=""&time=""&exchange=""')
    }
    return axios.get(`api/reportForm?type=${values.type}&time=${values.time}&exchange=${values.exchange}`)
}

export function getBPTable(values) {
    if (!values) {
        return axios.get('api/reportForm_basePrice')
    }
    return axios.get(`api/reportForm_basePrice?grpType=${values.grpType}&cType=${values.cType}`)
}

export function getBQTable(values) {
    if (!values) {
        return axios.get('api/reportForm_baseQty')
    }
    return axios.get(`api/reportForm_baseQty?grpType=${values.grpType}&cType=${values.cType}`)
}

export function getBpsTable(values) {
    if (!values) {
        return axios.get('api/reportForm_queryBps')
    }
    return axios.get(`api/reportForm_queryBps?grpType=${values.grpType}&bps=${values.bps}&cType=${values.cType}`)
}

export function getBtcTable(values) {
    if (!values) {
        return axios.get('api/reportForm_queryBtc')
    }
    return axios.get(`api/reportForm_queryBtc?grpType=${values.grpType}&bps=${values.btc}&cType=${values.cType}`)
}

export function History() {
    return axios.get(`api/getHistory`)

}


export function downDelete(values) {
    console.log('values', values)
    return axios.get(`api/delGroup?group=${values.group}`)
}