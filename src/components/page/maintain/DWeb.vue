<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 社区管理</el-breadcrumb-item>
				<el-breadcrumb-item> 页面维护</el-breadcrumb-item>
				<el-breadcrumb-item>动态站动态维护</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
	
	
		<!--列表-->
		<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
			<!--<el-table-column prop="ordermum" label="排序" sortable></el-table-column>-->
			<el-table-column prop="no" label="排序"></el-table-column>
			<!--<el-table-column prop="resourceData.nickname" label="用户昵称"></el-table-column>-->
			<el-table-column prop="resourceData.dynamicPath" label="动态图片" width="180">
				<template scope="scope">
					<img :src="scope.row.resourceData.dynamicPath" alt="" style="width: 120px; height: 120px;"/>
				</template>
			</el-table-column>
			<el-table-column prop="resourceData.context" label="动态内容" width="500">
				<template scope="scope">
					<div class="d-context">
						{{scope.row.resourceData.context}}
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="发布时间" width="210"> </el-table-column>
			<el-table-column prop="resourceData.readCount" label="点击次数"></el-table-column>
			<el-table-column label="操作" width="370">
				<template scope="scope">
					<el-button size="small" @click="handleOrder(scope.index,scope.row)">排序</el-button>
					<el-button size="small" @click="handleReplace(scope.index,scope.row)">替换</el-button>
					<el-button size="small" @click="handleSelect(scope.index,scope.row)">查看详情</el-button>
					<el-button size="small" @click="handleSelectComment(scope.index,scope.row)">查看评论</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--查看详情-->
		<div class="panel">
			<el-dialog v-model="detailsVisible" size="large" title="动态详情">
				<section border stripe style="width: 100%" >
					<div v-for="item in detailsData">
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

		</el-table>
		<div class="block" style="margin-bottom:20px">
			<el-pagination @size-change="handleSizeCommentChange" @current-change="handleCurrentCommentChange" :current-page="listCommentQuery.page" :page-sizes="[10,20,30,50]" :page-size="listCommentQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="totalComment">
			</el-pagination>
		</div>
			</el-dialog>
		</div>
		<!--end-->
		<!--查看全部动态-->
		<div class="panel">
			<el-dialog v-model="replaceVisible" size="large" title="全部动态" >
				<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-form-item label="条件查询">
					<el-input v-model="listQuery.keyword" placeholder="输入用户昵称或手机号搜索"></el-input>
				</el-form-item>
			
				<el-form-item>
					<el-button type="primary" icon="search" @click="handleFilter()">查询</el-button>
				</el-form-item>
			</el-form>
				<el-table :data="dynamicData" border stripe style="width:100%;" v-loading="listLoading" :hidden="hidden">
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
		<!--end-->
		<!--编辑排序-->
		<el-dialog v-model="editOrderVisible" size="tiny" title="编辑排序">
					<el-form ref="editOrderQuery" :model="editOrderQuery" label-width="80px">
					<el-form-item label="当前排序">
						<el-input v-model="editOrderQuery.no" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="重新排序" >
					<el-select v-model="orderNum" placeholder="请选择动态排序">
						<el-option v-for="item in eOrderData" :key="item" :label="item" :value="item"> </el-option>
					</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="OrderSubmit">提交</el-button>
						<el-button @click="editOrderVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
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
				replaceVisible:false,
				dynamicData:[],
				total: null,
				listQuery: {
					page: 1,
					limit: 10,
					keyword: undefined,
				},
				olddyId:undefined,
				hidden:true,
				editOrderVisible:false,
				editOrderQuery:{
					no:''
				},
				orderNum:1,
				eOrderData:[],
			}
		},

		mounted() {
			this.$nextTick(() => {
				this.token = sessionStorage.getItem('token');
				this.getData();
			});
		},
		methods: {
			getData() {
				this.listLoading = true;
				this.$axios({
						url: this.path + 'page/content/details?pageType=dynamic_site_dynamic&contentType=push_dynamic',
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
			//查看
			selectDetails(index, row) {
				this.$axios({
						url: this.path + 'resource/dynamic/' + row.contentId,
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
						url: this.path + 'resource/dynamic/discuss/count?dynamicId='+row.contentId,
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
						url: this.path + 'resource/dynamic/discuss/list?dynamicId='+row.contentId,
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
			handleReplace(index,row){
				this.replaceVisible = true;
				this.olddyId = row.id;
			},
			getDynamicTotal() {
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
			selectDynamic() {
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
						this.getDynamicTotal();
						this.dynamicData = res.data;
						this.listLoading = false;
					})
					.catch((err) => {
						console.log(err);
					})
			},
		
			handleFilter() {
				this.selectDynamic();
				this.hidden = false
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
			handleOrder(index,row){
				this.editOrderVisible = true;
				this.editOrderQuery = Object.assign({}, row);
				this.getExOrder();
			},
			getExOrder(){
				var arr = [];
				for(var i = 1 ;i <= this.tableData.length;i++){
					arr.push(i);
				}
				this.eOrderData = arr
			},
			OrderSubmit(){
				this.$confirm('确认要修改排序吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/update',
						method: 'post',
						data:{
							id: this.editOrderQuery.id,
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
							this.editOrderVisible = false;
							this.getData();
							this.orderNum = 1;
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