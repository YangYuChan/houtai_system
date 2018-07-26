<template>
	<div class="table">
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-menu"></i> 社区管理</el-breadcrumb-item>
				<el-breadcrumb-item> 页面维护</el-breadcrumb-item>
				<el-breadcrumb-item>课程界面维护</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
  <el-tabs v-model="activeIndex" type="card">
    <el-tab-pane label="banner" name="first">
    	<div class="btn-box">
			 <el-button type="primary" size="large" @click="handleBannerAdd">添加</el-button>
		</div>
    	<el-table :data="bannerData" border stripe style="width:100%" v-loading="listLoading">
			<el-table-column prop="no" width="150" label="当前排序"></el-table-column>
			<el-table-column prop="photo" label="封面图">
				<template scope="scope">
					<img :src="scope.row.photo" alt="" style="width: 220px; height: 100px;"/>
				</template>
			</el-table-column>
			<el-table-column prop="resourceData.className" label="课程名称"></el-table-column>
			<el-table-column prop="resourceData.classCoach" label="教练" width="200"></el-table-column>
			<el-table-column prop="resourceData.gymId" label="健身房"></el-table-column>
			<el-table-column label="操作" width="315">
				<template scope="scope">
					<el-button size="small" @click="handleBannerEdit(scope.index,scope.row)">编辑封面及排序</el-button>
					<el-button size="small" @click="handleBannerReplace(scope.index,scope.row)">替换课程</el-button>
					<el-button type="danger" size="small" @click="handleBannerDelete(scope.index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--添加-->
			<el-dialog v-model="addBannerFormVisible" size="small" title="添加banner">
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
							<el-button type="primary" size="small" @click="bannerAddSubmit(scope.index,scope.row)">添加</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="block" :hidden="ehidden" >
					<el-pagination @size-change="handleESizeChange" @current-change="handleECurrentChange" :current-page="addEQuery.page" :page-sizes="[10,20,30,50]" :page-size="addEQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="classTotal">
					</el-pagination>
				</div>
			</el-dialog>
		<!--end-->
		<!--编辑封面及排序-->
			<el-dialog v-model="editBannerFormVisible" size="tiny" title="编辑封面及排序">
				<el-form ref="editBannerForm" :model="editBannerForm" label-width="80px" :rules="editBannerRules">
					<el-form-item label="当前排序" prop="no">
						<el-input v-model="editBannerForm.no" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="封面图" >
						<el-upload class="avatar-uploader" :action="uploadUrl()" :show-file-list="false" :on-success="handlebannerAvatarSuccess" :before-upload="beforeAvatarUpload">
							<img v-if="editBannerForm.photo" :src="editBannerForm.photo" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<template>
							<span style="color:#999999">(点击图片重新上传)</span>
						</template>
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
		<!--替换课程-->
			<el-dialog v-model="reBannerFormVisible" size="small" title="替换banner">
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
							<el-button type="primary" size="small" @click="bannerReSubmit(scope.index,scope.row)">替换</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="block" :hidden="ehidden" >
					<el-pagination @size-change="handleESizeChange" @current-change="handleECurrentChange" :current-page="addEQuery.page" :page-sizes="[10,20,30,50]" :page-size="addEQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="classTotal">
					</el-pagination>
				</div>
			</el-dialog>
		<!--end-->
    </el-tab-pane>
    <!--热门课程-->
    <el-tab-pane label="热门课程" name="second">
		<div class="btn-box">
			 <el-button type="primary" size="large" @click="handleHotAdd">添加</el-button>
		</div>
    	<el-table :data="hotData" border stripe style="width:100%" v-loading="listLoading">
			<el-table-column prop="no" width="150" label="当前排序"></el-table-column>
			<el-table-column prop="resourceData.className" label="课程名称"></el-table-column>
			<el-table-column prop="resourceData.classCoach" label="教练"></el-table-column>
			<el-table-column prop="resourceData.gymId" label="健身房"></el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button size="small" @click="handleHotEdit(scope.index,scope.row)">编辑排序</el-button>
					<el-button type="danger" size="small" @click="handleHotDelete(scope.index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--添加热门-->
		<el-dialog v-model="addHotFormVisible" size="small" title="添加健身干货">
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
							<el-button type="primary" size="small" @click="hotAddSubmit(scope.index,scope.row)">添加</el-button>
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
			<el-dialog v-model="editHotVisible" size="tiny" title="编辑排序">
					<el-form ref="editHotQuery" :model="editHotQuery" label-width="80px">
					<el-form-item label="当前排序">
						<el-input v-model="editHotQuery.no" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="课程名称">
						<el-input v-model="editHotQuery.resourceData.className" :disabled="true"></el-input>
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
		<!--end-->
    </el-tab-pane>
  	<!--新手入门-->
    <el-tab-pane label="新手入门" name="three">
		<div class="btn-box">
			 <el-button type="primary" size="large" @click="handleBegAdd">添加</el-button>
		</div>
    	<el-table :data="begData" border stripe style="width:100%" v-loading="listLoading">
			<el-table-column prop="no" width="150" label="当前排序"></el-table-column>
			<el-table-column prop="resourceData.className" label="课程名称"></el-table-column>
			<el-table-column prop="resourceData.classCoach" label="教练"></el-table-column>
			<el-table-column prop="resourceData.gymId" label="健身房"></el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button size="small" @click="handleBegEdit(scope.index,scope.row)">编辑排序</el-button>
					<el-button type="danger" size="small" @click="handleBegDelete(scope.index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--添加推荐-->
		<el-dialog v-model="addBegFormVisible" size="small" title="添加健身干货">
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
							<el-button type="primary" size="small" @click="begAddSubmit(scope.index,scope.row)">添加</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="block" :hidden="ehidden" >
					<el-pagination @size-change="handleESizeChange" @current-change="handleECurrentChange" :current-page="addEQuery.page" :page-sizes="[10,20,30,50]" :page-size="addEQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="classTotal">
					</el-pagination>
				</div>
			</el-dialog>
			<!--编辑-->
			<el-dialog v-model="editBegVisible" size="tiny" title="编辑排序">
					<el-form ref="editBegQuery" :model="editBegQuery" label-width="80px">
					<el-form-item label="当前排序">
						<el-input v-model="editBegQuery.no" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="课程名称">
						<el-input v-model="editBegQuery.resourceData.className" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="重新排序" >
					<el-select v-model="orderBegNum" placeholder="请选择课程排序">
						<el-option v-for="item in begOrderData" :key="item" :label="item" :value="item"> </el-option>
					</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="begEditSubmit">提交</el-button>
						<el-button @click="editBegVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		<!--end-->
    </el-tab-pane>
  	<!--推荐课程-->
    <el-tab-pane label="推荐课程" name="fourth">
		<div class="btn-box">
			 <el-button type="primary" size="large" @click="handleRecAdd">添加</el-button>
		</div>
    	<el-table :data="recData" border stripe style="width:100%" v-loading="listLoading">
			<el-table-column prop="no" width="150" label="当前排序"></el-table-column>
			<el-table-column prop="resourceData.className" label="课程名称"></el-table-column>
			<el-table-column prop="resourceData.classCoach" label="教练"></el-table-column>
			<el-table-column prop="resourceData.gymId" label="健身房"></el-table-column>
			<el-table-column label="操作">
				<template scope="scope">
					<el-button size="small" @click="handleRecEdit(scope.index,scope.row)">编辑排序</el-button>
					<el-button type="danger" size="small" @click="handleRecDelete(scope.index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--添加推荐-->
		<el-dialog v-model="addRecFormVisible" size="small" title="添加健身干货">
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
							<el-button type="primary" size="small" @click="recAddSubmit(scope.index,scope.row)">添加</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="block" :hidden="ehidden" >
					<el-pagination @size-change="handleESizeChange" @current-change="handleECurrentChange" :current-page="addEQuery.page" :page-sizes="[10,20,30,50]" :page-size="addEQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="classTotal">
					</el-pagination>
				</div>
			</el-dialog>
			<!--编辑-->
			<el-dialog v-model="editRecVisible" size="tiny" title="编辑排序">
					<el-form ref="editRecQuery" :model="editRecQuery" label-width="80px">
					<el-form-item label="当前排序">
						<el-input v-model="editRecQuery.no" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="课程名称">
						<el-input v-model="editRecQuery.resourceData.className" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="重新排序" >
					<el-select v-model="orderRecNum" placeholder="请选择课程排序">
						<el-option v-for="item in recOrderData" :key="item" :label="item" :value="item"> </el-option>
					</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="recEditSubmit">提交</el-button>
						<el-button @click="editRecVisible = false">取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		<!--end-->
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
	        editBannerFormVisible:false,
	        reBannerFormVisible:false,
	        oldbanId:'',
	        editBannerForm:{
	        	id:'',
	        	photo:'',
	        },
	        editBannerRules: {
				photo: [
					{ required: true, message:'请上传图片', trigger: 'change' }
				],
			},
		
			//热门
			hotData:[],
			ClassList:[],
			typeData:[],
			hotOrderData:[],//排序数组
			classTotal:undefined,
			addHotFormVisible:false,
			addEQuery:{
				typeId:'',
				keyword:'',
				page: 1,
				limit: 10,
				
			},
			ehidden:true,
			editHotVisible:false,
			editHotQuery:{
				id:undefined,
				resourceData:{
					className:'',
				},
			},
			orderHotNum:1,
			//新手
			begData:[],
			
			begOrderData:[],//排序数组
			
			addBegFormVisible:false,
			
//			ehidden:true,
			editBegVisible:false,
			editBegQuery:{
				id:undefined,
				resourceData:{
					className:'',
				},
			},
			orderBegNum:1,
			//推荐
			recData:[],
			recOrderData:[],//排序数组
			addRecFormVisible:false,
//			ehidden:true,
			editRecVisible:false,
			editRecQuery:{
				id:undefined,
				resourceData:{
					className:'',
				},
			},
			orderRecNum:1,
	      };
	    },mounted() {
			this.$nextTick(() => {
				this.token = sessionStorage.getItem('token');
				this.getBannerList();
				this.getHotData();
				this.getRecData();
				this.getBegData();                              
			});
		},
	    methods: {
	    	//banner
	    	uploadUrl(){
				return this.action
			},
	       getBannerList(){
	       		this.listLoading = true;
					this.$axios({
						url: this.path + 'page/content/details?pageType=class&contentType=banner',
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
	       		this.getClassType();
	       },
	       bannerAddSubmit(index,row){
	       		this.$confirm('确认要添加吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/add?pageType=class&contentType=banner&contentId='+ row.id,
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
							this.addBannerFormVisible = false;
							this.getBannerList();
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
	        handleBannerEdit(index,row){
	       		this.editBannerFormVisible = true;
	       		this.editBannerForm = Object.assign({}, row);
	        },
	        //上传封面
			handlebannerAvatarSuccess(res, file) {
				this.editBannerForm.photo = res;
			},
	        bannerEditSubmit(){
	       	this.$confirm('确认要修改排序吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/update',
						method: 'post',
						data:{
							id: this.editBannerForm.id,
							orderNumber: this.orderBNumber,
							photo:this.editBannerForm.photo
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
							this.editBannerFormVisible = false;
							this.getBannerList();
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
	       
			handleBannerReplace(index,row){
	       		this.reBannerFormVisible = true;
	       		this.oldbanId = row.id;
	       		this.getClassType();
	        },
	        bannerReSubmit(index,row){
	        	this.$confirm('确认要替换吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/update?contentId=' + row.id +'&id='+ this.oldbanId,
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
							this.reBannerFormVisible = false;
							this.getBannerList();
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
	        handleBannerDelete(index,row){
	       		this.$confirm('确认要删除这条记录吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/delete/'+row.id+'?pageType=class&contentType=banner',
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
							this.getBannerList();
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
			getHotOrder(){
				var arr = [];
				for(var i = 1 ;i <= this.hotData.length;i++){
					arr.push(i);
				}
				this.hotOrderData = arr
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
			handleESizeChange(val) {
				this.addEQuery.limit = val;
				this.handleClassList();
			},
			handleECurrentChange(val) {
				this.addEQuery.page = val;
				this.handleClassList();
			},
			//热门课程
			getHotData(){
				this.listLoading = true;
				this.$axios({
					url: this.path + 'page/content/details?pageType=class&contentType=hot_class',
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
			handleHotAdd(){
				this.addHotFormVisible = true;
				this.getClassType();
			},
			hotAddSubmit(index,row){
				this.$confirm('确认要添加吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/add?pageType=class&contentType=hot_class&contentId='+ row.id,
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
							this.addHotFormVisible = false;
							this.getHotData();
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
			handleHotEdit(index,row){
				this.editHotVisible = true;
				this.editHotQuery = Object.assign({}, row);
				this.getHotOrder();
			},
			hotEditSubmit(){
				this.$confirm('确认要修改排序吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/update',
						method: 'post',
						data:{
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
						if(res.data == 1){
							this.$message({
								message: '操作成功',
								type: 'success'
							});
							this.editHotVisible = false;
							this.getHotData();
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
			handleHotDelete(index,row){
				this.$confirm('确认要删除这条记录吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/delete/'+row.id+'?pageType=class&contentType=hot_class',
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
							this.getHotData();
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
			//新手入门
			getBegData(){
				this.listLoading = true;
				this.$axios({
					url: this.path + 'page/content/details?pageType=class&contentType=beginner_class',
					method: 'get',
					headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
				})
				.then((res) => {
					this.begData = res.data;
					this.listLoading = false;
				})
				.catch((err) => {
					console.log(err);
				})
			},
			handleBegAdd(){
				this.addBegFormVisible = true;
				this.getClassType();
			},
			begAddSubmit(index,row){
				this.$confirm('确认要添加吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/add?pageType=class&contentType=beginner_class&contentId='+ row.id,
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
							this.addBegFormVisible = false;
							this.getBegData();
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
			getBegOrder(){
				var arr = [];
				for(var i = 1 ;i <= this.begData.length;i++){
					arr.push(i);
				}
				this.begOrderData = arr
			},
			handleBegEdit(index,row){
				this.editBegVisible = true;
				this.editBegQuery = Object.assign({}, row);
				this.getBegOrder();
			},
			begEditSubmit(){
				this.$confirm('确认要修改排序吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/update',
						method: 'post',
						data:{
							id: this.editBegQuery.id,
							orderNumber: this.orderBegNum
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
							this.editBegVisible = false;
							this.getBegData();
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
			handleBegDelete(index,row){
				this.$confirm('确认要删除这条记录吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/delete/'+row.id+'?pageType=class&contentType=beginner_class',
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
							this.getBegData();
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
			//推荐课程
			getRecData(){
				this.listLoading = true;
				this.$axios({
					url: this.path + 'page/content/details?pageType=class&contentType=recommend_class',
					method: 'get',
					headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'Authorization':this.token,
						}
				})
				.then((res) => {
					this.recData = res.data;
					this.listLoading = false;
				})
				.catch((err) => {
					console.log(err);
				})
			},
			handleRecAdd(){
				this.addRecFormVisible = true;
				this.getClassType();
			},
			recAddSubmit(index,row){
				this.$confirm('确认要添加吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/add?pageType=class&contentType=recommend_class&contentId='+ row.id,
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
							this.addRecFormVisible = false;
							this.getRecData();
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
			getRecOrder(){
				var arr = [];
				for(var i = 1 ;i <= this.recData.length;i++){
					arr.push(i);
				}
				this.recOrderData = arr
			},
			handleRecEdit(index,row){
				this.editRecVisible = true;
				this.editRecQuery = Object.assign({}, row);
				this.getRecOrder();
			},
			recEditSubmit(){
				this.$confirm('确认要修改排序吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/update',
						method: 'post',
						data:{
							id: this.editRecQuery.id,
							orderNumber: this.orderRecNum
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
							this.editRecVisible = false;
							this.getRecData();
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
			handleRecDelete(index,row){
				this.$confirm('确认要删除这条记录吗？', '提示', { type: 'warning' }).then(() => {
					this.$axios({
						url: this.path + 'page/content/delete/'+row.id+'?pageType=class&contentType=recommend_class',
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
							this.getRecData();
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