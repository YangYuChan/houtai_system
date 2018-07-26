<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 社区管理</el-breadcrumb-item>
				<el-breadcrumb-item> 页面维护</el-breadcrumb-item>
				<el-breadcrumb-item>动态站资讯维护</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
	
	<el-tabs v-model="activeIndex" type="card">
    <el-tab-pane label="资讯推送" name="first">
		<!--列表-->
		<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
			<el-table-column prop="no" label="排序"></el-table-column>
			<el-table-column prop="resourceData.articlePhoto" label="资讯图片" width="300">
				<template scope="scope">
					<img :src="scope.row.resourceData.articlePhoto" alt="" style="width: 220px; height: 100px;"/>
				</template>
			</el-table-column>
			<el-table-column prop="resourceData.title" label="标题" width="500"></el-table-column>
			<el-table-column prop="createTime" label="发布时间" width="210"> </el-table-column>
			<el-table-column prop="resourceData.readCount" label="点击次数"></el-table-column>
			<el-table-column label="操作" width="220">
				<template scope="scope">
					<el-button size="small" @click="handleReplace(scope.index,scope.row)">替换</el-button>
					<el-button size="small" @click="handleSelect(scope.index,scope.row)">查看详情</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--查看详情-->
		<div class="panel">
			<el-dialog v-model="detailsVisible" size="large" title="资讯详情">
				<section border stripe style="width: 100%" >
					<div v-for="item in detailsData">
					<div class="btn-group" style="text-align: right;">
						<!--<el-button size="large" type="primary" @click="handleSelect(item.id)">分析</el-button>-->
						<el-button size="large" @click="detailsVisible = false">返回</el-button>
					</div>
						<h2 class="details-title" v-html="item.title"></h2>
						<article class="details-content" v-html="item.context"></article>
					</div>
				</section>
			</el-dialog>
		</div>
		<!--end-->
	
		<!--查看全部动态-->
		<div class="panel">
			<el-dialog v-model="replaceVisible" size="large" title="全部资讯" >
				<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-form-item label="条件查询">
					<el-input v-model="listQuery.keyword" placeholder="输入资讯标题搜索"></el-input>
				</el-form-item>
			
				<el-form-item>
					<el-button type="primary" icon="search" @click="handleFilter()">查询</el-button>
				</el-form-item>
			</el-form>
				<el-table :data="dynamicData" border stripe style="width:100%;" v-loading="listLoading" :hidden="hidden">
			<el-table-column prop="articlePhoto" label="资讯图片" width="300">
				<template scope="scope">
					<img :src="scope.row.articlePhoto" alt="" style="width: 220px; height: 100px;"/>
				</template>
			</el-table-column>
			<el-table-column prop="title" label="标题" width="500"></el-table-column>
			<el-table-column prop="createTime" label="发布时间" width="210"> </el-table-column>
			<el-table-column prop="readCount" label="点击次数"></el-table-column>
			<el-table-column label="操作" width="230">
				<template scope="scope">
					<el-button size="small" @click="replaceDynamic(scope.index,scope.row)">替换</el-button>
				</template>
			</el-table-column>

		</el-table>
		<div class="block" style="margin-bottom:20px" :hidden="hidden">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
			</el-dialog>
		</div>
		  </el-tab-pane>
    <el-tab-pane label="历史推送" name="second">
    	<el-table :data="historyData" border stripe style="width:100%" v-loading="listLoading">
			<el-table-column prop="no" label="排序"></el-table-column>
			<el-table-column prop="resourceData.articlePhoto" label="资讯图片" width="300">
				<template scope="scope">
					<img :src="scope.row.resourceData.articlePhoto" alt="" style="width: 220px; height: 100px;"/>
				</template>
			</el-table-column>
			<el-table-column prop="resourceData.title" label="标题" width="500"></el-table-column>
			<el-table-column prop="createTime" label="发布时间" width="210"> </el-table-column>
			<el-table-column prop="resourceData.readCount" label="点击次数"></el-table-column>
			<el-table-column label="操作" width="220">
				<template scope="scope">
					<el-button size="small" @click="handleSelect(scope.index,scope.row)">查看详情</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--查看详情-->
		<div class="panel">
			<el-dialog v-model="detailsVisible" size="large" title="资讯详情">
				<section border stripe style="width: 100%" >
					<div v-for="item in detailsData">
					<div class="btn-group" style="text-align: right;">
						<!--<el-button size="large" type="primary" @click="handleSelect(item.id)">分析</el-button>-->
						<el-button size="large" @click="detailsVisible = false">返回</el-button>
					</div>
						<h2 class="details-title" v-html="item.title"></h2>
						<article class="details-content" v-html="item.context"></article>
					</div>
				</section>
			</el-dialog>
		</div>
    </el-tab-pane>
    </el-tabs>
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
				activeIndex: 'first',
				tableData: [], //列表数组
				token:'',
				detailsData: undefined,
				datetime:'',
				detailsVisible: false,
				listLoading: false,
				total: null,
				
				replaceVisible:false,
				dynamicData:[],
				total: null,
				listQuery: {
					page: 1,
					limit: 10,
					keyword: undefined,
				},
				hidden:true,
				olddyId:'',
				//历史
				historyData:[]
				
			}
		},

		mounted() {
			this.$nextTick(() => {
				this.token = sessionStorage.getItem('token');
				this.getData();
				this.getHistory();
			});
		},
		methods: {
			getData() {
				this.listLoading = true;
				this.$axios({
						url: this.path + 'page/content/details?pageType=dynamic_site_article&contentType=push_article',
						method: 'get',
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
					
						this.tableData = res.data;
						this.listLoading = false;
					})
					.catch((err) => {
						console.log(err);
					})
			},
		
			
			handleSelect(index, row) {
				this.detailsVisible = true;
				this.selectDetails(index, row);
			},
			//查看
			selectDetails(index, row) {
				this.$axios({
						url: this.path + 'resource/article/' + row.contentId,
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
			
			handleReplace(index,row){
				this.replaceVisible = true;
				this.olddyId = row.id;
			},
			getDynamicTotal() {
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
			selectDynamic() {
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
						this.getDynamicTotal();
						this.dynamicData = res.data;
					})
					.catch((err) => {
						console.log(err);
					})
			},
		
			handleFilter() {
				this.hidden = false
				this.selectDynamic();
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.selectDynamic();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.selectDynamic();
			},
			replaceDynamic(index,row){
				this.$confirm('确认要替换吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/update?contentId=' + row.id +'&id='+ this.olddyId,
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
							this.replaceVisible = false;
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
			getHistory() {
				this.listLoading = true;
				this.$axios({
						url: this.path + 'page/content/history?pageType=dynamic_site_article&contentType=push_article',
						method: 'get',
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
					
						this.historyData = res.data;
						this.listLoading = false;
					})
					.catch((err) => {
						console.log(err);
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