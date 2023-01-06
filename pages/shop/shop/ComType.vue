<template>
	<view style="background-color: #e8e8e8;
			width: 100%;
			min-height: 100vh;
			background-size: 100% 100%;">
		<view >
			<headbar :title = "title"></headbar>
		</view>
		<view class="swiper-item">
			 <u-swiper
			            :list="list1"
						height="150px"
						imgMode="scaleToFill"
			    ></u-swiper>
		</view>
		<view >
			<u-grid
					                :border="false"
									:col="4"
									
					        >
					            <u-grid-item
					                    v-for="(baseListItem,baseListIndex) in TypeList"
					                    :key="baseListIndex"
										@click="linkTo(baseListItem.id)"
					            >
									<view >
										<image :src="baseListItem.image" class="image"></image>
									</view>
					                <text class="grid-text">{{baseListItem.name}}</text>
					            </u-grid-item>
								<u-grid-item @click="toOrder">
									<u-icon name="order" size="100"></u-icon>
									<text class="grid-text">订单</text>
								</u-grid-item>
					        </u-grid>
				</view>
				<text class="tleft">推荐:</text>
				<view class="movieBox">
					<view v-for="(item, index) in ComList" :key="index" class="movieList" @click="toCom(item.id)">
						<image :src="item.cover" class="movieImg"></image>
						<view style="font-size: 20px;color: #787878;padding-left:25rpx;padding-right:7rpx;">
							{{ item.name | ellipsis }}
							<view class="moiveRate">
								<uni-rate :value="item.score"  size=14 color="#bbb" active-color="#ffca3e" readonly="true">
								</uni-rate>
								<text class="moiveRateT">{{item.amount+"元"}}</text>
							</view>
						</view>
					</view>
				</view>
				<uni-load-more :status="listStatus" :contentText="contentText" v-if="loadStatu"></uni-load-more>
		</view>
</template>

<script>
	import headbar from "@/components/headbar.vue"
	import uniList from "@/uni_modules/uni-list/components/uni-list/uni-list.vue" // 宫格列表
	import uniListItem from "@/uni_modules/uni-list/components/uni-list-item/uni-list-item.vue"
	import uniLoadMore from "@/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue" // 加载更多
	export default {
		data() {
			return {
				contentText: {
									contentdown: "加载更多",
									contentrefresh: "正在加载...",
									contentnomore: "我是有底线的"
								},
				token:"",
				TypeList:"",
				ComList:"",
				Host:"http://101.42.237.62:8080",
				title:"商城",
				list1: [
				                    'https://cdn.uviewui.com/uview/swiper/swiper1.png',
				                    'https://cdn.uviewui.com/uview/swiper/swiper2.png',
				                    'https://cdn.uviewui.com/uview/swiper/swiper3.png',
				                ],
				Page:2,
				loadStatu: false, // loading是否显示
				listStatus: 'loading',
				NowIndex:0,
				ComList:{}
			}
		},
		mounted() {
			let that = this
			uni.getStorage({
				key:"token",
				success(res) {
					that.token = res.data
				}
			})
			
			that.getTypeList()
			uni.request({
				url:"http://101.42.237.62:8080/api/commodity/GetList/1/10/"+1,
				method:"POST",
				success(res) {
					that.ComList = res.data.commodityList
				}
			})
		},
		onShow() {
			let that = this
			uni.getStorage({
				key:"token",
				success(res) {
					that.token = res.data
				}
			})
			
			that.getTypeList()
			uni.request({
				url:"http://101.42.237.62:8080/api/commodity/GetList/1/10/"+1,
				method:"POST",
				success(res) {
					that.ComList = res.data.commodityList
				}
			})
		},
		onReachBottom: function() { // 页面触底触发
					console.log('触底’')
					this.getmorenews()
				},
		onPullDownRefresh() {
			let that = this
			that.Page = 2
			that.getTypeList()
			uni.request({
				url:"http://101.42.237.62:8080/api/commodity/GetList/1/10/"+1,
				method:"POST",
				success(res) {
					that.ComList = res.data.commodityList
				}
			})
			uni.stopPullDownRefresh()
		},
		filters:{
			ellipsis(value) {
				if (!value) return '';
				if (value.length > 10) {
					return value.slice(0, 11) + '...'
				}
				return value
			},
		},
		methods: {
			getTypeList(){
				let that = this
				uni.request({
					url:that.Host + "/api/commodity/GetTypeList" ,
					method:"POST",
					success(res) {
						that.TypeList = res.data.TypeList
					}
				})
			},
			getmorenews(){
				var that = this
				that.loadStatu = true
				that.listStatus = 'loading'
				uni.request({
					url:"http://101.42.237.62:8080/api/commodity/GetList/"+that.Page+'/4/'+1,
					method:"POST",
					success(res) {
						console.log(res)
						that.Page += 1
						that.ComList=that.ComList.concat(...res.data.commodityList)
						that.listStatus = 'loading'
						that.loadStatu = false
					}
				})
			},
			linkTo(id){
				uni.navigateTo({
					url:"/pages/shop/shop/ComList/ComList?id="+id,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			toCom(id){
				uni.navigateTo({
					url:"/pages/shop/comDetail/comDetail?id=" + id
				})
			},
			toOrder(){
				if(this.token == ""){
					uni.navigateTo({
						url:"/pages/user/login"
					})
					return
				}
				uni.navigateTo({
					url:"/pages/shop/order/order"
				})
			}
		},
		components:{
			uniList,
			uniListItem,
			uniLoadMore,
			headbar
		}
	}
</script>

<style>
	.movieBox {
		
		border-radius: 40rpx 40rpx 40rpx 40rpx;
		width:96%;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.movieList {
		background-color: #ffffff;
		/* height: 300rpx; */
		margin-top: 8px;
		border-radius: 15rpx 15rpx 15rpx 15rpx;
		width: 49%;
	}
	.movieImg {
		height: 300rpx;
		width: 100%;
		border-radius: 15rpx 15rpx 0 0;
	}
	.moiveRate {
		height: 40rpx;
		line-height: 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 5rpx;
		margin-bottom: 10rpx;
	}
	.moiveRateT {
		margin-right: 2rpx;
		color: #fd550d;
		padding-right:0rpx;
	}
	.tleft{
		font-family: "Lato", Helvetica Neue, Helvetica, Arial, sans-serif;
		border-left: 3px solid #21759b;
		padding-left:10px;
		color: #171718;
		margin-bottom: 25px;
		margin-top:15px;
		margin-left:20rpx;
		font-size: 25px;
		text-align:left;
	}
		.grid-text {
	        font-size: 25px;
	        color: #505050;
	        padding: 10rpx 0 20rpx 0rpx;
	        /* #ifndef APP-PLUS */
	        box-sizing: border-box;
	        /* #endif */
	       }
		.image {
			height: 70px;
			width: 70px;
			border-radius: 40rpx 40rpx 40rpx 40rpx;
			margin-top: 30rpx;
		}
		 .swiper-item {
			
			height: 150px;
		 	margin:0;
		 	border-radius: 20upx;
		 }
		 .swiper-img {
		 	width: 100%;
		 	height: 100%;
		 	border-radius: 20upx 20upx;
		 } 
</style>
