<template>
	<view class="detailBox">
		<view class="topbar_size">
			<headbar :title = "title"></headbar>
		</view>
	

		<view class="detailBgMax">
			<view class="detailBg" :style="{backgroundImage: 'url(' + viewBg + ')'}">></view>
		</view>
		<cu-custom :isBack="true">
			<block slot="backText"> </block>
			<block slot="content" class="tarbar">{{ viewTitle }}</block>
		</cu-custom>
		<scroll-view class="scrollBox">
			<view :class="'textMark'">
				<view class="bigImgBox">
					<image :src="viewBg" class="bigImg"></image>
				</view>
				<view class="bigtitleBox">
					<text >{{ viewTitle }}</text>
					<br>
					<text class="textSty">{{ cctvlist.t+' ' }}</text>
					<br></br>
					<text class="textSty">{{'开始：'+ start+' ' }}{{'结束：'+ endtime }}</text>
				</view>
				<view class="summarybox">
					<text >频道介绍: </text>
					<br>
					<view class="summary">
						<template >
							{{summary}}
	
						</template>
					<video :src="`https://m.yangshipin.cn/video?type=1&vid=2000210103&pid=600001859`" ></video>	
					</view>
				</view>
				
				<!--        评论-->
				
			</view>
		</scroll-view>
		<!--        分割线-->
		<!-- #ifdef MP-WEIXIN || MP-BAIDU -->
		<!-- 接口失效预告片与剧照暂时删除 -->
		<!-- #endif -->
	</view>
</template>

<script>
	import headbar from "@/components/headbar.vue"
	export default {
		components: {
			headbar
		},
		onLoad: function(option) {
			console.log(this.head)
			// uni.setBackgroundTextStyle({
			//   textStyle: 'light' // 下拉背景字体、loading 图的样式为dark
			// })
			// uni.showLoading({
			// 	'title': '加载中'
			// })
			var that = this
			// 获取本地存储的图片
			uni.getStorage({
				key: 'storage_bg',
				success: function(res) {
					that.viewBg = res.data
					console.log(res)
				}
			});
			uni.getStorage({
				key: 'storage_h1',
				success: function(res) {
					that.viewTitle = res.data
					console.log(res)
				}
			});
			// 获取电影详情信息
			var id = option.id
			uni.request({
				url:`https://api.cntv.cn/epg/nowepg?c=`+id+`&serviceId=tvcctv&cb=t`,
				method:"GET",
				success(res) {
					that.cctvlist = eval("("+res.data.slice(2,-2)+")")
					that.viewTitle=that.cctvlist.c
					that.summary=that.cctvlist.n
					that.start=that.cctvlist.s
					that.endtime=that.cctvlist.e
					console.log(that.cctvlist)
				}
			})
		},
		data() {
			return {
				title:"直播详情",
				cctvlist: {}, 
				viewBg: '', 
				viewTitle: '', 
				viewBanner: '',
				summary: '',
				src:'',
				start:'',
				endtime:'',
				head:{
				'Accept': '*/*',
				'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
				'Connection': 'keep-alive',
				'Origin': 'https://tv.cctv.com',
				'Referer': 'https://tv.cctv.com/',
				'Sec-Fetch-Dest': 'empty',
				'Sec-Fetch-Mode': 'cors',
				'Sec-Fetch-Site': 'cross-site',
				'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Mobile Safari/537.36 Edg/101.0.1210.39',
				'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="101", "Microsoft Edge";v="101"',
				'sec-ch-ua-mobile': '?1',
				'sec-ch-ua-platform': '"Android"'
               }
				
			}
		},
		methods: {
			toggleDescription(num) {
				this.showText = !this.showText
			}
		},
	}
</script>

<style scoped>
	.topbar_size{
			 margin-bottom: 50px;
	}
	/* 文字遮罩 */
	.textMark {
		margin-top: 20rpx;
		border-radius: 80rpx 80rpx 14rpx 14rpx;
		background-color: rgba(0, 0, 0, .2);
	}
	.detailBox {
		width: 100%;
		height: 100vh;
		position: relative;
	}
	.detailBgMax {
		position: fixed;
		overflow: hidden;
		width: 100%;
		height: 100vh;
		top: 0;
		left: 0;
		z-index: 0;
	}
	.detailBg {
		width: 100%;
		height: 100vh;
		background-size: 100% 100%;
		filter: blur(60rpx);
		transform: scale(1.2);
		transition: 0.3s;
	}
	/* 导航tab */
	.tarbar {
		font-weight: 700 !important;
		color: #fff !important;
	}
	/* 大图 */
	.bigImgBox {
		height: 400rpx;
		/* background: pink; */
		transition: 1s;
		text-align: center;
	}
	/* 滚动视图窗口 */
	.scrollBox {}
	/* 图片从上至下动画 */
	@keyframes mymove {
		0% {
			margin-top: -200px
		}
		100% {
			margin-top: 50px
		}
	}
	.bigImg {
		width: 440rpx;
		height: 300rpx;
		margin-top: 50px;
		border-radius: 10rpx;
		animation: mymove 0.8s cubic-bezier(.41, -0.6, .68, .81) 1;
		/* -moz-box-shadow: 1px 1px 1px #dddddd;
		-webkit-box-shadow: 1px 1px 1px #dddddd;
		box-shadow: 1px 1px 1px #dddddd; */
	}
	.bigtitleBox {
		width: 90%;
		margin: 0 auto;
		text-align: center;
		line-height: 80rpx;
		font-weight: 700;
		color: #F7F7F7;
	}
	.textSty {
		width: 90%;
		margin: 0 auto;
	}
	/* 剧情简介 */
	.summarybox {
		width: 90%;
		margin: 40rpx auto 0;
		line-height: 60rpx;
		font-size: 40rpx;
		color: #EDE1D9;
		font-weight: 700;
	}
	/* 标题设置 */
	.hTitle {
		font-size: 40rpx;
		color: #EDE1D9;
		font-weight: 700;
		margin-left: 3%;
	}
	/* 演职员设置 */
	.castsBox {
		width: 90%;
		display: flex;
		margin: 30rpx auto 0;
		overflow: auto;
	}
	.castsBox-li {
		margin-right: 30rpx;
		text-align: center;
		;
	}
	.castsBox-li img {
		width: 200rpx;
		height: 260rpx;
		border-radius: 10rpx;
	}
	.summary {
		color: #fff;
		font-weight: 600;
		font-size: 30rpx;
		line-height: 40rpx;
		margin-top: 20rpx;
		/* max-height: 160upx; */
	}
	.summaryColor {
		color: #D3BBA7;
	}
	.summaryVColor {
		color: #fff;
		font-weight: 700;
	}
	/* 视频设置 */
	@-webkit-keyframes masked-animation {
		0% {
			background-position: 0 0
		}
		to {
			background-position: -100% 0
		}
	}
	.videoUrl {
		margin-top: 30rpx;
	}
	.play {
		color: #FFFFFF;
		font-size: 50rpx;
		font-weight: 700;
		line-height: 140rpx;
		text-align: center;
		background-image: -webkit-linear-gradient(left, #02ab6c, #DD524D 25%, #3499cd 50%, #DD524D 75%, #3499cd);
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
		-webkit-background-size: 200% 100%;
		-webkit-animation: masked-animation 1s infinite linear;
	}
</style>