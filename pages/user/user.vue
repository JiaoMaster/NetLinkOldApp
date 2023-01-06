<template>
	<view style="
			width: 100%;
			min-height: 100vh;
			background-size: 100% 100%;
			background: linear-gradient(15deg,#ffd289, #ffaa00, #ffaa7f);
			opacity:0.8;
			">
		<view class="topbar_size">
			<headbar :title="title"></headbar>
		</view>
		<view class="page">
			<br>
			<view>
				<view class="avatar">
					<u-avatar :src="userimage" size="100" v-show="islogin" style=""></u-avatar>
				</view>
				<view v-show="islogin">
					<text class="text_size" style="margin-top: 20rpx;padding-bottom: 15rpx;">{{'名称：'+Ename}}</text>
					<text class="text_size" style="padding-bottom: 20rpx;">{{'ID：'+userid}}</text>
				</view>
				<view v-show="!islogin">
					<text class="text_size" style="padding:20rpx">老人：{{'请先登录'}}</text>
					<view>
						<text class="text_size" style="padding:20rpx">家属：使用微信小程序家属端</text>
						<image src="../../static/applet.jpg" style="height: 350rpx;width: 350rpx;border-radius:50%; margin-left: 100px; opacity: 0.95;"></image>
					</view>
					
				</view>
			</view>
		</view>

		<!-- 		<view><u-gap height="10" bgColor="#f4f4f4"></u-gap></view> -->
		<view style="background-color: antiquewhite; border-radius: 10%;width: 95%; margin-left: 20rpx;">
			<view>
				<u-cell icon="man-add" title="亲属号码设置" :isLink="true" @click="setInfo()" size="large" titleStyle="padding-left:20rpx;"></u-cell>
			</view>
			<view>
				<u-cell icon="chat" title="我的帖子" :isLink="true" size="large" @click="toMypost()" titleStyle="padding-left:20rpx;"></u-cell>
			</view>
			<view>
				<u-cell icon="setting" title="更改名称" :isLink="true" size="large" @click="showfalse()" titleStyle="padding-left:20rpx;"></u-cell>
			</view>
		</view>

		<!-- 		<view><u-gap height="20" bgColor="#f4f4f4"></u-gap></view> -->

		<view style="background-color: #f4f4f4;">
			<view class="button_size" v-show="islogin">
				<u-button type="error" text="退出登录" customStyle="font-size: 25px;" @click="exit"></u-button>
			</view>
			<view class="button_size" v-show="!islogin">
				<u-button type="success" text="登录" size="normal" @click="toLogin"></u-button>
				<u-button type="primary" text="注册" size="normal" @click="toSignup"></u-button>
			</view>
		</view>

		<u-popup :show="show" mode="center" :closeOnClickOverlay="true">
			<view class="pop" style="height:320rpx">
				<u-row>
					<view>
						<text class="text_left">家属手机:</text>
						<u--input style="width:300rpx;height:50rpx;margin-top:20rpx;padding-left:30rpx;" placeholder="请输入内容" v-model="phone" type="number" border="surround" clearable>
						</u--input>
					</view>
				</u-row>
				<u-row>
					<view>
						<text class="text_left">您的名字:</text>
						<u--input style="width:300rpx;height:50rpx;margin:15rpx;padding-left:30rpx;" placeholder="请输入内容" v-model="oldname" border="surround" clearable></u--input>
					</view>
				</u-row>
				<button @click="getInfo" style="float: left; width:45%;margin-left:21rpx;height:90rpx;">
					<text>确认</text>
				</button>
				<button @click="concelInfo" style="float: right;width:45%;margin-right:21rpx;height:90rpx;">
					<text>取消</text>
				</button>
			</view>
		</u-popup>
		<u-popup :show="show2" mode="center" @close="close" :closeOnClickOverlay="true">
			<view class="pop">
				<u-row>
					<view>
						<text class="text_left" style="height:60rpx;">您的新网名:</text>
						<u--input placeholder="请输入内容" v-model="NewEname" border="surround"
							style="width:300rpx;height:50rpx;margin-top:20rpx;padding-left:7rpx;margin-bottom: 15rpx;" clearable></u--input>
					</view>
				</u-row>
				<view>
					<button @click="setting()" style="float: left; width:45%;margin-left:21rpx;height:90rpx;">
						<text>确认</text>
					</button>
					<button @click="concelInfo2" style="float: right;width:45%;margin-right:21rpx;height:90rpx;">
						<text>取消</text>
					</button>
				</view>

			</view>
		</u-popup>
	</view>

</template>

<script>
	import headbar from "@/components/headbar.vue"

	export default {
		data() {
			return {
				title: "用户",
				context: '1hello',
				username: "默认用户",
				Ename: "未知",
				userid: 1,
				userdetail: "无敌是多么寂寞",
				userimage: "./static/logo.png",
				islogin: false,
				show: false,
				phone: '',
				oldname: '',
				NewEname: '',
				show2: false
			}
		},
		// onPullDownRefresh() {
		// 	uni.stopPullDownRefresh()
		// },
		onShow() {
			let that = this

			uni.getStorage({
				key: 'token',
				success: function(res) {
					that.token = res.data
					uni.request({
						url: "http://101.42.237.62:8080/api/user/get_user_info",
						method: 'POST',
						header: {
							'Authorization': 'Bearer ' + that.token,
						},
						success(res) {
							console.log(res.data)
							that.userid = res.data.info.userid
							that.Ename = res.data.info.nickName
							that.islogin = true

						}
					})
				}
			})
		},
		watch: {
			token(newName, oldName) {
				let that = this
				if (newName != "") {
					that.islogin = true
				} else {
					that.islogin = false
				}
			}
		},
		onPullDownRefresh() {
			let that = this
			uni.getStorage({
				key: 'token',
				success: function(res) {
					that.token = res.data
					uni.request({
						url: "http://101.42.237.62:8080/api/user/get_user_info",
						method: 'POST',
						header: {
							'Authorization': 'Bearer ' + that.token,
						},
						success(res) {
							that.userid = res.data.info.userid
							that.Ename = res.data.info.nickName
							that.islogin = true
							console.log(res)
							uni.stopPullDownRefresh()
						}
					})
				}
			})
		},
		methods: {
			showfalse() {
				let that = this
				this.show2 = true
			},
			setting() {
				let that = this
				uni.getStorage({
					key: 'token',
					success: function(res) {
						that.token = res.data
						uni.request({
							url: "http://101.42.237.62:8080/api/user/put_user_info",
							method: 'POST',
							data: {
								username: that.username,
								nickName: that.NewEname
							},
							header: {
								'Authorization': 'Bearer ' + that.token,
							},
							success(res) {
								uni.getStorage({
									key: 'token',
									success: function(res) {
										that.token = res.data
										uni.request({
											url: "http://101.42.237.62:8080/api/user/get_user_info",
											method: 'POST',
											header: {
												'Authorization': 'Bearer ' + that
													.token,
											},
											success(res) {
												that.userid = res.data.info.userid
							 				that.Ename = res.data.info.nickName
												that.islogin = true
											}
										})
									}
								})
							},
							fail(res) {
								console.log(res)
							}
						})
					}
				})
				this.show2 = false
			},
			toMypost() {
				uni.navigateTo({
					url: "mypost",
					fail(res) {
						console.log(res)
					}
				})
				console.log("to")
			},
			setInfo() {
				let that = this
				uni.getStorage({
					key: 'phone',
					success: function(res) {
						that.phone = res.data
					}
				})
				uni.getStorage({
					key: 'oldname',
					success: function(res) {
						that.oldname = res.data
					}
				})
				this.show = true
			},
			getInfo() {
				let that = this
				uni.setStorage({
					key: 'phone',
					data: that.phone,
					success: function() {
						console.log("phone success")
					}
				})
				uni.setStorage({
					key: 'oldname',
					data: that.oldname,
					success: function() {
						console.log("oldname success")
					}
				})
				that.show = false
			},
			concelInfo() {
				this.show = false
			},
			concelInfo2() {
				this.show2 = false
			},
			toLogin() {
				uni.navigateTo({
					url: './login',
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			toSignup() {
				uni.navigateTo({
					url: './signup',
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			exit() {
				uni.closeSocket()
				uni.setStorage({
					key: 'token',
					data: "",
					success: function() {
						console.log("存储成功")
					}
				})
				uni.setStorage({
					key: 'UserName',
					data: "",
					success: function() {
						console.log("存储成功")
					}
				})
				this.islogin = false
				uni.navigateTo({
					url: "./login"
				})
			},
			close() {
				this.show2 = false
			}
		},
		components: {
			headbar
		}
	}
</script>

<style>
	.cell {
		font-size: 26px;
	}

	.pop {
		width: 310px;
		height: 110px;
	}

	.avatar {
		display: flex;
		justify-content: center; //子元素水平居中
		align-items: center; //子元素垂直居中
	}

	.warn {
		font-size: 30px;
		color: #CD6839;
	}

	.grid-text {
		font-size: 30px;
		color: #909399;
		margin-left: 13px;
		padding: 10rpx 0 20rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */

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

	.context_size {

		display: inline-block;
	}

	.head {
		width: 100%;
		height: 450rpx;
		background: url('https://img0.baidu.com/it/u=863435994,376429699&fm=253&fmt=auto&app=138&f=JPEG?w=1200&h=500') no-repeat center/cover;
	}

	.page {
		width: auto;
		height: auto;
		margin-left: 2px;
		margin-right: 2px;
/* 		background: linear-gradient(15deg, #ffd289, #ffaa00, #ffaa7f); */
/* 		opacity: 0.8; */
		color: #FFFFFF;
	}

	.button_size {
		position: absolute;
		left: 0;
		right: 0;
		flex-grow: 0;
		margin:20rpx;
		display: flex;
		display: -webkit-flex;
		align-items: center;
	}

	.text_left {
		font-size: 20px;
		float: left;
		margin: 25rpx;
		padding-left: 10rpx;
		padding-right: 10rpx;
	}
</style>
