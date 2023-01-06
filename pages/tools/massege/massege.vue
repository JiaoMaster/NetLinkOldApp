<template>
	<view>
		<view class="topbar_size" >
			<headbar :title = "title" :text  = "text"></headbar>
		</view>
		<vieww></vieww>
	</view>
</template>

<script>
	import headbar from "@/components/headbar.vue"
	import vieww from "@/pages/tools/massege/vieww.nvue"
	
	export default{
		data(){
			return {
				title:"防疫",
				text:"返回",
			}
		},
		onLoad() {
			
		},
		components:{headbar,vieww},
		mounted() {
	           
		}
		}
</script>

<style>
	.topbar_size{
		padding-bottom: calc(var(--window-top) + 45px);
	}
</style>
