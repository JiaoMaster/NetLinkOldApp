<template>
	<view style="background-color: #e8e8e8;
			width: 100%;
			min-height: 100vh;
			background-size: 100% 100%;">
		<view class="topbar_size">
			<headbar :title = "title"></headbar>
		</view>
		<view>
		</view>
		    <u-tabs  :list="list1"
			@click="chageIndex"
            lineWidth="45"
            lineColor="#e19600"
            :activeStyle="{
						color: '#303133',
						transform: 'scale(1.05)'
					}"
            :inactiveStyle="{
						color: '#606266',
						transform: 'scale(0.9)'
					}"
            itemStyle="padding-left: 10px; padding-right: 5px; height: 60px;"
			></u-tabs>
		<view class="movieBox">
			<view v-for="(item, index) in movieInfo" :key="index" class="movieList" @click="getDate(item)" v-if="NowIndex != 4">
				<image :src="item.cover" class="movieImg"></image>
				<view style="font-size: 22px;">
					{{ item.title | ellipsis }}
					<view class="moiveRate">
						<uni-rate disabled="true" :value="item.rate/2" size=14 active-color="#ffaa7f" color="#DADADA">
						</uni-rate>
						<text class="moiveRateT">{{item.rate}}</text>
					</view>
				</view>
			</view>
			<view v-for="(item, index) in cctvlist" :key="index" class="movieList" @click="getDate2(item)" v-if="NowIndex == 4">
				<image :src="`https://t.live.cntv.cn/imagehd/`+item.c+`_01.png?1651909071423`" class="movieImg"></image>
				<view style="font-size: 22px;">
					{{ item.n | ellipsis1 }}
					
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
		data(){
			return{
				title : "娱乐",
				 list1: [{
				                    name: '戏曲',
				                }, {
				                    name: '相声',
				                }, {
				                    name: '评书'
				                }, {
				                    name: '老片'
				                }, {
									name: '央视'
								}
							],	
				 list2: [{
				                    image: 'https://images.weserv.nl/?url=https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2621101922.jpg',
				                    title: '一点到家',
				                },{
				                    image: 'https://images.weserv.nl/?url=https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2632862664.jpg',
				                    title: '人潮汹涌'
				                },{
				                    image: 'https://images.weserv.nl/?url=https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2622388983.jpg',
				                    title: '唐人街探案3'
				                }],
				contentText: {
									contentdown: "加载更多",
									contentrefresh: "正在加载...",
									contentnomore: "我是有底线的"
								},
				NowIndex: 0,				
				pageNum: 1, // 电影列表初始页数
				movieInfo: {}, // 电影列表
				loadStatu: false, // loading是否显示
				listStatus: 'loading', // loading状态
				SelectList:["戏曲","相声","评书","老片"],
				cctvlist:{}
			}
		},
		filters: {
					// 名称超出显示省略号
					ellipsis(value) {
						if (!value) return '';
						if (value.length > 5) {
							return value.slice(0, 6) + '...'
						}
						return value
					},
					ellipsis1(value) {
						if (!value) return '';
						if (value.length > 8) {
							return value.slice(0, 9) + '...'
						}
						return value
					}
				},
		onPullDownRefresh() {
			let that = this
			uni.request({
				url:"https://api.cntv.cn/epg/nowepg?c=cctv1,cctv2,cctv3,cctv4,cctv5,cctv5plus,cctv6,cctv7,cctv8,cctv9&serviceId=tvcctv&cb=t",
				method:"GET",
				success(res) {
					that.cctvlist = eval("("+res.data.slice(2,-2)+")")
			
					console.log(that.cctvlist)
				}
			})
			uni.request({
				url: 'https://movie.douban.com/j/search_subjects',
				header: {
					"Content-Type": "application/text",
				},
				data: {
					type: 'movie',
					tag: this.SelectList[this.NowIndex],
					sort: 'recommend',
					page_limit: 6,
					page_start: 0,
					playable: 'on',
				},
				success: (res) => {
					this.movieInfo = res.data.subjects
				}
			})
			uni.stopPullDownRefresh()
		},
		onReachBottom: function() { // 页面触底触发
					console.log('触底’')
					this.getmorenews()
				},
		mounted() {
			let that =this
			uni.showLoading()
			uni.request({
				url: 'https://movie.douban.com/j/search_subjects',
				header: {
					"Content-Type": "application/text",
				},
				data: {
					type: 'movie',
					tag: this.SelectList[this.NowIndex],
					sort: 'recommend',
					page_limit: 6,
					page_start: 0,
					playable: 'on',
				},
				success: (res) => {
					this.movieInfo = res.data.subjects
					uni.hideLoading()
				}
			})
		},
		methods:{
		    // 触底之后触发函数，
		    getmorenews() {
		    	var that = this
		    	that.loadStatu = true
		    	if (that.movieInfo.length > 89) {
		    		that.listStatus = 'noMore'
		    		return
		    	}
		    	that.listStatus = 'loading'
		    	uni.request({
		    		url: 'https://movie.douban.com/j/search_subjects',
		    		method: 'GET',
		    		header: {
		    			"Content-Type": "application/text",
		    			"Cookie": 'bid=gmauOdTjPuM; ll="108296"; __utma=30149280.183190915.1588736614.1588736614.1588736614.1; __utmc=30149280; __utmz=30149280.1588736614.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __utma=223695111.1019919151.1588736616.1588736616.1588736616.1; __utmc=223695111; __utmz=223695111.1588736616.1.1.utmcsr=douban.com|utmccn=(referral)|utmcmd=referral|utmcct=/; _pk_ref.100001.4cf6=%5B%22%22%2C%22%22%2C1588736616%2C%22https%3A%2F%2Fwww.douban.com%2F%22%5D; _vwo_uuid_v2=DF41C6A193D708C4010E7A2D6F958507C|41887b5e2aa3fee81b7580e887d7e604; __yadk_uid=CaK93hfK60gv0yih8eYhMiiMaicvymVR; _pk_id.100001.4cf6=eb02d84691b41619.1588736616.1.1588736620.1588736616.; __gads=ID=5f256365a15a3bd0:T=1588736620:S=ALNI_MaoShIvp1GQXf-3uNudDn-YkC1ylA; dbcl2="199894991:L6mq4GWyH2I"; ck=C3EE'
		    		},
		    		data: {
		    			type: 'movie',
		    			tag: this.SelectList[this.NowIndex],
		    			sort: 'recommend',
		    			page_limit: 6,
		    			page_start: that.pageNum * 6,
		    			playable: 'on'
		    		},
		    		success: function(res) {
		    			that.pageNum++;
		    			that.movieInfo = that.movieInfo.concat(res.data.subjects);
		    			that.listStatus = 'more'
		    		}
		    	})
		    },
			chageIndex(res){
				let that = this
				that.NowIndex = res.index;
				if(res.index == 4){
					uni.request({
						url:"https://api.cntv.cn/epg/nowepg?c=cctv1,cctv2,cctv3,cctv4,cctv5,cctv5plus,cctv6,cctv7,cctv8,cctv9&serviceId=tvcctv&cb=t",
						method:"GET",
						success(res) {
							that.cctvlist = eval("("+res.data.slice(2,-2)+")")
					
							console.log(that.cctvlist)
						}
					})
					return
				}
				uni.request({
					url: 'https://movie.douban.com/j/search_subjects',
					header: {
						"Content-Type": "application/text",
					},
					data: {
						type: 'movie',
						tag: that.SelectList[that.NowIndex],
						sort: 'recommend',
						page_limit: 6,
						page_start: 0,
						playable: 'on',
					},
					success: (res) => {
						that.movieInfo = res.data.subjects
					}
				})
			},
		    getBanner(item) {
		    				uni.setStorage({
		    						key: 'storage_bg',
		    						data: 'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2559577569.jpg',
		    						success: function() {}
		    					}),
		    					uni.setStorage({
		    						key: 'storage_h1',
		    						data: item.title,
		    						success: function() {
		    							console.log('success');
		    						}
		    					})
		    				uni.navigateTo({
		    					url: '../detail/index?id=' + item.id,
		    					animationType: 'pop-in',
		    					animationDuration: 200
		    				})
		    			},
		    			getSearch() {
		    				uni.navigateTo({
		    					url: '../search/index',
		    					animationType: 'pop-in',
		    					animationDuration: 200
		    				})
		    			},
		    			getDate(item) {
		    				uni.setStorage({
		    					key: 'storage_bg',
		    					data: item.cover,
		    					success: function() {
		    						console.log('item.images.small');
		    					}
		    				})
		    				uni.setStorage({
		    					key: 'storage_h1',
		    					data: item.title,
		    					success: function() {
		    						console.log('success');
		    					}
		    				})
		    				uni.navigateTo({
		    					url: '../play/detail/detail?id=' + item.id,
		    					animationType: 'pop-in',
		    					animationDuration: 200
		    				})
		    			},
						getDate2(item) {
							uni.setStorage({
								key: 'storage_bg',
								data: `https://t.live.cntv.cn/imagehd/`+item.c+`_01.png?1651908123135`,
								success: function() {
									console.log('item.images.small');
								}
							})
							uni.setStorage({
								key: 'storage_h1',
								data: item.n,
								success: function() {
									console.log('success');
								}
							})
							uni.navigateTo({
								url: '../play/detail/live?id=' + item.c,
								animationType: 'pop-in',
								animationDuration: 200
							})
						},
		    			getChart(item) {
		    				console.log(item, 'item')
		    				uni.navigateTo({
		    					url: '../charts/index?type=' + item.name,
		    					animationType: 'pop-in',
		    					animationDuration: 200
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
	.title{
		margin-top: 20px;
	}
	.text_size{
		font-size: 30px;
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
			margin: 0 auto;
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
			background-color: #ffffff;
			border-radius: 40rpx 40rpx 40rpx 40rpx;
			width:94%;
			margin-top:30rpx;
			margin-left:25rpx;
			margin-right:25rpx;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
		}
		.movieList {
			/* height: 300rpx; */
			margin:25rpx;
			margin-top:40rpx;
			margin-bottom: 0;
			width: 42%;
		}
		.movieImg {
			height: 225rpx;
			width: 300rpx;
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
			margin-right: 4rpx;
		}
</style>
