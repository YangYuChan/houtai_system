<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 社区管理</el-breadcrumb-item>
				<el-breadcrumb-item> 页面维护</el-breadcrumb-item>
				<el-breadcrumb-item>首页内容维护</el-breadcrumb-item>
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
    <el-tab-pane label="精选文章" name="second">
		<div class="article-list">
			<ul>
				<li class="article-item clearfix" v-for="item in articleData">
						<header class="tags-box">
							<span class="tags">现有文章及封面</span>
							<div class="art-btnbox">
								
								<el-button @click="handleArticleEditPic(item)">替换封面图</el-button>
								<el-button @click="handleArticleChange(item)">替换文章</el-button>
							
							</div>
						</header>
						<div class="art-photo">
							<img v-if="item.photo" :src="item.photo">
							<img v-else="item.resourceData.articlePhoto" :src="item.resourceData.articlePhoto">
						</div>
						<div class="art-info">
							<h4 class="art-title" v-html="item.resourceData.title"></h4>
							<article class="art-content" v-html="item.resourceData.briefContext"></article>
						</div>
				</li>
			</ul>
		</div>
		<!--编辑封面-->
			<el-dialog v-model="editArticlePicFormVisible" size="tiny" title="编辑文章封面">
				<el-form ref="editArticlePicForm" :model="editArticlePicForm" label-width="80px" :rules="editArticleRules">
					<el-form-item label="封面图" >
						<el-upload class="avatar-uploader" :action="uploadUrl()" :show-file-list="false" :on-success="handleArtAvatarSuccess" :before-upload="beforeAvatarUpload">
							<img v-if="editArticlePicForm.photo" :src="editArticlePicForm.photo " class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<template>
							<span style="color:#999999">(点击图片重新上传)</span>
						</template>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="articleEditSubmit">提交</el-button>
						<el-button @click="editArticlePicFormVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
			<!--替换文章-->
			<el-dialog v-model="editArticleFormVisible" size="small" title="替换文章">
				<el-form :inline="true" :model="changeQuery" class="demo-form-inline">
					<el-form-item label="条件查询">
						<el-select placeholder="请选择资讯类别" v-model="changeQuery.tag">
						    <el-option v-for="item in sortList" :key="item.typeName" :label="item.typeName" :value="item.typeName"></el-option>
						  </el-select>
					</el-form-item>
					<el-form-item>
						<el-date-picker v-model="datetime" type="daterange" placeholder="选择日期" @change="dateChange">
					</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-input v-model="changeQuery.keyword" placeholder="输入资讯标题搜索"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="search" @click="handleArticleList()">查询</el-button>
					</el-form-item>
				</el-form>
				<el-table :data="ArticleList" border stripe style="width:100%;" v-loading="listLoading" :hidden="hidden">
					<el-table-column prop="title" label="文章标题"> </el-table-column>
					<el-table-column prop="briefContext" label="文章内容">
						<template scope="scope">
							<div class="d-context" v-html="scope.row.briefContext">
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="150">
						<template scope="scope">
							<el-button type="primary" size="small" @click="handleChange(scope.index,scope.row)">替换</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="block" :hidden="hidden" >
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="changeQuery.page" :page-sizes="[10,20,30,50]" :page-size="changeQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="artTotal">
			</el-pagination>
		</div>
			</el-dialog>
		<!--end-->
    </el-tab-pane>
    <el-tab-pane label="健身干货" name="third">
    	<div class="btn-box">
			 <el-button type="primary" size="large" @click="handleExerciseAdd">添加</el-button>
		</div>
    	<el-table :data="exerciseData" border stripe style="width:100%" v-loading="listLoading">
			<el-table-column prop="no" width="150" label="当前排序"></el-table-column>
			<el-table-column prop="resourceData.className" label="课程名称"></el-table-column>
			<el-table-column prop="resourceData.classCoach" label="教练"></el-table-column>
			<el-table-column prop="resourceData.gymId" label="健身房"></el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button size="small" @click="handleExerciseEdit(scope.index,scope.row)">编辑排序</el-button>
					<el-button type="danger" size="small" @click="handleExerciseDelete(scope.index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--添加健身-->
		<el-dialog v-model="addExerciseFormVisible" size="small" title="添加健身干货">
				<el-form :inline="true" :model="addEQuery" class="demo-form-inline">
					<el-form-item label="条件查询">
						<el-select v-model="addEQuery.typeId" placeholder="请选择课程分类">
						<el-option v-for="item in typeData" :key="item.id" :label="item.typeName" :value="item.id"> </el-option>
					</el-select>
					</el-form-item>
					
					<el-form-item>
						<el-input v-model="addEQuery.keyword" placeholder="输入课程名称搜索"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="search" @click="handleClassList()">查询</el-button>
					</el-form-item>
				</el-form>
				<el-table :data="ClassList" border stripe style="width:100%;" v-loading="listLoading" :hidden="ehidden">
					<el-table-column prop="className" label="课程名称"></el-table-column>
					<el-table-column prop="classInfo" label="课程简介"></el-table-column>
					<el-table-column prop="classCoach" label="教练"></el-table-column>
					<el-table-column prop="gymId" label="健身房"></el-table-column>
					<el-table-column label="操作" width="150">
						<template scope="scope">
							<el-button type="primary" size="small" @click="handleExerciseNew(scope.index,scope.row)">添加</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="block" :hidden="ehidden" >
			<el-pagination @size-change="handleESizeChange" @current-change="handleECurrentChange" :current-page="addEQuery.page" :page-sizes="[10,20,30,50]" :page-size="addEQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="classTotal">
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
					<el-form-item label="课程名称">
						<el-input v-model="editOrderEQuery.resourceData.className" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="重新排序" >
					<el-select v-model="orderNum" placeholder="请选择课程排序">
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
    <!--<el-tab-pane label="为你推荐" name="fourth">
    	<div class="article-list">
			<ul>
				<li class="article-item clearfix" v-for="item in articleData">
						<header class="tags-box">
							<span class="tags">现有封面及链接</span>
							<div class="art-btnbox">
								
								<el-button @click="handleArticleEditPic(item)">替换封面图</el-button>
								<el-button @click="handleArticleChange(item)">替换文章</el-button>
							
							</div>
						</header>
						<div class="art-photo">
							<img v-if="item.photo" :src="item.photo">
							<img v-else="item.resourceData.articlePhoto" :src="item.resourceData.articlePhoto">
						</div>
						<div class="art-info">
							<h4 class="art-title">{{item.resourceData.title}}</h4>
							<article class="art-content" v-html="item.resourceData.briefContext"></article>
						</div>
				</li>
			</ul>
		</div>
    </el-tab-pane>-->
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
			//文章
			articleData:[],
			ArticleList:[],
			datetime:'',
			artTotal:undefined,
			changeQuery:{
				startTime:'',
				overTime:'',
				tag:'',
				keyword:'',
				page: 1,
				limit: 10,
			},
			artId:'',
			hidden:true,
			editArticlePicForm:{
				id:'',
				photo:'',
			},
			editArticleRules: {
				photo: [
					{ required: true, message:'请上传图片', trigger: 'change' }
				],
			},
			editArticleFormVisible:false,
			editArticlePicFormVisible:false,
			sortList:[],
			//健身
			exerciseData:[],
			ClassList:[],
			typeData:[],
			eOrderData:[],//排序数组
			classTotal:undefined,
			addExerciseFormVisible:false,
			addEQuery:{
				typeId:'',
				keyword:'',
				page: 1,
				limit: 10,
				
			},
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
				this.getArticleData();
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
					url: this.path + 'page/content/list?pageType=index&contentType=banner',
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
									url: this.path + 'page/content/add?pageType=index&contentType=banner',
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
									url: this.path + 'page/content/update?pageType=index',
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
						url: this.path + 'page/content/delete/'+row.id+'?pageType=index&contentType=banner',
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
			//文章模块
			getArticleData(){
				this.listLoading = true;
				this.$axios({
					url: this.path + 'page/content/details?pageType=index&contentType=chosen_article',
					method: 'get',
					headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
				})
				.then((res) => {
					this.articleData = res.data;
					this.listLoading = false;
				})
				.catch((err) => {
					console.log(err);
				})
			},
			handleArticleEditPic(row){
				this.editArticlePicFormVisible = true;
				this.editArticlePicForm = Object.assign({}, row);
			},
			handleArticleChange(row){
				this.editArticleFormVisible = true;
				this.artId = row.id
				this.getType();
				
			},
			handleArtAvatarSuccess(res, file) {
				this.editArticlePicForm.photo = res;
			},
			dateChange(val){
				this.changeQuery.startTime = val.slice(0, 10)
				this.changeQuery.overTime = val.slice(13, 23)
			},
			articleEditSubmit(){
				this.$refs.editArticlePicForm.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$axios({
									url: this.path + 'page/content/update?pageType=index&contentType=chosen_article',
									method: 'post',
									data:{
										id:this.editArticlePicForm.id,
										photo:this.editArticlePicForm.photo
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
										this.$refs['editArticlePicForm'].resetFields();
										this.editArticlePicFormVisible = false;
										this.getArticleData();
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
								message: '已取消修改'
							});
							this.editArticlePicFormVisible = false;
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			handleSizeChange(val) {
				this.changeQuery.limit = val;
				this.handleArticleList();
			},
			handleCurrentChange(val) {
				this.changeQuery.page = val;
				this.handleArticleList();
			},
			getArtTotal() {
				this.$axios({
						url: this.path + 'resource/article/count',
						method: 'get',
						params: this.changeQuery,
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
						this.artTotal = res.data;
					})
					.catch((err) => {
						console.log(err);
					})
			},
			handleArticleList(){
				this.$axios({
						url: this.path + 'resource/article/list',
						method: 'get',
						params: this.changeQuery,
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
						this.getArtTotal();
						this.ArticleList = res.data;
						this.hidden = false;
					})
					.catch((err) => {
						console.log(err);
					})
			},
			getType(){
				this.$axios({
						url: this.path + 'resource/article/types',
						method: 'get',
					})
					.then((res) => {
						this.sortList = res.data;
					})
					.catch((err) => {
						console.log(err);
					})
			},
			handleChange(index,row){
				this.$confirm('确认要替换吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/update?contentId=' + row.id +'&id='+ this.artId,
						method: 'post',
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
							this.editArticleFormVisible = false;
							this.getArticleData();
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
			//健身干货
			getExerciseData(){
				this.listLoading = true;
				this.$axios({
					url: this.path + 'page/content/details?pageType=index&contentType=real_exercise',
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
			getExTotal() {
				this.$axios({
						url: this.path + 'resource/class/count',
						method: 'get',
						params: this.addEQuery,
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
						this.classTotal = res.data;
					})
					.catch((err) => {
						console.log(err);
					})
			},
			handleClassList(){
				this.$axios({
						url: this.path + 'resource/class/list',
						method: 'get',
						params: this.addEQuery,
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
						this.getExTotal();
						this.ClassList = res.data;
						this.ehidden = false;
					})
					.catch((err) => {
						console.log(err);
					})
			},
			getClassType(){
				this.$axios({
						url: this.path + 'resource/class/types',
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					})
					.then((res) => {
						this.typeData = res.data
					})
					.catch((err) => {
						console.log(err);
					})
			},
			handleExerciseAdd(){
				this.addExerciseFormVisible = true;
				this.getClassType();
			},
			handleESizeChange(val) {
				this.addEQuery.limit = val;
				this.handleClassList();
			},
			handleECurrentChange(val) {
				this.addEQuery.page = val;
				this.handleClassList();
			},
			handleExerciseNew(index,row){
				this.$confirm('确认要添加吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/add?pageType=index&contentType=real_exercise&contentId='+ row.id,
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
						url: this.path + 'page/content/delete/'+row.id+'?pageType=index&contentType=real_exercise',
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