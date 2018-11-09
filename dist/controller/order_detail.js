/**
 * User: Awin 卓尉家 詹锦锋
 * Mail: 731661902@qq.com
 * Date: 2018/8/6
 * Time: 10:20
 * Company: 广州市致一信息技术有限公司
 */

layui.define(["form"], function(t) {
  	var $ = layui.jquery;
	var form = layui.form;
	var s = layui.setter;
	var d = layui.daoke;
	
	var f = {

		ac:function(){
			var timer = null
			var vm = new Vue({
				el: '.contain',
				data: {
					orderDetail: {},
					unitFees: []
				},
				methods: {
					//点击打印按钮
					print: function(){
						window.print();
					},
					//点击拨打
					phoneUp: function(){
						layer.open({
							type: 1,
							title: '<b>电话联系客人</b>',
							area: ['400px','410px'],
							content: $('#extend'),
							shadeClose: true,
							success: function(layero,index){
								//遮罩层挡住弹出层处理
			                    var mask = $(".layui-layer-shade");
			                    mask.appendTo(layero.parent());
							}
						})
					},
					//点击获取虚拟手机号码
					createPhone: function(){
						var that = this
						$(".null-tele").css('display','none')
						$('.real-tele').css('display','')
						clearInterval(timer)
					 	var duringMs = 0   
					    that.count_down(duringMs)
					},
					//倒计时
					count_down: function(duringMs) {   
					    var that = this
					    let a = 300000 - duringMs
					    $(".timeout").text(that.date_format(a))
					    timer = setInterval(function (){
					      let clock1 = ''
					      a -= 1000;
					      if(that.date_format(a).slice(0,2)=='0'){
					        clock1 = that.date_format(a).slice(3, 6)
					      }
					      else{
					        clock1 = that.date_format(a)
					      }
					      $(".timeout").text(clock1)
					      if (a == 0) {
					        // timeout则停止timer
					        $(".timeout").text(' ')
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
					}
				},
				created: function(){
					location.hash.split("?")[1];
					console.log('订单编号：',location.hash.split("=")[1]);
					var that = this;
					var timeout = layer.msg('正在加载中',{time: 50000});
					d.Ajax("post",s.api.orderDetail,{orderId: location.hash.split("=")[1]},function(res){
						if(res.code == 0){
			              	that.$set(that,'orderDetail',res.data);
							that.$set(that,"unitFees",res.data.unitFees);
			              	layer.close(timeout);
						}
					},function(error){
						console.log(error)
					})
		            $(".contain").removeProp("hidden");
		            
				}
			})

		}
	}
			
	t("order_detail", f)
})
