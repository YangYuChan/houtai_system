export default {
	checkVrName: function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请填写视频名称'));
		} else {
			callback()
		}
	},
	checkTitle:function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请填写标题'));
		} else {
			callback()
		}
	},
	checkAuth:function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请填写文章作者'));
		} else {
			callback()
		}
	},
	checkContext:function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请填写文章内容'));
		} else {
			callback()
		}
	},
	checkClassName:function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请填写课程名称'));
		} else {
			callback()
		}
	},
	checkGym:function(rule, value, callback) {
		if(!value) {
			return callback(new Error('请选择健身房'));
		} else {
			callback()
		}
	},
	checkPhone: function(rule, value, callback) {
		if(!value) {
			return callback(new Error('电话不能为空'));
		} else if  (value.length > 11)  {
            return callback(new Error('电话号码不能大于11位'));
        } else {
			callback()
		}
	},
	checkNum: function(rule, value, callback) {
		if(!value) {
			return callback(new Error('数量不能为空'));
		} else if  (!Number.isInteger(value))  {
            return callback(new Error('数量格式不正确'));
        } else {
			callback()
		}
	},
}