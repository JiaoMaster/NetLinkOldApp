<template>
				<!-- 2.0.19支持autoBack，默认为false -->
		        <u-navbar
				     :leftText="text"
		            :title= "title"
		            @rightClick="rightClick"
		            :autoBack="true"
					height=44
					bgColor="linear-gradient(30deg, #ffaa00, #ffaa7f)"
					:placeholder="true"
					:border="true"
		        >
		        </u-navbar>
</template>

<script>
	export default {
		data(){
			return{
				color:'#ffbd65'
			}
		},
		props:['title','text'],
		methods:{
		    rightClick() {
			              console.log('rightClick');
			             }
		}
	}
</script>

<style>
	.topbar_size{
			 padding-bottom: calc(var(--window-top) + 45px);
	}
</style>
