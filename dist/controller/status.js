/**
 * User: Awin 卓尉家 詹锦锋
 * Mail: 731661902@qq.com
 * Date: 2018/8/6
 * Time: 10:20
 * Company: 广州市致一信息技术有限公司
 */

layui.define(["form"], function(t) {
  	var $ = layui.jquery,
	form = layui.form,
	s = layui.setter,
	element = layui.element,
	d = layui.daoke;

	var f = {

		ac: function(){
			var date_select    //选中的当前日期
			var days = ['日','一','二','三','四','五','六']
			var vm = new Vue({
				el: '.contain',
				data: {
					imgList: [
						{
							text: '同步ical日历',
							url: 'static/img/tb.png'
						},{
							text: '备注',
							url: 'static/img/bz.png'
						},{
							text: '待支付',
							url: 'static/img/dzf.png'
						},{
							text: '待入住',
							url: 'static/img/drz.png'
						},{
							text: '已入住',
							url: 'static/img/yrz.png'
						},{
							text: '已离店',
							url: 'static/img/yld.png'
						},{
							text: '房态关闭',
							url: 'static/img/ft.png'
						}
					],
					today: '',
					dateList: {},
					houseList: [],
					unitList: [],
					roomstatusList: {},
					isActive: false,
					roomToggleList: {
						id: '',
						room_id: '',
						dateList: []
					},
					bottom_isShow: false,
					selectedIds: [],
					selected_houseList: [],
					unitIds: [],
					peopleList: [],
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
						for(var i=0,k=0;i<9;i++){
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
							$("#date0").text(date_select.slice(0,7));
						},500);
					},
					//上一周日期
					prevWeek: function(){
						var that = this;
						date_select = that.getDateStr(date_select,-7);
						that.getDateList(date_select);
						that.getHouseList();
					},
					//下一周日期
					nextWeek: function(){
						var that = this;
						date_select = that.getDateStr(date_select,7);
						that.getDateList(date_select);
						that.getHouseList();
					},
					//上一天日期
					prevDay: function(){
						var that = this;
						date_select = that.getDateStr(date_select,-1);
						that.getDateList(date_select);
						that.getHouseList();
					},
					//下一天日期
					nextDay: function(){
						var that = this;
						date_select = that.getDateStr(date_select,1);
						that.getDateList(date_select);
						that.getHouseList();
					},
					//获取首页房屋列表
					getHouseList: function(){
						var that = this;
						var timeout = layer.msg('正在加载中',{time: 50000});
						d.Ajax("post",s.api.room_getPrice+'?v='+Math.random(100,1000000),{
							day: 9,
			  				startTime: date_select,
			  				endTime: that.getDateStr(date_select,8),
			  				room_ids: that.unitIds.join(',')
			  			},function(res){
				  			if(res.code == 0){
				  				if(res.data.length !=0 ){
				  					for(let i in res.data){
				  						res.data[i]["isShow"] = false;
				  					}
							    	that.$set(that,"houseList",res.data);
									that.$set(that,"today",that.getDateStr(false,0));
									layer.close(timeout);
						    	}
				  			}
						},function(error){
							console.log(error);
						})
					},
					//房屋展开收起
			        zhankai: function(idx){
			        	var that = this;
			        	var houseList = that.houseList;
				        var list = houseList[idx];
			        	list["isShow"] = ! list["isShow"];
			        	that.$set(that.houseList,idx,list);
			        },
			        //开关房
					open_closeHouse: function(date,status,name,num,idx){
						var that = this;
						var roomList = {
							bg_date: date,
							end_date: date,
							unitName: name,
							unitNumber: num,
							status: status
						};
						$("#switch_house-select").val(status);
						that.$set(that,"roomstatusList",roomList);
						i = layer.open({
						  type: 1,
						  area: ['400px','380px'],
						  title: '<b>开关房</b>',
						  content: $('#switch_house'),
						  shadeClose: true,
						  btn: ['确定','取消'],
						  success: function(layero, index){
						    //遮罩层挡住弹出层处理
		                    var mask = $(".layui-layer-shade");
		                    mask.appendTo(layero.parent());
						  },
						  yes: function(layero, index){
						  	var date1 = $("#date1").text();
						  	var date2 = $("#date2").text();
						  	var state = $('#switch_house-select option:selected').val();
						  	if(new Date(date1).getTime() > new Date(date2).getTime()){
						  		layer.msg('开始时间不能大于结束时间',{icon:2,time:1000});
						  		return;
						  	}
					  		else{
							  	d.Ajax("post",s.api.room_setpricee,{room_id: idx,status: parseInt(state),startTime: date1,endTime: date2},function(res){
						  			if(res.code == 0){
						  				setTimeout(function(){
						  					layer.msg("开关房成功",{icon: 1,time: 1000});
						  				},200);
						  				that.getHouseList();
							  			layer.close(i);
						  			}
								},function(error){
									console.log(error);
								});
							 }
						  }
						});
					},
					//房间选中切换
					roomToggle: function(date,room_id,status,idx,isActive_id){
						console.log({
							date: date,
							room_id: room_id,
							status: status,
							idx: idx,
							isActive_id: isActive_id
						});
						var that = this;
						var list = that.roomToggleList;
						list['room_id'] = room_id;
						list['id'] = idx;
						if(list.dateList.indexOf(isActive_id) != -1){
							list.dateList.splice(list.dateList.indexOf(isActive_id),1);
						}
						else
							list.dateList.push(isActive_id);
						that.$set(that,"roomToggleList",list);
						if(list.dateList.length != 0)	that.$set(that,"bottom_isShow",true);
						else that.$set(that,"bottom_isShow",false);
						console.log('roomToggleList',that.roomToggleList);
					},
					//取消所有选中
					cancle: function(){
						var that = this
						that.$set(that,"roomToggleList",{id: '',room_id: '',dateList: []})
						that.$set(that,"bottom_isShow",false)
					},
					//底部显示层房间关房
					closeCancleroom: function(status){
						var that = this;
						var list = that.roomToggleList;
						var arr = [];
						for(let i in list.dateList){
							arr.push(that.getDateStr(date_select,list.dateList[i]));
						}
						console.log({
							room_id: list.room_id,
							status: status,
							startTime: arr.join(',')
						});
					},
					//选择房屋
					popupSelectHouse: function(){
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
					  			that.getHouseList();
					  		}
					  		else{
					  			that.$set(that,"houseList",[]);
					  		}
					  		layer.close(index1);
						  }
						});
					},
					//批量调整房态
					popupOpen_CloseHouse: function(){
						var that = this;
						if(that.selectedIds.length == 0){
							layer.alert('请先选择房源，再调整房源房态',  {title:'<b>调整房态</b>',shadeClose: true,closeBtn:false,icon: 7}, function(index){
							  //do something
							  layer.close(index);	
							});
						}
						else{
							layer.open({
							  type: 1,
							  area: ['400px','380px'],
							  title: '<b>批量调整房态</b>',
							  content: $('#switch_houses'),
							  shadeClose: true,
							  btn: ['确定','取消'],
							  success: function(layero, index){
							    //遮罩层挡住弹出层处理
			                    var mask = $(".layui-layer-shade");
			                    var arr = [];
			                    mask.appendTo(layero.parent());
							    $("#date3").text(that.today);
							    $("#date4").text(that.today);
							    console.log('selectedIds',that.selectedIds);
							    for(let i in that.houseList){
								    for(let j in that.selectedIds){
								    	if(that.houseList[i].unit.room_id == that.selectedIds[j]){
								    		arr.push({unitNumber: that.houseList[i].unit.unitNumber,unitName: that.houseList[i].unit.unitName})
								    	}
								    }
								}
								that.$set(that,"selected_houseList",arr);
							  },
							  yes: function(layero, index){
							    var date1 = $('#date3').text();
							    var date2 = $('#date4').text();
							    var status = $('#switch_houses-select option:selected').val();
							    if(new Date(date1).getTime() > new Date(date2).getTime()){
							    	layer.msg('开始时间不能大于结束时间',{icon:2,time:1000});
					  				return;
							    }
							    else{
								    console.log({
								    	startTime: date1,
								    	endTime: date2,
								    	status: parseInt(status),
								    	room_id: that.selectedIds.join(',')
								    });
								    d.Ajax("post",s.api.room_setpricee,{room_id: that.selectedIds,status: parseInt(status),startTime: date1,endTime: date2},function(res){
							  			if(res.code == 0){
							  				setTimeout(function(){
							  					layer.msg("批量开关房成功",{icon: 1,time: 1000});
							  				},200);
							  				that.getHouseList();
								  			layer.close(i);
							  			}
									},function(error){
										console.log(error);
									});
								    layer.closeAll();
								}
							  }
							});
						}
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
					// 补录弹出层
					addOrder: function(){
						var that = this;
						layer.open({
							type: 1
							,area:['25%','100%']
							,offset: 'r'
							,content: $('#addOrder')
							,btn: ['办理入住','取消']
							,success: function(layero,index){
								//遮罩层挡住弹出层处理
			                    var mask = $(".layui-layer-shade");
			                    mask.appendTo(layero.parent());
							}
						});
					},
					// 房单编辑弹出层
					popupRoomList: function(){
						var that = this;
						layer.open({
							type: 1
							,area:['25%','100%']
							,offset: 'r'
							,content: $('#roomList')
							,btn: ['保存','取消']
							,success: function(layero,index){
								//遮罩层挡住弹出层处理
			                    var mask = $(".layui-layer-shade");
			                    mask.appendTo(layero.parent());
							}
						});
					},
					// 房单编辑弹出层
					popupAccount: function(){
						var that = this;
						layer.open({
							type: 1
							,area:['25%','100%']
							,offset: 'r'
							,content: $('#account')
							,btn: ['保存','取消']
							,success: function(layero,index){
								//遮罩层挡住弹出层处理
			                    var mask = $(".layui-layer-shade");
			                    mask.appendTo(layero.parent());
							}
						});
					},
					// 添加入住人
					addPeople: function(){
						var that = this;
						var list = {
							id: that.peopleList.length + 1,
							name: '',
							phone: '',
							idCard: ''
						};
						that.peopleList.push(list)
						console.log('peopleList',that.peopleList);
						that.$set(that,"peopleList",that.peopleList);
					},
					// 删除入住人
					deletePeople: function(idx){
						var that = this;
						console.log('idx',idx);
						that.peopleList.splice(idx,1);
						that.$set(that,"peopleList",that.peopleList);
					},
				},
				mounted: function(){
					var that = this;
					date_select = that.getDateStr(false,-1);
					that.getDateList(date_select);
					d.Ajax("post",s.api.get_room_list,{isActive: 1},function(res){
						if(res.code == 0){
							that.$set(that,'unitList',res.data.unitListVoList.data);
						}
					},function(error){
						console.log(error);
					});	
					$("#date0").text(date_select.slice(0,7));
					//日期选择器
					layui.use('laydate', function(){
					  	var laydate = layui.laydate;
					  	//首页上的选择器
					  	laydate.render({
						    elem: '#date0', //指定元素
						    showBottom: false,
						    format: 'yyyy-MM',
						    mark: {[that.getDateStr(false,0)]: ''},
						    done: function(value, date){
						    	date_select = date.year + '-' + (date.month<10?'0'+date.month:date.month) + '-' + (date.date<10?'0'+date.date:date.date)	    	 
								that.getDateList(date_select);
								that.getHouseList();
							    // console.log(value); //得到日期生成的值，如：2017-08-18
							    // console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
							 }
						});
						laydate.render({
						    elem: '#date1', //指定元素
						    showBottom: false
						});
						laydate.render({
						    elem: '#date2', //指定元素
						    showBottom: false
						});
						laydate.render({
						    elem: '#date3', //指定元素
						    showBottom: false
						});
						laydate.render({
						    elem: '#date4', //指定元素
						    showBottom: false
						});
					});
					//首页房屋checkbox
					form.on('checkbox(ckb1)',function(data){
						var select = that.selectedIds;
						if(data.value == 'index_all'){
							if(data.elem.checked){
								$('.ckb1').prop('checked',true);
								select = that.unitIds;
								data.elem.checked = true;
							}
							else{
								select = [];
								$(".ckb1").removeProp('checked');
							} 
						}
						else{
							var list = that.houseList[data.value];
						  	if(data.elem.checked){
							  	select.push(list.unit.room_id);
						  	}
						  	else{						  	
							  	select.splice(select.indexOf(list.unit.room_id),1);
						  	}
						}
						that.$set(that,"selectedIds",select);
						form.render();
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
					$(".contain").removeProp("hidden")
				},
				updated: function(){
			        this.$nextTick(function () {			
				        form.render()  
			    	});
				}
			})
		}
	}
			
	t("status", f)
})