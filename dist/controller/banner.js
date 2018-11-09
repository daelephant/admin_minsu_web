/**
 * User: Awin 卓尉家 詹锦锋
 * Mail: 731661902@qq.com
 * Date: 2018/8/6
 * Time: 10:20
 * Company: 广州市致一信息技术有限公司
 */

layui.define(["form", "table","laytpl", "upload"], function(t) {
  	var $ = layui.jquery,
  	table = layui.table,
	form = layui.form,
	s = layui.setter,
	element = layui.element,
	tpl = layui.laytpl,
	upload = layui.upload,
	d = layui.daoke;

	var f = {

		ac: function(){
			var tableIns;
			var vm = new Vue({
				el: '.contain',
				data: {
					imgUrl: ''
				},
				mounted: function(){
					var that = this;
					//监听分销商表格行工具事件
					table.on('tool(table)', function(obj){
						var data = obj.data;
						console.log(data);
						that.$set(that,"curr_id",data.id)
						if(obj.event === 'del'){
							layer.confirm('是否删除', function(index){
								d.Ajax('post', s.api.delFacilities, {id: data.id}, function(res){
									console.log(res);
									if(res.code == 0){
										layer.msg(res.msg, {
											offset: '15px',
											icon: 1,
											time: 1000
										});
									}
								}, function(error){
									console.log(error);
								})
								layer.close(index);
							});
						} else if(obj.event === 'edit'){
							form.val('add_banner',data);
							that.addPopup('修改图片');
						}
					});
					//表格数据渲染
					tableIns = table.render({
						elem: 'table'
						,url: s.api.getFaciliy
						,id: 'table'
						,cellMinWidth: 80
						,cols: [[
							{type:'checkbox'}
							,{field: 'level', title: 'ID'}
							,{field: 'title', title: '图片'}
							,{field: 'pid', title: '路径'}
							,{field: 'operation', title: '操作', minWidth: 150, toolbar: '#table-bar'}
						]]
						,size: 'sm' 
						,page: true //是否显示分页
						,limits: ['20']
						,limit: 20 //每页默认显示的数量
						,request: {
							pageName: 'current_page', //页码的参数名称，默认：page

						}
						,where: {
							access_token: d.tk('access_token')
							,member_id: d.tk('member_id')
						}
						,parseData: function(res){ //将原始数据解析成 table 组件所规定的数据
							console.log('res',res);
							// layer.close(index);
							return {
							   "code": res.code, //解析接口状态
							   "msg": res.msg, //解析提示文本
							   "count": res.data.total, //解析数据长度
							   "data": res.data.data //解析数据列表
							};
						}
					});
					//监听表单提交
       				form.on('submit(add_banner)', function(data){

       					console.log(data.field);
       					layer.closeAll();     					
       					return false;
       				});
       				//上传图片
					upload.render({
						elem: '.upload',
						url: '',
						auto: false, //选择文件后不自动上传
						size: 50,
						accept: 'images',
						size: 1980,
						choose: function(obj) {
							//预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
							obj.preview(function(index, file, result) {
								d.Ajax('post', s.api.getqiutoken, {}, function(e) {
									if(e.code == 0) {
										d.up(result, e.data.up_token, function(res) {
											if(typeof(res.key) != 'undefined') {
												console.log(res, 'res', s.domain);
												that.$set(that, "imgUrl", s.domain + res.key)
												// var ops = {
												//       path: s.domain + res.key  //图片路径
												// }
											}

										})
									}

								})

							});
						}
					});
					form.render();
				},
				updated: function(){
					this.$nextTick(function () {                  
						form.render();
					});
				},
				methods: {
					//添加弹出层
					addPopup: function(title){
						if(title == '添加图片')
							form.val('add_banner',{title:'',isShow:0,bannerUrl: '', path: ''});
						layer.open({
							type: 1
							,title: title
							,content: $("#addPopup")
							,area: ["750px","600px"]
							,shadeClose: true
							,success: function(layero,index){
								//遮罩层挡住弹出层处理
                                var mask = $(".layui-layer-shade");
                                mask.appendTo(layero.parent());
							}
						})
					},
					// 删除按钮
					deleteBanner: function(){
						var that = this;
						var data = table.checkStatus('table').data;
						console.log('data',data);
						if(data.length == 0) that.openTips('请先进行勾选', function(index){
							layer.closeAll();
						});

					},
					//文字提示弹出层
					openTips: function(content, yes) {
						layer.open({
							type: 1,
							title: '提示',
							area: ['300px', '165px'],
							content: '<div style="padding: 20px;border: 1px solid #e6e6e6;">' + content + '</div>',
							btn: ['确定'],
							shadeClose: true,
							btnAlign: 'c',
							yes: function(index) {
								yes(index);
							}
						})
					},
					//删除上传文件
					deleteImg: function() {
						var that = this;
						that.$set(that, "imgUrl", '');
					},
					//Tips弹出层
					Tips: function(text, id) {
						idx = layer.tips(text, '#' + id, {
							tips: 3
						});
					},
					//关掉Tips
					closeTips: function() {
						layer.close(idx);
					},
					//文件分组渲染
					getFolderData: function(url, params) {
						var that = this;
						d.Ajax("post", url, params, function(res) {
							if(res.code == 0) {
								that.$set(that, "groupList", res.data)
								var getTpl = select_tpl.innerHTML;
								var el = document.getElementById("select_tpl_view");
								tpl(getTpl).render({
									list: res.data.slice(2)
								}, function(html) {
									el.innerHTML = html;
								});
								l.render();
							}
						}, function(error) {
							console.log(error);
						})
					},
					//图片文件渲染
					getFileList: function(params) {
						var that = this;
						d.Ajax("post", "json/user/upload-fileList.json", {}, function(res) {
							if(res.code == 0) {
								that.$set(that, "fileList", res.data.list);
							}
						}, function(error) {
							console.log(error);
						});
					},
					//选择文件弹出层
					popupFileLib: function(id) {
						// var that = this;
						// that.getFolderData("json/user/upload-group.json", {});
						// layer.open({
						// 	type: 1,
						// 	title: '选择文件',
						// 	area: ['50%', '75%'],
						// 	content: $('#fileLib'),
						// 	btn: ['确定', '取消'],
						// 	shadeClose: true,
						// 	success: function(layero, index) {
						// 		//遮罩层挡住弹出层处理
						// 		var mask = $(".layui-layer-shade");
						// 		mask.appendTo(layero.parent());
						// 		that.getFileList({});
						// 	},
						// 	yes: function(layero, index) {
						// 		for(let i in that.fileList) {
						// 			if(that.fileList[i]["selected"] == 1) {
						// 				if(id == 'menusItem.icon') {
						// 					that.$set(that.menusItem, "icon", that.fileList[i].file_url);
						// 				} else
						// 					that.$set(that, id, that.fileList[i].file_url);
						// 				layer.close(layer.index);
						// 				return;
						// 			}
						// 		}
						// 		layer.close(layer.index);
						// 	}
						// });
					},
					//添加文件库文件分组
					addFolder: function() {
						var that = this;
						that.getFolderData("json/user/upload-group-add.json", {});
					},
					//点击文件分组
					clickFolder: function(val, id) {
						var that = this;
						that.$set(that, "isLoadingMore", true);
						that.getFileList({
							group_id: id
						});
						that.$set(that, "editValue", -1);
						that.$set(that, "activeValue", val);
					},
					//点击文件分组设置图标
					editFolder: function(val) {
						var that = this;
						if(val == that.editValue) {
							that.$set(that, "editValue", -1);
						} else {
							that.$set(that, "activeValue", val);
							that.$set(that, 'editValue', val);
						}
					},
					//编辑文件分组
					edit: function(text) {
						var that = this;
						that.$set(that, "editValue", -1);
						that.$set(that, "isEditing", true);
					},
					//删除文件分组
					deleteFolder: function(item) {
						var that = this;
						that.getFolderData("json/user/upload-group.json", item);
						that.$set(that, "editValue", -1);
					},
					//确认或取消编辑
					confirmOrCancleEdit: function(val, cancle) {
						var that = this;
						if(cancle == 0) { //当cancle=1时为取消
							that.getFolderData("json/user/upload-group-add.json", val);
						}
						that.$set(that, "activeValue", val);
						that.$set(that, "editValue", -1);
						that.$set(that, "isEditing", false);
					},
					//选中图片
					toggleSelected: function(val) {
						var that = this;
						if(that.fileList[val].selected == 0)
							that.fileList[val].selected = 1;
						else
							that.fileList[val].selected = 0;
						that.$set(that.fileList, val, that.fileList[val]);
					},
					//删除选中图片
					deleteLibImg: function() {
						var that = this;
						var arr = [];
						for(let i = 0; i < that.fileList.length; i++) {
							if(that.fileList[i]['selected'] == 1) {
								arr.push(that.fileList[i]['id']);
							}
						}
						if(arr.length == 0) {
							that.openTips('请先勾选要删除的图片', function(index) {
								layer.close(layer.index)
							});
						} else {
							that.openTips('删除成功', function(index) {
								layer.close(layer.index)
							});
							console.log('删除的图片ID：', arr);
							that.getFileList({
								id: arr
							});
						}
					},
				}
			})
		} 
	}
	t('banner',f)
});