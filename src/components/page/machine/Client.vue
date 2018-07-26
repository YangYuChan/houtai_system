<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 社区管理</el-breadcrumb-item>
				<el-breadcrumb-item> 机器管理</el-breadcrumb-item>
				<el-breadcrumb-item>客户管理</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
	
		<!--查询-->
		<div class="plugins-tips">
			<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-form-item label="条件查询">
					<el-input v-model="listQuery.keyword" placeholder="按客户姓名/手机/地址搜索"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="search" @click="handleFilter()">查询</el-button>
					<el-button type="primary" icon="plus" @click="handleAdd()">添加</el-button>
				</el-form-item>
			</el-form>
		</div>

		<!--列表-->
		<el-table :data="tableData" border stripe style="width:100%" v-loading="listLoading">
			<!--<el-table-column prop="id" label="客户id"> </el-table-column>-->
			<el-table-column prop="name" label="客户名称"> </el-table-column>
			<el-table-column prop="phone" label="电话"> </el-table-column>
			<el-table-column prop="buyNum" label="购买数量"> </el-table-column>
			<el-table-column prop="createTime" label="购买时间"></el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button size="small" @click="handleSelect(scope.index,scope.row)">查看详情</el-button>
					<el-button size="small" @click="handleUpdate(scope.index,scope.row)">修改</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!--查看-->
		<div class="panel">
			<el-dialog v-model="detailsVisible" size="large" title="个人详情">
				  	<el-table :data="detailsData" border stripe style="width:100%" v-loading="listLoading">
						<el-table-column prop="name" label="客户姓名"></el-table-column>
						<el-table-column prop="phone" label="电话"> </el-table-column>
						<el-table-column prop="address" label="地址">
							<template scope="scope">
								{{scope.row.city}}{{scope.row.area}}{{scope.row.address}}
							</template>
						</el-table-column>
						<el-table-column prop="buyNum" label="购买数量"> </el-table-column>
						<el-table-column prop="createTime" label="购买日期"> </el-table-column>
					</el-table>
			</el-dialog>
		</div>
		<!--end-->
		<!--添加-->
		<div class="panel">
			<el-dialog v-model="addFormVisible" size="tiny" title="添加客户信息">
				<el-form ref="addForm" :model="addForm" label-width="80px" :rules="addRules">
					<el-form-item label="客户姓名" prop="name">
						<el-input v-model="addForm.name"></el-input>
					</el-form-item>
					<el-form-item label="电话" prop="phone">
						<el-input v-model.number="addForm.phone"></el-input>
					</el-form-item>
					<!--<el-form-item label="使用地址" prop="city">
						<el-select v-model="editForm.city" placeholder="城市">
							<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="area">
						<el-select v-model="editForm.area" placeholder="区域">
							<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>-->
					<el-form-item label="使用地址" prop="address">
						<el-input v-model="addForm.address" type="textarea"></el-input>
					</el-form-item>
					<el-form-item label="购买台数" prop="buyNum">
						<el-input v-model.number="addForm.buyNum"></el-input>
					</el-form-item>
					
					<el-form-item>
						<el-button type="primary" @click="addSubmitForm">提交</el-button>
						<el-button @click="addFormVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</div>
		<!--修改-->
	<div class="panel">
			<el-dialog v-model="editFormVisible" size="tiny" title="修改客户信息">
				<el-form ref="editForm" :model="editForm" label-width="80px" :rules="editRules">
					<el-form-item label="客户姓名" prop="name">
						<el-input v-model="editForm.name"></el-input>
					</el-form-item>
					<el-form-item label="电话" prop="phone">
						<el-input v-model.number="editForm.phone"></el-input>
					</el-form-item>
					<!--<el-form-item label="使用地址" prop="city">
						<el-select v-model="editForm.city" placeholder="城市">
							<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="area">
						<el-select v-model="editForm.area" placeholder="区域">
							<el-option v-for="item in gymData" :key="item.id" :label="item.gymName" :value="item.id"> </el-option>
						</el-select>
					</el-form-item>-->
					<el-form-item label="使用地址" prop="address">
						<el-input v-model="editForm.address" type="textarea"></el-input>
					</el-form-item>
					<el-form-item label="购买台数" prop="buyNum">
						<el-input v-model.number="editForm.buyNum"></el-input>
					</el-form-item>
					
					<el-form-item>
						<el-button type="primary" @click="editSubmitForm">提交</el-button>
						<el-button @click="editFormVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</div>
	
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
				detailsData: undefined,
				token:'',
				detailsVisible: false,
				editFormVisible:false,
				addFormVisible:false,
				listLoading: false,
				total: null,
				listQuery: {
					page: 1,
					limit: 10,
					keyword: undefined,
				},
				addForm:{
					name:'',
					phone:'',
					city:'上海',
					area:'静安区',
					address:'',
					buyNum:null,
				},
				addRules:{
					name: [
						{ required: true, message:'请输入客户姓名', trigger: 'blur' }
					],
					phone: [
						{ required: true, validator: valid.checkPhone, trigger: 'blur' }
					],
					buyNum: [
						{ required: true, validator: valid.checkNum, trigger: 'blur' }
					]
				},
				editForm:{
					name:'',
					phone:'',
					city:'',
					area:'',
					address:'',
					buyNum:null,
				},
				editRules:{
					name: [
						{ required: true, message:'请输入客户姓名', trigger: 'blur' }
					],
					phone: [
						{ required: true, validator: valid.checkPhone, trigger: 'blur' }
					],
					buyNum: [
						{ required: true, validator: valid.checkNum, trigger: 'blur' }
					]
				}
		
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
						url: this.path + 'device/customer/count',
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
						url: this.path + 'device/customer/list',
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
			//查看
			selectDetails(index, row) {
				this.$axios({
						url: this.path + 'device/customer/'+ row.id,
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
			handleUpdate(index,row){
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			handleAdd(){
				this.addFormVisible = true;
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
									url: this.path + 'device/customer/add',
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
								message: '已取消添加'
							});
							this.addFormVisible = false;
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			editSubmitForm(){
				this.$refs.editForm.validate((valid) => {
					if(valid) {
						this.$confirm('您确定要提交吗?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.editLoading = true;
							this.$axios({
									url: this.path + 'device/customer/update',
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
								message: '已取消修改'
							});
							this.editFormVisible = false;
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
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
	
</style>