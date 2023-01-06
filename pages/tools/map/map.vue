<template>
	<view>
		<view style="height: 40px;"></view>
		<u-button type="info" @click="loca">
			
		</u-button>
		<u-text v-text="addrDel"></u-text>
	</view>
</template>

<script>
	
	export default{
		data(){
			return{
				addrDel:{},
				x:"",
				y:""
			}
		},
		onShow() {
		},
		methods: {
			loca(){
				let that = this
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
								}
							});
			}
		}
	}
</script>

<style>
</style>
