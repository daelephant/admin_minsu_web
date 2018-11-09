/**
 * User: Awin 卓尉家 詹锦锋
 * Mail: 731661902@qq.com
 * Date: 2018/8/6
 * Time: 10:20
 * Company: 广州市致一信息技术有限公司
 */

layui.define(["form", "table", "laytpl"], function(t) {
	var $ = layui.jquery;
	var form = layui.form;
	var table = layui.table;
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
					searchValue: ''
				},
				methods: {
					//添加核销员弹窗
					addHxy: function() {
						layer.open({
							type: 1,
							title: '<h3>设置核销员</h3>',
							content: '<div style="padding: 20px">门店选择<span style="color: red">*</span> 暂未设置门店，<a href="javascript:;" lay-href="mark/fenxiao">请前往设置</div>',
							area: ['300px', '165px'],
							btn: ['关闭'],
							shadeClose: true
						})
					},
					//跳转到会员设置页面
					toMemberEdit: function(id) {
						if(id) {
							location.href = '#/user/member-edit?id=' + id
						} else
							location.href = '#/user/member-edit'
					},
					//数据表格进行渲染
					renderTable: function(flag) {
						var that = this
						var index = layer.msg("正在加载中", {
							time: 50000
						})
						table.render({
							elem: that.tableValue.id,
							url: that.tableValue.url,
							cellMinWidth: 80,
							cols: [that.tableValue.cols],
							size: 'sm',
							page: true //是否显示分页
								,
							limits: [5, 7, 10],
							limit: 10 //每页默认显示的数量
								,
							where: that.tableValue.params
								// ,response: {
								// 	statusCode: 200 //重新规定成功的状态码为 200，table 组件默认为 0
								// }
								,
							parseData: function(res) { //将原始数据解析成 table 组件所规定的数据
								if(flag == 1) {
									var arr1 = [],
										arr2 = []
									for(let i = 0; i < res.data.length; i++) {
										if(arr1.indexOf(res.data[i]["identity"]) == -1)
											arr1.push(res.data[i]["identity"])
									}
									for(let j = 0; j < arr1.length; j++) {
										arr2.push({
											id: arr1[j],
											name: arr1[j]
										})
									}
									d.ltp("select_tpl_view", 'select_tpl', s.views + s.template.select, function(Tpl) {
										var ops = {
											name: 'member_type',
											first: '全部类型',
											filter: 'select_memberType',
											list: arr2
										}
										var view = document.getElementById('select_tpl_view');
										tpl(Tpl).render(ops, function(html) {
											view.innerHTML = html;
										});
										form.render();
									});
								}
								layer.close(index)
								// return {
								// 	"code": res.status, //解析接口状态
								// 	"msg": res.message, //解析提示文本
								// 	"count": res.total, //解析数据长度
								// 	"data": res.rows.item //解析数据列表
								// };
							}
						});
					},
					//搜索
					search: function() {
						var that = this
						console.log({
							value: that.searchValue
						})
						that.$set(that.tableValue, "params", {
							value: that.searchValue
						})
						console.log(that.tableValue, "tableValue")
						that.renderTable()
					}
				},
				created: function() {
					var that = this
				},
				mounted: function() {
					var that = this
					var value = {
						id: '#user-table',
						url: 'json/user/userList.json',
						cols: [ //标题栏
							{
								field: 'id',
								title: 'ID',
								width: 60
							}, {
								field: 'userPhoto',
								title: '头像',
								width: 60,
								templet: '#photo'
							}, {
								field: 'name',
								title: '昵称',
								width: 100
							}, {
								field: 'phone',
								title: '手机',
								width: 100
							}, {
								field: 'identity',
								title: '身份',
								width: 80
							}, {
								field: 'orderCount',
								title: '订单数',
								width: 80
							}, {
								field: 'couponCount',
								title: '优惠券',
								width: 80
							}, {
								field: 'currentPoints',
								title: '积分',
								Width: 60
							}, {
								field: 'currentBalance',
								title: '余额',
								Width: 60
							}, {
								field: 'joinTime',
								title: '加入时间',
								Width: 130
							}, {
								field: 'operation',
								title: '操作',
								toolbar: '#table-bar'
							}
						],
						params: ''
					}
					that.$set(that, "tableValue", value)
					that.renderTable(1)
					//监听Tab切换
					element.on('tab(userTab)', function() {
						var id = this.getAttribute('lay-id')
						var flag
						if(id == 0) { //用户列表
							value = {
								id: '#user-table',
								url: 'json/user/userList.json',
								cols: [ //标题栏
									{
										field: 'id',
										title: 'ID',
										width: 60
									}, {
										field: 'userPhoto',
										title: '头像',
										width: 60,
										templet: '#photo'
									}, {
										field: 'name',
										title: '昵称',
										width: 100
									}, {
										field: 'phone',
										title: '手机',
										width: 100
									}, {
										field: 'identity',
										title: '身份',
										width: 80
									}, {
										field: 'orderCount',
										title: '订单数',
										width: 80
									}, {
										field: 'couponCount',
										title: '优惠券',
										width: 80
									}, {
										field: 'currentPoints',
										title: '积分',
										Width: 60
									}, {
										field: 'currentBalance',
										title: '余额',
										Width: 60
									}, {
										field: 'joinTime',
										title: '加入时间',
										Width: 130
									}, {
										field: 'operation',
										title: '操作',
										toolbar: '#table-bar'
									}
								],
								params: ''
							}
							flag = 1
						} else if(id == 1) { //核销员
							value = {
								id: '#hxy-table',
								url: 'json/user/hxyList.json',
								cols: [ //标题栏
									{
										field: 'id',
										title: 'ID'
									}, {
										field: 'photo',
										title: '头像',
										templet: '#photo'
									}, {
										field: 'name',
										title: '昵称'
									}, {
										field: 'belongStore',
										title: '所属门店'
									}, {
										field: 'joinTime',
										title: '加入时间',
										minWidth: 200
									}, {
										field: 'identity',
										title: '身份'
									}, {
										field: 'orderCount',
										title: '核销订单数'
									}, {
										field: 'totalMoney',
										title: '核销总额'
									}, {
										field: 'cardCount',
										title: '核销卡券数量'
									}, {
										field: 'operation',
										title: '操作',
										minWidth: 150,
										toolbar: '#table-bar'
									}
								],
								params: ''
							}
						} else if(id == 2) { //会员等级
							value = {
								id: '#member-table',
								url: 'json/user/levelList.json',
								cols: [ //标题栏
									{
										field: 'level',
										title: '等级',
										width: 120
									}, {
										field: 'levelTitle',
										title: '等级名称'
									}, {
										field: 'discount',
										title: '折扣'
									}, {
										field: 'price',
										title: '购买所需金额'
									}, {
										field: 'promoteCondition',
										title: '升级条件'
									}, {
										field: 'status',
										title: '状态',
										templet: '#switchTpl',
										minWidth: 100
									}, {
										field: 'operation',
										title: '操作',
										minWidth: 150,
										toolbar: '#table-bar'
									}
								],
								params: ''
							}
						} else if(id == 3) { //余额充值记录
							value = {
								id: '#recharge-table',
								url: 'json/user/rechargeList.json',
								cols: [ //标题栏
									{
										field: 'id',
										title: 'ID'
									}, {
										field: 'orderNumber',
										title: '订单号',
										minWidth: 300
									}, {
										field: 'name',
										title: '昵称'
									}, {
										field: 'payMoney',
										title: '支付金额'
									}, {
										field: 'giveMoney',
										title: '赠送金额'
									}, {
										field: 'time',
										title: '充值时间',
										minWidth: 150
									}
								],
								params: ''
							}
						} else {
							value = { //会员购买记录
								id: '#buy-table',
								url: 'json/user/buyList.json',
								cols: [ //标题栏
									{
										field: 'id',
										title: 'ID'
									}, {
										field: 'orderNumber',
										title: '订单号',
										minWidth: 200
									}, {
										field: 'name',
										title: '昵称'
									}, {
										field: 'payMoney',
										title: '支付金额'
									}, {
										field: 'beforeBuy',
										title: '购买前'
									}, {
										field: 'afterBuy',
										title: '购买后'
									}, {
										field: 'time',
										title: '购买时间',
										minWidth: 150
									}
								],
								params: ''
							}
						}
						that.$set(that, "tableValue", value)
						that.renderTable(flag)
						that.$set(that, "searchValue", '')
					});
					//监听用户列表会员类型下拉框事件
					form.on('select(select_memberType)', function(obj) {
						console.log(obj.value)
						//将对应值作为参数进行请求并渲染表格
						//that.$set(that.tableValue,"params",{value: obj.value})
						//that.renderTable()
					});
					//监听用户表格行工具事件
					table.on('tool(user-table)', function(obj) {
						var data = obj.data;
						if(obj.event === 'del') {
							layer.confirm('是否删除', function(index) {
								obj.del();
								layer.close(index);
							});
						} else if(obj.event === 'edit') {

						}
					});
					//监听核销员表格行工具事件
					table.on('tool(member-table)', function(obj) {
						var data = obj.data;
						if(obj.event === 'del') {
							layer.confirm('是否删除', function(index) {
								obj.del();
								layer.close(index);
							});
						} else if(obj.event === 'edit') {

						}
					});
					//监听会员表格行工具事件
					table.on('tool(member-table)', function(obj) {
						var data = obj.data;
						if(obj.event === 'del') {
							layer.confirm('是否删除', function(index) {
								obj.del();
								layer.close(index);
							});
						} else if(obj.event === 'edit') {
							that.toMemberEdit(obj.data.id)
						}
					});
					//监听会员列表状态操作
					form.on('switch(statusSwitch)', function(obj) {
						//layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
						if(this.value == 'open') {
							layer.tips('禁用成功！', obj.othis)
						} else
							layer.tips('启用成功！', obj.othis)
					});
					form.render()
				},
				updated: function() {
					this.$nextTick(function() {
						form.render()
					});
				}
			})

		}
	}

	t("user_list", f)
});