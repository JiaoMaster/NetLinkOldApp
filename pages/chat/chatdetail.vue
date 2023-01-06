<template>
	<view style="background-color: #f4f4f4;">
		<view class="content">
			<view class="topbar_size">
			<headbar title = "帖子"></headbar>
			</view>
			<u-toast ref="uToast"
					 ></u-toast>
					 
			<view style="background-color: #ffffff;">
				<view>
					
				</view>
				<view class="text_title">
					 <u--text
					 v-if="chatdetail.title != ''"
					:text="chatdetail.title"
					bold
					size="30"
					></u--text>
					<u--text
					v-if="chatdetail.title == ''"
					text="语音详细"
					bold
					size="30"
					></u--text>
				</view>
				<u-divider  lineColor="#e7dcdc"></u-divider>
				<view style="margin-left: 0%;">
					<u-cell
								:title="'作者：'+chatdetail.username"
								:label="chatdetail.create_time"
								:border = "false"
								size = "large"
							>
						<u-avatar :text="vname"
						slot="icon"
						size="50"
						fontSize="30"
						randomBgColor></u-avatar>
						</u-cell>
				</view>
				<view  class="content">
					
					<view style="margin-left: 0px;" v-if="chatdetail.content != ''">
						<text>{{chatdetail.content}}</text>
					</view>
					<view v-if="chatdetail.content == ''">
						<button @tap="playVoice">播放录音</button>
						<button @tap="stopVoice">停止播放</button>
					</view>
				</view>
			</view>
			<view style="background-color: #ffffff;">
				<view style="margin-left: 10px;margin-right: 10px;">
					<u-album :urls="imageList" :multipleSize="albumwidth" space=3></u-album>
				</view>
			</view>
			<text class="tleft">写评论:</text>
			 <view style="background-color: #ffffff;border-radius: 40rpx 40rpx 40rpx 40rpx;">
			<u--textarea  v-model="mycom"  count maxlength=64></u--textarea>
			<view style="padding: 20px;">
				<u-button type="primary" text="发表" @click="sendcommit"></u-button>
			</view>
			</view>
			 
			<text class="tleft">评论区:</text>
			<view style="background-color: #ffffff;border-radius: 40rpx 40rpx 40rpx 40rpx;">
				<view  v-for="(item, index) in commits" :key="index" >
					<uni-card style="font-size: 20px;" :title="'评论人：' + item.username" :extra="timestampToTime(item.create_time)">
						<text style="font-size: 25px;">{{item.content}}</text>
						<template v-slot:actions>
								<view class="card-actions">
									<view style="float: right;" @click="tocommit(item.id,item.content,item.username,item.create_time)">
										<uni-icons type="chatbubble" size="30" color="#999"></uni-icons>
										<text style="font-size: 20px;">评论</text>
									</view>
								</view>
							</template>
					</uni-card>
				</view>
				<u-empty
				        mode="list"
						textSize="20px"
						v-show="commits == null "
				>
				</u-empty>
			</view>
			
		    
		</view>
	</view>
	
</template>

<script>
	import headbar from "@/components/headbar.vue"
	import UniCard from "@/uni_modules/uni-card/components/uni-card/uni-card"
	import wxyAudio from '@/uni_modules/wxy-audio/components/wxy-audio/wxy-audio.vue'
	
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	
	innerAudioContext.autoplay = true;
	export default {
		data(){
				return{
					title : "社交",
					Ttitle: "",
					context : '1hello',
					chatdetail: {},
					mycom:"",
					commits:{},
					token:"",
					id:"",
					success:{
						type: 'success',
						title: '发表成功',
						message: "发表成功",
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
					},
					warn:{
						type: 'error',
						icon: false,
						title: '发表失败',
						message: '发表失败,未登录',
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/error.png'
					},
					audiopath:"",
					imageList:[],
					albumwidth:150,
					vname:""
				}
			},
		onPullDownRefresh() {
			uni.stopPullDownRefresh()
		},
		components:{
			headbar,
			UniCard,
			wxyAudio
		},
		onInit() {
			
		},
		onShow() {
			let that = this
			uni.getSystemInfo({
			    success: function (res) {
			        console.log(res.windowWidth);	
					that.albumwidth = (res.windowWidth)/2.5
			    }
			});
		},
		onUnload() {
			let that = this
			if (that.audiopath != ""){
				uni.removeSavedFile({
					filePath:that.audiopath,
					success: (res) => {
						console.log("ok")
						console.log(res)
					},
					fail(res) {
						console.log("fail")
						console.log(res)
					}
				})
			}
			},
		watch:{
			chatdetail(newName, oldName){
				
			}
		},
		onLoad:function(option) {
			let that = this
			this.id = option.id
			console.log(this.id)
			uni.getStorage({
				key: 'token',
				success: function(res) {
					that.token = res.data

				}
			})
			uni.request({
				url:'http://101.42.237.62:8080/api/question/get_question_detail/'+that.id,
				method:'post',
				header: {
				'Authorization': 'Bearer ' + that.token,
				},
				success(res) {
					that.chatdetail = res.data.question_info
					that.chatdetail.create_time = that.timestampToTime(that.chatdetail.create_time)
					that.imageList = that.chatdetail.image_list.split('+')
					for (let i = 0;i < that.imageList.length;i++){
						that.imageList[i] = 'http://101.42.237.62:8080/objects/' + that.imageList[i]
					}
					uni.request({
						url:'http://101.42.237.62:8080/api/user/get_user_NickName/'+res.data.question_info.username,
						method:'POST',
						success(r) {
							that.chatdetail.username = r.data.user.nickName
							that.vname = that.chatdetail.username.slice(0,1)
						},
						fail(r) {
							console.log(r)
						}
					})
					if(that.chatdetail.title == ""){
						uni.downloadFile({
							url:'http://101.42.237.62:8080/down?url='+that.chatdetail.audio_path,
							success(res){
								that.audiopath = res.tempFilePath
								console.log(that.audiopath)
							}
							
						})
					}
				},
				fail(res) {
					console.log(res)
				}
			})
			uni.request({
				url:'http://101.42.237.62:8080/api/commit/get_commit/'+that.id,
				method:'post',
				data:{
					
				},
				header: {
				},
				success(res) {
					that.commits = res.data.data
					console.log(res)
				}
			})
		},
			methods: {
				tocommit(id,con,user,time){
					uni.setStorage({
						key:'comcon',
						data:con,
					})
					uni.setStorage({
						key:'comuser',
						data:user,
					})
					uni.setStorage({
						key:'comtime',
						data:time,
					})
					uni.navigateTo({
						url:"./commit?id="+id,
						animationType: 'pop-in',
						animationDuration: 200,
						fail(res) {
							console.log(res)
						}
					})
				},
				playVoice() {
					console.log('播放录音');
					if (this.audiopath) {
						innerAudioContext.src = this.audiopath;
						innerAudioContext.play();
					}
				},
				stopVoice(){
					console.log('暂停播放录音');
					innerAudioContext.src = this.audiopath;
					innerAudioContext.pause();
				},
				er(errMsg){
					console.log(errMsg)
				},
				timestampToTime (time) {// 时间戳为10位需*1000，时间戳为13位的话不需乘1000
					time = time.replace("T"," ")
					time = time.replace("Z"," ")
					return time
				},
				get_token(){
					uni.getStorage({
						key: 'token',
						success: function(res) {
							this.token = res.data
						}
					})
				},
				scrolltolower() {
					this.loadmore()
				},
				sendcommit(){
					let that = this
					uni.getStorage({
						key: 'token',
						success: function(res) {
							that.token = res.data
						}
					})
					if(that.mycom == ""){
						return
					}
					if(that.token == ""){
						that.$refs.uToast.show({
							...that.warn,
							
						})
						uni.navigateTo({
							url:"../user/login",
						}) 
						return
					}
					
					uni.request({
						url:'http://101.42.237.62:8080/api/commit/send_commit',
						method:'post',
						data:{
							post_id:that.id,
							content:that.mycom,
							to_user:that.chatdetail.username
						},
						header: {
						'Authorization': 'Bearer ' + that.token,
						},
						success(res) {
							that.mycom = ''
							uni.request({
								url:'http://101.42.237.62:8080/api/commit/get_commit/'+that.id,
								method:'post',
								data:{
									
								},
								header: {
								},
								success(res) {
									that.commits = res.data.data
								}
							})
							that.$refs.uToast.show({
							...that.success,
							})
						}
					})
					
					
				}	
			},
	}
</script>

<style lang="scss">
	.topbar_size{
		margin-bottom: 0px;
	}	
	.text_title {
	font-family: arial;
	font-size: 40px;
	color: #369;
	padding-bottom: 3px;
	margin-left: 10px;
	margin-right: 10px;
	margin-bottom: 2px;
	}
	.src{
		color: #929394;
		margin-top: 10px;
		font-size: 20px;
		margin-bottom: 15px;
	}
	.tleft{
		font-family: "Lato", Helvetica Neue, Helvetica, Arial, sans-serif;
		border-left: 3px solid #21759b;
		padding-left: 3px;
		color: #929394;
		margin-bottom: 25px;
		margin-top: 10px;
		font-size: 25px;
		text-align:left;
	}
	.time{
		color: #929394;
		margin-top: 10px;
		font-size: 20px;
		margin-bottom: 30px;
	}
	.content{
		color: #696969;
		word-break: break-all;
		font-size: 25px;
		margin-left: 10px;
		margin-right: 10px;
		margin-bottom: 5px;
	}
</style>
