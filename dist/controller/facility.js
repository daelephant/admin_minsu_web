/**
 * User: Awin 卓尉家 詹锦锋
 * Mail: 731661902@qq.com
 * Date: 2018/8/6
 * Time: 10:20
 * Company: 广州市致一信息技术有限公司
 */

layui.define(["form","table","iconPicker","laytpl"], function(t) {
	var $ = layui.jquery;
	var element = layui.element;
	var form = layui.form;
	var table = layui.table;
	var iconPicker = layui.iconPicker;
	var s = layui.setter;
	var d = layui.daoke;
	var tpl = layui.laytpl;

  
	var f={

       	ac:function(){
       		var tableIns;
       		var vm = new Vue({
       			el: '.contain',
       			data: {
       				curr_id: -1,
       				icon: 'layui-icon-snowflake'
       			},
       			created: function(){

       			},
       			mounted: function(){
       				var that = this;
       				var index = layer.msg('正在加载中',{time:50000});
       				that.getFacilities();
       				//监听表单提交
       				form.on('submit(add_facility)', function(data){
       					data.field["icon"] = that.icon;
       					if(that.curr_id != -1){
       						data.field['id'] = that.curr_id;
       						//提交数据到后端
	       					d.Ajax("post",s.api.setFaciliy, data.field, function(res){
	       						console.log(res,'这是修改');
	       						if(res.code == 0){
	       							that.$set(that,"curr_id",-1);
	       							that.renderTable();
	       							layer.msg(res.msg, {
										offset: '15px',
										icon: 1,
										time: 1000
									});
	       						}

	       					},function(error){
	       						console.log(error);
	       					});
       					}
       					else{
       						//提交数据到后端
	       					d.Ajax("post",s.api.setFaciliy, data.field, function(res){
	       						if(res.code == 0){
	       							that.$set(that,"curr_id",-1);
	       							//重新加载类型下拉列表框模板
						            d.ltp("select_view_type", 'facility_select_tpl', s.views + s.template.select, function(Tpl) {
				                        var ops = {
				                        	value: 'id',
				                        	name: 'pid',
				                            list: res.data
				                        }
				                        var view = document.getElementById('select_view_type');
				                        tpl(Tpl).render(ops, function(html) {
				                            view.innerHTML = html;
				                        });
				                        form.render();
				                    });
	       							that.renderTable();
	       							layer.msg(res.msg, {
										offset: '15px',
										icon: 1,
										time: 1000
									});
	       						}
	       					},function(error){
	       						console.log(error);
	       					});
       					}
       					console.log(data.field)
       					layer.closeAll();     					
       					return false;
       				});
       				var iconlist = [
						"icon-sheshifuwu", "icon-hanglijicun", "icon-jijiubao", "icon-caishichang", "icon-yaodian", "icon-mianfeitingche", "icon-tikuanji", "icon-gonggonghuayuan",
						"icon-canting", "icon-chaoshi", "icon-yongchijing", "icon-ertongleyuan", "icon-youchuanghu", "icon-sijiawenquan", "icon-pingmiyishangduliketing", "icon-sijiahuayuan",
						"icon-ladichuang", "icon-dianti", "icon-sijiayongchi", "icon-guanjingloutai", , "icon-zhinengmensuo", "icon-baoan", "icon-baoxianxiang", "icon-menjinxitong",
						"icon-huozaijingbaoqi", "icon-miehuoqi", "icon-zhuomianzuqiu", "icon-touyingshebei", "icon-jiatingyingyuan", "icon-iconfontyouxiji", "icon-majiangji", "icon-_huaban",
						"icon-shaokaoqiju", "icon-dianfanguo", "icon-zhengtichugui", "icon-canju", "icon-daojucaiban", "icon-xidiyongju", "icon-ranqizaomeiqizaozaotaixianxing", "icon-weibolu",
						"icon-diancilu", "icon-pengren", "icon-tiaoliao", "icon-zhinengmatonggai", "icon-maojin", "icon-yujin", "icon-duliweiyu", "icon-xiangzao",
						"icon-quantianreshui", "icon-fenshiduanreshui", "icon-weishengzhi1", "icon-yugang", "icon-xiyuyongpin", "icon-yaju", "icon-xiuxianyi", "icon-tuoxie",
						"icon-jiashiqi", "icon-bingxiang", "icon-liangyijia", "icon-dasaogongju", "icon-dianchuifeng", "icon-xiyiji", "icon-dianshi", "icon-kongqijinghuaqi",
						"icon-jingshuiqi", "icon-yundou", "icon-chaji", "icon-shafa", "icon-Hjiafangjiashi-ditandidian", "icon-xiyiye", "icon-zhuangshi", "icon-shuinuanqigongcheng",
						"icon-reshuihu", "icon-iconfont32pxjiayongdianqhongganji", "icon-wifi", "icon-kongtiao"
					];
					//图片选择器
					iconPicker.render({
						// 选择器，推荐使用input
						elem: '#iconPicker',
						// 数据类型：fontClass/unicode，推荐使用fontClass
						type: 'fontClass',
						data: iconlist,
						// 是否开启搜索：true/false
						search: false,
						// 是否开启分页
						page: true,
						// 每页显示数量，默认12
						limit: 12,
						click: function(data) {
							icon=data.icon;
							console.log(data.icon);
						}
					});
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
							form.val('add_facility',data);
							iconPicker.checkIcon('iconPicker', data.icon);
							that.addPopup('修改设施');
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
							,{field: 'level', title: '分类'}
							,{field: 'title', title: '名称'}
							,{field: 'pid', title: '父级ID'}
							,{field: 'icon', title: 'icon', templet: '#icon'}
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
							layer.close(index);
							return {
							   "code": res.code, //解析接口状态
							   "msg": res.msg, //解析提示文本
							   "count": res.data.total, //解析数据长度
							   "data": res.data.data //解析数据列表
							};
						}
					});
       			},
				updated: function(){
					this.$nextTick(function () {                  
						form.render();
					});
				},
       			methods: {
					//数据表格数据重载
					renderTable: function(){
						var that = this;
						tableIns.reload({
							page: {
						    	curr: 1 //重新从第 1 页开始
						    }
						});
					},
					//添加弹出层
					addPopup: function(title){
						if(title == '添加设施')
							form.val('add_facility',{level:1,pid:0,title: ''});
						layer.open({
							type: 1
							,title: title
							,content: $("#addPopup")
							,area: ["550px","600px"]
							,shadeClose: true
							,success: function(layero,index){
								//遮罩层挡住弹出层处理
                                var mask = $(".layui-layer-shade");
                                mask.appendTo(layero.parent());
							}
						})
					},
					//获取设施分类数据
					getFacilities: function(){
						var that = this;
						d.Ajax("get",s.api.setFaciliy,{}, function(res){
	       					if(res.code == 0){
	       						//加载下拉列表框模板
					            d.ltp("select_view_level", 'facility_select_tpl', s.views + s.template.select, function(Tpl) {
			                        var ops = {
			                        	value: 'level',
			                        	name: 'level',
			                            list: res.data.level
			                        }
			                        var view = document.getElementById('select_view_level');
			                        tpl(Tpl).render(ops, function(html) {
			                            view.innerHTML = html;
			                        });
			                        form.render();
			                    });
			                    //加载下拉列表框模板
					            d.ltp("select_view_type", 'facility_select_tpl', s.views + s.template.select, function(Tpl) {
			                        var ops = {
			                        	value: 'id',
			                        	name: 'pid',
			                            list: res.data.list
			                        }
			                        var view = document.getElementById('select_view_type');
			                        tpl(Tpl).render(ops, function(html) {
			                            view.innerHTML = html;
			                        });
			                        form.render();
			                    });
	       					}
	       				},function(error){
	       					console.log(error);
	       				});
					},
       			}
       		})

       	}
   }

   t('facility',f);
})