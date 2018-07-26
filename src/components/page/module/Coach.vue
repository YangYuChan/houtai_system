<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 社区管理</el-breadcrumb-item>
				<el-breadcrumb-item> 板块管理</el-breadcrumb-item>
				<el-breadcrumb-item>教练</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<el-tabs v-model="activeIndex" type="card">
			<el-tab-pane label="banner" name="first">

				<el-table :data="bannerData" border stripe style="width:100%" v-loading="listLoading">
					<el-table-column prop="resourceData.id" width="150" label="ID"></el-table-column>
					<el-table-column prop="photo" label="封面图">
						<template scope="scope">
							<img :src="scope.row.photo" alt="" style="width: 220px; height: 100px;" />
						</template>
					</el-table-column>
					<el-table-column prop="resourceData.coachName" label="名称"></el-table-column>
					<el-table-column label="操作" width="315">
						<template scope="scope">
							<el-button size="small" @click="handleBannerEdit(scope.index,scope.row)">编辑封面</el-button>
							<el-button size="small" @click="handleBannerReplace(scope.index,scope.row)">替换教练</el-button>
						</template>
					</el-table-column>
				</el-table>

				<!--编辑封面及排序-->
				<el-dialog v-model="editBannerFormVisible" size="tiny" title="编辑封面及排序">
					<el-form ref="editBannerForm" :model="editBannerForm" label-width="80px" :rules="editBannerRules">
						<el-form-item label="封面图">
							<el-upload class="avatar-uploader" :action="uploadUrl()" :show-file-list="false" :on-success="handlebannerAvatarSuccess" :before-upload="beforeAvatarUpload">
								<img v-if="editBannerForm.photo" :src="editBannerForm.photo" class="avatar">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
							<template>
								<span style="color:#999999">(点击图片重新上传)</span>
							</template>
						</el-form-item>

						<el-form-item>
							<el-button type="primary" @click="bannerEditSubmit">提交</el-button>
							<el-button @click="editBannerFormVisible = false">取消</el-button>
						</el-form-item>
					</el-form>
				</el-dialog>
				<!--end-->
				<!--替换课程-->
				<el-dialog v-model="reBannerFormVisible" size="large" title="替换banner">
					<el-form :inline="true" :model="listQuery" class="demo-form-inline">
						<el-form-item label="条件查询">
							<el-input v-model="listQuery.keyword" placeholder="输入健身房/教练搜索"></el-input>
						</el-form-item>
						<el-form-item>
							<el-date-picker v-model="datetime" type="daterange" placeholder="选择日期" @change="dateChange">
							</el-date-picker>
						</el-form-item>

						<el-form-item>
							<el-button type="primary" icon="search" @click="handleFilter()">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="danger" @click="clearCoachData()">清除信息</el-button>
						</el-form-item>
					</el-form>
					<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading" :hidden="hidden">
						<el-table-column prop="coachName" label="教练姓名"> </el-table-column>
						<el-table-column prop="gymId" label="所属健身房"> </el-table-column>
						<el-table-column prop="typeId" label="教练类型"></el-table-column>
						<el-table-column prop="coachPath" label="教练图片" width="280">
							<template scope="scope">
								<img alt="" :src="scope.row.coachPath" style="width: 225px; height: 100px;" />
							</template>
						</el-table-column>
						<el-table-column prop="honor" label="个人成果"></el-table-column>

						<el-table-column label="操作" width="250">
							<template scope="scope">
								<el-button type="primary" size="small" @click="bannerReSubmit(scope.index,scope.row)">替换</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="block" :hidden="hidden">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
						</el-pagination>
					</div>
				</el-dialog>
				<!--end-->
			</el-tab-pane>
			<!--热门教练-->
			<el-tab-pane label="热门教练" name="second">
		<div class="btn-box">
			 <el-button type="primary" size="large" @click="handleHotAdd">添加</el-button>
		</div>
    	<el-table :data="hotData" border stripe style="width:100%" v-loading="listLoading">
			<el-table-column prop="no" width="150" label="当前排序"></el-table-column>
			<el-table-column prop="resourceData.coachName" label="教练名称"></el-table-column>
			<el-table-column prop="resourceData.typeId" label="教练类型"></el-table-column>
			<el-table-column prop="resourceData.honor" label="个人荣誉"></el-table-column>
			<el-table-column prop="resourceData.gymId" label="健身房"></el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button size="small" @click="handleHotEdit(scope.index,scope.row)">编辑排序</el-button>
					<el-button type="danger" size="small" @click="handleHotDelete(scope.index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
			<!--添加-->
			<el-dialog v-model="addHotFormVisible" size="large" title="添加热门教练">
				<el-form :inline="true" :model="listHQuery" class="demo-form-inline">
						<el-form-item label="条件查询">
							<el-input v-model="listHQuery.keyword" placeholder="输入健身房/教练搜索"></el-input>
						</el-form-item>
						<el-form-item>
							<el-date-picker v-model="datetime" type="daterange" placeholder="选择日期" @change="dateChange">
							</el-date-picker>
						</el-form-item>

						<el-form-item>
							<el-button type="primary" icon="search" @click="handleHFilter()">查询</el-button>
						</el-form-item>
					</el-form>
					<el-table :data="tableHData" border stripe style="width:100%" v-loading="listLoading" :hidden="ehidden">
						<el-table-column prop="coachName" label="教练姓名"> </el-table-column>
						<el-table-column prop="gymId" label="所属健身房"> </el-table-column>
						<el-table-column prop="typeId" label="教练类型"></el-table-column>
						<el-table-column prop="coachPath" label="教练图片" width="280">
							<template scope="scope">
								<img alt="" :src="scope.row.coachPath" style="width: 225px; height: 100px;" />
							</template>
						</el-table-column>
						<el-table-column prop="honor" label="个人成果"></el-table-column>
						<el-table-column label="操作" width="250">
							<template scope="scope">
								<el-button type="primary" size="small" @click="hotAddSubmit(scope.index,scope.row)">添加</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="block" :hidden="ehidden">
						<el-pagination @size-change="handleHSizeChange" @current-change="handleHCurrentChange" :current-page="listHQuery.page" :page-sizes="[10,20,30,50]" :page-size="listHQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="totalH">
						</el-pagination>
					</div>
			</el-dialog>
			<!--添加-->
				<el-dialog v-model="editHotVisible" size="tiny" title="编辑排序">
					<el-form ref="editHotQuery" :model="editHotQuery" label-width="80px">
					<el-form-item label="当前排序">
						<el-input v-model="editHotQuery.no" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="课程名称">
						<el-input v-model="editHotQuery.resourceData.coachName" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="重新排序" >
					<el-select v-model="orderHotNum" placeholder="请选择课程排序">
						<el-option v-for="item in hotOrderData" :key="item" :label="item" :value="item"> </el-option>
					</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="hotEditSubmit">提交</el-button>
						<el-button @click="editHotVisible = false">取消</el-button>
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
				bannerData: [],
				listLoading: false,
				tableData: [],
				total: null,
				listQuery: {
					page: 1,
					limit: 10,
					keyword: undefined,
					startTime: undefined,
					overTime: undefined,
				},
				datetime: '',
				editBannerFormVisible: false,
				reBannerFormVisible: false,
				oldbanId: '',
				hidden: true,
				editBannerForm: {
					id: '',
					photo: '',
				},
				editBannerRules: {
					photo: [
						{ required: true, message: '请上传图片', trigger: 'change' }
					],
				},

				//热门
				hotData: [],
				ClassList: [],
				typeData: [],
				hotOrderData: [], //排序数组
				classTotal: undefined,
				addHotFormVisible: false,
				tableHData: [],
				totalH: null,
				listHQuery: {
					page: 1,
					limit: 10,
					keyword: undefined,
					startTime: undefined,
					overTime: undefined,
				},
				ehidden: true,
				editHotVisible: false,
				editHotQuery: {
					id: undefined,
					resourceData: {
						coachName: '',
					},
				},
				orderHotNum: 1,

			};
		},
		mounted() {
			this.$nextTick(() => {
				this.token = sessionStorage.getItem('token');
				this.getBannerList();
				this.getHotData();
			});
		},
		methods: {
			//banner
			uploadUrl(){
				return this.action
			},
			getBannerList() {
				this.listLoading = true;
				this.$axios({
						url: this.path + 'page/content/details?pageType=coach&contentType=banner',
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
			//编辑封面
			handleBannerEdit(index, row) {
				this.editBannerFormVisible = true;
				this.editBannerForm = Object.assign({}, row);
			},
			//上传封面
			handlebannerAvatarSuccess(res, file) {
				this.editBannerForm.photo = res;
			},
			//提交修改封面
			bannerEditSubmit() {
				this.$confirm('确认要修改封面吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/update',
						method: 'post',
						data: {
							id: this.editBannerForm.id,
							photo: this.editBannerForm.photo
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
						if(res.data == 1) {
							this.$message({
								message: '操作成功',
								type: 'success'
							});
							this.editBannerFormVisible = false;
							this.getBannerList();
						} else {
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
			//替换banner内容
			handleBannerReplace(index, row) {
				this.reBannerFormVisible = true;
				this.oldbanId = row.id;
			},
			bannerReSubmit(index, row) {
				this.$confirm('确认要替换吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/update?contentId=' + row.id + '&id=' + this.oldbanId,
						method: 'post',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
							
						}
					}).then((res) => {
						if(res.data == 1) {
							this.$message({
								message: '操作成功',
								type: 'success'
							});
							this.reBannerFormVisible = false;
							this.getBannerList();
							this.hidden = true;
						} else {
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
			//清空教练信息
			clearCoachData() {
				this.$confirm('确认要替换吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/update?contentId=0&id=' + this.oldbanId,
						method: 'post',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
							
						}
					}).then((res) => {
						if(res.data == 1) {
							this.$message({
								message: '操作成功',
								type: 'success'
							});
							this.reBannerFormVisible = false;
							this.getBannerList();
						} else {
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
			getTotal() {
				this.$axios({
						url: this.path + 'resource/coach/count',
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
						url: this.path + 'resource/coach/list',
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
				this.hidden = false;
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getData();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getData();
			},

			dateChange(val) {
				this.listQuery.startTime = val.slice(0, 10)
				this.listQuery.overTime = val.slice(13, 23)
			},
			//热门教练
			getHotData() {
				this.listLoading = true;
				this.$axios({
						url: this.path + 'page/content/details?pageType=coach&contentType=hot_coach',
						method: 'get',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
							
						}
					})
					.then((res) => {
						this.hotData = res.data;
						this.listLoading = false;
					})
					.catch((err) => {
						console.log(err);
					})
			},
			handleHotAdd() {
				this.addHotFormVisible = true;
			},
			hotAddSubmit(index, row) {
				this.$confirm('确认要添加吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/add?pageType=coach&contentType=hot_coach&contentId=' + row.id,
						method: 'put',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
							
						}
					}).then((res) => {
						if(res.data == 1) {
							this.$message({
								message: '操作成功',
								type: 'success'
							});
							this.addHotFormVisible = false;
							this.getHotData();
							this.ehidden = true;
						} else {
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
			handleHotEdit(index, row) {
				this.editHotVisible = true;
				this.editHotQuery = Object.assign({}, row);
				this.getHotOrder();
			},
			getHotOrder(){
				var arr = [];
				for(var i = 1 ;i <= this.hotData.length;i++){
					arr.push(i);
				}
				this.hotOrderData = arr
			},
			hotEditSubmit() {
				this.$confirm('确认要修改排序吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/update',
						method: 'post',
						data: {
							id: this.editHotQuery.id,
							orderNumber: this.orderHotNum
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
						if(res.data == 1) {
							this.$message({
								message: '操作成功',
								type: 'success'
							});
							this.editHotVisible = false;
							this.getHotData();
							this.orderHotNum = 1;
						} else {
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
			handleHotDelete(index, row) {
				this.$confirm('确认要删除这条记录吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/delete/' + row.id + '?pageType=coach&contentType=hot_coach',
						method: 'delete',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
							
						}
					}).then((res) => {
						if(res.data === 1) {
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.getHotData();
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
			//过滤热门
			getHTotal() {
				this.$axios({
						url: this.path + 'resource/coach/recommend/select/count',
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
						this.totalH = res.data;
					})
					.catch((err) => {
						console.log(err);
					})
			},
			getHData() {
				this.listLoading = true;
				this.$axios({
						url: this.path + 'resource/coach/recommend/select',
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
						this.getHTotal();
						this.tableHData = res.data;
						this.listLoading = false;
					})
					.catch((err) => {
						console.log(err);
					})
			},
			handleHFilter() {
				this.getHData();
				this.ehidden = false;
			},
			handleHSizeChange(val) {
				this.listHQuery.limit = val;
				this.getHData();
			},
			handleHCurrentChange(val) {
				this.listHQuery.page = val;
				this.getHData();
			},
		}
	}
</script>
<style type="text/css">
	.btn-box {
		margin: 20px 0;
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
		height: 165px;
		line-height: 165px;
		text-align: center;
	}
	
	.avatar {
		width: 375px;
		height: 165px;
		display: block;
	}
	
	.el-upload--text {
		border: none;
		width: auto;
		height: auto;
	}
	
	.article-item {
		border: 1px solid #dfe6ec;
		padding: 0 20px 20px;
	}
	
	.tags-box {
		height: 50px;
	}
	
	.tags-box .tags {
		float: left;
	}
	
	.tags-box .art-btnbox {
		float: right;
	}
	
	.art-photo {
		float: left;
	}
	
	.art-info {
		position: relative;
		left: 30px;
		padding-right: 30px;
	}
	
	.art-photo img {
		width: 375px;
		height: 165px;
	}
	
	.art-title {
		margin-bottom: 10px;
	}
	
	.art-content {
		line-height: 27px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		overflow: hidden;
	}
	
	.change {
		text-align: center;
		margin-top: 10px;
	}
	
	.el-pagination {
		text-align: right;
		margin-top: 30px;
	}
	
	.d-context {
		height: 120px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>