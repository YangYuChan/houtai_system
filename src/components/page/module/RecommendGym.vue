<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 社区管理</el-breadcrumb-item>
				<el-breadcrumb-item> 模块管理</el-breadcrumb-item>
				<el-breadcrumb-item>健身房推荐</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
	
		<!--查询-->
		<div class="plugins-tips">
			<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-form-item label="条件查询">
					<el-input v-model="listQuery.keyword" placeholder="输入健身房名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="listQuery.gymPhone" placeholder="输入健身房电话"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="listQuery.address" placeholder="输入健身房地址"></el-input>
				</el-form-item>
				
				<el-form-item>
					<el-date-picker v-model="datetime" type="daterange" placeholder="选择日期" @change="dateChange">
					</el-date-picker>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" icon="search" @click="handleFilter()">查询</el-button>
					<el-button type="primary" icon="plus" @click="handleAdd()">添加推荐</el-button>
				</el-form-item>
			</el-form>
		</div>

		<!--列表-->
		<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
			<el-table-column prop="gymName" label="健身房名称"> </el-table-column>
			<el-table-column prop="gymPhone" label="联系方式"> </el-table-column>
			<el-table-column prop="gymInfo" label="健身房简介" width="300">
				<template scope="scope">
					<div class="gyminfo">
						{{scope.row.gymInfo}}
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="gymPath" label="健身房图片" width="280">
				<template scope="scope">
					<img alt="" :src="scope.row.gymPath" style="width: 225px; height: 100px;"/>
			    </template>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间"></el-table-column>
			<el-table-column prop="city" label="城市"></el-table-column>
			<el-table-column prop="area" label="区域"></el-table-column>
			<el-table-column prop="address" label="详细地址"></el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<!--<el-button size="small" @click="handleSelect(scope.index,scope.row)">查看</el-button>-->
					<!--<el-button size="small" @click="handleEdit(scope.index,scope.row)">编辑</el-button>-->
					<el-button type="danger" size="small" @click="handleDelete(scope.index,scope.row)">取消推荐</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	
		<!--添加-->
		<div class="panel">
			<el-dialog v-model="addFormVisible" size="tiny" title="添加推荐健身房">
				<el-form :inline="true" :model="recQuery" class="demo-form-inline">
					<el-form-item label="条件查询">
						<el-input v-model="recQuery.keyword" placeholder="输入健身房名称搜索"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="search" @click="handleGymList()">查询</el-button>
					</el-form-item>
				</el-form>
				<el-table :data="GymList" border stripe style="width:100%;" v-loading="listLoading" :hidden="hidden">
					<el-table-column prop="serialNumber" label="健身房ID"> </el-table-column>
					<el-table-column prop="gymName" label="健身房名称"> </el-table-column>
					<el-table-column label="操作" width="150">
						<template scope="scope">
							<el-button type="danger" size="small" @click="handleRecom(scope.index,scope.row)">推荐</el-button>
						</template>
					</el-table-column>
				</el-table>
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
				GymList:[],
				token:'',
				listLoading: false,
				hidden:true,
				total: null,
				listQuery: {
					page: 1,
					limit: 10,
					keyword: undefined,
					gymPhone:undefined,
					city:undefined,
					startTime:undefined,
					overTime:undefined,
				},
				recQuery:{
					keyword:'',
				},
				//添加
				datetime:'',
				addFormVisible: false,
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
			getTotal() {
				this.$axios({
						url: this.path + 'resource/gym/recommend/count',
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
						url: this.path + 'resource/gym/recommend/list',
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
			dateChange(val){
				this.listQuery.startTime = val.slice(0, 10)
				this.listQuery.overTime = val.slice(13, 23)
			},
			handleAdd() {
				this.addFormVisible = true;
			},
			//查询健身房
			handleGymList(){
				this.$axios({
						url: this.path + 'resource/gym/recommend/select',
						method: 'get',
						params: this.recQuery,
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
						this.GymList = res.data;
						this.hidden = false;
					})
					.catch((err) => {
						console.log(err);
					})
			},
			//推荐
			handleRecom(index,row) {
				this.$confirm('确认要推荐吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'resource/gym/recommend/' + row.id,
						method: 'get',
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
							this.addFormVisible = false;
							this.getData();
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
			handleDelete(index, row) {
				this.$confirm('确认要取消推荐吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'resource/gym/unrecommend/' + row.id,
						method: 'get',
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
	.gyminfo{
		width:230px;
	    word-break:break-all;
	    display:-webkit-box;
	    -webkit-line-clamp:3;
	    -webkit-box-orient:vertical;
	    overflow:hidden;
	}
</style>