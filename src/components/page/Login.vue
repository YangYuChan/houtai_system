<template>
    <div class="login-wrap">
        <div class="ms-login">
        	<div class="logo"><img src="../../../static/img/logo.png" alt="" /></div>
        <h3 class="ms-title">未度App后台管理系统</h3>
            <el-form class="demo-ruleForm" :model="ruleForm" :rules="rules" ref="ruleForm">
                <el-form-item prop="uname">
                    <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="pwd">
                    <el-input type="password" v-model="ruleForm.password"></el-input>
                </el-form-item>
                 <!--<el-checkbox v-model="checked" class="remember">记住密码</el-checkbox>-->
                <el-form-item style="width:100%;margin-top: 20px;">
     				<el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit">登录</el-button>
              </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script type="text/javascript">
	import AXIOS from '../../axios/axios'
	import global_ from '../common/Global'
	import valid from '../../common/js/validate'
	const Axios = new AXIOS();
	export default {
    data() {
      return {
      	path: global_.path,
        logining: false,
        uname:'',
        pwd:'',
        ruleForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {required: true, validator: valid.checkUsername, trigger: 'blur' }
          ],
          password: [
            {required: true, validator: valid.checkPassword, trigger: 'blur' }
          ]
        },
        checked: true,
        token:'',
        userId:''
      };
    },
//  mounted() {
//			this.$nextTick(() => {
//				if(this.checked == true){
//					this.getData();
//					this.checked = true
//				}else{
//					this.checked = false
//				}
//			});
//		},
    methods: {
      handleReset() {
        this.$refs.ruleForm.resetFields();
      },
      handleSubmit(ev) {
        var _this = this;
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
//          this.logining = true;
            this.$axios({
						url: this.path + 'sys/user/login',
						method: 'post',
						params: this.ruleForm,
						transformRequest: [function(params) {
							let ret = ''
							for(let it in params) {
								ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&'
							}
							return ret
						}],
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						}
					}).then(res => {
					if(res.data.result == 0){
						this.$message({
		                  message: '用户名或密码错误，请重新输入',
		                  type: 'error'
		                });
					}else if(res.data.result == 1){
		           	    let user = this.ruleForm.username;
//		           	    let pwd = this.ruleForm.password;
		              	let token = res.data.token;
//		              	let userId = res.data.id;
						sessionStorage.setItem('token', token);
		                sessionStorage.setItem('user', user);
//		                sessionStorage.setItem('pwd', pwd);
//						sessionStorage.setItem('userId', userId);
		                this.$router.push({ path: '/home' });
		              }
		            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
     },
//   getData(){
//   	this.uname = sessionStorage.getItem('user');
//   	this.pwd = sessionStorage.getItem('pwd');
//   }

    }
  }
</script>
<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-color: #FFFFFF;
    }
    .logo{
    	text-align: center;
    	margin-bottom: 25px;
    }
    .logo img{
    	width: 250px;
    	background-size: cover;
    }
    .ms-title{
        text-align: center;
        font-size:30px;
        color: #333;
        margin-bottom: 80px;
        font-weight: normal;
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        height:auto;
        margin:-200px 0 0 -190px;
        /*padding:40px;
        border-radius: 5px;
        background: #fff;
        box-shadow: 0px 0px 10px #999;*/
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>