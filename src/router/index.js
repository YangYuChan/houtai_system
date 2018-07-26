import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
			routes: [
					{
			            path: '/',
			            redirect: '/login'
		        	},
					{
						path: '/home',
						component: resolve => require(['../components/common/Home.vue'], resolve),
						children: [{
								path: '/',
								component: resolve => require(['../components/page/Main.vue'], resolve),
							},
							{
								path: '/vr',
								component: resolve => require(['../components/page/module/VRList.vue'], resolve),  //板块  VR视频
							},
							{
								path: '/message',
								component: resolve => require(['../components/page/module/Message.vue'], resolve),//资讯推送
							},
							{
								path: '/activity',
								component: resolve => require(['../components/page/module/Activity.vue'], resolve),//活动编辑
							},
							{
								path: '/class',
								component: resolve => require(['../components/page/module/Class.vue'], resolve),//课程架构
							},
							{
								path: '/rgym',
								component: resolve => require(['../components/page/module/RecommendGym.vue'], resolve),//健身房推荐
							},
							{
								path: '/rcoach',
								component: resolve => require(['../components/page/module/RecommendCoach.vue'], resolve),//教练推荐
							},
							{
								path: '/coach',
								component: resolve => require(['../components/page/module/Coach.vue'], resolve), //维护教练
							},
							{
								path: '/dynamic',
								component: resolve => require(['../components/page/module/Dynamic.vue'], resolve),  //动态管理
							},
							{
								path: '/mindex',
								component: resolve => require(['../components/page/maintain/Index.vue'], resolve), //维护首页
							},
							{
								path: '/mclass',
								component: resolve => require(['../components/page/maintain/Class.vue'], resolve), //维护课程
							},
							{
								path: '/mdynamic',
								component: resolve => require(['../components/page/maintain/Dynamic.vue'], resolve), //维护动态内容
							},
							{
								path: '/mdweb',
								component: resolve => require(['../components/page/maintain/DWeb.vue'], resolve), //维护动态站
							},
							{
								path: '/mmweb',
								component: resolve => require(['../components/page/maintain/MWeb.vue'], resolve), //维护动态站
							},
							{
								path: '/user',
								component: resolve => require(['../components/page/account/User.vue'], resolve), //维护动态站
							},
							{
								path: '/client',
								component: resolve => require(['../components/page/machine/Client.vue'], resolve), //维护动态站
							},
							{
								path: '/machine',
								component: resolve => require(['../components/page/machine/Machine.vue'], resolve), //维护动态站
							},
						]
					},
					{
			            path: '/login',
			            component: resolve => require(['../components/page/Login.vue'], resolve)
			        },
			]
})
// 判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
 if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
 if (sessionStorage.getItem('user')) {// 判断是否登录
  next({
  	path: '/home',
  })
 } else {// 没登录则跳转到登录界面
  next({
  path: '/login',
//query: {redirect: to.fullPath}
  })
 }
 } else {
 next()
 }
})
 
export default router