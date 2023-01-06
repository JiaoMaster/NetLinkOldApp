<template>
	<view class="content">
		<!-- <view>
			不带文字
		</view>
		<gw-audiott :autoplay="false"  :src="src"/> -->
		<view style="margin-top: 50rpx;">
			带文字
		</view>
		<gw-audiott
			@current="currentProgress"
			@error="error"
			@end="end"
			:autoplay="true" 
			:src="src"
			:showText="true"
			:list="textList"
			:fields="{text:'detail'}"
			rightRole="B"
			style="position: fixed;bottom:0;left: 0;"
			>
		</gw-audiott>
	
	</view>
</template>

<script>
	import gwAudiott from '../../components/gw-audiott/gw-audiott.vue'
	export default {
		components: {
			gwAudiott
		},
		data() {
			return {
				src:'https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3',
				textList:[
					{
					  "startTime": 270,
					  "endTime": 950,
					  "detail": "嗯",
					  "role": "A",
					},
					{
					  "startTime": 1460,
					  "endTime": 2080,
					  "detail": " Hello. ",
					  "role": "B",
					},
					{
					  "startTime": 2910,
					  "endTime": 3850,
					  "detail": "什么意思？",
					  "role": "A",
					},
					{
					  "startTime": 4430,
					  "endTime": 4900,
					  "detail": "噢",
					  "role": "A",
					},
					{
					  "startTime": 5670,
					  "endTime": 6540,
					  "detail": "2014年",
					  "role": "A",
					},
					{
					  "startTime": 7030,
					  "endTime": 8020,
					  "detail": "不是不是。",
					  "role": "A",
					},
					{
					  "startTime": 8030,
					  "endTime": 9270,
					  "detail": "唉对哈罗大哥。",
					  "role": "B",
					},
					{
					  "startTime": 9480,
					  "endTime": 12230,
					  "detail": "对对对，上次也是我给您介绍的。",
					  "role": "B",
					},
					{
					  "startTime": 12480,
					  "endTime": 16470,
					  "detail": "对中间啊对，但是130的已经没有了现在。",
					  "role": "B",
					},
				],
			}
		},
		onLoad() {
			
		},
		methods:{
			currentProgress(current) {
				// console.log(`播放进度：${current}`);
			},
			error(err) {
				console.log(`播放出错：${err}`);
			},
			end() {
				console.log(`播放结束`);
			},
		},
		
	}
</script>

<style>
	page{
		background: #f5f5f5;
	}
	
	.content {
		padding: 10upx;
	}
</style>