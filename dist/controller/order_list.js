/**
 * User: Awin 卓尉家 詹锦锋
 * Mail: 731661902@qq.com
 * Date: 2018/8/6
 * Time: 10:20
 * Company: 广州市致一信息技术有限公司
 */

layui.define(["form","laypage"], function(t) {
  	var $ = layui.jquery
	,element = layui.element
	,form = layui.form
	,s = layui.setter
	,d = layui.daoke
	,laypage = layui.laypage;

	var f = {

		ac: function(){
			var today = new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate()   //用于日期弹出显示当天标记
			var id = 0 //tab选项卡当前id
			var vm = new Vue({
				el: '.contain',
				data: {
					tabList: [
						{
							id: 1,
							text: '待支付'
						},{
							id: 2,
							text: '待确认'
						},{
							id: 3,
							text: '待入住'
						},{
							id: 4,
							text: '已入住'
						},{
							id: 5,
							text: '已离店'
						},{
							id: 6,
							text: '已取消'
						},
					],
					selectList: [
						{
							value: 'orderNumber',
							text: '订单号'
						},{
							value: 'inTime',
							text: '入住日期'
						},{
							value: 'orderTime',
							text: '下单日期'
						},
					],
					orderList: [],
					total: ''

				},
				methods: {
					//修改价格
					modify_price: function(time,price){
						var that = this
						var yp = price * 0.7
						$(".total-price").text('￥'+price)
						$(".youhui-price").text(yp)
						layer.open({
							type:1,
							area: ['500px','450px'],
							title: '<b>修改价格</b>',
							content: $('#modify_price'),
							shadeClose: true,
							btn: ['修改','取消'],
							success: function(layero,index){
								//遮罩层挡住弹出层处理
			                    var mask = $(".layui-layer-shade");
			                    mask.appendTo(layero.parent());
								var a = time.split(/[^0-9]/)
							    //截止日期：日期转毫秒
							    var setuptime = new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
							    var now = new Date().getTime();
							    var duringMs = now - setuptime.getTime();
							    that.count_down(duringMs);
							},
							yes: function(layero,index){

							}
						})
					},
					//更新订单数据
					updateData: function(params={}){
						var that = this;
			          	var timeout = layer.msg('正在加载中',{time: 50000});
						d.Ajax("post",s.api.orderList,params,function(res){
							if(res.code == 0){
								if(res.data.length != 0){				
									that.$set(that,'orderList',res.data.data);
									that.$set(that,'total',res.data.total);									
					              	layer.close(timeout);
				                }
				                else{ 
					              	that.$set(that,'currentOrderList',[]);
					              	layer.close(timeout);
				                }
							}
						},function(error){
							console.log(error);
						})
					},
					//点击搜索按钮
					search: function(){
						var that = this,
						select_text = $("#search-select option:selected").val(),
						input_text,
						bg_date,
						end_date;
						var list = {
							status: id,
							[select_text]: '',
						}
						if($('.search-input1').css('display') == 'none'){
							list[select_text] = $(".search-input2").val().split(" - ")[0];
							list["outTime"] = $(".search-input2").val().split(" - ")[1];
						}
						else{
							list[select_text] = $("#search-input").val();
						}
						if(list[select_text] == ''){
							layer.msg('搜索内容不能为空',{time: 800});
							return;
						}
						that.updateData(list);
					},
					// 订单详情
					toOrderDetail: function(num){
						window.location.href = '#/order/order-detail?orderNumber='+num
					},
					// 倒计时
					count_down: function(duringMs) {   
					    var that = this
					    var timer = null
					    let a = 1800000 - duringMs   
					    if(duringMs >= 1800000){ 
					      $(".timeout").text('请勿修改价格，订单已取消')
					      return
					    }
					    $(".timeout").text(that.date_format(a))
					    timer = setInterval(function (){
					      let clock1 = ''
					      a -= 1000;
					      if(that.date_format(a).slice(0,2)=='0'){
					        clock1 = that.date_format(a).slice(3, 6)
					        console.log('这是clocl1:',clock1)
					      }
					      else{
					        clock1 = that.date_format(a)
					      }
					      $(".timeout").text(clock1)
					      if (a == 0) {
					        $(".timeout").text('请勿修改价格，订单已取消')
					        // timeout则停止timer
					        clearInterval(timer)
					        return
					      }
					    }, 1000)
					},
					/* 格式化倒计时 */
					date_format: function(micro_second) {
						var that = this
						// 秒数
						var second = Math.floor(micro_second / 1000);
						// 小时位
						var hr = Math.floor(second / 3600);
						// 分钟位
						var min = that.fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
						// 秒位
						var sec = that.fill_zero_prefix(second % 60);// equal to => var sec = second % 60;
						return min + "分" + sec + "秒";
					},
					/* 分秒位数补0 */
					fill_zero_prefix: function(num) {
						return num < 10 ? "0" + num : num
					},
					// 分页渲染
					pages:function(isActive){
						var that = this;
						setTimeout(function(){
							var interval = setInterval(function(){
								if(typeof that.total != 'undefined'){
									laypage.render({ 
										elem: 'pages'
										,count: that.total //数据总数，从服务端得到
										,limit: 10
										,jump: function(obj, first){                            
											// console.log(obj.limit); //得到每页显示的条数                       
											//首次不执行
											if(!first){
												var list = {
													current_page:obj.curr
												};
												if(typeof isActive != 'undefined'){
													list["status"] = isActive;
												}
												that.updateData(list);
											}
										}
									});
									clearInterval(interval);
								}
							},100);
						},500);               
					},
				},
				created:function(){
					var that = this;
					that.updateData();
					that.pages(0);
					//input获取焦点
					$(".search-input2").focus(function(){
						$(".search-input2").attr('placeholder','请选择时间范围');
					});
					//选项卡功能
					element.on('tab(tab)', function(){
					  	id = this.getAttribute('lay-id');				  	
					  	that.updateData({status: id});
					  	if($('.search-input1').css('display') == 'none'){
							$(".search-input2").val('');
						}
						else{
							$("#search-input").val('');
						}
					});
					//select下拉选择框响应
					form.on('select(select1)',function(){
					  	var text = $('#search-select option:selected').text();
					  	$("#search-input").attr('placeholder',text);
					  	$("#search-input").val('');
					  	if(text == '入住日期' || text == '下单日期'){
					  		$(".search-input2").attr('placeholder',text);
					  		$(".search-input2").val('');
					  		$(".search-input1").css('display','none');
					  		$(".search-input2").css('display','');
					  		$(".search-input2").attr('placeholder',text);
					  	}
					  	else{
					  		$(".search-input2").css('display','none');
					  		$(".search-input1").css('display','');
					  	}
					  	form.render();
					});
					$(".contain").removeProp("hidden");
					$(".tab").html('<div class="layui-tab layui-tab-brief" lay-filter="tab"><ul class="layui-tab-title" style="border: none;"><li class="layui-this" lay-id="0">全部</li><li :lay-id="item.id" v-for="item in tabList">{{ item.text }}</li></ul></div>')
					$(".search-select").html('<div class="layui-form-item"><div class="" style="width: 100px;"><select id="search-select" name="select" lay-filter="select1"><option value="guestName" selected>入住人</option><option :value="item.value" v-for="item in selectList">{{ item.text }}</option></select></div></div>')
			    },
			    mounted: function(){
			    	var that = this;
			    	//日期选择
					layui.use('laydate', function(){
				  		var laydate = layui.laydate;
						//日期范围
						laydate.render({
						  elem: '.search-input2'
						  ,mark: {[today]: ''}
						  ,range: true
						});
					});				
			    },
			    updated: function (){
			        this.$nextTick(function () {
			        	form.render();
			    	});
				}
			})
		}
	}
	

	t("order_list", f)
})

