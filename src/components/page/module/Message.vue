<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 社区管理</el-breadcrumb-item>
				<el-breadcrumb-item> 模块管理</el-breadcrumb-item>
				<el-breadcrumb-item>资讯推送</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
	
		<!--查询-->
		<div class="plugins-tips">
			<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-form-item label="条件查询">
					<el-input v-model="listQuery.keyword" placeholder="输入资讯标题搜索"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" icon="search" @click="handleFilter()">查询</el-button>
					<!--<router-link to="/addMessage">
						<el-button type="primary" icon="plus">添加</el-button>
					</router-link>-->
					<el-button type="primary" icon="plus" @click="handleAdd()">添加</el-button>
				</el-form-item>
			</el-form>
		</div>

		<!--列表-->
		<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">

			<el-table-column prop="title" label="标题"></el-table-column>
			<el-table-column prop="createTime" label="发布时间"> </el-table-column>
			<el-table-column prop="readCount" label="浏览次数"></el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button size="small" @click="handleSelect(scope.index,scope.row)">查看</el-button>
					<el-button size="small" @click="handleEdit(scope.index,scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDelete(scope.index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!--查看-->
		<div class="panel">
			<el-dialog v-model="detailsVisible" size="large" title="资讯详情">
				<section border stripe style="width: 100%" >
					<div v-for="item in detailsData">
					<div class="btn-group" style="text-align: right;">
						<el-button size="large" type="primary" @click="handleSelect(item.id)">分析</el-button>
						<el-button size="large" @click="detailsVisible = false">返回</el-button>
					</div>
						<h2 class="details-title" v-html="item.title"></h2>
						<article class="details-content" v-html="item.context"></article>
					</div>
				</section>
			</el-dialog>
		</div>
		<!--end-->
		<!--编辑-->
		<div class="panel">
			<el-dialog v-model="editFormVisible" size="small" title="编辑资讯">
				<el-form ref="editForm" :model="editForm" label-width="80px" :rules="editRules">
					<el-form-item label="文章分类" prop="tag">
						 <el-select v-model="editForm.tag">
						    <el-option v-for="item in sortList" :key="item.typeName" :label="item.typeName" :value="item.typeName"></el-option>
						  </el-select>
					</el-form-item>
					<el-form-item label="文章标题" prop="title">
						<el-input v-model="editForm.title"></el-input>
					</el-form-item>
					<el-form-item label="文章作者" prop="auth">
						<el-input v-model="editForm.auth"></el-input>
					</el-form-item>
					<el-form-item label="封面图" >
						<el-upload class="avatar-uploader" :action="uploadUrl()" :show-file-list="false" :on-success="handleEditAvatarSuccess" :before-upload="beforeAvatarUpload">
							<img v-if="editForm.articlePhoto" :src="editForm.articlePhoto" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
					<el-form-item label="分享内容" prop="shareContext">
						<el-input v-model="editForm.shareContext"></el-input>
					</el-form-item>
					<el-form-item label="文章内容" prop="context">
						 <ueditor style="height: 500px;" v-model="editForm.context"></ueditor>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="editSubmitForm">提交</el-button>
						<el-button @click="editFormVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</div>
		<!--end-->
		<!--添加-->
		<div class="panel">
			<el-dialog v-model="addFormVisible" size="small" title="添加资讯">
				<el-form ref="addForm" :model="addForm" label-width="80px" :rules="addRules">
					<el-form-item label="文章分类" prop="tag">
						 <el-select placeholder="请选择文章分类" v-model="addForm.tag">
						    <el-option v-for="item in sortList" :key="item.typeName" :label="item.typeName" :value="item.typeName"></el-option>
						  </el-select>
					</el-form-item>
					<el-form-item label="文章标题" prop="title">
						<el-input v-model="addForm.title"></el-input>
					</el-form-item>
					<el-form-item label="文章作者" prop="auth">
						<el-input v-model="addForm.auth"></el-input>
					</el-form-item>
					<el-form-item label="封面图" >
						<el-upload class="avatar-uploader" :action="uploadUrl()" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
							<img v-if="addForm.articlePhoto" :src="addForm.articlePhoto" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
					<el-form-item label="分享内容" prop="shareContext">
						<el-input v-model="addForm.shareContext"></el-input>
					</el-form-item>
					<el-form-item label="文章内容" prop="context">
						<!--<VueUEditor @ready="editorReady" v-model="addForm.context" style="height: 800px;"></VueUEditor>-->
						 <ueditor style="height: 500px;" v-model="addForm.context"></ueditor>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="addSubmitForm">提交</el-button>
						<el-button @click="addFormVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
				
			</el-dialog>
		</div>
		<!--end-->
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
				tableData: [], //列表数组
				token:'',
				detailsData: undefined,
				sortList: [],
				detailsVisible: false,
				listLoading: false,
				total: null,
				listQuery: {
					page: 1,
					limit: 10,
					keyword: undefined,
				},
				//添加
				addForm: {
					tag:'',
					title: '',
					auth:'',
					articlePhoto: '',
					shareContext: '',
					context: '',
				},
				addRules: {
					title: [
						{ required: true, validator: valid.checkTitle, trigger: 'blur' }
					],
					auth: [
						{ required: true, validator: valid.checkAuth, trigger: 'blur' }
					],
					context: [
						{ required: true, validator: valid.checkContext, trigger: 'blur' }
					],
				},

				//编辑
				editForm: {
					id:0,
					tag:'',
					title: '',
					auth:'',
					articlePhoto: '',
					shareContext: '',
					context: '',
				},
				editRules: {
					title: [
						{ required: true, validator: valid.checkVrName, trigger: 'blur' }
					],
					auth: [
						{ required: true, validator: valid.checkVrName, trigger: 'blur' }
					],
					context: [
						{ required: true, validator: valid.checkVrName, trigger: 'blur' }
					],
				},
				addFormVisible: false,
				editFormVisible: false,
			}
		},

		mounted() {
			this.$nextTick(() => {
				this.token = sessionStorage.getItem('token');
				this.getData();
			});
		},
		methods: {
			uploadUrl(){
				return this.action
			},
			getType(){
				this.$axios({
						url: this.path + 'resource/article/types',
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
							
						}
					})
					.then((res) => {
						this.sortList = res.data;
					})
					.catch((err) => {
						console.log(err);
					})
			},
			getTotal() {
				this.$axios({
						url: this.path + 'resource/article/count',
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
						url: this.path + 'resource/article/list',
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
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getData();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getData();
			},
			handleSelect(index, row) {
				this.detailsVisible = true;
				this.selectDetails(index, row);
			},
			handleAdd() {
				this.addFormVisible = true;
				this.getType();
		
				
			},
			//查看
			selectDetails(index, row) {
				this.$axios({
						url: this.path + 'resource/article/' + row.id,
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
							
						}
					})
					.then((res) => {
						this.detailsData = res.data;
					})
					.catch((err) => {
						console.log(err);
					})
			},
			//添加
			addSubmitForm() {
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$axios({
									url: this.path + 'resource/article/add',
									method: 'put',
									params:this.addForm,
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
										this.$refs['addForm'].resetFields();
										this.addForm.articlePhoto='';
										this.addFormVisible = false;
										this.getData();
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
								message: '已取消上传'
							});
							this.addFormVisible = false;
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},

			handleEdit(index, row) {
				this.editFormVisible = true;
				this.getType();
				this.editForm = Object.assign({}, row);
			},
			editSubmitForm() {
				this.$refs.editForm.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.editLoading = true;
							this.$axios({
									url: this.path + 'resource/article/update',
									method: 'post',
									params:this.editForm,
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
										this.$refs['editForm'].resetFields();
										this.editFormVisible = false;
										this.getData();
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
								message: '已取消编辑'
							});
							this.editFormVisible = false;
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			handleDelete(index, row) {
				this.$confirm('确认要删除这条记录吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'resource/article/delete/' + row.id,
						method: 'delete',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					}).then((res) => {
						if(res.data == 1){
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getData();
						}else if(res.data == 0){
							this.$message({
								message: '删除失败',
								type: 'error'
							});
						}else{
							this.$message({
								message: '删除失败，该信息在前端展示，请先移除',
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
				this.addForm.articlePhoto = res;
			},
			handleEditAvatarSuccess(res, file) {
				this.editForm.articlePhoto = res;
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
			}
			
			
		}
	}
</script>
<style type="text/css">
	.v-modal{
		z-index: 1000!important;
	}
	.el-dialog__wrapper{
		z-index: 1001!important;
	}
	.el-form-item__content{
		line-height: 0;
	}
	.block {
		float: right;
		margin-top: 25px;
	}
	
	.plugins-tips .el-form-item {
		margin-bottom: 0;
	}
	
	.btn-box {
		margin-bottom: 20px;
	}
	.details-title{
		text-align: center;
		line-height: 50px;
		font-size: 20px;
		height: 50px;
		margin-bottom: 20px;
		color: #1f2d3d;
	}
	.details-content{
		font-size: 16px;
		line-height: 1.5;
		padding: 0 5rem;
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
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}
	
	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
	
	.el-upload--text {
		border: none;
		width: auto;
		height: auto;
	}
</style>