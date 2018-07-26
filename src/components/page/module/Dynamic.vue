<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 社区管理</el-breadcrumb-item>
				<el-breadcrumb-item> 模块管理</el-breadcrumb-item>
				<el-breadcrumb-item>动态管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
	
		<!--查询-->
		<div class="plugins-tips">
			<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-form-item label="条件查询">
					<el-input v-model="listQuery.keyword" placeholder="输入用户昵称或手机号搜索"></el-input>
				</el-form-item>
				<!--<el-form-item>
					<el-date-picker v-model="datetime" type="daterange" placeholder="选择日期" @change="dateChange">
					</el-date-picker>
				</el-form-item>-->
				<el-form-item>
					<el-button type="primary" icon="search" @click="handleFilter()">查询</el-button>
				</el-form-item>
			</el-form>
		</div>

		<!--列表-->
		<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
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
			<el-table-column label="操作" width="230">
				<template scope="scope">
					<el-button size="small" @click="handleSelect(scope.index,scope.row)">查看详情</el-button>
					<el-button size="small" @click="handleSelectComment(scope.index,scope.row)">查看评论</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!--查看详情-->
		<div class="panel">
			<el-dialog v-model="detailsVisible" size="large" title="动态详情">
				<section border stripe style="width: 100%" >
					<div v-for="item in detailsData">
					<div class="btn-group" style="text-align: right;">
						<el-button size="large" type="danger" @click="handleDelete(item.id)">删除此动态</el-button>
						<!--<el-button size="large" @click="detailsVisible = false">拉黑此用户</el-button>-->
					</div>
						<div class="userinfo">
							<div class="photo"><img :src="item.headPhoto"/></div>
							<div class="username">{{item.nickname}}</div>
							<div class="like">点赞：{{item.sumLike}}</div>
							<div class="transpond">转发：{{item.sumRepeat}}</div>
						</div>
						<div class="content-info">
							<div class="tags"><span class="phone">手机号：{{item.phone}}</span><span class="createTime">发布时间：{{item.createTime}}</span></div> 
							<div class="tags"><span class="frequency">发布动态次数：{{item.sumUserDynamic}}</span><span class="hot-num">热门度：{{item.sumHot}}</span></div> 
							<div class="dy-content">
								{{item.context}}
							</div>
						</div>
					</div>
				</section>
			</el-dialog>
		</div>
		<!--end-->
		<!--查看评论-->
		<div class="panel">
			<el-dialog v-model="commentVisible" size="large" title="动态评论" style="min-height: 500px;">
				<el-table :data="commentData" border stripe style="width:100%;" v-loading="listLoading">
			<el-table-column prop="nickname" label="用户昵称"></el-table-column>
			<el-table-column prop="createTime" label="发布时间"></el-table-column>
			<el-table-column prop="context" label="评论内容"></el-table-column>
			<el-table-column label="操作" width="120">
				<template scope="scope">
					<el-button size="small" type="danger" @click="handleCommentDelete(scope.index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block" style="margin-bottom:20px">
			<el-pagination @size-change="handleSizeCommentChange" @current-change="handleCurrentCommentChange" :current-page="listCommentQuery.page" :page-sizes="[10,20,30,50]" :page-size="listCommentQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="totalComment">
			</el-pagination>
		</div>
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
				commentData:[],
				token:'',
				detailsData: undefined,
				datetime:'',
				detailsVisible: false,
				commentVisible:false,
				listLoading: false,
				total: null,
				totalComment:null,
				listCommentQuery:{
					page: 1,
					limit: 10,
				},
				listQuery: {
					page: 1,
					limit: 10,
					keyword: undefined,
				},
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
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getData();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getData();
			},
			handleSizeCommentChange(val) {
				this.listCommentQuery.limit = val;
				this.getCommentData();
			},
			handleCurrentCommentChange(val) {
				this.listCommentQuery.page = val;
				this.getCommentData();
			},
			handleSelect(index, row) {
				this.detailsVisible = true;
				this.selectDetails(index, row);
			},
			dateChange(val){
				this.listQuery.startTime = val.slice(0, 10)
				this.listQuery.overTime = val.slice(13, 23)
			},
			//查看
			selectDetails(index, row) {
				this.$axios({
						url: this.path + 'resource/dynamic/' + row.id,
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
			handleSelectComment(index, row) {
				this.commentVisible = true;
				this.getCommentData(index, row);
			},
			getCommentTotal(index,row) {
				this.$axios({
						url: this.path + 'resource/dynamic/discuss/count?dynamicId='+row.id,
						method: 'get',
						params: this.listCommentQuery,
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
						this.totalComment = res.data;
					})
					.catch((err) => {
						console.log(err);
					})
			},
			getCommentData(index,row) {
				this.$axios({
						url: this.path + 'resource/dynamic/discuss/list?dynamicId='+row.id,
						method: 'get',
						params: this.listCommentQuery,
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
						this.getCommentTotal(index,row);
						this.commentData = res.data;
					})
					.catch((err) => {
						console.log(err);
					})
			},
			handleDelete(id) {
				this.$confirm('确认要删除这条动态吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'resource/dynamic/delete/' + id,
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
							this.detailsVisible = false;
							this.getData();
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
			handleCommentDelete(index, row) {
				this.$confirm('确认要删除这条记录吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'resource/dynamic/discuss/delete/' + row.id,
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
							this.getCommentData();
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
	.d-context{
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.btn-box {
		margin-bottom: 20px;
	}
	.userinfo{
		float: left;
		width: 15%;
		text-align: center;
	}
	.userinfo .photo img{
		width: 100px;
		height: 100px;
		border-radius: 100%;
	}
	.userinfo .username,
	.userinfo .like,
	.userinfo .transpond{
		line-height: 2;
	}
	.content-info{
		float: left;
		width: 70%;
		padding-bottom: 30px;
	}
	.tags{
		line-height: 2;
	}
	.tags span{
		display: inline-block;
		margin-right: 50px;
	}
	.dy-content{
		margin-top: 50px;
		line-height: 30px;
		min-height: 400px;
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