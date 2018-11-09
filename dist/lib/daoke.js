/**
 * User: Awin 卓尉家
 * Mail: 731661902@qq.com
 * Date: 2018/8/6
 * Time: 10:20
 * Company: 广州市致一信息技术有限公司
 */
layui.define(function(e) {
	var a = layui.admin;
	var s = layui.setter;
	var q = layui.jquery;

	var d = {
		init: function() {
			
			this.Ajax('post', s.host + s.api.webapi,{}, function(e) {

				var data = e.data;
				for(i in data) {

					for(j in data[i]) {
						s.api[j] = s.host + data[i][j]

					}
				}
				//console.log(s);
			});
		},
		/***
		 * pingzheng 不懂问我
		 * 
		 * ****/
		tk: function(key = '') {
			var ak = layui.data(s.tableName);
			//console.log(ak.access_token);
			if(key == '') {

				return ak;

			} else {

				if(typeof ak[key] == "undefined") {
					return false;
				} else {
					return ak[key]
				}

			}

		},
		token:function(){
			var ak = layui.data(s.tableName);
			var t = {
					'access_token': ak['access_token'],
					'member_id': ak['member_id']
				};
				return t;
		},
		rs: function(type, api, obj = {}, call) {
			obj['access_token'] = this.tk('access_token');
			obj['member_id'] = this.tk('member_id');
			a.req({
				url: api,
				type: type,
				data: obj,
				success: function(res) {

					call(res);
				},
				error: function(e) {

				}

			})

		},
		//解决跨域问题
		Ajax: function(type, url, data, success, failed) {
            if(typeof data.access_token =="undefined"|| data.access_token ==null || data.access_token ==false){
			   data['access_token'] = this.tk('access_token');
			   data['member_id'] = this.tk('member_id');
            }
			// 创建ajax对象
			var xhr = null;
			if(window.XMLHttpRequest) {
				xhr = new XMLHttpRequest();
			} else {
				xhr = new ActiveXObject('Microsoft.XMLHTTP')
			}

			var type = type.toUpperCase();
			// 用于清除缓存
			var random = Math.random();

			if(typeof data == 'object') {
				var str = '';
				for(var key in data) {
					str += key + '=' + data[key] + '&';
				}
				data = str.replace(/&$/, '');
			}

			if(type == 'GET') {
				if(data) {
					xhr.open('GET', url + '?' + data, true);
				} else {
					xhr.open('GET', url + '?t=' + random, true);
				}
				xhr.send();

			} else if(type == 'POST') {
				xhr.open('POST', url, true);
				// 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr.send(data);
			}

			// 处理返回数据
			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4) {
					if(xhr.status == 200) {
						success(eval("(" + xhr.responseText + ")"));
					} else {
						if(failed) {
							failed(xhr.status);
						}
					}
				}
			}
		},
		GetLength: function(str) { //获取支付长度

			var realLength = 0,
				len = str.length,
				charCode = -1;
			for(var i = 0; i < len; i++) {
				charCode = str.charCodeAt(i);
				if(charCode >= 0 && charCode <= 128)
					realLength += 1;
				else
					realLength += 2;
			}
			return realLength;
		},
		ltp: function(a, b, p, f) {
			var tpl = q("#" + a).load(p);

			var index = setInterval(function() {
				var obj = document.getElementById(b);

				if(typeof(obj) != 'undefined' && obj != null) {
					f(obj.innerHTML);
					clearInterval(index);
				}

			}, 1000)
		},
		opw: function(obj, title = '信息窗口', w = '300px', h = '400px') {
			console.log(obj);
			layer.open({
				title: title,
				type: 1,
				anim: 1,
				content: obj, //数组第二项即吸附元素选择器或者DOM
				area: [w, h],
				shade: [0.8, '#393D49']
			});
		},
		up: function(b64, tk, call) {

			var formData = new FormData();
			formData.append("file", this.convertBase64UrlToBlob(b64));
			formData.append("token", tk);
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4) {
					var keyText = xhr.responseText;
					keyText = eval('(' + keyText + ')')
					call(keyText);
				}
			}
			xhr.open("POST", s.qiuniu);
			xhr.send(formData)

		},
		convertBase64UrlToBlob: function(urlData) {

			var bytes = window.atob(urlData.split(',')[1]);
			var ab = new ArrayBuffer(bytes.length);
			var ia = new Uint8Array(ab);
			for(var i = 0; i < bytes.length; i++) {
				ia[i] = bytes.charCodeAt(i)
			}
			return new Blob([ab], {
				type: 'image/jpeg'
			})
		}
	}
	d.init();
	e("daoke", d);
});