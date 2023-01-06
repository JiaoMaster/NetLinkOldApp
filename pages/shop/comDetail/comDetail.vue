<template>
	<view>
		<view style="margin-top: 5px;">
			<headbar :title = "title"></headbar>
		</view>
		<view>
			<u-swiper
			           :list="comDetail.images"
					   height="500px"
					   indicator
					   imgMode="scaleToFill"
					  indicatorMode="line"
					  circular
			   ></u-swiper>
			   <u-gap height="6px"></u-gap>
			   <text class="moiveRateT">{{comDetail.amount+"元"}}</text>
			   <u-gap height="6px"></u-gap>
			   <view class="title">
				   <text>{{comDetail.name}}</text>
			   </view>
			    <u-gap height="3px"></u-gap>
			   <view class="sold">
				   <text>{{"月销：" + comDetail.sold}}</text>
			   </view>
		</view>
		<view>
			<uni-card :title="shopDetail.name" :sub-title="shopDetail.introduction"  :thumbnail="shopDetail.image" @click="" >
				<text class="uni-body" style="font-size: 17px;color: ;">{{'商品简介：'+comDetail.introduction}}</text>
				<view style="display: flex;">
					<text class="text" style="font-size: 17px;color: ;">{{"大众评分："}}</text>
					<view style="display: flex; 
								justify-content: center;
								align-items: center;">
						<uni-rate :value="comDetail.score"  size=15 color="#bbb" active-color="#ffca3e" readonly="true"></uni-rate>
					</view>
					<text class="text" style="font-size: 14px;color: #ff0000;">{{comDetail.score+"分"}}</text>
				</view>
			</uni-card>
		</view>
		<view >
			<image :src="comDetail.detailImage" class="detailimage"></image>
		</view>
		<u-tabbar
			:fixed="true"
			:placeholder="true"
			:safeAreaInsetBottom="true"
		>
			<view style="display: flex; 
								justify-content: center;
								align-items: center;
								margin-left: 5px;">
				<u-number-box v-model="number"></u-number-box>
			</view>
			<u-button color="#feac31" text="想要" customStyle="margin-top: 5px;margin-right: 5px;margin-left: 5px;" @click="want()"></u-button>
		</u-tabbar>
	</view>
</template>

<script>
	import headbar from "@/components/headbar.vue"
	export default {
		data() {
			return {
				title:"商品",
				id:"",
				comDetail:{},
				shopDetail:{},
				token:"",
				number:1,
				show:false
			}
		},
		onLoad(option) {
			this.id = option.id
		},
		onShow() {
			let that = this
			uni.getStorage({
				key:"token",
				success(res) {
					that.token = res.data
				}
			})
		},
		mounted() {
			let that = this
			uni.getStorage({
				key:"token",
				success(res) {
					that.token = res.data
				}
			})
			uni.request({
				url:"http://101.42.237.62:8080/api/commodity/GetDetail/"+that.id,
				method:"POST",
				success(res) {
					that.comDetail = res.data.shop
					that.comDetail.images = res.data.shop.images.split("+")
					console.log(that.comDetail.images)
					uni.request({
						url:"http://101.42.237.62:8080/api/shop/GetDetail/"+that.comDetail.shopId,
						method:"POST",
						success(res) {
							that.shopDetail = res.data.shop
						}
					})
				}
			})
		},
		onPullDownRefresh() {
			let that = this
			uni.getStorage({
				key:"token",
				success(res) {
					that.token = res.data
				}
			})
			uni.request({
				url:"http://101.42.237.62:8080/api/commodity/GetDetail/"+that.id,
				method:"POST",
				success(res) {
					that.comDetail = res.data.shop
					that.comDetail.images = res.data.shop.images.split("+")
					console.log(that.comDetail.images)
					uni.request({
						url:"http://101.42.237.62:8080/api/shop/GetDetail/"+that.comDetail.shopId,
						method:"POST",
						success(res) {
							that.shopDetail = res.data.shop
						}
					})
				}
			})
			uni.stopPullDownRefresh()
		},
		methods: {
			want(){
				let that = this
				if(this.token == ""){
					uni.navigateTo({
						url:"/pages/user/login"
					})
					return
				}
				uni.request({
					url:"http://101.42.237.62:8080/api/order/create",
					method:"POST",
					header: {
					'Authorization': 'Bearer ' + that.token,
					},
					data:{
						commodityId:this.comDetail.id,
						amount:this.comDetail.amount * this.number,
						number:this.number
					},
					success(res) {
						if(res.data.code != 200){
							uni.showModal({
								title: '错误',
								content: '找不到您的亲属，请联系亲属绑定您的账号',
								showCancel:false,
								success: function (res) {
								}
							});
						}
						uni.showModal({
							title: '成功',
							content: '订单已经发给您的亲属',
							showCancel:false,
							success: function (res) {
							}
						});
					}
				})
			},
			onChange(e){
					 setTimeout(() => {
						 this.number = this.number + 1;
					 }, 100)
				 }
			  
		},
		components:{
			headbar
		}
	}
</script>

<style lang="less">
		.detailimage{
			width: 100%;
			height: 600px;
		}
		.moiveRate {
			height: 40rpx;
			line-height: 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 15rpx;
		}
	    .indicator {
	        @include flex(row);
	        justify-content: center;
	
	        &__dot {
	             height: 6px;
	             width: 6px;
	             border-radius: 100px;
	             background-color: rgba(255, 255, 255, 0.35);
	             margin: 0 5px;
	             transition: background-color 0.3s;
	    
	            &--active {
	                 background-color: #ffffff;
	             }
	        }
	    }
		.title{
			font-size: 20px;
			margin-left: 5px;
			margin-right: 5px;
		}
		.up{
			margin-bottom: 10px;
		}
		.sold{
			font-size: 18px;
			margin-left: 5px;
			color: #a6a6a6;
		}
	    .indicator-num {
	        padding: 2px 0;
	        background-color: rgba(0, 0, 0, 0.35);
	        border-radius: 100px;
	        width: 35px;
	        @include flex;
	        justify-content: center;
	
	        &__text {
	             color: #FFFFFF;
	             font-size: 12px;
	         }
	    }
		.moiveRateT {
			margin-right: 2rpx;
			font-size: 25px;
			margin-left: 5px;
			color: #fd550d;
		}
</style>
