<template>
	<view class="page" v-if="forecast.data">
		<view class="" style="">
			<view class="dp-flex-center wt-temp" style="">
				<text style="font-size: 60rpx;margin-top: 0px;">
					{{luner.nongli}}
				</text>
			</view>
			<view class="dp-flex-center" style="margin-top: 25rpx;font-size: 50rpx">
				<text>
					{{"节气:"+jieqi.now.name}}
				</text>
			</view>
			<view class="dp-flex-center" style="margin-top: 20rpx;font-size: 60rpx">
				<text>
					{{forecast.data[current].wea+" | "+    forecast.data[current].win}}
				</text>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				forecast: {},
				luner:{},
				jieqi:{},
				current: 0
			};
		},
		mounted() {
			var myDate = new Date();
			let that = this
			let requ = '&year='+String(myDate.getYear()+1900)+'&month='+String(myDate.getMonth()+1)+'&day='+String(myDate.getDate())
			uni.request({
				url: 'https://api.jisuapi.com/huangli/date?appkey=a41d737a4133cfe3'+requ,
				success(data) {

					that.luner = data.data.result

				}
			})
			uni.request({
				url: 'https://api.jisuapi.com/jieqi/query?appkey=a41d737a4133cfe3&year=',
				success(data) {
					that.jieqi = data.data.result

				}
			})
			this.getWeather().then(data => {
				this.forecast = data
			},100)

		},
		methods: {
			getWeather() {
				return new Promise((resolve, reject) => {
					uni.request({
						url: 'https://yiketianqi.com/free/week',
						data: {
							//  天气预报api注册： https://www.tianqiapi.com/user/login
							appid: '94211731', //需要去提供api官方注册得到appid
							appsecret: '04xuiGO4', //需要去提供api官方注册得到appsecret
							version: 'v9', //版本号
						},
						success: ({
							data
						}) => {
							resolve(data)
							console.log(data)
						},
						fail: function(info) {
							reject(info)
							//失败回调
							console.log(info)
						}
					})
				})
			}

		}
	}
</script>

<style lang="scss">
	.nav{
		font-size: 30px;
		height: 100rpx;
	}
	.dp-flex-around {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	
	
	.dp-flex-between {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.dp-flex-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.page {
		height: 200px;
		border-radius: 40rpx 40rpx 40rpx 40rpx;
		background: linear-gradient(15deg,#ffd289, #ffaa00, #ffaa7f);
		color: #FFFFFF;
		margin-top:5px;
	}

</style>
