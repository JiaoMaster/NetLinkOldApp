<template>
  <view class="page">
	  <view class="topbar_size">
	  	<headbar :title = "title"></headbar>
	  </view>
    <view class="top-background-raduis"> </view>
    <view class="login-box">
		<view class="logo">
			<image src="../../static/icon/NetLinkOld(1).png" mode=""></image>
		</view>
      <view class="login-card-title">
        <view class="login-card-title-content"> 账号密码登录 </view>
      </view>
      <view class="login-card-input">
        <!-- 输入框头部图标 -->
        <uni-easyinput
          class="hj-input"
          v-model="username"
          focus
          maxlength="30"
          :trim="true"
          @focus="UserNamePassWrodFocusBorderStyle"
          :styles="inputColorConfigToUserName"
          @blur="UserNamePassWrodBlurBorderStyle"
          placeholder="请输入账号"
        ></uni-easyinput>
        <!-- 输入框头部图标 -->
        <uni-easyinput
          class="hj-input"
          v-model="password"
          type="password"
          @focus="PassWordFocusBorderStyle"
          @blur="PassWordBlurBorderStyle"
          :styles="inputColorConfigToPassWord"
          placeholder="请输入密码"
        ></uni-easyinput>
      </view>
      <view class="login-card-loginIn" @click="login()">
        <view class="login-card-loginIn-btn">
          登 录
        </view>
      </view>
	  
       <view class="login-bottom-info">
         忘记密码
       </view>
	   <view >
	   	<text class="text_size" style="padding:10rpx">家属：使用微信小程序家属端</text>
	   	<image src="../../static/applet.jpg" style="height: 350rpx;width: 350rpx;border-radius:50%; float: inherit; opacity: 0.95;"></image>
	   </view>
	   <view class="bottom-message">
	     登录/注册代表你已同意《网联花甲用户协议》
	   </view>
    </view>
     
	 
  </view>
</template>

 
<script>
		import headbar from "@/components/headbar.vue"
//import {  } from "@/common/api/{$}.js";
export default {
  data() {
    return {
		title:"登录",
      // 输入框边框颜色默认值
      colorDefault:'#b4b4b4',
      // 输入框边框聚焦值
      colorFocusColor:'#f9d093',
      // 输入框颜色配置
      inputColorConfigToUserName: {
        color: "#000000",
        disableColor: "#eee",
        borderColor: "#f9d093",
      },
      // 输入框颜色配置
      inputColorConfigToPassWord: {
        color: "#000000",
        disableColor: "#eee",
        borderColor: "#f9d093",
      },
      value: "",
	  username: "",
	  password: "",
	  token:"",
    };
  },
  components:{headbar},
  //监听页面初始化，其参数同 onLoad 参数，为上个页面传递的数据，参数类型为 Object（用于页面传参），触发时机早于 onLoad
  onInit() {},
  //监听页面加载，其参数为上个页面传递的数据，参数类型为 Object（用于页面传参）
  onLoad() {},
  //监听页面初次渲染完成。注意如果渲染速度快，会在页面进入动画完成前触发
  onReady() {},
  //监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面
  beforeDestroy() {},
  //页面滚动到底部的事件（不是scroll-view滚到底），常用于下拉下一页数据。
  onReachBottom() {},
  onShareAppMessage() {},
  created() {},
  methods: {
    // 输入框聚焦变换边框样式
    UserNamePassWrodFocusBorderStyle(){
      this.inputColorConfigToUserName.borderColor
      = this.colorFocusColor;
    },
    PassWordFocusBorderStyle(){
      this.inputColorConfigToPassWord.borderColor
      = this.colorFocusColor;
    },
    // 输入框失去焦点变换边框样式
    UserNamePassWrodBlurBorderStyle(){
      this.inputColorConfigToUserName.borderColor
      = this.colorDefault;
    },
    PassWordBlurBorderStyle(){
      this.inputColorConfigToPassWord.borderColor
      = this.colorDefault;
    },
	login(){
		let that = this
		uni.request({
			url:'http://101.42.237.62:8080/login',
			method: 'POST',
			data:{
				username:this.username,
				password:this.password
			},
			success:(res)  =>{
				if(res.data.code == "200"){
					that.token = res.data.token
					console.log(res.data)
					uni.setStorage({
						key:'token',
						data:that.token,
					})
					uni.setStorage({
						key:'UserName',
						data:that.username,
					})
					uni.navigateBack({
						delta:1,
					})
					uni.connectSocket({
					  url: 'ws://101.42.237.62:8080/api/notice/newcommit',
					  success() {
						  uni.onSocketOpen(function (res) {
						  							
						  							uni.sendSocketMessage({
						  								data:that.username
						  							})
						  							 });
						 uni.onSocketError(function (res) {
						 	console.log(res)
						   console.log('WebSocket连接打开失败，请检查！');
						 });
						}});    
				}else{
					uni.showToast({
					    title: '账号或者密码不存在',  
					    mask: false,  
					    duration: 1000,  
					    icon:"none"  
					});
					console.log(this.username)
					console.log(this.password)
				}
			},
			fail:(res)  =>{
				console.log(res)
			}
		})
  }
  }
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.logo {
		height: 5vh;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
.page {
  position: relative;
  height: 100vh;
}
.top-background-raduis {
  height: 30%;
  background-color: #d8d8d8;
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
}
/deep/ .is-input-border{
  border-radius: 7px !important;
}
/deep/ .uni-easyinput__content{
  min-height: 39px !important;
}
.hj-input {
  margin-top: 15rpx;
}
.hj-input:nth-child(2) {
  margin-top: 35rpx;
}
.login-box {
  top: 20%;
  position: absolute;
  width: 80%;
  left: 10%;
  right: 10%;
  height: 700rpx;
  padding: 30rpx;
  background-color: white;
  border-radius: 40rpx;
  box-shadow: 9px 9px 6px #e3e3e3;
  .login-card-input {
    // background-color: violet;
    height: 50%;
    padding: 5rpx;
  }
  .login-card-title {
    height: 20%;
    // background-color: black;
    padding: 10rpx;
    display: flex;
    justify-content: center;
    .login-card-title-content {
      font-size: 1.7em;
      color: #f9d093;
      border-bottom: 3px solid #f9d093;
    }
  }
  .login-card-loginIn{
    height: 25%;
    display: flex;
    justify-content: center;
    padding: 10rpx;
    align-items: center;
    .login-card-loginIn-btn{
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f9d093;
      width: 100%;
      font-size: 1.5em;
      height: 80%;
      border-radius: 40rpx;
      color: white;
    }
  }
  .login-bottom-info{
    height: 5%;
    display: flex;
    font-size: 0.7em;
    color: #f9d093;
    justify-content: end;

  }
}
.text_size {
		font-size: 22px;
		display: flex;
		/*实现垂直居中*/
		align-items: center;
		/*实现水平居中*/
		justify-content: center;
		text-align: justify;
	}
.bottom-message{
  height: 70rpx;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 0.9em;
  overflow: hidden;
  color: #969898;
  bottom: 40rpx;
}
</style>