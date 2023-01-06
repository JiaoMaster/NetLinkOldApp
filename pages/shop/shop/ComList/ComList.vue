<template>
	<view class="back">
		<view style="margin-top: 0px;">
			<headbar :title = "title"></headbar>
		</view>
		<view class="movieBox">
			<view v-for="(item, index) in ComList" :key="index" class="movieList" @click="toCom(item.id)">
				<image :src="item.cover" class="movieImg"></image>
				<view style="font-size: 20px;color: #787878;">
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
				id:"",
				title:"商城",
				Host:"http://101.42.237.62:8080",
				ComList:{},
				Page:2,
				loadStatu: false, // loading是否显示
				listStatus: 'loading',
				NowIndex:0,
				contentText: {
									contentdown: "加载更多",
									contentrefresh: "正在加载...",
									contentnomore: "我是有底线的"
								},
			}
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
		onReachBottom: function() { // 页面触底触发
					console.log('触底’')
					this.getmorenews()
				},
		onLoad(option) {
			let that = this
			that.id = option.id
		},
		onShow() { 
			let that = this
			uni.request({
				url:"http://101.42.237.62:8080/api/commodity/GetList/1/10/"+that.id,
				method:"POST",
				success(res) {
					that.ComList = res.data.commodityList
				}
			})
			this.getComList()
		},
		onPullDownRefresh() {
			let that = this
			that.Page = 2
			uni.request({
				url:"http://101.42.237.62:8080/api/commodity/GetList/1/10/"+that.id,
				method:"POST",
				success(res) {
					that.ComList = res.data.commodityList
				}
			})
			uni.stopPullDownRefresh()
		},
		methods: {
			getComList(){
				
			},
			getmorenews(){
				var that = this
				that.loadStatu = true
				that.listStatus = 'loading'
				uni.request({
					url:"http://101.42.237.62:8080/api/commodity/GetList/"+that.Page+'/4/'+that.id,
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
			toCom(id){
				uni.navigateTo({
					url:"/pages/shop/comDetail/comDetail?id=" + id
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
		.back{
			background-color: #e8e8e8;
			width: 100%;
			min-height: 100vh;
			background-size: 100% 100%;

		}
		.title{
			margin-top: 20px;
		}
		.text_size{
			font-size: 25px;
		}
	/* 轮播图 */
		.swiper-item {
			width: 80%;
			;
			height: 100%;
			margin: 0 auto;
			border-radius: 20upx 20upx 0 0;
		}
		.swiper-img {
			width: 100%;
			height: 100%;
			border-radius: 20upx 20upx 0 0;
		}
		/* 电影列表 */
		@-webkit-keyframes masked-animation {
			0% {
				background-position: 0 0
			}
			to {
				background-position: -100% 0
			}
		}
		.movieH {
			width: 94%;
			margin: 1 auto;
			height: 100rpx;
			line-height: 100rpx;
			font-weight: 900;
			color: #DD524D;
			font-size: 25rpx;
			background-image: -webkit-linear-gradient(left, #02ab6c, #DD524D 25%, #3499cd 50%, #DD524D 75%, #3499cd);
			-webkit-text-fill-color: transparent;
			-webkit-background-clip: text;
			-webkit-background-size: 200% 100%;
			-webkit-animation: masked-animation 1s infinite linear;
		}
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
			height: 350rpx;
			width: 100%;
			border-radius: 15rpx;
		}
		.moiveRate {
			height: 40rpx;
			line-height: 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 15rpx;
		}
		.moiveRateT {
			margin-right: 2rpx;
			color: #fd550d;
		}
</style>
