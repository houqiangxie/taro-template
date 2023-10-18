<!--
 * @Descripttion: 
 * @version: 
 * @Author: houqiangxie
 * @Date: 2023-10-12 10:24:00
 * @LastEditors: houqiangxie
 * @LastEditTime: 2023-10-18 15:32:17
-->
<template>
  <view class="index">
     <nut-button type="primary">主要按钮</nut-button>
    <view class="w-30 h-20 bg-green">kk</view>
  </view>
</template>

<script setup>
import './index.scss'
import Counter from '@/components/Counter.vue'
import {Router} from 'tarojs-router-next'
import Taro from '@tarojs/taro'
Taro.setStorageSync('token',{token:'1315088c18b041a5b8456c9ec428e282'})
const toHome = ()=>{
  Router.toHome()
}

const getList = async()=>{
  const {code} = await post('/par/page',{"name":null,"status":null,"total":47,"needPage":true,"pageNum":1,"pageSize":10})
  console.log('code: ', code);
}
getList()
</script>
