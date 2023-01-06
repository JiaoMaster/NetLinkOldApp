<template>
	<view>
		<headbar :title = "title"></headbar>
		<u-divider  lineColor="#000000"></u-divider>
		<u-cell
			title="疫情地图"
			isLink
			center
			size="large"
			titleStyle="font-size: 40px;height: 60px;"
			url="/pages/tools/massege/massege"
			class="cell"
		></u-cell>
		<u-divider  lineColor="#000000"></u-divider>
		<u-divider  lineColor="#000000"></u-divider>
		<u-cell
			title="核酸检测结果"
			isLink
			center
			size="large"
			titleStyle="font-size: 40px;height: 60px;"
			url="/pages/tools/service/view"
			class="cell"
		></u-cell>
		<u-divider  lineColor="#000000"></u-divider>
		<u-divider  lineColor="#000000"></u-divider>
		<u-cell
			title="扫一扫"
			titleStyle="font-size: 40px;height: 60px;"
			isLink
			size="large"
			url=""
			@click="scan"
		></u-cell>
		<u-divider  lineColor="#000000"></u-divider>
		<u-divider  lineColor="#000000"></u-divider>
		<u-cell
			title="亲属号码设置"
			titleStyle="font-size: 40px;height: 60px;"
			isLink
			size="large"
			url=""
			@click="setInfo"
		></u-cell>
		<u-divider  lineColor="#000000"></u-divider>
		
	</view>
  
</template>

<script>
	import headbar from "@/components/headbar.vue"
	
	export default {
		data(){
			return{
				title : "防疫",
				context : '1hello',
				list3: [
				                    'https://cdn.uviewui.com/uview/swiper/swiper3.png',
				                    'https://cdn.uviewui.com/uview/swiper/swiper2.png',
				                    'https://cdn.uviewui.com/uview/swiper/swiper1.png',
				                ],
				show:false,
				phone:'',
				oldname:''
			}
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh()
		},
		methods:{
			
			scan(){
				var mpaasScanModule = uni.requireNativePlugin("Mpaas-Scan-Module")
				 
				mpaasScanModule.mpaasScan({
				                        // 扫码 UI 风格，参数可为 qr、bar，默认为 qr
				                        'type': 'qr',
				                        // 扫码识别类型，参数可多选，qrCode、barCode，不设置，默认识别所有
				                        'scanType':  ['qrCode','barCode'],
				                        // 是否隐藏相册，默认false不隐藏
				                        'hideAlbum': false
				                    },
				                    (ret) => {
				                        uni.showModal({
				                            title: "弹窗标题",
				                            // 返回值中，resp_code 表示返回结果值，10：用户取消，11：其他错误，1000：成功
				                            // 返回值中，resp_message 表示返回结果信息
				                            // 返回值中，resp_result 表示扫码结果，只有成功才会有返回
				                            content: JSON.stringify(ret),
				                            showCancel: false,
				                            confirmText: "确定"
				                        })
				                    })
			}
		},
		components:{
			headbar
		}
	}
</script>

<style>
	.cell{
		font-size: 30px;
	}
	.pop{
		width:310px;
		height: 150px;
	}
	.text_left{
		font-size: 30px;
		float: left;
	}
</style>
