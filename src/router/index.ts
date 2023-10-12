import Taro from '@tarojs/taro'
import { Middleware, Router, registerMiddleware } from 'tarojs-router-next'

// 路由拦截
const beforeRoute = async(url,flag) => {
    if (!whiteList.includes(url)) {
        const token = Taro.getStorageSync('token')
        if (!token) {
            if (flag) Router.toLogin()
            const { confirm } = await Taro.showModal({
                title: '提示',
                content: '请先登录',
            })

            if (confirm) Router.toLogin()
            // 直接返回，不执行 next 即可打断中间件向下执行
            return
        }
    }
}

// 无需校验用户信息页面白名单
const whiteList:string[] = ['/pages/login/index']
export const AuthCheck: Middleware<{ mustLogin: boolean }> = async (ctx, next) => {
    beforeRoute(ctx.route?.url,false)
    await next()
}


export default registerMiddleware(AuthCheck)
// window.onload = () => { 
//     beforeRoute(window.location.pathname,true)
// }