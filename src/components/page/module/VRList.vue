<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 社区管理</el-breadcrumb-item>
				<el-breadcrumb-item> 模块管理</el-breadcrumb-item>
				<el-breadcrumb-item>VR视频上传</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!--查询-->
		<div class="plugins-tips">
			<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-form-item label="条件查询">
					<el-input v-model="listQuery.keyword" placeholder="输入视频名称搜索"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" icon="search" @click="handleFilter()">查询</el-button>
					<el-button type="primary" icon="plus" @click="handleAdd()">上传</el-button>
				</el-form-item>
			</el-form>
		</div>

		<!--列表-->
		<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">

			<el-table-column prop="vrName" label="视频名称" sortable></el-table-column>
			<el-table-column prop="createTime" label="发布时间"> </el-table-column>
			<el-table-column prop="viewNum" label="观看次数"></el-table-column>
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
			<el-dialog v-model="detailsVisible" size="large" title="视频详情">
				<el-table :data="detailsData" border stripe style="width: 100%">
					<el-table-column prop="vrName" label="视频名称"></el-table-column>
					<el-table-column prop="vrInfo" label="视频简介" width="400"></el-table-column>
					<el-table-column prop="vrType" label="视频分类" width="100">
						<template scope="scope">
							<span v-if="scope.row.vrType == 1">环境
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="vrVideoTime" label="视频时长" width="100"> </el-table-column>
					<el-table-column prop="vrVideoSize" label="视频大小" width="100"></el-table-column>
					<el-table-column prop="vrPrice" label="视频价格" width="100"></el-table-column>
					<el-table-column prop="createTime" label="发布时间" width="220"></el-table-column>
					<el-table-column prop="viewNum" label="观看次数" width="100"></el-table-column>
					<el-table-column prop="sumFavorite" label="收藏次数" width="100"></el-table-column>
					
				</el-table>
			</el-dialog>
		</div>
		<!--end-->
		<!--编辑-->
		<div class="panel">
			<el-dialog v-model="editFormVisible" size="tiny" title="编辑视频信息">
				<el-form ref="editForm" :model="editForm" label-width="80px" :rules="editRules">
					<el-form-item label="视频分类" prop="vrType">
						<el-select placeholder="请选择分类" v-model="editForm.vrType">
							<el-option v-for="item in sortDate" :key="item.id" :label="item.value" :value="item.id" > </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="视频标题" prop="vrName">
						<el-input v-model="editForm.vrName"></el-input>
					</el-form-item>
					<el-form-item label="封面图" prop="vrPath">
						<el-upload class="avatar-uploader" :action="uploadUrl()"
							:on-success="handleAvatarEditSuccess" 
							:before-upload="beforeAvatarUpload"
							:show-file-list="false">
							<img v-if="editForm.vrPath" :src="editForm.vrPath" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<template>
							<span style="color:#999999">(点击图片重新上传)</span>
						</template>
					</el-form-item>
					<el-form-item label="视频上传" prop="vrVideoUrl">
						<el-upload class="upload-demo" :action="uploadVUrl()"  :on-success="handleEditChange">
							<el-button size="small" type="primary">点击上传</el-button>
							<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
						</el-upload>
					
					</el-form-item>
					<el-form-item label="视频价格" prop="vrPrice">
						<el-input v-model="editForm.vrPrice"></el-input>
					</el-form-item>
					<el-form-item label="视频简介" prop="vrInfo">
						<el-input type="textarea" v-model="editForm.vrInfo"></el-input>
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
			<el-dialog v-model="addFormVisible" size="tiny" title="添加视频">
				<el-form ref="addForm" :model="addForm" label-width="80px" :rules="addRules">
					<el-form-item label="视频分类" prop="vrType">
						<el-select placeholder="请选择分类" v-model="addForm.vrType">
							<el-option v-for="item in sortDate" :key="item.id" :label="item.value" :value="item.id" > </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="视频标题" prop="vrName">
						<el-input v-model="addForm.vrName"></el-input>
					</el-form-item>
					<el-form-item label="封面图" prop="vrPath">
						<el-upload class="avatar-uploader" :action="uploadUrl()"
							:on-success="handleAvatarSuccess" 
							:before-upload="beforeAvatarUpload"
							:show-file-list="false">
							<img v-if="addForm.vrPath" :src="addForm.vrPath" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<template>
							<span style="color:#999999">(点击图片重新上传)</span>
						</template>
					</el-form-item>
					<el-form-item label="分享内容" prop="vrShareContext">
						<el-input v-model="addForm.vrShareContext"></el-input>
					</el-form-item>
					<el-form-item label="视频上传" prop="vrVideoUrl">
						<el-upload ref="upload" class="upload-demo" 
							:action="uploadVUrl()"  
							:on-success="handleChange" 
							:file-list="videoList" 
							:on-preview="handlePreview"
							>
								<el-button v-if="addForm.vrVideoUrl" size="small" type="primary">重新上传</el-button>
								<el-button v-else size="small" type="primary">点击上传</el-button>
						<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
						</el-upload>
					</el-form-item>
					<el-form-item label="视频价格" prop="vrPrice">
						<el-input v-model="addForm.vrPrice"></el-input>
					</el-form-item>
					<el-form-item label="视频简介" prop="vrInfo">
						<el-input type="textarea" v-model="addForm.vrInfo"></el-input>
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
				actionV:global_.actionV,
				token:'',
				tableData: [], //列表数组
				detailsData: [],
				sortDate: [{
					id: 1,
					value: '环境'
				}],
				fileVadioList:[],
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
					vrType:undefined,
					vrName: '',
					vrInfo: '',
					vrPath: undefined,
					vrVideoUrl: undefined,
					vrShareContext:'',
					vrPrice:undefined,
					vrInfo:'',
					
				},
				vrFileList:undefined,
				addRules: {
					vrName: [
						{ required: true, validator: valid.checkVrName, trigger: 'blur' }
					],
				},
				//编辑
				editForm: {
					id:0,
					vrType:undefined,
					vrName: '',
					vrInfo: '',
					vrPath: undefined,
					vrVideoUrl: undefined,
					vrPrice:undefined,
					videoName:'',
				},
				editRules: {
					vrName: [
						{ required: true, validator: valid.checkVrName, trigger: 'blur' }
					],
				},
				addFormVisible: false,
				editFormVisible: false,
				videoList:[],

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
			uploadVUrl(){
				return this.actionV
			},
			getTotal() {
				this.$axios({
						url: this.path + 'resource/vr/count',
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
						url: this.path + 'resource/vr/list',
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
			},
			selectDetails(index, row) {
				this.$axios({
						url: this.path + 'resource/vr/' + row.id,
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
			addSubmitForm() {
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.$axios({
									url: this.path + 'resource/vr/add',
									method: 'put',
									params: this.addForm,
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
									this.$message({
										message: '提交成功',
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getData();
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
									url: this.path + 'resource/vr/update',
									method: 'post',
									params: this.editForm,
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
						url: this.path + 'resource/vr/delete/' + row.id,
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
				this.addForm.vrPath = res;
			},
			handleAvatarEditSuccess(res, file) {
				this.editForm.vrPath = res;
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
			//上传视频
			handlePreview (file) {
				console.log(file)
//				this.file=''
		  	},
			handleChange(file,fileList) {
				this.addForm.vrVideoUrl = fileList.response;
			},
			handleEditChange(file,fileList) {
				this.editForm.vrVideoUrl = fileList.response;

			},
		}
	}
</script>
<style type="text/css">
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
	..el-form-item__content{
		line-height: 36px;
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