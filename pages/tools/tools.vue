<template>
	<view style="background-color: #edeeef;">
		<view class="topbar_size">
			<headbar :title = "title"></headbar>
		</view>
		<view class="tianqi">
			<weather-forecast></weather-forecast>
		</view>	 
		<u-toast ref="uToast"
				 ></u-toast>
		 <view class="menu1">
			 <u-grid col="2">
				 <u-grid-item>
					 <u-icon
					 :customStyle="{paddingTop:20+'rpx'}"
					 name="scan"
					 :size="55"
					 @click="scan()"                ></u-icon>
					 <text class="grid-text">扫一扫</text>
				 </u-grid-item>
				 <u-grid-item>
					 <u-icon
					 :customStyle="{paddingTop:20+'rpx'}"
					 name="chat"
					 :size="55"
					 @click="toSend()"               ></u-icon>
					<text class="grid-text">发帖</text>
				 </u-grid-item>
				 <u-grid-item>
					 <u-icon
					 :customStyle="{paddingTop:20+'rpx'}"
					 name="bag"
					 :size="50"
					 @click="toBuy" ></u-icon>
					 <text class="grid-text">购物</text>
				 </u-grid-item>
				 <u-grid-item>
					 <u-icon
					 :customStyle="{paddingTop:20+'rpx'}"
					 name="/static/Hesuan.png"
					 :size="50"
					 @click="toHesuan" ></u-icon>
					 <text class="grid-text">健康码</text>
				 </u-grid-item>
			 </u-grid>
		 </view>
		 <view class="menu">
			 <u-grid
			               :border="true"
							align="center"
							col=1
			       >
			 				<u-grid-item class="cell">
			 									<view  class="block">
			 										<navigator @click="sos" hover-class="navigator-hover">
			 											<view class="image">
			 											   <u--image src="/static/sos.jpg" width="50px" height="50px" radius = "50"></u--image>
			 											</view>
			 											<view class="text_size">
			 											<text>紧急求救</text>
			 											</view>
			 										</navigator>
			 									</view>
			 				</u-grid-item>
			 				<u-grid-item class="cell">
			 									<view class="block">
			 										<navigator url="/pages/tools/service/service" hover-class="navigator-hover">
			 											<view class="image">
			 											   <u--image src="/static/fy.jpg" width="50px" height="50px" radius = "50"></u--image>
			 											</view>
			 											<view class="text_size">
			 											<text>防疫新态</text>
			 											</view>
			 										</navigator>
			 									</view>
			 				</u-grid-item>
			 				 <u-grid-item class="cell">
			 					<view class="block">
			 						<navigator url="/pages/tools/news/news" hover-class="navigator-hover">
			 							<view class="image">
			 								<u--image src="/static/OIP-C.jpg" width="50px" height="50px" radius = "50"></u--image>
			 							</view>
			 							<view class="text_size">
			 							<text >新闻资讯</text>
			 							</view>
			 						</navigator>
			 					</view>
							</u-grid-item>
							<u-grid-item class="cell" @click="toXC()">
								<view class="block">
										<view class="image">
											<u--image src="/static/xc.png" width="50px" height="50px" radius = "50"></u--image>
										</view>
										<view class="text_size">
										<text >行程码</text>
										</view>
								</view>
							</u-grid-item>
					<u-popup :show="show" mode="center"  @close="close" @open="open">
										 <view class="pop">
											 <u-row>
												 <view>
												 					 <text class="text_left">家属手机:</text>
												 					 <u--input
												 						 placeholder="请输入内容"
												 						 v-model="phone"
												 						 type="number"
												 						 border="surround"
												 						 clearable
												 					   ></u--input>
												 </view>
											 </u-row>
											<u-row>
												<view>
																	 <text class="text_left">您的名字:</text>
																	 <u--input
																		 placeholder="请输入内容"
																		 v-model="oldname"
																		 border="surround"
																		 clearable			 
																	   ></u--input>  
												</view>
											</u-row>
												<button @click="getInfo">
													<text>确认</text>
												</button>
										 </view>
									</u-popup>
					</u-grid>	
		 </view>
		<view style="background-color: #edeeef;">
			<u-cell icon="chat" title="最新发声" size="large"></u-cell>
		</view>
		
		<view class="menu2">
			<view
			class="movieBox"
			>
				<view
					v-for="(item, index) in indexList"
					:key="index"
				>
				
				<view @click="toDetail(item.id)">
				<u-text class="text_size" v-if="item.title != ''" v-text="item.title" ></u-text>
				<u-text class="text_size" v-if="item.title == ''" v-text="'来自'+item.username+'的语音'"></u-text>
				<text class="grid-text">{{timestampToTime(item.create_time)}}</text>
				<u-divider  lineColor="#ffaa7f"></u-divider>
				</view>
				</view>
			</view>
		</view>	  
	</view>
</template>

<script>
	import headbar from "@/components/headbar.vue"
	import weatherForecast from '@/components/weather-forecast/weather-forecast.vue'
	
	export default {
		data(){
			return{
				title : "服务",
				context : '1hello',
				list3: [
				                    'https://images-new-cdn.123rf.com.cn/450wm/tandav/tandav1803/tandav180300008.jpg',
				                    'https://images-new-cdn.123rf.com.cn/450wm/tandav/tandav1803/tandav180300008.jpg',
				                ],
				success:{
					type: 'success',
					title: '求救成功',
					message: "求救成功",
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
				},	
				warn:{
					type: 'error',
					icon: false,
					title: '求救失败',
					message: '求救失败,检查手机号',
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
				},			
				show:false,
				phone:'',
				oldname:'',
				location:'',
				sendLocation:'',
				version:"",
				apkurl:"",
				indexList:{},
				token:''
			}
		},
		onLoad() {
			let that = this
			plus.runtime.getProperty(plus.runtime.appid,(wgtinfo)=>{
			console.log(JSON.stringify(wgtinfo));
			console.log(wgtinfo.version);//应用版本号
			that.version = wgtinfo.version
			
			});
			
		},
		onPullDownRefresh() {
			
			uni.stopPullDownRefresh()
		},
		onShow() {
			let that = this
			//在mounted 声明周期中创建定时器
			const timer = setInterval(()=>{
				// 这里调用调用需要执行的方法，1为自定义的参数，由于特殊的需求它将用来区分，定时器调用和手工调用，然后执行不同的业务逻辑
				
				if(this.token != ""){
					this.upLocation()
				}
			}, 1000) // 每两秒执行1次
			// 通过$once来监听定时器，在beforeDestroy钩子可以被清除
			this.$once('hook:beforeDestroy',()=>{
				// 在页面销毁时，销毁定时器
				clearInterval(timer)
			})
			uni.getSystemInfo({
			               success:(res) => {  
			                   console.log(res.platform);  
			                   //检测当前平台，如果是安卓则启动安卓更新  
			                   if(res.platform=="android"){  
			                       this.AndroidCheckUpdate();  
			                   }  
			               }  
			           })
			uni.getStorage({
				key: 'token',
				success: function(res) {
					that.token = res.data
				}
			})
			uni.request({
				url:'http://101.42.237.62:8080/api/question/get_question_list/1/5',
				method:'post',
				data:{
					ch:2,
					location:"中国"
				},
				header: {
				'Authorization': 'Bearer ' + that.token,
				},
				success(resq) {
					that.indexList = resq.data.question_list
				}
			})
			uni.getStorage({
				key: 'phone',
				success:function(res){
					console.log("soss")
					if(res == ''){
						that.show = true
						return
					}
			
					that.phone = res.data
				},
				fail() {
					console.log("sosf")
					that.show = true
				}
			})
			uni.getStorage({
				key: 'oldname',
				success:function(res){
					if(res == ''){
						that.show = true
						return
					}
			
					that.oldname = res.data
				},
				fail() {
					that.show = true
				}
			})
			uni.getLocation({
						    type: 'gcj02',
							geocode:true,//设置该参数为true可直接获取经纬度及城市信息
						    success: function (res) {
								that.addrDel = res.address;
								that.sendLocation = that.addrDel.country+that.addrDel.province+that.addrDel.city+that.addrDel.district+that.addrDel.street+that.addrDel.streetNum
							},
							fail: function (res) {
							}
						})
				
				  		
		},
		methods:{
			toXC(){
				plus.runtime.openURL('https://render.alipay.com/p/s/i/?scheme=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D2021002170600786')
			},
			upLocation(){
				let that = this
				uni.getLocation({
					type: 'gcj02',
					geocode:true,
					success(res) {
						uni.request({
							url:'http://101.42.237.62:8080/api/user/put_user_location',
							method:'post',
							data:{
								x:res.latitude,
								y:res.longitude,
								location:that.sendLocation
							},
							header: {
							'Authorization': 'Bearer ' + that.token,
							},
							success: (res) =>{
								console.log(res)
							},
							fail(res) {
								console.log(res)
							}
						})
					},
					fail(res) {
						
					}
				})
			},
			toBuy(){
				uni.switchTab({
					url:"/pages/shop/shop/ComType"
				})
			},
			timestampToTime (time) {// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
				time = time.replace("T"," ")
				time = time.replace("Z"," ")
				return time
			},
			toHesuan(){
				plus.runtime.openURL("alipays://platformapi/startapp?appId=20000067&chInfo=ch_desktop&url=https%3A%2F%2F68687564.h5app.alipay.com%2Fwww%2Findex.html")
			},
			scan(){
				var mpaasScanModule = uni.requireNativePlugin("Mpaas-Scan-Module")
				 
				mpaasScanModule.mpaasScan({
				                        // 扫码 UI 风格，参数可为 qr、bar，默认为 qr
				                        'type': 'qr',
				                        // 扫码识别类型，参数可多选，qrCode、barCode，不设置，默认识别所有
				                        'scanType':  ['qrCode','barCode'],
				                        // 是否隐藏相册，默认false不隐藏
				                        'hideAlbum': false
				                    },
				                    (ret) => {
										console.log(ret)
				                        plus.runtime.openWeb(ret.resp_result);
										uni.showModal({
											title: '提示',
											content: '扫码结果不符？点击确定转跳支付宝扫码',
											success: function (res) {
												if (res.confirm) {
													plus.runtime.openURL("alipayqr://platformapi/startapp?said=10000007")
												} else if (res.cancel) {
													
												}
											}
										});
				                    })
			},
			toDetail(id){
				uni.navigateTo({
					url:"../chat/chatdetail?id="+id,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			toSend(){
				if(this.token == ""){
					this.$refs.uToast.show({
						...this.warn,
						
					})
					uni.navigateTo({
						url:"../user/login",
					}) 
					return
				}
				uni.navigateTo({
					url:"../chat/sendChat",
				})
			},
			AndroidCheckUpdate:function(){  
			                var _this=this;  
			                uni.request({  
			                    url: 'http://101.42.237.62:8080/api/version/get_version',  
			                    method: 'POST',  
			                    data: {},  
			                    success: res => {  
 									console.log(res.data.data)
									console.log(_this.version)
			                        if(res.data.data!==_this.version){ 
										uni.request({
											url:'http://101.42.237.62:8080/api/version/get_apkurl',
											 method: 'POST',
											 data: {},
											 success(res) {
											 	_this.apkurl = res.data.data
												console.log(_this.apkurl)
											 }
										})
			                            if(plus.networkinfo.getCurrentType()!=3){  
											uni.showModal({
												title: '提示',
												content: '有新的版本发布，检测到您目前非Wifi连接，是否更新',
												success: function (res) {
													if (res.confirm) {
														console.log('用户点击确定');
													} else if (res.cancel) {
														console.log('用户点击取消');
														return;
													}
												}
											})
			                            }  
			                            uni.showToast({  
			                                title: '有新的版本发布，检测到您目前为Wifi连接，程序已启动自动更新。新版本下载完成后将自动弹出安装程序。',  
			                                mask: false,  
			                                duration: 5000,  
			                                icon:"none"  
			                            });  
			                            var dtask = plus.downloader.createDownload( _this.apkurl, {}, function ( d, status ) {  
			                                    // 下载完成  
												console.log(_this.apkurl)
												console.log(status)
			                                    if ( status == 200 ) {   
			                                        plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename),{},{},function(error){  
			                                            uni.showToast({  
			                                                title: '安装失败',  
			                                                mask: false,  
			                                                duration: 1500  
			                                            });  
			                                        })  
			                                    } else {  
			                                         uni.showToast({  
			                                            title: '更新失败',  
			                                            mask: false,  
			                                            duration: 1500  
			                                         });  
			                                    }    
			                                });
			                            dtask.start();   
										var prg = 0;
										var showLoading = plus.nativeUI.showWaiting("正在下载");
										dtask.addEventListener('statechanged', function(task,status) {
										// 给下载任务设置一个监听 并根据状态 做操作
										switch (task.state) {
										case 1:
										showLoading.setTitle("正在下载");
										break;
										case 2:
										showLoading.setTitle("已连接到服务器");
										break;
										case 3:
										prg = parseInt(
										(parseFloat(task.downloadedSize) /
										parseFloat(task.totalSize)) *
										100
										);
										showLoading.setTitle("版本更新,正在下载" + prg + "% ");
										break;
										case 4:
										plus.nativeUI.closeWaiting();
										//下载完成
										break;
										}
										});
			                        }  
			                    },  
			                    fail: () => {},  
			                    complete: () => {}  
			                });  
			            },
			  open() {
			        // console.log('open');
			      },
			  close() {
				this.show = false
				// console.log('close');
			  },
			getInfo(){
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
		    sos(){
					let that = this;
					uniCloud.callFunction({
						name:'sendcode',
						data:{
							phone: that.phone,
							oldname:that.oldname,
							location:that.addrDel.country+that.addrDel.province+that.addrDel.city+that.addrDel.district+that.addrDel.street+that.addrDel.streetNum
						},
						success(res) {
							console.log(res.result)
							console.log(that.phone)
							
							if(res.result.code == 0){
								that.$refs.uToast.show({
									...that.success,
								
								})
							}else if(res.result.msg == "手机号格式不正确，仅支持中国大陆手机号"){
								that.$refs.uToast.show({
									...that.warn,
								})
							}
							else{
								that.$refs.uToast.show({
									...that.warn,
								
								})
							}
						},
						fail(res) {
							console.log(res)
							that.$refs.uToast.show({
								...that.warn,
							
							})
						}
					})
					
				}
		},
		components:{
			headbar,
			weatherForecast
		}
	}
</script>

<style>
	.grid-text {
	        font-size: 25px;
	        color: #909399;
	        padding: 10rpx 0 20rpx 0rpx;
	        /* #ifndef APP-PLUS */
	        box-sizing: border-box;
	        /* #endif */
	    }
	.menu{
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 10px;
		margin-bottom: 20px;
		margin-left: 10px;
		margin-right: 10px;
		border-radius: 40rpx 40rpx 40rpx 40rpx;
		background-color: #ffffff;
	}
	.menu1{
		margin-top:0px;
		margin-bottom: 15px;
		margin-left: 10px;
		margin-right: 10px;
		border-radius: 40rpx 40rpx 40rpx 40rpx;
		background-color: #ffffff;
	}
	.menu2{
		margin-bottom: 15px;
		margin-left: 10px;
		margin-right: 10px;
		border-radius: 40rpx 40rpx 40rpx 40rpx;
		background-color: #ffffff;
	}
	.tianqi{
		height: 220px;
	}
	.pop{
		width:310px;
		height: 150px;
	}
	.image{
		margin-left: 30px;
		float: left;
		height: 50px;
	}
	.text_size{
		font-size: 30px;
		float: right;
		width:120px;
		height:50pxpx;
		margin-right: 30px;
		background:#ffse2-mm.cn.bing.net/th/ffff;
		color:#6a6c71;
	}
	.text_left{
		font-size: 30px;
		float: left;
	}
	.cell{
		   height: 80px;
		   width: 200px;
	}
	.block{
		width: 300px;
		height: 50px;
	}
	.movieBox {
		width:94%;
		margin: 0 auto;
		
	}
</style>
