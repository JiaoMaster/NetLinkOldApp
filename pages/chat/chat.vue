<template>
	<view  style="background: linear-gradient(12deg,#ffd289, #ffaa00, #ffaa7f);
		opacity:0.8;">
<!-- 		<view> -->
			<headbar :title = "title"></headbar>
<!-- 		</view>	 -->
<!-- 		<view > -->
		      <u-notice-bar :text="text1" fontSize="25px" color="#ffaa7f" direction="column" speed="15" customStyle="border-radius:25rpx;margin:20rpx;background:white;"></u-notice-bar>
<!-- 		</view> -->
        <u-toast ref="uToast"
				 ></u-toast>
<!-- 		<view style="background: linear-gradient(12deg,#ffd289, #ffaa00, #ffaa7f);
		opacity:0.8;"> -->
			<u-tabs  :list="list1"
			@click="chageIndex"
			lineWidth="30"
			lineColor="#f56c6c"
			:activeStyle="{
						color: '#303133',
						fontWeight: 'bold',
						transform: 'scale(0.95)'
					}"
			:inactiveStyle="{
						color: '#606266',
						transform: 'scale(0.85)'
					}"
			itemStyle="padding-left:15rpx;height:60px;padding-right:2rpx"
			></u-tabs>
<!-- 		</view> -->
		
		<view v-show="nowCh == 0">
			<view v-show="addrDel.city != '' " style="margin:20rpx">
				<u-tag :text='`${addrDel.country}${addrDel.province}${addrDel.city}${addrDel.district}`' size="large" icon="map" plain></u-tag>
			</view>
			<view v-show="addrDel.city == ''" style="margin:25rpx">
				<u-tag text='定位失败请打开定位' size="large" icon="map" plain></u-tag>
			</view>
		</view>
		
			<view class="btnv">
				<view class="btn" @click="toSend">
					<text>发帖</text>
				</view>
			</view>
			<view class="movieBox" v-show="nowCh == '0' ">
				<u-divider  lineColor="#4a4646"></u-divider>
				<view style="margin-left: 25rpx;">
					<u--text prefixIcon="info-circle-fill" iconStyle="font-size: 25px" text="请及时下楼做核酸" size="25px"></u--text>
					<u--text prefixIcon="info-circle-fill" iconStyle="font-size: 25px" text="广场舞活动开展" size="25px"></u--text>
					<u--text prefixIcon="info-circle-fill" iconStyle="font-size: 25px" text="垃圾分类,人人有责" size="25px"></u--text>
				</view>
				<u-divider  lineColor="#4a4646"></u-divider>
			</view>
				
				<view
				class="movieBox"
				>
					<view
						v-for="(item, index) in indexList"
						:key="index"
						style="margin-top: 10px;background-color: #fff; border-radius:30rpx"
					>
						<view @click="toDetail(item.id)" style="margin-left: 15px;">
						<u-text class="text_size" v-if="item.title != ''" v-text="item.title" ></u-text>
						<u-text class="text_size" v-if="item.title == ''" v-text="'来自'+item.username+'的语音'"></u-text>
						<image v-if="item.title != ''&& ImageSlice(item.image_list.split('+')) != 'nil' && ImageSlice(item.image_list.split('+')) != ''" style="object-fit:contain" :src="'http://101.42.237.62:8080/objects/'+ImageSlice(item.image_list.split('+'))"></image>
						<view><text class="grid-text">{{timestampToTime(item.create_time)}}</text></view>
						</view>
					</view>
				</view>
	</view>
</template>

<script>
	import headbar from "@/components/headbar.vue"
	import uniLoadMore from "@/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue" // 加载更多

	export default {
		data(){
			return{
				title : "社交",
				addrDel:{},
				context : '1hello',
				indexList: {},
				amount:10,
				page:1,
				nowCh:0,
				token:"",
				warn:{
					type: 'error',
					icon: false,
					title: '未登录不能发帖子',
					message: "未登录不能发帖子",
					iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
				},
				list1:[{
					                   name: '本地社交',
					               }, {
					                   name: '我要发声',
					               }, {
					                   name: '全国频道'
					               }
												],
				loadStatu: false, // loading是否显示
				listStatus: 'loading', // loading状态
				contentText: {
									contentdown: "加载更多",
									contentrefresh: "正在加载...",
									contentnomore: "我是有底线的"
								},
				text1:["请配合社区核酸检测","不要相信任何花钱的电话","有任何异常请立即联系社区"]				
			}
		},
		onPullDownRefresh() {
			let that = this
			uni.request({
				url:'http://101.42.237.62:8080/api/question/get_question_list/1/10',
				method:'post',
				data:{
					ch:that.nowCh+1,
					location:that.addrDel.province+that.addrDel.city
				},
				header: {
				'Authorization': 'Bearer ' + that.token,
				},
				success: (res) =>{
					that.indexList = res.data.question_list
					uni.stopPullDownRefresh()
				}
			})
					
		},
		components:{
			headbar
		},
		onReachBottom: function() { // 页面触底触发
					console.log('触底’')
					this.loadmore()
				},
		mounted(){
			let that = this
			
			uni.getStorage({
				key: 'token',
				success: function(res) {
					that.token = res.data
				}
			})
			uni.getLocation({
						    type: 'gcj02',
							geocode:true,//设置该参数为true可直接获取经纬度及城市信息
						    success: function (res) {

								that.addrDel = res.address;
								uni.request({
									url:'http://101.42.237.62:8080/api/question/get_question_list/1/10',
									method:'post',
									data:{
										ch:1,
										location:that.addrDel.province+that.addrDel.city
									},
									header: {
									'Authorization': 'Bearer ' + that.token,
									},
									success: (res) =>{
										that.indexList = res.data.question_list
										console.log(that.indexList)
									}
								})
						    },
							fail: function (res) {
								console.log(res)
								that.addrDel = {"province":"山西","city":""}
							}
						});
		},
		onShow() {
			let that = this
			this.amount = 10	
			uni.getStorage({
				key: 'token',
				success: function(res) {
					that.token = res.data
				}
			})
			uni.getLocation({
						    type: 'gcj02',
							geocode:true,//设置该参数为true可直接获取经纬度及城市信息
						    success: function (res) {
			
								that.addrDel = res.address;
								uni.request({
									url:'http://101.42.237.62:8080/api/question/get_question_list/1/10',
									method:'post',
									data:{
										ch:that.nowCh+1,
										location:that.addrDel.province+that.addrDel.city
									},
									header: {
									'Authorization': 'Bearer ' + that.token,
									},
									success: (res) =>{
										that.indexList = res.data.question_list
										console.log(that.indexList)
									}
								})
						    },
							fail: function (res) {
								that.addrDel = {"province":"山西","city":""}
							}
						});
		},
		onLoad() {
			this.amount = 10
		},
		methods: {
			ImageSlice(s){
				return s[0]
			},
			chageIndex(res){
				let that = this
				that.page = 1
				that.nowCh = res.index
				console.log(that.nowCh)
				uni.getLocation({
							    type: 'gcj02',
								geocode:true,//设置该参数为true可直接获取经纬度及城市信息
							    success: function (res) {
									console.log(res)
									that.addrDel = res.address;
									console.log(that.addrDel)
							    },
								fail: function (res) {
									console.log(res)
									that.addrDel = {"province":"山西","city":""}
								}
							});
				uni.getStorage({
					key: 'token',
					success: function(res) {
						that.token = res.data
						console.log(that.token)
					}
				})
				uni.request({
					url:'http://101.42.237.62:8080/api/question/get_question_list/'+that.page+'/'+that.amount,
					method:'post',
					data:{
						ch:that.nowCh+1,
						location:that.addrDel.province+that.addrDel.city
					},
					header: {
					'Authorization': 'Bearer ' + that.token,
					},
					success(res) {
						that.indexList = res.data.question_list
					}
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
					url:"./sendChat",
				})
			},
			toDetail(id){
				uni.navigateTo({
					url:"./chatdetail?id="+id,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			timestampToTime (time) {// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
				time = time.replace("T"," ")
				time = time.replace("Z"," ")
				return time
			},
			get_token(){
				uni.getStorage({
					key: 'token',
					success: function(res) {
						this.token = res.data
					}
				})
			},
			scrolltolower() {
				this.loadmore()
			},
			loadmore() {
				
				let that = this
				if(that.amount >= 70){
					return
				}
				that.loadStatu = true
				that.amount+=10;
				that.listStatus = 'loading'
				uni.request({
					url:'http://101.42.237.62:8080/api/question/get_question_list/'+that.page+'/'+that.amount,
					method:'post',
					data:{
						ch:that.nowCh+1,
						location:that.addrDel.province+that.addrDel.city
					},
					header: {
					'Authorization': 'Bearer ' + that.token,
					},
					success(res) {
						that.indexList = res.data.question_list
						that.listStatus = 'loading'
						that.loadStatu = false
					}
				})
			}
		},
	}
</script>

<style>
	.position-sticky {
	    position: -webkit-sticky!important;
	    position: sticky!important;
	}
	    
	.fixed-bottom {
	    position: fixed;
	    right: 0;
	    bottom: calc( var(--window-bottom) + 3px);
	    left: 0;
	    z-index: 1030;
	    margin-bottom: 6;
	}
	.btn {
		width: 100%;
		height: 4rem;
		line-height: 4rem;
		border-radius: 50%;
		margin-top: 0.5rem;
		text-align: center;
		background: linear-gradient(12deg,#ffd289, #ffaa00, #ffaa7f);
		opacity:0.8;
		color: #fff;
		font-size: 1.5rem;
	}
	.btnv{
		width: 125rpx;
		height: 200rpx;
		position: fixed;
		right: 20rpx;
		bottom:120rpx;
		z-index: 99999;
	}
	.movieBox {
		margin-left: 30rpx;
		margin-right: 30rpx;
		
	}
	.u-page{
		margin-left: 10px;
		margin-right: 10px;
	}
	.border{
			 margin-left: 10px;
			 margin-right: 10px;
	}
	.text_size{
		color: #000000;
		font-size:28px;
		padding:20rpx;
		padding-left: 15rpx;
	}
	.grid-text{
		color: #A9A9A9;
		padding: 15rpx;
		position: relative;
		bottom:6rpx;
		left:300rpx;
	}
</style>
