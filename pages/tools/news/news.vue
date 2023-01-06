<template>
	<view >
		<view class="topbar_size">
			<headbar :title = "title" :text  = "text"></headbar>
		</view>
		<view class="wrap">
			<view class="menu">
				 <u-subsection 
				 :list="list" 
				 :current="tabIndex" 
				 activeColor = "#CD6839"
				 font-size = "25px"
				 mode="subsection"
				 @change="changeNews"
				 
				 ></u-subsection>
			</view>
		</view>	

			<!-- 新闻内容 -->
		<view
		 class="movieBox"
		>
				<view
				 :border="true"
				 v-for="(item, index) in newsInfo" :key="index"
				
				>
					<u-row  @click="getData(item)" customStyle="margin-bottom: 10px; margin-top: 10px">
					   <text style="font-size: 30px;">{{item.title | ellipsis}}</text>
					   <view style="float: right;">
						   <u--image
						   :src="item.pic" 
						   width="100px" 
						   height="100px" 
						   					
						   >
						   </u--image>
					   </view>
					</u-row>
					<u-row 
					justify="space-between"
					gutter="0">
							<text class="source">{{item.src}}</text>
							<text class="date">{{item.time}}</text>
					</u-row>
					<u-gap height="2" bgColor="#bdbdbd"></u-gap>
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
	export default{
		data(){
			return {
				title:"新闻",
				text:"返回",
				list: ['头条', '体育', '科技','军事'],
				TempnewsInfo:{},
				page:1,
				tabIndex:0,
				loadStatu: false, // loading是否显示
				listStatus: 'loading', // loading状态
				contentText: {
									contentdown: "加载更多",
									contentrefresh: "正在加载...",
									contentnomore: "我是有底线的"
								}
			}
		},
		leftClick(){
			uni.switchTab({
				url: 'pages/tools/tools'
			});
		},
		computed: {
		    newsInfo: {
		        get: function(){
		        return this.TempnewsInfo; // 在这里把临时对象的值通过计算属性赋值给页面中用到的对象
		        }
		    },
		},
		filters: {
					// 名称超出显示省略号
					ellipsis(value) {
						if (!value) return '';
						if (value.length > 15) {
							return value.slice(0, 14) + '...'
						}
						return value
					}
				},
		components:{uniList,
			uniListItem,
			uniLoadMore,
			headbar},
		onReady() {
			    uni.showLoading()
				uni.request({
				
				          url: `https://api.jisuapi.com/news/get?=0&num=10&appkey=`,  //这里的lid,page,pagesize只能是数字或字母
				
				          method: 'GET',
						  data: {
							channel: "头条",
							start: 0,
							num : 20*this.page,
							appkey: 'a41d737a4133cfe3',
						 },
				          success: (res)=>{
							  this.TempnewsInfo = res.data.result.list
							  uni.hideLoading()
						  },
				
				          fail: (err)=>{}
				
				    })
		},
		onPullDownRefresh() {
			this.page = 1
			uni.request({
						 
				          url: `https://api.jisuapi.com/news/get?=0&num=10&appkey=`,  //这里的lid,page,pagesize只能是数字或字母
				
				          method: 'GET',
						  data: {
							channel: this.list[this.tabIndex],
							start: 0,
							num : 20*this.page,
							appkey: 'a41d737a4133cfe3',
						 },
				          success: (res)=>{
							
							this.TempnewsInfo = res.data.result.list
							uni.stopPullDownRefresh()
						  },
				
				          fail: (err)=>{}
				
				    })
			
		},
		onReachBottom: function() { // 页面触底触发
					console.log('触底’')
					this.getmorenews()
				},
		methods:{
			getData(item){
				uni.setStorage({
					key: 'storage_src',
					data: item.src,
					success: function() {
						console.log('item.images.small');
					}
				})
				uni.setStorage({
					key: 'storage_time',
					data: item.time,
					success: function() {
						console.log('item.images.small');
					}
				})
				uni.setStorage({
					key: 'storage_title',
					data: item.title,
					success: function() {
						console.log('success');
					}
				})
				uni.setStorage({
					key: 'storage_pic',
					data: item.pic,
					success: function() {
						console.log('success');
					}
				})
				uni.setStorage({
					key: 'storage_content',
					data: item.content,
					success: function() {
						console.log('success');
					}
				})
				uni.navigateTo({
					url: './detail',
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			test(){console.log(this.newsInfo)},
			getmorenews(){
				console.log("low")
				this.loadStatu = true
				this.page++
				this.listStatus = 'loading'
				uni.request({
							 
					          url: `https://api.jisuapi.com/news/get?=0&num=10&appkey=`,  //这里的lid,page,pagesize只能是数字或字母
					
					          method: 'GET',
							  data: {
								channel: this.list[this.tabIndex],
								start: 0,
								num : 20*this.page,
								appkey: 'a41d737a4133cfe3',
							 },
					          success: (res)=>{
								
								this.TempnewsInfo = res.data.result.list
								this.listStatus = 'loading'
								this.loadStatu = false
							  },
					
					          fail: (err)=>{}
					
					    })
						
				},
			changeNews(index){
				this.tabIndex = index
				this.page = 1
				uni.request({
				
				          url: `https://api.jisuapi.com/news/get?=0&num=10&appkey=`,  //这里的lid,page,pagesize只能是数字或字母
				
				          method: 'GET',
						  data: {
							channel: this.list[index],
							start: 0,
							num : 20,
							appkey: 'a41d737a4133cfe3',
						 },
				          success: (res)=>{
							
							this.TempnewsInfo = res.data.result.list
							 
						  },
				
				          fail: (err)=>{}
				
				    })
					
			},
			
			changeSwiper(e){
				this.changeNews(e.detail.current) 
			}
		},
		mounted() {
		    
		  },
		
	}
</script>

<style>

		.scrollHeight{
			height: 100vh;
		}

	.wrap{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-left: 5px;
		margin-right: 5px;
	}
	.menu{
		display: flex;
		width: 100%;
	}
	.menu-wrap{
		display: flex;
		width: 100%;
	}
	.menu-wrap>view{
		display: inline-block;
		flex-wrap: nowrap;
		padding-left: 20px;
		padding-right: 20px;
		font-size: 30px;
		height: 50px;
		line-height: 40px;
		text-align: center;
	}
	.menu view{
		flex: 1;
		text-align: center;
		font-size: 30px;
	}
	.active{
		color:#CD6839;
		border-bottom: 2px solid #CD6839;
	}
	swiper{
		width:94%;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.new-list{
		padding-bottom: 10px;
		border-bottom: #BBBCBE;
	}
	.lists-top{
		display: flex;
	}
	.lists-top image{
		width: 280px; 
		height: 160px;
	}
	.lists-top text{
		width: 68%;
		font-size: 30px;
	}
	.source,.date{
		font-size: 20px;
	}
	.lists-bottom{
		display: flex;
		margin-top: 10px;
	}
	.tab-bar ::-webkit-scrollbar{
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance:none;
		background-color:#000000;
	}
	.movieBox {
		width:94%;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
</style>
