<!--
 * @Descripttion: 
 * @version: 
 * @Author: houqiangxie
 * @Date: 2023-10-12 10:24:00
 * @LastEditors: houqiangxie
 * @LastEditTime: 2023-10-12 16:16:00
-->
<template>
  <view class="index">
    <AtButton @click="toHome"  class="!w-30">index</AtButton>
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
