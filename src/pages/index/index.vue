<!--
 * @Descripttion: 
 * @version: 
 * @Author: houqiangxie
 * @Date: 2023-10-12 10:24:00
 * @LastEditors: houqiangxie
 * @LastEditTime: 2023-10-17 14:52:57
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

const toHome = ()=>{
  Router.toHome()
}
</script>
