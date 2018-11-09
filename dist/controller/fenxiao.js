/**
 * User: Awin 卓尉家 詹锦锋
 * Mail: 731661902@qq.com
 * Date: 2018/8/6
 * Time: 10:20
 * Company: 广州市致一信息技术有限公司
 */

layui.define(["form", "table", "upload", "laytpl"], function(t) {
	var $ = layui.jquery;
	var form = layui.form;
	var table = layui.table;
	var upload = layui.upload;
	var element = layui.element;
	var tpl = layui.laytpl;
	var s = layui.setter;
	var d = layui.daoke;

	var f = {

		ac: function() {

			var vm = new Vue({
				el: ".contain",
				data: {
					tableValue: {},
					imgUrl1: '',
					imgUrl2: '',
					groupList: [],
					fileList: [],
					menusList: [],
					menusItem: {},
					wordsList: [],
					wordsNameList: [],
					activeValue: 0,
					editValue: -1,
					isEditing: false,
					isLoadingMore: false,
					checkedCount: 0,
					uncheckedCount: 0,
					searchValue: '',
					modelData: {
						text: '',
						img1: '',
						img2: '',
						img3: ''
					}
				},
				methods: {
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
					deleteImg: function(val) {
						var that = this;
						if(val == 'shImg')
							that.$set(that, "imgUrl1", '');
						else if(val == 'dshImg')
							that.$set(that, "imgUrl2", '');
						else
							that.$set(that.menusItem, "icon", '');
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
								form.render();
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
						var that = this;
						that.getFolderData("json/user/upload-group.json", {});
						layer.open({
							type: 1,
							title: '选择文件',
							area: ['50%', '75%'],
							content: $('#fileLib'),
							btn: ['确定', '取消'],
							shadeClose: true,
							success: function(layero, index) {
								//遮罩层挡住弹出层处理
								var mask = $(".layui-layer-shade");
								mask.appendTo(layero.parent());
								that.getFileList({});
							},
							yes: function(layero, index) {
								for(let i in that.fileList) {
									if(that.fileList[i]["selected"] == 1) {
										if(id == 'menusItem.icon') {
											that.$set(that.menusItem, "icon", that.fileList[i].file_url);
										} else
											that.$set(that, id, that.fileList[i].file_url);
										layer.close(layer.index);
										return;
									}
								}
								layer.close(layer.index);
							}
						});
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
					//查看模板教程弹出层
					popupModel: function(title, val) {
						var that = this
						if(val == 0) {
							that.modelData["text"] = '提现到账通知'
							that.modelData['img1'] = 'http://mch.zhiyinfo.com/statics/images/tplmsg/cash_success_tpl/1.png'
							that.modelData['img2'] = 'http://mch.zhiyinfo.com/statics/images/tplmsg/cash_success_tpl/2.png'
							that.modelData['img3'] = 'http://mch.zhiyinfo.com/statics/images/tplmsg/cash_success_tpl/3.png'
						} else if(val == 1) {
							that.modelData["text"] = '提现失败通知'
							that.modelData['img1'] = 'http://mch.zhiyinfo.com/statics/images/tplmsg/cash_fail_tpl/1.png'
							that.modelData['img2'] = 'http://mch.zhiyinfo.com/statics/images/tplmsg/cash_fail_tpl/2.png'
							that.modelData['img3'] = 'http://mch.zhiyinfo.com/statics/images/tplmsg/cash_fail_tpl/3.png'
						} else {
							that.modelData["text"] = '分销审核通知'
							that.modelData['img1'] = 'http://mch.zhiyinfo.com/statics/images/tplmsg/apply_tpl/1.png'
							that.modelData['img2'] = 'http://mch.zhiyinfo.com/statics/images/tplmsg/apply_tpl/2.png'
							that.modelData['img3'] = 'http://mch.zhiyinfo.com/statics/images/tplmsg/apply_tpl/3.png'
						}
						that.$set(that, "modelData", that.modelData);
						layer.open({
							type: 1,
							title: '<h3>' + title + '</h3>',
							content: $("#popupModel"),
							area: ['26%', '90%'],
							btn: ['关闭'],
							shadeClose: true,
							success: function(layero, index) {
								//遮罩层挡住弹出层处理
								var mask = $(".layui-layer-shade");
								mask.appendTo(layero.parent());
							}
						})
					},
					//自定义设置页面文字编辑弹出层
					popupWordsEdit: function() {
						layer.open({
							type: 1,
							title: '文字编辑',
							content: $("#wordsEdit"),
							area: ["28%", "70%"],
							shadeClose: true,
							success: function(layero, index) {
								//遮罩层挡住弹出层处理
								var mask = $(".layui-layer-shade");
								mask.appendTo(layero.parent());
							}
						})
					},
					//自定义设置页面栏目编辑弹出层
					popupMenusEdit: function(item) {
						var that = this;
						that.$set(that, "menusItem", item);
						console.log("item", that.menusItem);
						layer.open({
							type: 1,
							title: '栏目编辑',
							content: $("#menusEdit"),
							area: ["580px"],
							shadeClose: true,
							success: function(layero, index) {
								//遮罩层挡住弹出层处理
								var mask = $(".layui-layer-shade");
								mask.appendTo(layero.parent());
							}
						})
					},
					//自定义内容保存
					customSubmit: function() {
						var that = this;
						that.openTips('保存成功', function(index) {
							layer.close(layer.index)
						});
					},
					//数据表格渲染
					renderTable: function() {
						var that = this;
						var index = layer.msg('正在加载中', {
							time: 50000
						});
						table.render({
							elem: that.tableValue.id,
							url: that.tableValue.url,
							id: 'table',
							cellMinWidth: 80,
							cols: [that.tableValue.cols],
							size: 'sm',
							page: true //是否显示分页
								,
							limits: [5, 7, 10],
							limit: 10 //每页默认显示的数量
								,
							where: that.tableValue.params,
							parseData: function(res) { //将原始数据解析成 table 组件所规定的数据
								that.$set(that, "checkedCount", res.checkedCount);
								that.$set(that, "uncheckedCount", res.uncheckedCount);
								layer.close(index);
								// return {
								//    "code": res.code, //解析接口状态
								//    "msg": res.msg, //解析提示文本
								//    "count": res.total, //解析数据长度
								//    "data": res.data //解析数据列表
								// };
							}
						});
					},
					//批量通过
					passTogether: function() {
						var that = this;
						var data = table.checkStatus('table').data;
						if(data.length == 0)
							that.openTips('请先勾选用户', function(index) {
								layer.close(layer.index)
							});
						else
							that.openTips('是否批量通过', function(index) {
								console.log(data, '选中的行');
								layer.close(layer.index);
							});
					},
					//升为一级
					promote: function() {
						var that = this;
						var data = table.checkStatus('table').data;
						if(data.length == 0)
							that.openTips('请先勾选用户', function(index) {
								layer.close(layer.index)
							});
						else
							that.openTips('是否批量升为一级', function(index) {
								console.log(data, '选中的行');
								layer.close(layer.index);
							});
					},
					//表格搜索
					search: function() {
						var that = this;
						console.log('搜索条件：', {
							value: that.searchValue
						});
						that.$set(that.tableValue, "params", {
							value: that.searchValue
						});
						that.renderTable();
					}
				},
				created: function() {
					d.Ajax("post", "json/mark/form-base-setting.json", {}, function(res) {
						if(res.code == 0) {
							form.val("baseSetting", res.data); //表单初始化赋值
						}
					}, function(error) {
						console.log(error);
					})
				},
				mounted: function() {
					var that = this;
					var value = {
						id: '#fxs-table',
						url: 'json/mark/fxs-table.json',
						cols: [ //标题栏
							{
								type: 'checkbox'
							}, {
								field: 'id',
								title: 'ID',
								width: 80
							}, {
								field: 'photo',
								title: '头像',
								templet: '#photo'
							}, {
								field: 'name',
								title: '昵称'
							}, {
								field: 'profile',
								title: '资料'
							}, {
								field: 'moneyDetail',
								title: '佣金详情'
							}, {
								field: 'lowerUser',
								title: '下级用户'
							}

							, {
								field: 'order',
								title: '会员订单'
							}, {
								field: 'status',
								title: '状态',
								width: 80
							}, {
								field: 'time',
								title: '时间',
								minWidth: 145
							}, {
								field: 'operation',
								title: '操作',
								minWidth: 150,
								toolbar: '#table-bar'
							}
						],
						params: ''
					}
					that.$set(that, "tableValue", value);
					that.renderTable();
					//监听分销tab切换
					element.on('tab(fx-tab)', function() {
						var id = this.getAttribute('lay-id');
						if(id == 0) {
							value = {
								id: '#fxs-table',
								url: 'json/mark/fxs-table.json',
								cols: [ //标题栏
									{
										type: 'checkbox'
									}, {
										field: 'id',
										title: 'ID',
										width: 80
									}, {
										field: 'photo',
										title: '头像',
										templet: '#photo'
									}, {
										field: 'name',
										title: '昵称'
									}, {
										field: 'profile',
										title: '资料'
									}, {
										field: 'moneyDetail',
										title: '佣金详情'
									}, {
										field: 'lowerUser',
										title: '下级用户'
									},
									{
										field: 'order',
										title: '会员订单'
									},{
										field: 'status',
										title: '状态',
										width: 80
									}, {
										field: 'time',
										title: '时间',
										minWidth: 145
									},{
										field: 'operation',
										title: '操作',
										minWidth: 150,
										toolbar: '#table-bar'
									}
								],
								params: ''
							}
						} else if(id == 1) {
							value = {
								id: '#order-table',
								url: 'json/mark/order-table.json',
								cols: [{
									field: 'goodsInfo',
									title: '商品信息'
								}, {
									field: 'money',
									title: '金额',
									width: 150
								}, {
									field: 'status',
									title: '订单状态',
									width: 150
								}, {
									field: 'fxSituation',
									title: '分销情况'
								}],
								params: ''
							}
						} else if(id == 2) {
							value = {
								id: '#deposit-table',
								url: 'json/mark/deposit-table.json',
								cols: [{
									field: 'id',
									title: 'ID',
									width: 80
								}, {
									field: 'wechatInfo',
									title: '微信信息'
								}, {
									field: 'accountInfo',
									title: '账号信息'
								}, {
									field: 'depositMoney',
									title: '提现金额（元）'
								}, {
									field: 'status',
									title: '状态',
									width: 80
								}, {
									field: 'applyTime',
									title: '申请时间',
									minWidth: 245
								}, {
									field: 'operation',
									title: '操作',
									minWidth: 150,
									toolbar: '#table-bar'
								}],
								params: ''
							}
						} else {
							// d.Ajax("post",url,{},function(res){
							//       if(res.code == 0){

							//       }
							// },function(error){
							//       console.log(error)
							// }) 
							return
						}
						that.$set(that, "searchValue", '');
						that.$set(that, "tableValue", value);
						that.renderTable();
					});
					//监听分销设置tab切换
					element.on('tab(fx-settingTab)', function() {
						var id = this.getAttribute('lay-id');
						if(id == 'base') {

						} else if(id == 'money') {

						} else {
							d.Ajax("post", "json/mark/customList.json", {}, function(res) {
								if(res.code == 0) {
									that.$set(that, "menusList", res.data.menus)
									that.$set(that, "wordsList", res.data.words)
									for(let i in that.wordsList) {
										that.wordsNameList.push(i)
									}
									that.$set(that, "wordsNameList", that.wordsNameList)
								}
							}, function(error) {
								console.log(error)
							})
						}
					});
					//监听分销商tab切换
					element.on('tab(fxs-tab)', function() {
						var id = this.getAttribute('lay-id');
						var url;
						if(id == 0) {
							url = "json/mark/fxs-table.json";
						} else if(id == 1) {
							url = "json/mark/fxs-table.json";
						} else {
							url = "json/mark/fxs-table-checked.json";
						}
						that.$set(that.tableValue, "url", url);
						that.renderTable();
					});
					//监听分销订单tab切换
					element.on('tab(order-tab)', function() {
						var id = this.getAttribute('lay-id');
						var url = "json/mark/order-table.json";
						that.$set(that.tableValue, "url", url);
						that.renderTable();
					});
					//监听分销提现tab切换
					element.on('tab(deposit-tab)', function() {
						var id = this.getAttribute('lay-id');
						var url = "json/mark/deposit-table.json";
						that.$set(that.tableValue, "url", url);
						that.renderTable();
					});
					//监听基础设置表单提交
					form.on('submit(baseSetting)', function(data) {
						that.openTips('保存成功', function(index) {
							layer.close(layer.index)
						});
						return false;
					});
					//监听自定义文字设置表单提交
					form.on('submit(wordsEdit)', function(data) {
						for(let i in that.wordsList) {
							that.wordsList[i]["name"] = data.field[i];
						}
						layer.closeAll();
						return false;
					});
					//监听栏目编辑表单提交
					form.on('submit(menusEdit)', function(data) {
						var name = that.menusItem.name;
						for(let i in that.menusList) {
							if(name == that.menusList[i]["name"]) {
								that.$set(that.menusList[i], "name", data.field.name);
								that.$set(that.menusList[i], "url", data.field.url);
							}
						}
						layer.closeAll();
						return false;
					});
					//监听文件库移动图片分组点击
					form.on('select(select_lib)', function(data) {
						var arr = [];
						for(let i in that.fileList) {
							if(that.fileList[i].selected == 1)
								arr.push(that.fileList[i]);
						}
						if(arr.length == 0) {
							that.openTips('请先勾选要移动的图片', function(index) {
								layer.close(layer.index)
							});
						} else {
							console.log('data', {
								group_id: data.value,
								data: arr
							});
						}
					});
					//表单验证规则定义
					form.verify({
						//提现金额
						position: function(value, item) { //value：表单的值、item：表单的DOM对象
							if(value < 1)
								return '最小提现金额的值必须不小于1。';
						},
						//每日提现上限
						limit: function(value, item) {
							if(value < 0) {
								if(item.name == 'depositLimit')
									return '每日提现上限的值必须不小于0。';
								else
									return '消费自动成为分销商的值必须不小于0。';
							}
						}
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
												console.log(res, 'res', s.domain)
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
					//监听分销商表格行工具事件
					table.on('tool(fxs-table)', function(obj) {
						var data = obj.data;
						if(obj.event === 'del') {
							layer.confirm('是否删除', function(index) {
								obj.del();
								layer.close(index);
							});
						} else if(obj.event === 'edit') {

						}
					});
					//监听分销提现表格行工具事件
					table.on('tool(deposit-table)', function(obj) {
						var data = obj.data;
						if(obj.event === 'del') {
							layer.confirm('是否删除', function(index) {
								obj.del();
								layer.close(index);
							});
						} else if(obj.event === 'edit') {
							console.log('editing')
						}
					});
					//监听文件库弹出层复选框
					form.on('checkbox(ckb)', function(data) {
						if(data.elem.checked) {
							if(that.fileList.length != 0) {
								for(let i in that.fileList)
									that.fileList[i]["selected"] = 1;
							}
						} else {
							for(let i in that.fileList)
								that.fileList[i]["selected"] = 0;
						}
						that.$set(that, "fileList", that.fileList);
					});
					$(".fxs-tab").removeProp('hidden');
				},
				updated: function() {
					this.$nextTick(function() {
						form.render();
					});
				}
			})
		}
	}

	t("fenxiao", f)
})