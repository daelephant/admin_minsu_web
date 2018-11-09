/**
 * User: Awin 卓尉家
 * Mail: 731661902@qq.com
 * Date: 2018/8/6
 * Time: 10:20
 * Company: 广州市致一信息技术有限公司
 */
layui.use('slider', function(){
  var slider = layui.slider;
  
  //渲染
  slider.render({
    elem: '#slideTest1'  //绑定元素
  });
});