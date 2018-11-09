/**
 * User: Awin 卓尉家
 * Mail: 731661902@qq.com
 * Date: 2018/8/6
 * Time: 10:20
 * Company: 广州市致一信息技术有限公司
 */
layui.define(['laytpl', 'layer', 'element', 'util'], function(e) {
	var $ = layui.jquery,
		element = layui.element;

	var a = {

		http: function(type = 'post', obj = {}, url, call) {
			$.ajax({
				type: type, //提交方式 
				url: url, //路径 
				data: obj, //数据，这里使用的是Json格式进行传输 
				async: true, //是否支持异步刷新，默认是true
				dataType: 'json',
				success: function(result) { //返回数据根据结果进行相应的处理 

					call(result);
				},
				error: function(err) { //错误返回
					console.log('请求错误', err);
				}
			});
		},
		test:function(s){
			console.log(s)
		}
	}
	e("request", a);
})