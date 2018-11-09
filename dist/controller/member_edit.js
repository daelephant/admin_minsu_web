/**
 * User: Awin 卓尉家 詹锦锋
 * Mail: 731661902@qq.com
 * Date: 2018/8/6
 * Time: 10:20
 * Company: 广州市致一信息技术有限公司
 */

layui.define(["form","upload","laytpl"], function(t) {
	var $ = layui.jquery;
	var form = layui.form;
	var upload = layui.upload;
      var s = layui.setter;
	var d = layui.daoke;
      var tpl = layui.laytpl;
      console.log(s.api)

      var f={

            ac:function(){

       		var vm = new Vue({
       			el: '.contain',
       			data: {
       				imgUrl: '',
       				groupList: [],
                              fileList: [],
       				activeValue: 0,
       				editValue: -1,
       				isEditing: false,
                              isLoadingMore: false
       			},
       			methods: {
                              //文字提示弹出层
                              openTips: function(content,yes){
                                    layer.open({
                                          type: 1
                                          ,title: '提示'
                                          ,area: ['300px','165px']
                                          ,content: '<div style="padding: 20px;border: 1px solid #e6e6e6;">' + content + '</div>'
                                          ,btn: ['确定']
                                          ,shadeClose: true
                                          ,btnAlign: 'c'
                                          ,yes: function(index){
                                                yes(index);
                                          }
                                    })
                              },
       				//删除上传文件
       				deleteImg: function(){
       					var that = this;
       					that.$set(that,"imgUrl",'');     					
       				},
       				//Tips弹出层
       				Tips: function(text,id){
      					idx = layer.tips(text, '#'+id, { tips: 3});
       				},
       				//关掉Tips
       				closeTips: function(){
       					layer.close(idx);
       				},
                              //文件分组渲染
                              getFolderData: function(url,params){
                                    var that = this;
                                    d.Ajax("post", url, params, function(res){
                                          if(res.code == 0){
                                                that.$set(that,"groupList",res.data);
                                                d.ltp("select_tpl_view2", 'select_tpl', s.views + s.template.select, function(Tpl) {
                                                      var ops = {
                                                            name: 'select',
                                                            filter: 'select_lib',
                                                            first: '移动',
                                                            list: res.data.slice(2)
                                                      };
                                                      var view = document.getElementById('select_tpl_view2');
                                                      tpl(Tpl).render(ops, function(html){
                                                            view.innerHTML = html;
                                                      });
                                                      form.render();
                                                });                                           
                                          }
                                    }, function(error){
                                          console.log(error);
                                    })
                              },
                              //图片文件渲染
                              getFileList: function(params){
                                    var that = this;
                                    d.Ajax("post","json/user/upload-fileList.json",{},function(res){
                                          if(res.code == 0){
                                                that.$set(that,"fileList",res.data.list);
                                          }
                                    },function(error){
                                          console.log(error);
                                    });
                              },
       				//选择文件弹出层
                              popupFileLib: function(){
                                    var that = this;
                                    that.getFolderData("json/user/upload-group.json",{});
                                    layer.open({
                                          type: 1
                                          ,title: '选择文件'
                                          ,area: ['50%','75%']
                                          ,content: $('#fileLib')
                                          ,btn: ['确定','取消']
                                          ,shadeClose: true,
                                          success: function(layero,index){
                                                //遮罩层挡住弹出层处理
                                                var mask = $(".layui-layer-shade");
                                                mask.appendTo(layero.parent());
                                                that.getFileList({})
                                                
                                          },
                                          yes: function(layero, index){
                                                for(let i in that.fileList){
                                                      if(that.fileList[i]["selected"] == 1){
                                                            that.$set(that,'imgUrl',that.fileList[i].file_url);
                                                            layer.close(layer.index);
                                                            return;
                                                      }
                                                }
                                                layer.close(layer.index);
                                          }
                                    });                                
                              },
                              //添加文件库文件分组
                              addFolder: function(){
                                    var that = this;
                                    that.getFolderData("json/user/upload-group-add.json",{});                                
                              },
                              //点击文件分组
                              clickFolder: function(val,id){
                                    var that = this;
                                    console.log(id,'group_id');
                                    that.$set(that,"isLoadingMore",true);
                                    that.getFileList({});
                                    that.$set(that,"editValue",-1);
                                    that.$set(that,"activeValue",val);                             
                              },
                              //点击文件分组设置图标
                              editFolder: function(val){
                                    var that = this;
                                    if(val == that.editValue){
                                          that.$set(that,"editValue",-1);
                                    }
                                    else{
                                          that.$set(that,"activeValue",val);
                                          that.$set(that,'editValue',val);
                                    }
                              },
                              //编辑文件分组
                              edit: function(text){
                                    var that = this;
                                    that.$set(that,"editValue",-1);
                                    that.$set(that,"isEditing",true);
                              },
                              //删除文件分组
                              deleteFolder: function(item){
                                    var that = this;
                                    console.log(item,'要删除的分组');
                                    that.getFileList(item);
                                    that.$set(that,"editValue",-1);
                              },
                              //确认或取消编辑
                              confirmOrCancleEdit: function(val,cancle){
                                    var that = this;
                                    if(cancle == 0){       //当cancle=1时为取消
                                          that.getFileList(val);
                                    }
                                    that.$set(that,"activeValue",val);
                                    that.$set(that,"editValue",-1);
                                    that.$set(that,"isEditing",false);                                
                              },
                              //选中图片状态切换
                              toggleSelected: function(val){
                                    var that = this
                                    if(that.fileList[val].selected == 0)
                                          that.fileList[val].selected = 1
                                    else
                                          that.fileList[val].selected = 0
                                    that.$set(that.fileList,val,that.fileList[val])
                              },
                              //删除选中图片
                              deleteLibImg: function(){
                                    var that = this;
                                    var arr = [];
                                    for(let i = 0; i < that.fileList.length;i++){
                                          if(that.fileList[i]['selected'] == 1){
                                                arr.push(that.fileList[i]['id']);
                                          }
                                    }
                                    if(arr.length == 0){
                                          that.openTips('请先勾选要删除的图片', function(index){layer.close(layer.index)});
                                    }
                                    else{
                                          console.log('删除的图片ID：',arr);
                                          that.getFileList({id:arr});
                                          that.openTips('删除成功', function(index){layer.close(layer.index)});                                         
                                    }
                              }
       			},
       			created: function(){      				
                              //判断页面参数id
                              if(location.hash.split("?")[1]){
                                    var id = location.hash.split("=")[1];
                                    d.Ajax("post","json/user/form-levelSetting.json",{},function(res){
                                          if(res.code == 0){
                                                form.val('levelSetting',res.data);
                                                if(res.data.imgUrl != '')
                                                      $('#memberImg').attr('src', res.data.imgUrl);
                                          }
                                    },function(error){
                                          console.log(error);
                                    })      
                              }     				
                              //获取会员等级说明内容
                              d.Ajax("post","json/user/form-levelDesc.json",{},function(res){
                                    if(res.code == 0){
                                          form.val('levelDesc',res.data);
                                    }
                              },function(error){
                                    console.log(error);
                              })      				
       			},
       			mounted: function(){
           				var that = this;                      
                              var arr = [];
                              for(let i =1;i<101;i++){
                                    arr.push({id: i,name: i});
                              }
                              //加载下拉框select模板
                              d.ltp("select_tpl_view", 'select_tpl', s.views + s.template.select, function(Tpl) {
                                    var ops = {
                                          name: 'level',
                                          first: '0',
                                          list: arr
                                    }
                                    var view = document.getElementById('select_tpl_view');
                                    tpl(Tpl).render(ops, function(html) {
                                          view.innerHTML = html;
                                    });
                                    form.render();
                              });
                              //上传图片
                              upload.render({
                                    elem: '.upload',
                                    url: '',
                                    auto: false, //选择文件后不自动上传
                                    size: 50,
                                    accept: 'images',
                                    size: 1980,
                                    choose: function(obj) {
                                          //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
                                          obj.preview(function(index, file, result) {
                                                d.Ajax('post', s.api.getqiutoken, {}, function(e) {
                                                      if(e.code == 0) {
                                                            d.up(result, e.data.up_token, function(res) {
                                                                  if(typeof(res.key) != 'undefined') {
                                                                        that.$set(that,"imgUrl",s.domain + res.key)
                                                                        
                                                                  }

                                                            })
                                                      }
                                                })
                                          });
                                    }
                              });
      				//监听会员等级设置表单提交 
      				form.on('submit(levelSetting)', function(data){
      					console.log(JSON.stringify(data.field))
                                    that.openTips('保存成功', function(index){layer.close(layer.index)});
      					return false;
      				});
                              //监听会员等级说明表单提交
                              form.on('submit(levelDesc)', function(data){
                                    console.log(JSON.stringify(data.field));
                                    that.openTips('保存成功', function(index){layer.close(layer.index)});
                                    return false;
                              });
                              //监听文件库弹出层复选框
                              form.on('checkbox(ckb)', function(data){
                                    if(data.elem.checked){
                                          if(that.fileList.length != 0){
                                                for(let i in that.fileList)
                                                      that.fileList[i]["selected"] = 1;
                                          }
                                    }
                                    else{
                                          for(let i in that.fileList)
                                                that.fileList[i]["selected"] = 0;
                                    }
                                    that.$set(that,"fileList",that.fileList);
                              });
           				//监听文件库移动图片分组点击
                              form.on('select(select_lib)', function(data){
                                    var arr = []
                                    for(let i in that.fileList){
                                          if(that.fileList[i].selected == 1)
                                                arr.push(that.fileList[i])
                                    }
                                    if(arr.length == 0){
                                          that.openTips('请先勾选要移动的图片', function(index){layer.close(layer.index)});
                                    }
                                    else{
                                          console.log('data',{group_id: data.value,data: arr})
                                    }
                              });
                              //表单验证规则定义
                              form.verify({
                                    discount: function(value, item){ //value：表单的值、item：表单的DOM对象
                                          if(value > 10)
                                                return '折扣的值必须不大于10。'
                                          else if(value < 0.1)
                                                return '折扣的值必须不小于0.1。'
                                    }
                              }); 
                        },
       			updated: function (){
                              this.$nextTick(function () {
                                   form.render();
                              });
                        },
             	})
            }
      }


	t("member_edit",f)
})