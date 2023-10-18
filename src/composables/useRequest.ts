import Taro from '@tarojs/taro'
/**
 * config 自定义配置项
 * @param withoutCheck 不使用默认的接口状态校验，直接返回 response
 * @param returnOrigin 是否返回整个 response 对象，为 false 只返回 response.data
 * @param showError 全局错误时，是否使用统一的报错方式
 * @param canEmpty 传输参数是否可以为空
 * @param mock 是否使用 mock 服务
 * @param timeout 接口请求超时时间，默认10秒
 */
let configDefault: any = {
    showError: true,
    canEmpty: false,
    returnOrigin: false,
    withoutCheck: false,
    mock: false,
    timeout: 10000,
    mode: "cors",
    cache: "no-cache",
    cached: false,
    catchExpires: null,
    proxy: true,
    // responseType: "json",
    // enableHttp2:true,
};

// 根据请求方式，url等生成请求key
const generateReqKey = (config: any) => {
    const { method, url, body, requestKey } = config;
    return requestKey || [method, url, new URLSearchParams(body)].join("&");
}

// 请求配置map
const pendingRequest = new Map();
// 添加请求map
const addPendingRequest = (config: any) => {
    const requestKey = generateReqKey(config);
    if (!pendingRequest.has(requestKey)) {
        pendingRequest.set(requestKey, config);
    }
}
// 移除请求map
export const removePendingRequest = (config: any, requestKey?: string) => {
    if (!requestKey) requestKey = generateReqKey(config);
    if (!config.requestKey) config.requestKey = requestKey;
    if (pendingRequest.has(requestKey)) {
        const cancelToken = config || pendingRequest.get(requestKey);
        if (cancelToken) {
            cancelToken.abortRequest = true;
            cancelToken.controller.abort();
        }
        pendingRequest.delete(requestKey);
    }
}

// 移除所有pending请求
export const removeAllPendingRequest = () => {
    pendingRequest.forEach((source) => {
        if (source) {
            removePendingRequest(source)
        }
    })
}

// 结果处理，fetch请求响应结果是promise，还得处理
async function resultReduction(response: any,request: any) {
    let res = '';
    switch (request.responseType) {
        case "JSON":
            res = await response.json();
            break;
        case "Text":
            res = await response.text();
            break;
        case "Binary":
            res = await response.blob();
            break;
        case "arrayBuffer":
            res = await response.arrayBuffer();
            break;
        default:
            res = await response?.json();
            break;
    }
    return await res;
}

async function useRequest(method: string, path: string, data: { [prop: string]: any }, config: any = {}): Promise<{ data: any, code: number }> {
    // if (!config.hideLoading) commonStore.showLoading = true;
    const token = Taro.getStorageSync('token')?.token;
    let configTemp = Object.assign(
        {
            header: {
                "Content-Type": config.formData
                    ? "application/x-www-form-urlencoded" :
                    config.fileUpload ? 'multipart/form-data;'
                        : "application/json;charset=utf-8",
                // authorization: `Bearer ${token}`,
                token,
                Authorization: token
            },
        },
        {  ...configDefault, ...config }
    );
    if (configTemp.isNotAuth) delete configTemp.headers['token'];
    if (configTemp.fileUpload) delete configTemp.headers["Content-Type"];
    if (!configTemp.fileUpload) {
        const paramsData = deepClone(data);
        for (const key in paramsData) {
            if (paramsData[key] === null) {
                delete paramsData[key];
            }
        }
        data = paramsData;
    }
    // path = (configTemp?.proxy ? process.env.VITE_baseUrl : '') + path;
    path = (configTemp?.proxy ? 'http://172.17.30.13:28999' : '') + path;
    let myInit = {
        method,
        ...configDefault,
        ...configTemp,
        data:configTemp.formData ? new URLSearchParams(data) : data
    };
    if (method === 'GET') delete myInit.body
    let params = '';
    if (data && (method === 'GET' || configTemp.joinUrl)) {
        // 对象转url参数
        params = (JSON.stringify(data) as any)?.replace(/:/g, '=')?.replace(/"/g, '')?.replace(/,/g, '&')?.match(/\{([^)]*)\}/)[1];
    }
    return new Promise((resolve, reject) => {
        Taro.request({ url: params ? `${path}${params ? "?" : ""}${params}` : path ,...myInit}).then(async response => {
            console.log('response: ', response);
            // TODO: 这里是复制一份结果处理，在这里可以做一些操作
            // commonStore.showLoading = false;
            const res: any =  response.data;
            if ((response.statusCode == 401 || res.code == 401) && !configTemp.withoutCheck) {
                const { hash, pathname } = location;
                if (!hash.includes('returnUrl')) {
                    location.href = pathname + '#/login?returnUrl=' + encodeURIComponent(hash);;
                }
                return resolve(res);
            }
            if (res.code == 403) window.history.go(-1);
            // HTTP 状态码 2xx 状态入口，data.code 为 200 表示数据正确，无任何错误
            if (response.statusCode >= 200 && response.statusCode < 300 && res.code != 401) {
                if (res.code !== 0 && res.message && !configTemp.withoutCheck) {
                    window.$message.error(res.code !== 500 ? res.message : '接口异常，请联系管理员!');
                }
                // if (configTemp.cached) {
                //     const requestKey = generateReqKey(configTemp)
                //     db.set(requestKey, deepClone(res), configTemp.catchExpires)
                // }
                return resolve(res);
            } else {
                // 非 2xx 状态入口
                if (configDefault.withoutCheck) return resolve(response as any);
                // return Promise.reject(response);
                if (res.code !== 0 && res.code !== 500 && res.message) {
                    window.$message.error(res.message);
                }

            }
        }).catch(err => {
            console.log('err: ', err);
            reject(err)
        })
    })
}
// get请求方法使用封装
export function get(path = '', data = {}, config = {}) {
    return useRequest('GET', path, data, config);
}

// post请求方法使用封装
export function post(path = '', data = {}, config = {}) {
    return useRequest('POST', path, data, config);
}

// put请求方法使用封装
export function put(path = '', data = {}, config = {}) {
    return useRequest('PUT', path, data, config);
}

// delete请求方法使用封装
export function del(path = '', data = {}, config = {}) {
    return useRequest('DELETE', path, data, config);
}


