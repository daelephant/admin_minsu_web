/**
 * User: Awin 卓尉家
 * Mail: 731661902@qq.com
 * Date: 2018/8/6
 * Time: 10:20
 * Company: 广州市致一信息技术有限公司
 */
layui.define(["table", "form", "upload", "element", "admin", "laytpl"], function(t) {
	var e = (layui.$, layui.admin),
		i = layui.view,
		n = layui.table,
		d = layui.daoke,
		s = layui.setter,
		a = layui.admin,
		el = layui.element,
		upload = layui.upload,
		tpl = layui.laytpl,
		$ = layui.jquery,
		l = layui.form;
	var index = 0;
	el.on('tab(SettingTabBrief)', function(data) {
		index = data.index
	});

	//监听提交
	l.on('submit(submit-1)', function(data) {

		data.field.index = index;

		console.log("提交的数据", data.field);

		d.Ajax('post', s.api.setting, data.field, function(e) {

			if(e.code == 0) {
				layer.msg(e.msg)
			}
		})

		return false;

	})

	//验证类
	l.verify({
		service_tel: function(value, item) { //value：表单的值、item：表单的DOM对象

			if(value == '') {
				return '请输入客服电话';

			}
		},
		about: function(value, item) { //value：表单的值、item：表单的DOM对象

			if(value == '') {
				return '请输入小程序基本介绍！';

			}
		},
		mini_appid: function(value, item) {

			if(value == '') {
				return 'appid很重要哦，不能为空';

			}

		},
		mini_appsecrept: function(value, item) {

			if(value == '') {
				return 'appsecrept很重要哦，不能为空';

			}

		}
	});

	var f = {

		ac: function() {
            this.init()//初始化
			var vm = new Vue({
				el: ".contain",
				data: {
					imgUrl: '',
					groupList: [],
					fileList: [],
					activeValue: 0,
					editValue: -1,
					isEditing: false,
					isLoadingMore: false
				},
				mounted: function() {
					var that = this;
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
				}

			});
		},
		init: function() {
			//获取数据

			d.Ajax('post', s.api.get_setdata, {}, function(e) {

				if(e.code == 0) {
				
					l.val("formOne", {
						"logo":e.data.logo,
						"service_tel": e.data.service_tel, // "name": "value"
						"complaint_tel": e.data.complaint_tel,
						"about": e.data.about,
					})
					l.val("formTwo", {
						"app_name": e.data.app_name, // "name": "value"
						"mini_appid": e.data.mini_appid,
						"mini_appsecrept": e.data.mini_appsecrept,
						"mini_mid": e.data.mini_mid,
						"mini_apicode": e.data.mini_apicode,
						"apiclient_cert": e.data.apiclient_cert,
						"apiclient_cert_key": e.data.apiclient_cert_key
					})
				}
			})
		}

	}

	t("setting", f);
})