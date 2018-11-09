/**
 * User: Awin 卓尉家
 * Mail: 731661902@qq.com
 * Date: 2018/8/6
 * Time: 10:20
 * Company: 广州市致一信息技术有限公司
 */
layui.define(["table", "form", "admin"], function(t) {
	var e = (layui.$, layui.admin),
		i = layui.view,
		n = layui.table,
		d = layui.daoke,
		s = layui.setter,
		a = layui.admin,
		l = layui.form;

	if(!d.tk("member_id")) {

		layer.alert('您还没有配置小程序，暂不能进行改操作！', {
			icon: 2,
			closeBtn: 0,
			title: '系统提示'
		}, function(index) {
			layer.close(index);
			location.hash = a.correctRouter('setting/wechatset')
		});

	}
	n.render({
		elem: "#LAY-app-content-list",
		url: s.api.get_mycity,
		where:{'access_token':d.tk('access_token'),'member_id':d.tk('member_id'),'type':'my'},
		cols: [
			[{
				type: "checkbox",
				fixed: "left"
			}, {
				field: "city_id",
				width: 100,
				title: "城市ID",
				sort: !0
			},{
				title: "所属国家",
				field: "contas",
				
			},{
				field: "city_name",
				title: "城市名称"
			},{
				field: "initial",
				title: "城市首字母"
			},{
				title: "操作",
				minWidth: 100,
				align: "center",
				fixed: "right",
				toolbar: "#table-content-list"
			}]
		],
		page: !0,
		limit: 10,
		limits: [10, 15, 20, 25, 30],
		text: "对不起，加载出现异常！"
	}), n.on("tool(LAY-app-content-list)", function(t) {
		var n = t.data;
	
		"del" === t.event ? layer.confirm("确定删除这个城市吗？", function(e) {
			t.del(), layer.close(e)
		}) : "edit" === t.event && e.popup({
			title: "编辑城市",
			area: ["550px", "550px"],
			id: "LAY-popup-content-edit",
			success: function(t, e) {
	            
				i(this.id).render("setting/cityset", n).done(function(e) {
					
					l.render(null, "layuiadmin-app-form-list"), l.on("submit(layuiadmin-app-form-submit)", function(t) {
						t.field;
						layui.table.reload("LAY-app-content-list"), layer.close(e)
					})
				})
			}
		})
	});
	l.on('select(province)', function(data) {
		var city_ids = document.getElementById("city_ids");
	        city_ids.innerHTML=''
		for(i in f.citylist) {
			if(f.citylist[i].city_id == data.value) {
					
                var list=f.citylist[i].city_list;
				for(j in list) {
					var op = document.createElement("option");
					op.value = list[j].city_id;
					op.setAttribute("data-index", j);
					op.innerHTML = list[j].city_name;
					city_ids.appendChild(op);
				}
				l.render('select', 'city_select'); 
                break;
			}

		}
		
	});
	var f = {
		citylist: {},
		init: function() {

			d.Ajax("post", s.api.getChina, {access_token:d.tk('access_token'),member_id:d.tk('member_id')}, function(e) {

				if(e.code == 0) {
					f.citylist = e.data
				}
			});
		},
		setcity: function() {

			var province_id = document.getElementById("province_id");

			for(i in f.citylist) {
				var op = document.createElement("option");
				op.value = f.citylist[i].city_id;
				op.setAttribute("data-index", i);
				op.innerHTML = f.citylist[i].city_name;
				province_id.appendChild(op);
			}

		},
		create_city:function(obj){
	
			d.Ajax('post', s.api.set_city,obj, function(e) {

				if(e.code == 0) {
					console.log("设置城市",e.msg)
				}else{
					layer.msg(e.msg)
				}
			})
		}
	}
	f.init();
	t("citylist", f)
});