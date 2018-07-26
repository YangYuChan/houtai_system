<template>
	<div class="sidebar">
    <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" unique-opened router>
    	<el-submenu index="1">
        <template slot="title"><i class="el-icon-message"></i>社区管理</template>
        <el-submenu index="1-1">
          <template slot="title">用户管理</template>
          	<el-menu-item index="user">账号数据</el-menu-item>
        </el-submenu>
        <el-submenu index="1-2">
          <template slot="title">页面维护</template>
          	<el-menu-item index="mindex">首页内容维护</el-menu-item>
          	<el-menu-item index="mclass">课程界面维护</el-menu-item>
          	<el-menu-item index="mdynamic">动态界面维护</el-menu-item>
          	<el-menu-item index="mdweb">动态站动态维护</el-menu-item>
          	<el-menu-item index="mmweb">动态站资讯维护</el-menu-item>
        </el-submenu>
        <el-submenu index="1-3">
          <template slot="title">板块管理</template>
          	<el-menu-item index="message">资讯推送</el-menu-item>
          	<el-menu-item index="dynamic">动态管理</el-menu-item>
          	<el-menu-item index="vr">VR视频上传</el-menu-item>
          	<el-menu-item index="activity">活动编辑</el-menu-item>
          	<el-menu-item index="class">课程架构</el-menu-item>
          	<el-menu-item index="rgym">健身房推荐</el-menu-item>
          	<!--<el-menu-item index="rcoach">教练推荐</el-menu-item>-->
          	<el-menu-item index="coach">教练</el-menu-item>
        </el-submenu>
        <el-submenu index="1-4">
          <template slot="title">运动管理</template>
          	<el-menu-item index="">运动排名</el-menu-item>
          	<el-menu-item index="">运动群</el-menu-item>
        </el-submenu>
        <el-submenu index="1-5">
          <template slot="title">内容维护</template>
          	<el-menu-item index="">评论与回复</el-menu-item>
          	<el-menu-item index="">用户反馈</el-menu-item>
          	<el-menu-item index="">版本</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title"><i class="el-icon-message"></i>运营数据分析</template>
        <el-submenu index="2-1">
          <template slot="title">客户分析</template>
          	<el-menu-item index="">用户分析</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title"><i class="el-icon-message"></i>交易中心</template>
        <el-submenu index="3-1">
          <template slot="title">总资产概况</template>
          	<el-menu-item index="">课程交易流水</el-menu-item>
        </el-submenu>
        <el-submenu index="3-2">
          <template slot="title">app交易明细</template>
          	<el-menu-item index="">所有订单</el-menu-item>
          	<el-menu-item index="">待支付订单</el-menu-item>
          	<el-menu-item index="">支付失败订单</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title"><i class="el-icon-message"></i>机器管理</template>
        <el-submenu index="4-1">
          <template slot="title">客户管理</template>
            <el-menu-item index="client">客户管理</el-menu-item>
          	<el-menu-item index="">销量分析</el-menu-item>
        </el-submenu>
        <el-submenu index="4-2">
          <template slot="title">机器管理</template>
          	<el-menu-item index="machine">机器查询录入</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title"><i class="el-icon-message"></i>场馆管理</template>
        <el-submenu index="5-1">
          <template slot="title">健身房信息录入</template>
          	<el-menu-item index="">信息列表</el-menu-item>
        </el-submenu>
        <el-submenu index="5-2">
          <template slot="title">健身房管理</template>
          	<el-menu-item index="">健身房列表</el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>
	</div>
</template>
<style type="text/css">
	.sidebar{
        display: block;
        position: absolute;
        width: 220px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #F9FAFC;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
<script>
  export default {
  	 computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
  
</script>