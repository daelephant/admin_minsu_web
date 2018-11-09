/**
 * User: Awin 卓尉家 詹锦锋
 * Mail: 731661902@qq.com
 * Date: 2018/8/6
 * Time: 10:20
 * Company: 广州市致一信息技术有限公司
 */

layui.define(["form","laypage"], function(t) {
  	var $ = layui.jquery,
	form = layui.form,
	element = layui.element,
	laypage = layui.laypage,
	s = layui.setter,
	a = layui.admin,
	d = layui.daoke;
	console.log('this is ss',s);

	var f = {

		ac: function(){
			var days = ['日','一','二','三','四','五','六'];
			var vm = new Vue({
				el: '.contain',
				data: {
					dateList: [],
					date_select: '',
					houseList: [],
					unitList: [],
					changePriceList: {},
					unitIds: [],
				},
				methods: {
					//获取日期数据
					getDateList: function(date){
						var that = this;
						var date1;
						var index = new Date(date).getDay();
						var list = [];
						if(date == that.getDateStr(false,0)) date1 = '今天';
						else date1 = date.slice(8);
						for(var i=0,k=0;i<14;i++){
							var item = {};
							if(index == 7) index = 0;
							item['date'] = date1;
							item['day'] = days[index];
							index++;
							if(that.getDateStr(date,i+1).slice(8) == '01')
								date1 = that.getDateStr(date,i+1) == that.getDateStr(false,0) ? '今天' : that.getDateStr(date,i+1).slice(5,7)+'.'+that.getDateStr(date,i+1).slice(8)
							else
								date1 = that.getDateStr(date,i+1) == that.getDateStr(false,0) ? '今天' : that.getDateStr(date,i+1).slice(8);

							list.push(item);
						}
						setTimeout(function(){
							that.$set(that,'dateList',list);
							that.$set(that,'date_select',date);
						},500);	
					},
					//点击查询按钮
					query: function(){
						var that = this
						$(".middle-prev").removeClass('layui-btn-disabled')
						$(".prev-img").attr('src','static/img/arrow_l.png')
						that.getDateList($('#date0').val());
			  			that.getHouseList({
			  				startTime: $('#date0').val(),
			  				endTime: that.getDateStr($('#date0').val(),13),
			  				room_ids: that.unitIds.join(',')
			  			});
					},
					//上一周日期
					prevWeek: function(){
						var that = this;
						var date = '';
						if(that.date_select == that.getDateStr(false,0)){
							$(".middle-prev").addClass('layui-btn-disabled');
							$(".prev-img").attr('src','static/img/arrow_l_gray.png');
							return;
						}
						else if(new Date(that.date_select).getTime() < new Date(that.getDateStr(false,7)).getTime()){
							date = that.getDateStr(false,0);
						}
						else{
							date = that.getDateStr($('#date0').val(),-7);
						}
						that.getDateList(date);
						that.getHouseList({
			  				startTime: date,
			  				endTime: that.getDateStr(date,13),
			  				room_ids: that.unitIds.join(',')
			  			});
					},
					//下一周日期
					nextWeek: function(){
						var that = this;
						var date = that.getDateStr($('#date0').val(),7);
						that.getDateList(date);
						$(".middle-prev").removeClass('layui-btn-disabled');
						$(".prev-img").attr('src','static/img/arrow_l.png');
						that.getHouseList({
			  				startTime: that.getDateStr($('#date0').val(),7),
			  				endTime: that.getDateStr(that.getDateStr($('#date0').val(),7),13),
			  				room_ids: that.unitIds.join(',')
			  			});
					},
					//获取首页房屋列表
					getHouseList: function(params){
						var that = this;
						var timeout = layer.msg('正在加载中',{time: 300000});
						d.Ajax("post",s.api.room_getPrice,params,function(res){
							if(res.code == 0){
								if(res.data.length != 0){
							    	that.$set(that,"houseList",res.data);						    	
						    	}
						    	layer.close(timeout);
							}
						},function(error){
							console.log(error);
						})
					},
					//修改价格
				    open_closeHouse: function(date,price,name,num,idx){
				    	var that = this;
				    	var changePriceList = {
				    		houseName: name,
				    		houseNum: num,
				    		date_begin: date,
				    		date_end: date,
				    		price: price
				    	};
				    	that.$set(that,"changePriceList",changePriceList);
						i = layer.open({
							  type: 1,
							  area: ['500px','350px'],
							  title: '<b>特殊价格</b>',
							  content: $('#switch_house'),
							  shadeClose: true,
							  btn: ['确定','取消'],
							  success: function(layero, index){
							    //遮罩层挡住弹出层处理
			                    var mask = $(".layui-layer-shade");
			                    mask.appendTo(layero.parent());
							  },
							  yes: function(layero, index){
							  	var list = that.changePriceList
							  	,date1 = list.date_begin
							  	,date2 = list.date_end
							  	,price1 = list.price
							  	,name = list.houseName
							  	,num = list.houseNum;
							  	if(new Date(date1).getTime() > new Date(date2).getTime()){
							  		layer.msg("开始时间不能大于结束时间",{icon: 2,time: 1000})
							  		return
							  	}
							  	else{
							  		d.Ajax("post",s.api.room_setpricee,{room_id: idx,price: price1,startTime: date1,endTime: date2},function(res){
							  			if(res.code == 0){
							  				setTimeout(function(){
							  					layer.msg("修改价格成功",{icon: 1,time: 1000});
							  				},200);
							  				that.getHouseList({
								  				startTime: that.date_select,
								  				endTime: that.getDateStr(that.date_select,13),
								  				room_ids: that.unitIds.join(',')
								  			});
								  			layer.close(i);

							  			}
									},function(error){
										console.log(error);
									});						  		
							  	}							  	
							  }
							});
					},
					//获取当前日期的相邻日期
					getDateStr: function(today, addDayCount) {    
					  var dd;
					  if (today) {
					    dd = new Date(today);
					  } else {
					    dd = new Date();
					  }
					  dd.setDate(dd.getDate() + addDayCount);//获取AddDayCount天后的日期 
					  var y = dd.getFullYear();
					  var m = dd.getMonth() + 1;//获取当前月份的日期 
					  var d = dd.getDate();
					  if (m < 10) {
					    m = '0' + m;
					  };
					  if (d < 10) {
					    d = '0' + d;
					  };
					  return y + "-" + m + "-" + d;
					},
					//房屋选择
					popupHouse: function(){
						var that = this
						var index1 = layer.open({
						  type: 1,
						  area: ['800px','600px'],
						  title: '<b>请选择房屋</b>',
						  content: $('#tab'),
						  shadeClose: true,
						  btn: ['保存','取消'],
						  success: function(layero,index){
						  	//遮罩层挡住弹出层处理
		                    var mask = $(".layui-layer-shade");
		                    mask.appendTo(layero.parent());
						  		
						  },
						  yes: function(layero, index){
					  		if(that.unitIds.length != 0){
					  			that.getHouseList({
					  				startTime: that.date_select,
					  				endTime: that.getDateStr(that.date_select,13),
					  				room_ids: that.unitIds.join(',')
					  			});
					  		}
					  		else{
					  			that.$set(that,"houseList",[]);
					  		}
					  		layer.close(index1);
						  }
						});
					},
					//跳转至房屋信息修改（价格模块）
					toCreatRoom: function(room_id){
						sessionStorage.setItem("tabindex",6);
						sessionStorage.setItem("room_id",room_id);
						setTimeout(function(){
							location.hash = a.correctRouter('room/create_room');
						},20);
					},
					// 复选框操作
					checkbox: function(data,filterName){
						var that = this;
						if(data.value == 'all'){
							if(data.elem.checked){
								$(filterName).prop('checked',true)
								for(let i = 0;i<that.unitList.length;i++){
									if(that.unitIds.indexOf(that.unitList[i].room_id)==-1)
										that.unitIds.push(that.unitList[i].room_id)
								}
							}
							else{
								$(filterName).removeProp('checked')
								for(let i = 0;i<that.unitList.length;i++){
									if(that.unitIds.indexOf(that.unitList[i].room_id)!=-1)
										that.unitIds.splice(that.unitIds.indexOf(that.unitList[i].room_id),1)
								}
							}
						}
						else{
							if(data.elem.checked){
								that.unitIds.push(that.unitList[data.value].room_id)
							}
							else{
								that.unitIds.splice(that.unitIds.indexOf(that.unitList[data.value].room_id),1)
							}
						}
						that.$set(that,"unitIds",that.unitIds)
						form.render();
						console.log(that.unitIds);
					},
				},
				created: function(){
					var that = this;
					var date_select = that.getDateStr(false,0);   //选中的当前日期
					that.getDateList(date_select);
					d.Ajax("post",s.api.get_room_list,{isActive: 1},function(res){
						if(res.code == 0){
							that.$set(that,'unitList',res.data.unitListVoList.data);
						}
					},function(error){
						console.log(error);
					});			
					$(".contain").removeProp("hidden");
				},
				mounted: function(){
					var that = this
					//日期选择器
					layui.use('laydate', function(){
					  	var laydate = layui.laydate; 
					  	//首页上的选择器
					  	laydate.render({
						    elem: '#date0', //指定元素
						    format: 'yyyy-MM-dd',
						    showBottom: false,
						    mark: {[that.getDateStr(false,0)]: ''},
						    min: that.getDateStr(false,0),
						    done: function(value, date){
							 }
						});
						laydate.render({
						    elem: '#date1', //指定元素
						    showBottom: false,
						    min: that.getDateStr(false,0),
						    done: function(value, date){
						    	that.$set(that.changePriceList,"date_begin",value)
							 }
						});
						laydate.render({
						    elem: '#date2', //指定元素
						    showBottom: false,
						    min: that.getDateStr(false,0),
						    done: function(value, date){
						    	that.$set(that.changePriceList,"date_end",value)
							 }
						});
					});
					// 房屋选择选项卡
					element.on('tab(tabber)', function(){
						var isActive = this.getAttribute('lay-id');
						d.Ajax("post",s.api.get_room_list,{isActive: isActive},function(res){
							if(res.code == 0){
								that.$set(that,'unitList',res.data.unitListVoList.data);
							}
						},function(error){
							console.log(error);
						});
						form.render();
					});
					//上架房屋checkbox操作
					form.on('checkbox(activeUnit)',function(data){
						that.checkbox(data,'.activeUnit');
					});	
					//下架房屋checkbox操作
					form.on('checkbox(unactiveUnit)',function(data){
						that.checkbox(data,'.unactiveUnit');
					});
					// 分页
					// laypage.render({
     //                    elem: 'pages'
     //                    ,count: that.total //数据总数，从服务端得到
     //                    ,limit: that.per_page
     //                    ,jump: function(obj, first){                            
     //                      // console.log(obj.limit); //得到每页显示的条数                       
     //                      //首次不执行
     //                      if(!first){
     //                        var list = {
     //                          current_page:obj.curr
     //                        };
     //                        if(typeof isActive != 'undefined'){
     //                          list["isActive"] = isActive;
     //                        }
     //                        that.getDataList(list);
     //                      }
     //                    }
     //                  }); 
				},
				updated: function(){
			        this.$nextTick(function () {
				        form.render();
			    	});
				}
			})
		}
	}
			

	t("price", f)
})