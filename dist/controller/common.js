/**
 * User: Awin 卓尉家
 * Mail: 731661902@qq.com
 * Date: 2018/8/6
 * Time: 10:20
 * Company: 广州市致一信息技术有限公司
 */
layui.define(function(e) {
	var i = (layui.$, layui.layer, layui.laytpl, layui.setter, layui.view, layui.admin);
	var d=layui.daoke;
	var c = layui.setter;
	i.events.logout = function() {
		d.Ajax('post', c.api.logout, {}, function(e) {
			i.exit();
		})
	}, e("common", {})
});
