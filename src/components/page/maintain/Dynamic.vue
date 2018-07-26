<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 社区管理</el-breadcrumb-item>
				<el-breadcrumb-item> 页面维护</el-breadcrumb-item>
				<el-breadcrumb-item>动态界面维护</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
  <el-tabs v-model="activeIndex" type="card">
    <el-tab-pane label="banner" name="first">
    	<div class="btn-box">
			 <el-button type="primary" size="large" @click="handleBannerAdd">添加</el-button>
		</div>
    	<el-table :data="bannerData" border stripe style="width:100%" v-loading="listLoading">
			<el-table-column prop="no" width="150" label="当前排序"></el-table-column>
			<el-table-column prop="photo" label="图片">
				<template scope="scope">
					<img :src="scope.row.photo" alt="" style="width: 220px; height: 100px;"/>
				</template>
			</el-table-column>
			<el-table-column prop="href" label="链接地址">
				<template scope="scope">
					<a :href="scope.row.href" target="_blank">{{scope.row.href}}</a>
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button size="small" @click="handleBannerEdit(scope.index,scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleBannerDelete(scope.index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--添加-->
			<el-dialog v-model="addBannerFormVisible" size="tiny" title="添加banner">
				<el-form ref="addBannerForm" :model="addBannerForm" label-width="80px" :rules="addBannerRules">
					<el-form-item label="封面图" >
						<el-upload class="avatar-uploader" :action="uploadUrl()" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
							<img v-if="addBannerForm.photo" :src="addBannerForm.photo" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<template>
							<span style="color:#999999">(点击图片重新上传)</span>
						</template>
					</el-form-item>
					
					<el-form-item label="活动链接" prop="href">
						<el-input v-model="addBannerForm.href"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="bannerAddSubmit">提交</el-button>
						<el-button @click="addBannerFormVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		<!--end-->
		<!--编辑-->
			<el-dialog v-model="editBannerFormVisible" size="tiny" title="编辑banner">
				<el-form ref="editBannerForm" :model="editBannerForm" label-width="80px" :rules="editBannerRules">
					<el-form-item label="当前排序" prop="no">
						<el-input v-model="editBannerForm.no" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="封面图" >
						<el-upload class="avatar-uploader" :action="uploadUrl()" :show-file-list="false" :on-success="handleEditAvatarSuccess" :before-upload="beforeAvatarUpload">
							<img v-if="editBannerForm.photo" :src="editBannerForm.photo" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<template>
							<span style="color:#999999">(点击图片重新上传)</span>
						</template>
					</el-form-item>
					
					<el-form-item label="活动链接" prop="href">
						<el-input v-model="editBannerForm.href"></el-input>
					</el-form-item>
					<el-form-item label="排序" prop="orderBNumber">
						<el-select v-model="orderBNumber">
							<el-option v-for="item in orderList" :key="item.id" :label="item.id" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="bannerEditSubmit">提交</el-button>
						<el-button @click="editBannerFormVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		<!--end-->
    </el-tab-pane>

    <el-tab-pane label="热门动态" name="third">
    	<div class="btn-box">
			 <el-button type="primary" size="large" @click="handleExerciseAdd">添加</el-button>
		</div>
    	<el-table :data="exerciseData" border stripe style="width:100%" v-loading="listLoading">
			<el-table-column prop="no" width="150" label="当前排序"></el-table-column>
			<el-table-column prop="resourceData.dynamicPath" width="300" label="封面图">
				<template scope="scope">
					<img :src="scope.row.resourceData.dynamicPath" alt="" style="width: 220px; height: 100px;"/>
				</template>
			</el-table-column>
			<el-table-column prop="resourceData.context" label="动态内容"></el-table-column>
			<el-table-column prop="resourceData.nickname" label="用户昵称"></el-table-column>
			<el-table-column prop="resourceData.phone" label="联系方式"></el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button size="small" @click="handleExerciseEdit(scope.index,scope.row)">编辑排序</el-button>
					<el-button type="danger" size="small" @click="handleExerciseDelete(scope.index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--热门动态-->
		<el-dialog v-model="addExerciseFormVisible" size="large" title="添加热门动态">
				<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-form-item label="条件查询">
					<el-input v-model="listQuery.keyword" placeholder="输入用户昵称或手机号搜索"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="datetime" type="daterange" placeholder="选择日期" @change="dateChange">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="search" @click="handleFilter()">查询</el-button>
				</el-form-item>
			</el-form>
				<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading" :hidden="ehidden">
			<!--<el-table-column prop="ordermum" label="排序" sortable></el-table-column>-->
			<el-table-column prop="nickname" label="用户昵称"></el-table-column>
			<el-table-column prop="phone" label="手机号" ></el-table-column>
			<el-table-column prop="context" label="动态内容" width="500">
				<template scope="scope">
					<div class="d-context">
						{{scope.row.context}}
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="发布时间" width="210"> </el-table-column>
			<el-table-column prop="sumHot" label="热门指数"></el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button type="primary" size="small" @click="addHotDynamic(scope.index,scope.row)">添加</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block" :hidden="ehidden">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
			</el-dialog>
			<!--添加-->
			<!--编辑-->
			<el-dialog v-model="editOrderEVisible" size="tiny" title="编辑排序">
					<el-form ref="editOrderEQuery" :model="editOrderEQuery" label-width="80px">
					<el-form-item label="当前排序">
						<el-input v-model="editOrderEQuery.no" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="用户昵称">
						<el-input v-model="editOrderEQuery.resourceData.nickname" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="重新排序" >
					<el-select v-model="orderNum" placeholder="请选择动态排序">
						<el-option v-for="item in eOrderData" :key="item" :label="item" :value="item"> </el-option>
					</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="exOrderSubmit">提交</el-button>
						<el-button @click="editOrderEVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
    </el-tab-pane>

  </el-tabs>
  
 </div>
 
</template>
<script>
	import AXIOS from '../../../axios/axios'
	import global_ from '../../common/Global'
	import valid from '../../../common/js/validate'
	const Axios = new AXIOS();
	export default {
	    data() {
	      return {
	      	path: global_.path,
	      	action:global_.action,
	        activeIndex: 'first',
	        token:'',
	        bannerData:[],
	        listLoading:false,
	        orderList:[{
	        	id:1
	        },{
	        	id:2
	        },{
	        	id:3
	        },{
	        	id:4
	        },{
	        	id:5
	        }],
	        orderBNumber:1,
	        addBannerFormVisible:false,
	        addBannerForm:{
	        	photo:'',
	        	href:'',
	        },
	        addBannerRules: {
				photo: [
					{ required: true, message:'请上传图片', trigger: 'change' }
				],
			},
	        editBannerFormVisible:false,
	        editBannerForm:{
	        	id:'',
	        	photo:'',
	        	href:'',
	        },
	        editBannerRules: {
				photo: [
					{ required: true, message:'请上传图片', trigger: 'change' }
				],
			},
		
			//健身
			datetime:'',
			exerciseData:[],
			total: null,
				tableData: [], //列表数组
				listQuery: {
					page: 1,
					limit: 10,
					keyword: undefined,
				},
			addExerciseFormVisible:false,
			eOrderData:[],
			ehidden:true,
			editOrderEVisible:false,
			editOrderEQuery:{
				id:undefined,
				resourceData:{
					className:'',
				},
			},
			orderNum:1,
	      };
	    },mounted() {
			this.$nextTick(() => {
				this.token = sessionStorage.getItem('token');
				this.getBannerData();
				this.getExerciseData();
			});
		},
	    methods: {
	    	uploadUrl(){
				return this.action
			},
	        getBannerData() {
	        	this.listLoading = true;
				this.$axios({
					url: this.path + 'page/content/list?pageType=dynamic&contentType=banner',
					method: 'get',
					headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
				})
				.then((res) => {
					this.bannerData = res.data;
					this.listLoading = false;
				})
				.catch((err) => {
					console.log(err);
				})
	    	},
	    	handleBannerAdd(){
	    		this.addBannerFormVisible = true;
	    	},
	    	bannerAddSubmit(){
	    		this.$refs.addBannerForm.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$axios({
									url: this.path + 'page/content/add?pageType=dynamic&contentType=banner',
									method: 'put',
									data:{
							        	photo:this.addBannerForm.photo,
							        	href:this.addBannerForm.href,
									},
									transformRequest: [function(data) {
										let ret = ''
										for(let it in data) {
											ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
										}
										return ret
									}],
									headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
								})
								.then((res) => {
									if(res.data === 1){
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['addBannerForm'].resetFields();
										this.addBannerFormVisible = false;
										this.addBannerForm.photo='';
										this.getBannerData();
									}else{
										this.$message({
											message: '提交失败',
											type: 'error'
										});
									}
								})
								.catch((err) => {
									console.log(err);
								})
						}).catch(() => {
							this.$message({
								type: 'info',
								message: '已取消添加'
							});
							this.addBannerFormVisible = false;
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
	    	},
	    	handleBannerEdit(index,row){
	    		this.editBannerFormVisible = true;
				this.editBannerForm = Object.assign({}, row);
	    	},
	    	bannerEditSubmit(){
	    		this.$refs.editBannerForm.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$axios({
									url: this.path + 'page/content/update?pageType=dynamic',
									method: 'post',
									data:{
							        	id:this.editBannerForm.id,
							        	photo:this.editBannerForm.photo,
							        	href:this.editBannerForm.href,
							        	orderNumber:this.orderBNumber,
									},
									transformRequest: [function(data) {
										let ret = ''
										for(let it in data) {
											ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
										}
										return ret
									}],
									headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
								})
								.then((res) => {
									if(res.data === 1){
										this.$message({
											message: '提交成功',
											type: 'success'
										});
										this.$refs['editBannerForm'].resetFields();
										this.editBannerFormVisible = false;
										this.orderBNumber=1;
										this.getBannerData();
									}else{
										this.$message({
											message: '提交失败',
											type: 'error'
										});
									}
								})
								.catch((err) => {
									console.log(err);
								})
						}).catch(() => {
							this.$message({
								type: 'info',
								message: '已取消添加'
							});
							this.editBannerFormVisible = false;
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
	    	},
	    	handleBannerDelete(index,row){
	    		this.$confirm('确认要删除这条记录吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/delete/'+row.id+'?pageType=dynamic&contentType=banner',
						method: 'delete',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					}).then((res) => {
						if(res.data === 1){
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getBannerData();
						}else{
							this.$message({
								message: '删除失败',
								type: 'error'
							});
						}
							
					}).catch((err) => {
							console.log(err);
					})
				})
	    	},
			//上传封面
			handleAvatarSuccess(res, file) {
				this.addBannerForm.photo = res;
			},
			handleEditAvatarSuccess(res, file) {
				this.editBannerForm.photo = res;
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if(!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if(!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
		
			//健身干货
			getExerciseData(){
				this.listLoading = true;
				this.$axios({
					url: this.path + 'page/content/details?pageType=dynamic&contentType=hot_dynamic',
					method: 'get',
					headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
				})
				.then((res) => {
					this.exerciseData = res.data;
					this.listLoading = false;
				})
				.catch((err) => {
					console.log(err);
				})
			},
			getExOrder(){
				var arr = [];
				for(var i = 1 ;i <= this.exerciseData.length;i++){
					arr.push(i);
				}
				this.eOrderData = arr
			},
			dateChange(val){
				this.listQuery.startTime = val.slice(0, 10)
				this.listQuery.overTime = val.slice(13, 23)
			},
			handleExerciseAdd(){
				this.addExerciseFormVisible = true;
				this.ehidden = true;
			},
			getTotal() {
				this.$axios({
						url: this.path + 'resource/dynamic/count',
						method: 'get',
						params: this.listQuery,
						transformRequest: [function(params) {
							let ret = ''
							for(let it in params) {
								ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&'
							}
							return ret
						}],
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					})
					.then((res) => {
						this.total = res.data;
					})
					.catch((err) => {
						console.log(err);
					})
			},
			getData() {
				this.listLoading = true;
				this.$axios({
						url: this.path + 'resource/dynamic/list',
						method: 'get',
						params: this.listQuery,
						transformRequest: [function(params) {
							let ret = ''
							for(let it in params) {
								ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&'
							}
							return ret
						}],
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					})
					.then((res) => {
						this.getTotal();
						this.tableData = res.data;
						this.listLoading = false;
					})
					.catch((err) => {
						console.log(err);
					})
			},
			handleFilter() {
				this.getData();
				this.ehidden = false;
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getData();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getData();
			},
			addHotDynamic(index,row){
				this.$confirm('确认要添加吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/add?pageType=dynamic&contentType=hot_dynamic&contentId='+ row.id,
						method: 'put',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					}).then((res) => {
						if(res.data == 1){
							this.$message({
								message: '操作成功',
								type: 'success'
							});
							this.addExerciseFormVisible = false;
							this.getExerciseData();
						}else{
							this.$message({
								message: '操作失败',
								type: 'error'
							});
						}
							
					}).catch((err) => {
							console.log(err);
					})
				})
			},
			handleExerciseEdit(index,row){
				this.editOrderEVisible = true;
				this.editOrderEQuery = Object.assign({}, row);
				this.getExOrder();
			},
			handleExerciseDelete(index,row){
				this.$confirm('确认要删除这条记录吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/delete/'+row.id+'?pageType=dynamic&contentType=hot_dynamic',
						method: 'delete',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					}).then((res) => {
						if(res.data === 1){
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getExerciseData();
						}else{
							this.$message({
								message: '删除失败',
								type: 'error'
							});
						}
							
					}).catch((err) => {
							console.log(err);
					})
				})
			},
			exOrderSubmit(index,row){
				this.$confirm('确认要修改排序吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/update',
						method: 'post',
						data:{
							id: this.editOrderEQuery.id,
							orderNumber: this.orderNum
						},
						transformRequest: [function(params) {
							let ret = ''
							for(let it in params) {
								ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&'
							}
							return ret
						}],
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					}).then((res) => {
						if(res.data == 1){
							this.$message({
								message: '操作成功',
								type: 'success'
							});
							this.editOrderEVisible = false;
							this.getExerciseData();
							this.orderNum = 1
						}else{
							this.$message({
								message: '操作失败',
								type: 'error'
							});
						}
							
					}).catch((err) => {
							console.log(err);
					})
				})
			},
			//
  		}
	}
</script>
<style type="text/css">
.btn-box{
	margin:20px 0;
}
.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	
	.avatar-uploader .el-upload:hover {
		border-color: #20a0ff;
	}
	
	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 375px;
		height:165px;
		line-height: 165px;
		text-align: center;
	}
	.avatar {
		width: 375px;
		height:165px;
		display: block;
	}
	
	.el-upload--text {
		border: none;
		width: auto;
		height: auto;
	}
	.article-item{
		border:1px solid #dfe6ec;
		padding: 0 20px 20px;
	}
	.tags-box{
		height: 50px;
	}
	.tags-box .tags{
		float: left;
	}
	.tags-box .art-btnbox{
		float: right;
	}
	.art-photo{
		float: left;
	}
	.art-info{
		position: relative;
		left: 30px;
		padding-right: 30px;
	}
	.art-photo img{
		width: 375px;
		height:165px;
	}
	.art-title{
		margin-bottom: 10px;
	}
	.art-content{
		line-height: 27px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		overflow: hidden;
	}
	.change{
		text-align: center;
		margin-top: 10px;
	}
	.el-pagination{
		text-align: right;
		margin-top: 30px;
	}
	.d-context{
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
</style>