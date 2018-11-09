/**
 * User: Awin 卓尉家
 * Mail: 731661902@qq.com
 * Date: 2018/8/6
 * Time: 10:20
 * Company: 广州市致一信息技术有限公司
 */
;
layui.define(["form", "setter"], function(e) {
	var t = layui.$,
		i = (layui.layer, layui.laytpl, layui.setter, layui.view, layui.admin, layui.form),
		a = t("body"),
		f = layui.form,
		ad = layui.admin,
		c = layui.setter,
		d =layui.daoke,
		router = layui.router(),
		search = router.search;
	    f.render();
	var index = layer.open({
		      type:3,
              shade: [0.9, '#000']
        });
       d.Ajax('post', c.host+c.api.login, {}, function(res) {
    	
    	//请求成功后，写入 access_token
			if(res.code == 0) {
				layui.data(c.tableName, {key: c.request.tokenName,value: res.data.token});
                layui.data(c.tableName, {key: c.request.member_id,value: res.data.member_id});
              
			   layer.msg(res.msg, {
					offset: '15px',
					icon: 0,
					time: 1000
				}, function() {
					layer.close(index);
					location.hash = ad.correctRouter('/')
				});
			}else{
				layer.close(index);
			}
    	    
    	
    })

	f.on('submit(LAY-user-login-submit)', function(obj) {
		console.log(obj)
		d.Ajax('post', c.host+c.api.login, obj.field, function(res) {
			console.log(res);
			//请求成功后，写入 access_token
			if(res.code == 0) {
				layui.data(c.tableName, {key: c.request.tokenName,value: res.data.token});
                layui.data(c.tableName, {key: c.request.member_id,value: res.data.member_id});
                
				layer.msg(res.msg, {
					offset: '15px',
					icon: 0,
					time: 1000
				}, function() {
					location.hash = ad.correctRouter('/')
				});

			} else {

				layer.msg(res.msg, {
					offset: '15px',
					icon: 0,
					time: 1000
				});

			}
		}, function(error) {
			console.log(error);
		});
		

	});
	i.verify({
		nickname: function(e, t) {
			return new RegExp("^[a-zA-Z0-9_一-龥\\s·]+$").test(e) ? /(^\_)|(\__)|(\_+$)/.test(e) ? "用户名首尾不能出现下划线'_'" : /^\d+\d+\d$/.test(e) ? "用户名不能全为数字" : void 0 : "用户名不能有特殊字符"
		},
		pass: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"]
	}), a.on("click", "#LAY-user-get-vercode", function() {
		t(this);
		this.src = "https://www.oschina.net/action/user/captcha?t=" + (new Date).getTime()
	}), e("user", {})
});