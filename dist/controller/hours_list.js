/**
 * User: Awin 卓尉家 詹锦锋
 * Mail: 731661902@qq.com
 * Date: 2018/8/6
 * Time: 10:20
 * Company: 广州市致一信息技术有限公司
 */

layui.define(["form","laypage","admin"], function(t) {
  var $ = layui.jquery,
  element = layui.element,
  a = layui.admin,
  form = layui.form,
  s = layui.setter,
  d = layui.daoke,
  laypage = layui.laypage;
  console.log('admin',a)
  
  var f={

       ac:function(){
          var tab_id = 0  //tab选项卡选中id
          var vm = new Vue({
            el: '.contain',
            data: {
              hoursData: {},
              daifabuList: [],
              addressInfo: {
                unitAddress: '',
                unitNumber: '',
                doorNumber: ''
              },
              statusSelectList: [],
              select1: false,
              currentUnitList: [],
              activeId: 1
            },
            methods: {
              //更新房屋数据
              getDataList: function(params){
                var that = this;
                params = params?params:{};
                var arr = ['positionAuditReject','detailAuditReject','descriptionAuditReject','facilityAuditReject','explanationAuditReject','imageAuditReject'];
                var timeout = layer.msg('正在加载中',{time: 50000});
                d.Ajax('post', s.api.get_room_list, params, function(res) {
                  if(res.code == 0) {
                      if(res.data.totalCount != 0){
                        var unitList = res.data.unitListVoList.data;
                        for(let j = 0;j<unitList.length;j++){
                          var selectList = [
                            {
                              id: 1,
                              isReject: '',
                              text: '房屋位置'
                            },
                            {
                              id: 2,
                              isReject: '',
                              text: '房屋详情'
                            },
                            {
                              id: 3,
                              isReject: '',
                              text: '房屋描述'
                            },
                            {
                              id: 4,
                              isReject: '',
                              text: '设施服务'
                            },
                            {
                              id: 5,
                              isReject: '',
                              text: '入住规则'
                            },
                            {
                              id: 6,
                              isReject: '',
                              text: '房屋照片'
                            },
                            {
                              id: 7,
                              isReject: '0',
                              text: '价格'
                            }
                          ]
                            ,status = unitList[j].houseStatus == 0 ? '审核失败' : '审核通过'
                            ,active = unitList[j].isActive == 0 ? '未上架' : '已上架'
                            ,str = active + '（' + status + '）'
                          for(let i = 0;i<arr.length;i++){
                            var attr = arr[i];
                            selectList[i]['isReject'] = unitList[j][attr];
                            unitList[j]['selectList'] = selectList;
                          }
                          if(that.statusSelectList.indexOf(str) == -1)
                            that.statusSelectList.push(str);
                        }

                        that.$set(that,'currentUnitList',unitList);
                        that.$set(that,'statusSelectList',that.statusSelectList); 
                      }
                      else {
                        that.$set(that,'unitList',[]);
                      }
                      that.$set(that,'hoursData',res.data);
                      layer.close(timeout);
                  }
                }, function(error) {
                  console.log(error);
                });                
              },
              //创建房屋
              create_room:function(){
              	  sessionStorage.removeItem("tabindex");
                  sessionStorage.removeItem("room_id");
              	  setTimeout(function(){
                    location.hash = a.correctRouter('room/create_room');
                  },20);
              },
              //待发布房屋显示层
              popup: function(){
                var that = this
                var timeout = layer.msg('正在加载中',{time: 500})
                d.Ajax('post',s.api.room_uncommitted,{},function(res){
                  if(res.code == 0){
                    that.$set(that,'daifabuList',res.data.unitListVoList)
                    layer.close(timeout)
                  }
                },function(error){
                  console.log(error)
                })
                layer.open({
                  type: 1,
                  area: ['700px','500px'],
                  title: '<h4>待发布房屋('+that.hoursData.uncommittedCount+')</h4>',
                  content: $('#daifabu'),
                  shadeClose: true,
                  success: function(layero,index){
                    //遮罩层挡住弹出层处理
                    var mask = $(".layui-layer-shade");
                    mask.appendTo(layero.parent());
                  }
                })
              },
              //点击删除房屋
              deleteHouse: function(name,number,id){
                var that = this;
                if(typeof(name) == 'undefined') 
                  name = '';
                var str = name + '（' + number + '）';
                layer.open({
                  type: 1,
                  area: ['520px','165px'],
                  title: '<b>删除房屋</b>',
                  content: '<p>确定要删除'+str+'吗？</p>',
                  shadeClose: true,
                  btn: ['确定','取消'],
                  yes: function(){
                    that.roomSet(2,'',id);
                    layer.closeAll();
                  }
                });
              },
              //点击上架房屋
              pushHouse: function(name,number,id,status){
                var that = this;
                if(status == 3) return;
                var str = name + '（' + number + '）';
                var idx = layer.open({
                  type: 1,
                  area: ['520px','165px'],
                  title: '<b>房屋上架</b>',
                  content: '<p>确定要上架'+str+'吗？</p>',
                  shadeClose: true,
                  btn: ['确定','取消'],
                  yes: function(){
                    that.roomSet(1,1,id);
                    layer.close(idx);
                  }
                })
              },
              //点击下架房屋
              downHouse: function(name,number,id){
                var that = this;
                var idx = layer.open({
                  type: 1,
                  area: ['520px','165px'],
                  title: '<b>房屋下架</b>',
                  content: '<p>设置为下架状态，房源将不在线上展示</p>',
                  shadeClose: true,
                  btn: ['确定','取消'],
                  yes: function(){
                    that.roomSet(1,0,id);
                    layer.close(idx);
                  }
                })
              },
              //维护房屋地址
              popupAddress: function(id){
                var that = this
                var idx = layer.open({
                  type: 1,
                  title: ' ',
                  area: ['700px','320px'],
                  content: $('#address'),
                  shadeClose: true,
                  btn: ['提交','取消'],
                  success: function(layero,index){           
                    //遮罩层挡住弹出层处理
                    var mask = $(".layui-layer-shade");
                    mask.appendTo(layero.parent());
                    d.Ajax("post",s.api.room_addressChange,{room_id: id},function(res){
                      if(res.code == 0){
                        that.$set(that,'addressInfo',{
                          unitNumber: res.data.unitNumber,
                          unitAddress: res.data.RoomAddress.unitAddress,
                          doorNumber: res.data.RoomAddress.doorNumber
                        });
                      }
                    },function(error){
                      console.log(error)
                    });
                  },
                  yes: function(){
                    var add = $("#unitAddress").val();
                    if(add == that.addressInfo.doorNumber){
                      layer.close(idx);
                      return;
                    }
                    else{
                      d.Ajax("post",s.api.room_addressChange,{room_id: id,doorNumber: add},function(res){
                        if(res.code == 0){
                          layer.msg(res.msg, {
                            offset: '15px',
                            icon: 1,
                            time: 1000
                          });
                          layer.close(idx);
                        }
                      },function(error){
                        console.log(error);
                      });
                    }
                  },
                })
              },
              //上下架以及删除房源操作
              roomSet: function(type,value,room_id){    //type:1上架/下架操作   2为删除房源;value:1 上架值，0下架值，删除不需要传值
                var that = this;
                var data = {
                  type: type,
                  room_id: room_id
                };
                if(type == 1)
                  data['value'] = value;
                  d.Ajax("post",s.api.room_set, data, function(res){
                    if(res.code == 0){
                      layer.msg(res.msg, {
                        offset: '15px',
                        icon: 1,
                        time: 1000
                      });
                      if(tab_id == 0){
                        that.getDataList();
                        that.pages('pages1');
                      }
                      else{
                        var isActive = tab_id==1?1:0;
                        var pages = tab_id==1?'pages1':'pages2';
                        that.getDataList({isActive: isActive});
                      }
                    }                      
                  }, function(error){
                    console.log(error);
                  });
              },
              //分页渲染
              pages:function(elem,isActive){
                var that = this;
                setTimeout(function(){
                  var interval = setInterval(function(){
                    if(typeof that.hoursData.totalCount != 'undefined'){
                      laypage.render({
                        elem: elem
                        ,count: that.hoursData.totalCount //数据总数，从服务端得到
                        ,limit: that.hoursData.unitListVoList.per_page
                        ,jump: function(obj, first){                            
                          // console.log(obj.limit); //得到每页显示的条数                       
                          //首次不执行
                          if(!first){
                            var list = {
                              current_page:obj.curr
                            };
                            if(typeof isActive != 'undefined'){
                              list["isActive"] = isActive;
                            }
                            that.getDataList(list);
                          }
                        }
                      });
                      clearInterval(interval);
                    }
                  },100);
                },500);               
              },
              // 跳转到创建房屋页面
              toCreateRoom: function(room_id){
                var that = this;
                //监听编辑房屋下拉选择框
                form.on('select(select2)',function(data){
                  var indextab;
                  if(data.value!=0){
                  	indextab = data.value-1;
                  }else{
                  	return false;
                  }
                  sessionStorage.setItem("tabindex",indextab);
                  sessionStorage.setItem("room_id",room_id);
                  setTimeout(function(){
                    location.hash = a.correctRouter('room/create_room');
                  },20);
                });
              }
            },
            created:function(){
                var that = this;
                that.getDataList();
                that.pages('pages1');
                form.on('select(select1)',function(data){
                  var id = data.value
                  if(id == 'all'){
                  }
                  else{
                    var active = that.statusSelectList[data.value].split("（")[0] == '已上架' ? '1' : '0'
                    ,status = that.statusSelectList[data.value].split("（")[1].slice(0,4) == '审核通过' ? '1' : '0'
                    console.log({tab_id: tab_id ,isActive: active,houseStatus: status})
                    if(id == 0){
                    }
                  }
                  form.render();
                  });
                
                //选项卡功能
                element.on('tab(tab)', function(){
                  that.$set(that,"statusSelectList",[]);
                  id = this.getAttribute('lay-id');
                  if(id == 0){
                    that.getDataList();
                    that.$set(that,"activeId",1);
                  }
                  else if(id == 1){
                    that.getDataList({isActive: 1});
                    that.pages('pages2',1);
                    that.$set(that,"activeId",2);
                  }
                  else{
                    that.getDataList({isActive: 0});
                    that.pages('pages3',0);
                    that.$set(that,"activeId",3);
                  }
                  tab_id = id
                  form.render();
                });
                $(".contain").removeProp("hidden")
                $(".exist-select").html('<div class="layui-form-item"><select id="exist-select" name="select" lay-filter="select1"><option value="all" selected>全部</option><option :value="idx" v-for="(item,idx) in statusSelectList">{{ item }}</option></select></div>')
                $(".right-ckb").html('<div class="right-select layui-form-item"><select id="right-select" name="select" lay-filter="select2"><option value="0" selected>编辑房屋</option><option v-for="list in item.selectList" :value="[list.id]">{{ list.text }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ list.isReject ==1 ? "!":""}}</option></select></div>')
            },
            mounted: function(){
              var that = this;


            },
            updated: function (){
                this.$nextTick(function () {
                     form.render()
                });
            },
            })
       }
  }
 
  
  t("hours_list",f)
})