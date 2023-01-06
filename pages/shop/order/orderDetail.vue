<template>
	<view class="back">
		<view style="margin-top: 0px;">
			<headbar :title = "title"></headbar>
		</view>
		
		<view class="orderBox">
			<view style="height:10rpx"></view>
				<u-steps :current="currentId()" direction="column" :dot="true">
						<u-steps-item title="已下单" iconSize="20" :desc="'订单id：'+orderDetail.id">
						
						</u-steps-item>
						
						<u-steps-item :title="'发往 '+addressDetail.address" :desc="addressDetail.name+' '+addressDetail.phone" iconSize="20" v-if="orderDetail.ifPay == 1"></u-steps-item>
						<u-steps-item title="已支付" iconSize="100" v-if = "orderDetail.ifPay == 1"></u-steps-item>
						<u-steps-item :error="true" title="未同意" :desc="'家属理由：'+orderDetail.unapplyReason" iconSize="20" v-if="reason != ''"></u-steps-item>
				</u-steps>
		</view>
<!-- 		<u-gap bgColor="#e8e8e8"></u-gap> -->
		<view class="comBox" @click="toCom(orderDetail.commodityId)">
			<view class="movieList">
				<image :src="orderDetail.cover" class="movieImg"></image>
				<text class="moiveRateT"">{{orderDetail.name}}</text>
				<br/>
				<text class="moiveRateT">{{"总价："+orderDetail.amount}}</text>
				<br/>
				<text class="moiveRateT">{{"件数："+orderDetail.number}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import headbar from "@/components/headbar.vue"
	export default {
		data() {
			return {
				title:"订单",
				orderDetail:{},
				addressDetail:{},
				token:"",
				reason:"",
				id:""
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
					uni.request({
						url:"http://101.42.237.62:8080/api/order/GetDetail/"+that.id,
						method:"POST",
						header: {
						'Authorization': 'Bearer ' + that.token,
						},
						success(res) {
							console.log(res.data.order)
							that.orderDetail = res.data.order
							if(that.orderDetail.unapplyReason != null){
								that.reason = that.orderDetail.unapplyReason
							}
							that.getAddress()
						},
						fail() {
							console.log(123)
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
					uni.request({
						url:"http://101.42.237.62:8080/api/order/GetDetail/"+that.id,
						method:"POST",
						header: {
						'Authorization': 'Bearer ' + that.token,
						},
						success(res) {
							console.log(res.data.order)
							that.orderDetail = res.data.order
							if(that.orderDetail.unapplyReason != null){
								that.reason = that.orderDetail.unapplyReason
							}
							that.getAddress()
						},
						fail() {
							console.log(123)
						}
					})
				}
			})
			uni.stopPullDownRefresh()
		},
		mounted() {
			
		},
		methods: {
			currentId(){
				if( this.orderDetail.ifPay == 1){
					return 3
				}
				if(this.orderDetail.ifPay == 0){
					return 1
				}
			},
			getAddress(){
				var that = this
				uni.request({
					url:"http://101.42.237.62:8080/api/address/get/"+that.orderDetail.addressId,
					method:"POST",
					header: {
					'Authorization': 'Bearer ' + that.token,
					},
					success(res) {
						that.addressDetail = res.data.address
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
			headbar
		}
	}
</script>

<style lang="scss">
	.back{
		min-height: 600px;
		background: linear-gradient(15deg,#ffd289, #ffaa00, #ffaa7f);
		opacity:0.8;
		width: 100%;
		min-height: 100vh;
		background-size: 100% 100%;
	
	}
	.orderBox{
		background-color: #ffffff;
		opacity:0.95;
		border-radius:40rpx;
		margin: 25rpx 10rpx 25rpx 10rpx;
		padding-left: 25rpx;
		padding-top: 20rpx;
	}
	.comBox{
		padding-top: 2px;
		background-color: #ffffff;
		border-radius: 40rpx;
	}
	.slot-icon {
			width: 30px;
			height: 30px;
			background-color: $u-warning;
			border-radius: 100px;
			font-size: 12px;
			color: #fff;
			line-height: 30px;
			text-align: center;
		}
		.moiveRateT {
			padding-bottom: 20rpx;
			margin:15rpx 20rpx 15rpx 20rpx;
			color: #000000;
			font-size: 25px;
		}
		.movieList {
			background-color: #ffffff;
			/* height: 300rpx; */
			margin:15rpx 20rpx 15rpx 20rpx;
			border-radius: 15rpx 15rpx 15rpx 15rpx;
		}
		.movieImg {
			padding-left: 2px;
			padding-right: 2px;
			width: 98%;
			height:400px;
			border-radius: 20rpx;
		}
</style>