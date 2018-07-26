<template>
	<div class="header clearfix">
		<div class="header-tit">
			<span><img src="../../../static/img/logo.png" class="logo"></span>
			<h4>未度App后台管理系统</h4>
		</div>
		<div class="user-info">
			<span id="time"></span>
			<span class="username">&nbsp;欢迎您，{{user}}</span>
			<span class="exit" @click="logout">退出</span>
		</div>
	</div>
</template>
<script type="text/javascript">
	import AXIOS from '../../axios/axios'
	const Axios = new AXIOS();
	export default {
		data() {
			return {
				user: '',
			}
		},
		mounted() {
			this.user = sessionStorage.getItem('user');
			this.sysTime();
		},
		methods: {
			sysTime(){
		        var now = new Date(); //获取日期对象
		        var year = now.getYear()+1900; //获取的年
		        var month = now.getMonth()+1; //获得月份
		        var date = now.getDate(); //获得日
		        var time = year+"年"+month+"月"+date+"日 ";
		        document.getElementById("time").innerHTML = time;
		     },

			logout() {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {});
			},
		}
	}
</script>

<style type="text/css">
	.header {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 1000;
		width: 100%;
		height: 70px;
		line-height: 70px;
	    transition: all .5s ease;
	    border-top: 4px solid #3091f2;
	    background-color: #fff;
	    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);

	}
	.header .header-tit{
		float: left;
		margin-left: 20px;
	}
	.header .header-tit .logo{
		margin-top: 17px;
		display: inline-block;
		height: 40px;
		background-size: cover;
		float: left;
	}
	.header h4 {
		display: inline-block;
		font-weight: normal;
		margin-left: 20px;
	}
	
	.header .user-info {
		float: right;
		font-size: 14px;
		margin-right: 20px;
	}
	
	.header .user-info .exit {
		margin-left: 15px;
		opacity: 0.7;
		cursor: pointer;
		display: inline-block;
	}
</style>