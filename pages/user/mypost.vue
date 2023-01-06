<template>
	<view style="background-color: #f4f4f4;">
		<view>
			<headbar :title = "title"></headbar>
		</view>
		<view style="background-color: #edeeef;">
			<u-cell icon="chat" title="帖子" size="large"></u-cell>
		</view>
		<view class="menu2">
			<view class="movieBox">
				<view v-for="(item, index) in indexList" :key="index">
				<view @click="toDetail(item.id)">
				<u-text class="text_size" v-if="item.title != ''" v-text="item.title" ></u-text>
				<u-text class="text_size" v-if="item.title == ''" v-text="'来自'+item.username+'的语音'"></u-text>
				<text class="grid-text">{{timestampToTime(item.create_time)}}</text>
				<u-divider  lineColor="#ffaa7f"></u-divider>
				</view>
				</view>
			</view>
				<u-empty
				        mode="list"
						textSize="20px"
						v-show="indexList == null "
				>
				</u-empty>
		</view>
		
	</view>
	
</template>

<script>
	import uniLoadMore from "@/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue" // 加载更多
	import headbar from "@/components/headbar.vue"
	export default {
		data() {
			return {
				title: '我的帖子',
				oldname:"",
				indexList:{},
				token:"",
				amount:10,
				page:1,
				loadStatu: false, // loading是否显示
				listStatus: 'loading', // loading状态
				contentText: {
									contentdown: "加载更多",
									contentrefresh: "正在加载...",
									contentnomore: "我是有底线的"
								}
			}
		},
		onShow() {
				let that = this
				this.amount = 10	
				uni.getStorage({
					key: 'UserName',
					success:function(res){
						that.oldname = res.data
						console.log(that.oldname)
						uni.request({
							url:'http://101.42.237.62:8080/api/question/get_question_by_id/'+that.oldname+'/'+that.page+'/'+that.amount,
							method:'post',
							header: {
							'Authorization': 'Bearer ' + that.token,
							},
							success: (res)=> {
								console.log(res)
								that.indexList = res.data.question_list
								console.log(that.indexList)
								that.listStatus = 'loading'
								that.loadStatu = false
							},
							fail(res) {
								console.log(res)
							}
						})
					}
				})
				
		},
		onLoad() {
			this.amount = 10
		},
		onReachBottom: function() { // 页面触底触发
					console.log('触底’')
					this.loadmore()
				},
		components:{
			headbar,
			uniLoadMore
		},
		onPullDownRefresh() {
			let that = this
			this.amount = 10	
			uni.getStorage({
				key: 'UserName',
				success:function(res){
					that.oldname = res.data
					console.log(that.oldname)
					uni.request({
						url:'http://101.42.237.62:8080/api/question/get_question_by_id/'+that.oldname+'/'+that.page+'/'+that.amount,
						method:'post',
						header: {
						'Authorization': 'Bearer ' + that.token,
						},
						success: (res)=> {
							console.log(res)
							that.indexList = res.data.question_list
							console.log(that.indexList)
							that.listStatus = 'loading'
							that.loadStatu = false
							uni.stopPullDownRefresh()
						},
						fail(res) {
							console.log(res)
						}
					})
				}
			})
		},
		methods: {
			toDetail(id){
				uni.navigateTo({
					url:"../chat/chatdetail?id="+id,
					animationType: 'pop-in',
					animationDuration: 200,
					fail(res) {
						console.log(res)
					}
				})
			},
			timestampToTime (time) {// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
				time = time.replace("T"," ")
				time = time.replace("Z"," ")
				return time
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
					url:'http://101.42.237.62:8080/api/question/get_question_by_id/'+that.oldname+'/'+that.page+'/'+that.amount,
					method:'post',
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
		}
	}
</script>
 
<style>
	.menu2{
		margin-bottom: 15px;
		margin-left: 10px;
		margin-right: 10px;
		border-radius: 40rpx 40rpx 40rpx 40rpx;
		background-color: #ffffff;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}
	
	.text-area {
		display: flex;
		justify-content: center;
	}
	
	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	.movieBox {
		width:94%;
		margin: 0 auto;

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
		font-size: 30px;
		width:120px;
		height:50pxpx;
		margin-right: 30px;
		background:#ffse2-mm.cn.bing.net/th/ffff;
		color:#6a6c71;
	}
	.grid-text {
	        font-size: 25px;
	        color: #909399;
	        padding: 10rpx 0 20rpx 0rpx;
	        /* #ifndef APP-PLUS */
	        box-sizing: border-box;
	        /* #endif */
	    }
</style>
