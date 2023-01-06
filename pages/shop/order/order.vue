<template>
	<view>
		<view style="margin-top: 2px;">
			<headbar :title = "title"></headbar>
		</view>
		<u-list
			@scrolltolower="scrolltolower"
		>
			<u-list-item
				v-for="(item, index) in orderList"
				:key="index"
			>
			<view @click="toOrder(item.id)">
				<u-cell
					:title="item.name"
					customStyle="{'font-size': '200px'}"
				>
					<text slot="label" style="font-size: 20px;color: #fd550d;margin-top:20rpx;">{{item.amount + " 元"}}</text>
					<u-tag
					    		    :text="Apply(item.ifApply)"
					    		    plain
					    		    size="large"
					    		    type="warning"
									slot="value"
									style="margin-left: 20rpx;"
					    		>
					</u-tag>
					<u-avatar
						slot="icon"
						shape="square"
						size="125"
						:src="item.cover"
						customStyle="margin:0;margin-right:20rpx;"
					></u-avatar>
				</u-cell>
			</view>
			</u-list-item>
		</u-list>
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
				token:"",
				title:"订单",
				orderList:{},
				page:2
			}
		},
		onShow() {
			let that = this
			uni.getStorage({
				key:"token",
				success(res) {
					that.token = res.data
					that.getOrderList()
				}
			})
			
		},
		onPullDownRefresh() {
			this.page = 2
			uni.request({
				url:"http://101.42.237.62:8080/api/order/GetListByOld/1/10",
				method:"POST",
				header: {
				'Authorization': 'Bearer ' + that.token,
				},
				success(res) {
					that.orderList = res.data.orderList
				}
			})
			uni.stopPullDownRefresh()
		},
		computed: {
						
					},
		methods: {
			getOrderList(){
				let that = this
				uni.request({
					url:"http://101.42.237.62:8080/api/order/GetListByOld/1/10",
					method:"POST",
					header: {
					'Authorization': 'Bearer ' + that.token,
					},
					success(res) {
						that.orderList = res.data.orderList
					}
				})
			},
			Apply(e){
				if(e == 0){
					return "待查看"
				}else if(e == 1){
					return "不同意"
				}else{
					return "已同意"
				}
			},
			scrolltolower() {
				console.log("chu")
							this.loadmore()
			},
			loadmore() {
				let that = this
				uni.request({
					url:"http://101.42.237.62:8080/api/order/GetListByOld/"+that.page+"/5",
					method:"POST",
					header: {
					'Authorization': 'Bearer ' + that.token,
					},
					success(res) {
						that.page += 1
						that.orderList = that.orderList.concat(...res.data.orderList)
					}
				})
			},
			toOrder(e){
				uni.navigateTo({
					url:"/pages/shop/order/orderDetail?id="+e
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

</style>
