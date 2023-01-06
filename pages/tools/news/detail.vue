<template>
	<view class="content">
		<view>
			<headbar :title = "title" :text  = "text"></headbar>
		</view>
		<view>
			<text class="text_title" >{{Ntitle}}</text>
		</view>
		<view>
			<u-text class="src" v-text="Nsrc"></u-text>
			<u-text class="time" v-text="Ntime"></u-text>
		</view>
		<view class="clear"></view>
		<image :src="Npic" class="image"></image>
		<view>
			<u-parse :content="Ncontent"></u-parse>
		</view>
	</view>
</template>

<script>
	import headbar from "@/components/headbar.vue"
	export default{
		data(){
			return {
				title:"新闻",
				text:"返回",
				Ntitle:"无标题",
				Nsrc:"无来源",
				Ntime:"无时间",
				Npic:"",
				Ncontent:"无内容"
			}
		},
		onLoad(){
			var that = this
			// 获取本地存储的图片
			uni.getStorage({
				key: 'storage_src',
				success: function(res) {
					that.Nsrc = res.data
				}
			});
			uni.getStorage({
				key: 'storage_time',
				success: function(res) {
					that.Ntime = res.data
				}
			});
			uni.getStorage({
				key: 'storage_pic',
				success: function(res) {
					that.Npic = res.data
				}
			});
			uni.getStorage({
				key: 'storage_title',
				success: function(res) {
					that.Ntitle = res.data
				}
			});
			uni.getStorage({
				key: 'storage_content',
				success: function(res) {
					that.Ncontent = res.data
				}
			});
			this.Ncontent = this.Ncontent.replace(/<img/g,"<img style='max-width:100%;height:auto;'");
		},
		onPullDownRefresh() {
			var that = this
			// 获取本地存储的图片
			uni.getStorage({
				key: 'storage_src',
				success: function(res) {
					that.Nsrc = res.data
				}
			});
			uni.getStorage({
				key: 'storage_time',
				success: function(res) {
					that.Ntime = res.data
				}
			});
			uni.getStorage({
				key: 'storage_pic',
				success: function(res) {
					that.Npic = res.data
				}
			});
			uni.getStorage({
				key: 'storage_title',
				success: function(res) {
					that.Ntitle = res.data
				}
			});
			uni.getStorage({
				key: 'storage_content',
				success: function(res) {
					that.Ncontent = res.data
				}
			});
			this.Ncontent = this.Ncontent.replace(/<img/g,"<img style='max-width:100%;height:auto;'");
			uni.stopPullDownRefresh()
		},
		components: {
			headbar
		},
	}
</script>

<style>
	.content {
		/* width: 100%; */
		background-color: #ececec;
		background-size: cover;
		/* overflow: hidden; */
		margin-left: 5px;
		margin-right: 5px;
	}
	.text_title {
	font-family: arial;
	font-size: 50px;
	color: #369;
	padding-bottom: 5px;
	border-bottom: 1px solid #999;
	margin-left: 30px;
	margin-right: 30px;
	margin-bottom: 10px;
	}
	.src{
		color: #929394;
		margin-top: 5px;
		font-size: 20px;
		float: left;
		margin-bottom: 10px;
	}
	.time{
		color: #929394;
		margin-top: 5px;
		font-size: 20px;
		float: right;
		margin-bottom: 10px;
	}
	.clear { 
		
	     clear: both; 
	 }
	 .image{
		width: 100%;
		margin-bottom: 30px;
	 }
	.content{
		font-size: 30px;
		margin-top: 5px;
	}
	
</style>
