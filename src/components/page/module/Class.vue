<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 社区管理</el-breadcrumb-item>
				<el-breadcrumb-item> 模块管理</el-breadcrumb-item>
				<el-breadcrumb-item>课程架构</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
	
		<!--查询-->
		<div class="plugins-tips">
			<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-form-item label="条件查询">
					<el-input v-model="listQuery.keyword" placeholder="输入课程名称/健身房搜索"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="listQuery.classKind" placeholder="请选择课程渠道">
						<el-option v-for="item in kindData" :key="item.id" :label="item.value" :value="item.id"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="listQuery.typeId" placeholder="请选择课程分类">
						<el-option v-for="item in typeData" :key="item.id" :label="item.typeName" :value="item.id"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="listQuery.isFree" placeholder="是否免费">
						<el-option v-for="item in freeData" :key="item.type" :label="item.value" :value="item.type"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="datetime" type="daterange" placeholder="选择日期" @change="dateChange">
					</el-date-picker>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" icon="search" @click="handleFilter()">查询</el-button>
					<el-button type="primary" icon="plus" @click="handleAdd()">添加</el-button>
				</el-form-item>
			</el-form>
		</div>

		<!--列表-->
		<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">

			<el-table-column prop="className" label="课程名称" sortable></el-table-column>
			<!--<el-table-column prop="classInfo" label="课程简介"></el-table-column>-->
			<!--<el-table-column prop="classVideoUrl" label="视频地址">
				<template scope="scope">
					<a :href="scope.row.classVideoUrl" target="_blank">{{scope.row.classVideoUrl}}</a>
			    </template>
			</el-table-column>-->
			<el-table-column prop="gymId" label="健身房"> </el-table-column>
			<el-table-column prop="classKind" label="课程渠道" width="130">
				<template scope="scope">
					<span v-if="scope.row.classKind == 0">线上课程</span>
					<span v-else>线下课程</span>
				</template>
			</el-table-column>
			<el-table-column prop="typeId" label="课程类型" width="130"> </el-table-column>
			<el-table-column prop="isFree" label="是否免费" width="130">
				<template scope="scope">
					<span v-if="scope.row.isFree == true">是</span>
					<span v-else>否</span>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" width="210"></el-table-column>
			<el-table-column label="操作" width="250">
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
			<el-dialog v-model="detailsVisible" size="large" title="课程详情">
				<el-table :data="detailsData" border stripe style="width:100%" v-loading="listLoading">

			<el-table-column prop="className" label="课程名称"></el-table-column>
			<el-table-column prop="classInfo" label="课程简介"></el-table-column>
			<el-table-column prop="classVideoUrl" label="视频地址">
				<template scope="scope">
					<a :href="scope.row.classVideoUrl" target="_blank">{{scope.row.classVideoUrl}}</a>
			    </template>
			</el-table-column>
			<!--<el-table-column prop="classKind" label="课程渠道" width="130">
				<template scope="scope">
					<span v-if="scope.row.classKind == 0">线上课程</span>
					<span v-else>线下课程</span>
				</template>
			</el-table-column>
			<el-table-column prop="typeId" label="课程类型" width="130"> </el-table-column>
			<el-table-column prop="gymId" label="健身房"> </el-table-column>
			<el-table-column prop="isFree" label="是否免费" width="130"> 
			<template scope="scope">
					<span v-if="scope.row.isFree == true">是</span>
					<span v-else>否</span>
				</template>
			</el-table-column>-->
			<el-table-column prop="classPrice" label="课程售价" width="130"> </el-table-column>
			<el-table-column prop="classVideoTime" label="时长(秒)" width="130"> </el-table-column>
			<el-table-column prop="classVideoSize" label="大小(MB)" width="135"> </el-table-column>
			<el-table-column prop="viewNum" label="观看次数" width="130"> </el-table-column>
			<el-table-column prop="sumDiscuss" label="评论数" width="120"> </el-table-column>
			<!--<el-table-column prop="createTime" label="创建时间"></el-table-column>-->
		</el-table>
			</el-dialog>
		</div>
		<!--end-->
		<!--编辑-->
		<div class="panel">
			<el-dialog v-model="editFormVisible" size="tiny" title="编辑活动">
				<el-form ref="editForm" :model="editForm" label-width="80px" :rules="editRules">
					<el-form-item label="课程名称" prop="className">
						<el-input v-model="editForm.className"></el-input>
					</el-form-item>
					<el-form-item label="课程简介" prop="classInfo">
						<el-input v-model="editForm.classInfo" type="textarea"></el-input>
					</el-form-item>
					<el-form-item label="视频地址" prop="classVideoUrl">
						<el-input v-model="editForm.classVideoUrl"></el-input>
					</el-form-item>
					<el-form-item label="课程渠道" prop="classKind">
						<el-select v-model="editForm.classKind" placeholder="请选择课程渠道" @change="eKindChange">
							<el-option v-for="item in kindData" :key="item.id" :label="item.value" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="课程类型" prop="typeId">
						<el-select v-model="editForm.typeId" placeholder="请选择课程分类">
							<el-option v-for="item in typeData" :key="item.id" :label="item.typeName" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="健身房" prop="gymId">
						<el-select v-model="editForm.gymId" placeholder="请选择课程分类">
							<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否免费" prop="isFree">
						<el-select v-model="editForm.isFree" placeholder="是否免费" @change="eFreeChange">
							<el-option v-for="item in freeData" :key="item.type" :label="item.value" :value="item.type"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="课程售价" prop="classPrice">
							<el-input v-model="editForm.classPrice" :value="0" :disabled="epdisabled"></el-input>
					</el-form-item>
					<el-form-item label="时长(秒)" prop="classVideoTime">
						<el-input v-model="editForm.classVideoTime" :disabled="edisabled"></el-input>
					</el-form-item>
					<el-form-item label="大小(MB)" prop="classVideoSize">
						<el-input v-model="editForm.classVideoSize" :disabled="edisabled"></el-input>
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
			<el-dialog v-model="addFormVisible" size="tiny" title="添加活动">
				<el-form ref="addForm" :model="addForm" label-width="80px" :rules="addRules">
					<el-form-item label="课程名称" prop="className">
						<el-input v-model="addForm.className"></el-input>
					</el-form-item>
					<el-form-item label="课程简介" prop="classInfo">
						<el-input v-model="addForm.classInfo" type="textarea"></el-input>
					</el-form-item>
					<el-form-item label="视频地址" prop="classVideoUrl">
						<el-input v-model="addForm.classVideoUrl"></el-input>
					</el-form-item>
					<el-form-item label="课程渠道" prop="classKind">
						<el-select v-model="addForm.classKind" placeholder="请选择课程渠道" @change="KindChange">
							<el-option v-for="item in kindData" :key="item.id" :label="item.value" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="课程类型" prop="typeId">
						<el-select v-model="addForm.typeId" placeholder="请选择课程分类">
							<el-option v-for="item in typeData" :key="item.id" :label="item.typeName" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="健身房" prop="gymId">
						<el-select v-model="addForm.gymId" placeholder="请选择课程分类">
							<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否免费" prop="isFree">
						<el-select v-model="addForm.isFree" placeholder="是否免费" @change="FreeChange">
							<el-option v-for="item in freeData" :key="item.type" :label="item.value" :value="item.type"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="课程售价" prop="classPrice">
							<el-input v-model="addForm.classPrice" :value="0" :disabled="pdisabled"></el-input>
					</el-form-item>
					<el-form-item label="时长(秒)" prop="classVideoTime">
						<el-input v-model="addForm.classVideoTime" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="大小(MB)" prop="classVideoSize">
						<el-input v-model="addForm.classVideoSize" :disabled="disabled"></el-input>
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
				tableData: [], //列表数组
				token:'',
				detailsData: undefined,
				typeData:[],//课程分类
				gymData:[],//健身房
				detailsVisible: false,
				pdisabled:true,
				epdisabled:true,
				disabled:true,
				edisabled:true,
				listLoading: false,
				total: null,
				listQuery: {
					page: 1,
					limit: 10,
					keyword: undefined,
					classKind:undefined,
					typeId:undefined,
					isFree:undefined,
					startTime:undefined,
					overTime:undefined,
				},
				//添加
				datetime:'',
				addForm: {
					className: '',
					classInfo:'',
					classVideoUrl: '',
					classVideoTime: 0,
					classVideoSize: 0,
					classKind:1,
					typeId:'',
					gymId:'',
					isFree:true,
					classPrice:0
				},
				addRules: {
					className: [
						{ required: true, validator: valid.checkClassName, trigger: 'blur' }
					],
					gymId: [
						{ required: true, validator: valid.checkGym, trigger: 'change' }
					]
				},

				//编辑
				editForm: {
					id:0,
					className: '',
					classInfo:'',
					classVideoUrl: '',
					classVideoTime: undefined,
					classVideoSize: '',
					classKind:0,
					typeId:'',
					gymId:'',
					isFree:true,
					classPrice:''
				},
				editRules: {
					className: [
						{ required: true, validator: valid.checkClassName, trigger: 'blur' }
					],
					gymId: [
						{ required: true, validator: valid.checkGym, trigger: 'change' }
					]
				},
				addFormVisible: false,
				editFormVisible: false,
				kindData: [
				{
					id:0,
					value:'线上课程'
				},
				{
					id:1,
					value:'线下课程'
				}],
				freeData:[{
					type:false,
					value:'否'
				},
				{
					type:true,
					value:'是'
				}],
			}
		},
		filters:{
  			time (value) {
        		var date = new Date(value),
		        y = date.getFullYear(),
		        m = date.getMonth() + 1,
		        d = date.getDate(),
		        h = date.getHours(),
		        i = date.getMinutes(),
		        s = date.getSeconds();
		        if (m < 10) {
		            m = '0' + m;
		        }
		        if (d < 10) {
		            d = '0' + d;
		        }
		        if (h < 10) {
		            h = '0' + h;
		        }
		        if (i < 10) {
		            i = '0' + i;
		        }
		        if (s < 10) {
		            s = '0' + s;
		        }
			//  获取时间格式 2017-01-03 10:13:48
		        var t = y+'-'+m+'-'+d+'    '+h+':'+i+':'+s;
			//  获取时间格式 2017-01-03
			//	var t = y + '-' + m + '-' + d;
		        return t;
		    		}
  	},
		mounted() {
			this.$nextTick(() => {
				this.token = sessionStorage.getItem('token');
				this.getData();
			});
		},
		methods: {  
			//课程分类
			getType(){
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
			FreeChange(){
				var free = this.addForm.isFree;
				if(free == true){
					this.addForm.classPrice = 0;
					this.pdisabled = true;
				}else{
					this.addForm.classPrice = '';
					this.pdisabled = false;
				}
				
			},
			eFreeChange(){
				var efree = this.editForm.isFree;
				if(efree == true){
					this.editForm.classPrice = 0;
					this.epdisabled = true;
				}else{
					this.editForm.classPrice = this.editForm.classPrice;
					this.epdisabled = false;
				}
			},
			KindChange(){
				var kind = this.addForm.classKind;
				if(kind == 1){
					this.addForm.classVideoTime = 0;
					this.addForm.classVideoSize = 0;
					this.disabled = true;
				}else{
					this.addForm.classVideoTime = '';
					this.addForm.classVideoSize = '';
					this.disabled = false;
				}
				
			},
			eKindChange(){
				var ekind = this.editForm.classKind;
				if(ekind == 1){
					this.editForm.classVideoTime = 0;
					this.editForm.classVideoSize = 0;
					this.edisabled = true;
				}else{
					this.editForm.classVideoTime = this.editForm.classVideoTime;
					this.editForm.classVideoSize = this.editForm.classVideoSize;
					this.edisabled = false;
				}
			},
			//健身房列表
			getGym(){
				this.$axios({
						url: this.path + 'resource/gym/select',
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
					})
					.then((res) => {
						this.gymData = res.data
					})
					.catch((err) => {
						console.log(err);
					})
			},
			getTotal() {
				this.$axios({
						url: this.path + 'resource/class/count',
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
						url: this.path + 'resource/class/list',
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
						this.getType();
						this.getGym();
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
			dateChange(val){
				this.listQuery.startTime = val.slice(0, 10)
				this.listQuery.overTime = val.slice(13, 23)
			},
		
			handleAdd() {
				this.addFormVisible = true;
		
				
			},
			//查看
			selectDetails(index, row) {
				this.$axios({
						url: this.path + 'resource/class/' + row.id,
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
									url: this.path + 'resource/class/add',
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
										this.addFormVisible = false;
										this.addForm.activityPath=''
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
									url: this.path + 'resource/class/update',
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
						url: this.path + 'resource/class/delete/' + row.id,
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
	.details-title{
		text-align: center;
		line-height: 50px;
		font-size: 20px;
		height: 50px;
		margin-bottom: 20px;
		color: #1f2d3d;
	}
	.details-content{
		font-size: 14px;
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