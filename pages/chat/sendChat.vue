<template>
	<view  style="background-color: #f4f4f4;">
		<headbar :title = "title"></headbar>
		<u-toast ref="uToast" 
		         type= 'success'
				 title= '发表成功'
				 message= "发表成功"
				 iconUrl= 'https://cdn.uviewui.com/uview/demo/toast/success.png'
				 ></u-toast>
		<view class="text">
			<text>选择频道:</text>		 
			 <u-radio-group
				v-model="radiovalue1"
				placement="column"
			  >
				<u-radio
				  :customStyle="{marginBottom: '8px'}"
				  v-for="(item, index) in radiolist1"
				  :key="index"
				  :label="item.name"
				  :name="item.name"
				  @change="radioChange(item.id)"
				>
				</u-radio>
			  </u-radio-group>
			  <view>
			  	<button @click="changemode()">{{textmode==1?'点击切换语音模式':'点击切换文字模式'}}</button>
			  </view>
		</view>	
		<view v-if="textmode==1">
			<view class="text">
				<text>题目:</text>
				<u--textarea v-model="Ctitle" placeholder="请输入内容" placeholderClass="text-a" autoHeight maxlength="20" count
				></u--textarea>
			    <br></br>
			</view>		
			<view class="text">
				<text>内容:</text>
				<u--textarea v-model="Ccontent" placeholder="请输入内容" placeholderClass="text-a" height="100" count ></u--textarea>
				<br></br>
			</view>
			
			<view class="text">
				<text>添加照片</text>
				<view>
					<u-upload
							:fileList="fileList1"
							@afterRead="afterRead"
							@delete="deletePic"
							name="1"
							maxSize="52085760"
							:maxCount="3"
							width= "300rpx"
							height="300rpx"
						></u-upload>
				</view>
			</view>
			<view class="btn">
				<u-button @click="send" color="#ffaa7f" size="large" text="点击发表"></u-button>
			</view>
		</view>
		
		<view v-if="textmode==0">
			<u-count-down  ref="countDown" :time="60 * 10000" format="mm:ss" :autoStart= "false" @change="rollchange()"></u-count-down>
			<u-line-progress ref="roll" :percentage="rollPercent" :showText="false"></u-line-progress>
			<button @tap="startRecord">开始录音</button>
			<button @tap="endRecord">停止录音</button>
			<button @tap="playVoice">播放录音</button>
			<button @tap="stopVoice()">停止播放</button>
			<button @tap="uploadRecord(voicePath)">上传录音</button>
		</view>
	</view>
</template>

<script>
	import headbar from "@/components/headbar.vue"

	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	
	innerAudioContext.autoplay = true;
	export default {
			data() {
				return {
					title : "社交",
					Ctitle: '',
					Ccontent: '',
					username: "",
					token:"",
					warn:{
						type: 'success',
						title: '发表成功',
						message: "发表成功",
						iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
					},
					addrDel:"",
					nowCh:"1",
					radiolist1: [{
					            name: '本地频道',
								id:"1",
					            disabled: false
					          },
					            {
					              name: '我要发声',
								  id:"2",
					              disabled: false
					            },
					            {
					              name: '全球频道',
								  id:"3",
					              disabled: false
					            }
					          ],
					          // u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
					radiovalue1: '本地频道',
					textmode:1,
					fileList1: [],
					ImageList1: [],
					ImageList1string:'',
					voicePath: '',
					rollPercent: 0,
					time:0,
					issend:false
				}
			},
			onBackPress() {
				let that = this
				if (that.issend == false) {
					let i = 0
					let that = this
					for (;i < that.ImageList1.length;i++){
					   console.log(that.ImageList1[i])
						uni.request({
							url:'http://101.42.237.62:8080/objects/'+that.ImageList1[i],
							method:"DELETE"
						})
					}
				}
			},
			onLoad() {
				let self = this;
				recorderManager.onStop(function (res) {
					self.voicePath = res.tempFilePath;
				});
			},
			onShow() {
				let that = this
				uni.getStorage({
					key: 'token',
					success: function(res) {
						that.token = res.data
					}
				})
			},
			onPullDownRefresh() {
				location.reload();
				uni.stopPullDownRefresh()
			},
			methods:{
				   enddelet(){
					   
				   },
				// 删除图片
					deletePic(event) {
						
						let that = this
						
						this[`fileList${event.name}`].splice(event.index, 1)
						var s = String(event.file.url).split('/')
						uni.request({
							url:'http://101.42.237.62:8080/objects/'+s[s.length - 1],
							method:"DELETE"
						})
						
					},
					// 新增图片
					async afterRead(event) {
						// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
						let that = this
						console.log(event)
						let lists = [].concat(event.file)
						let fileListLen = this[`fileList${event.name}`].length
						lists.map((item) => {
							this[`fileList${event.name}`].push({
								...item,
								status: 'uploading',
								message: '上传中'
							})
						})
						for (let i = 0; i < lists.length; i++) {
							const result = await this.uploadFilePromise(lists[i].url)
							let Imagename = result.split('/')
							that.ImageList1.push(Imagename[Imagename.length-1])
							console.log(this.ImageList1)
							let item = this[`fileList${event.name}`][fileListLen]
							this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
								status: 'success',
								message: '',
								url: result
							}))
							fileListLen++
						}
					}, 
					uploadFilePromise(url) {
						return new Promise((resolve, reject) => {
							var s = String(url).split('/')
							let a = uni.uploadFile({
								url: 'http://101.42.237.62:8080/objects/'+s[s.length - 1], // 仅为示例，非真实的接口地址
								filePath: url,
								name: 'file',
								formData: {
									user: 'test'
								},
								success: (res) => {
									setTimeout(() => {
										console.log(res)
										resolve(res.data)
									}, 1000)
								}
							});
						})
					},
				startRecord() {
					console.log('开始录音');
					const options = {
									  duration: 600000,
									  
									}
					
					this.$refs.countDown.reset();
					recorderManager.start();
					this.$refs.countDown.start(options);
				},
				endRecord() {
					console.log('录音结束');
					recorderManager.stop();
					this.$refs.countDown.pause();
					
				},
				playVoice() {
					console.log('播放录音');
					if (this.voicePath) {
						innerAudioContext.src = this.voicePath;
						innerAudioContext.play();
					}
				},
				stopVoice(){
					console.log('暂停播放录音');
					innerAudioContext.src = this.voicePath;
					innerAudioContext.pause();
				},
				rollchange(){
					this.rollPercent += 0.16
				},
				uploadRecord(tempFilePath) {
					let that = this
					console.log(that.nowCh)
					uni.getLocation({
								    type: 'gcj02',
									geocode:true,//设置该参数为true可直接获取经纬度及城市信息
								    success: function (res) {
										that.addrDel = res.address;
										uni.getStorage({
											key: 'token',
											success: function(res) {
												console.log(res.data)
												that.token = res.data
											}
										})
										console.log(tempFilePath)
										const uploadTask = uni.uploadFile({
										url: 'http://101.42.237.62:8080/upload/'+that.nowCh+'/'+that.addrDel.country+that.addrDel.province+that.addrDel.city,
										filePath: tempFilePath, //录音结束后返回的临时路径
										name: 'picFile', // 文件对应的 key值对象名称
										header: {
											'content-type': 'multipart/form-data',
											'Authorization': 'Bearer ' + that.token
										},
										success: (res) => {
										console.log('-----上传成功-----'+JSON.stringify(res.data))
										// json字符串转对象，JSON.parse( res.data )
										that.$refs.countDown.reset();
										that.rollPercent = 0
										uni.navigateBack({
											
										})
										},
										fail: (res) => {
										console.log('-----上传失败-----'+JSON.stringify(res))
										this.$refs.countDown.reset();
										this.rollPercent = 0
										}
										})
								    },
									fail: function (res) {
										console.log(res)
									}
								});
							    // tempFilePath为RecorderManager对象返回的录音文件临时地址
								
							},
				changemode(){
					this.textmode = !this.textmode
				},
				 radioChange(n) {
					 
				        console.log('groupChange', n);
						this.nowCh = n
				      },
				send(){ 
					let that = this
					console.log(that.nowCh)
					if(that.textmode == 1 && (that.Ctitle == '' || that.Ccontent == '')) {
						uni.showModal({
							title: "无法发帖",
							content: "请输入标题和内容",
							showCancel: true,
							confirmText: "确定"
						})
						return
					}
					
					uni.getLocation({
								    type: 'gcj02',
									geocode:true,//设置该参数为true可直接获取经纬度及城市信息
								    success: function (res) {
										that.addrDel = res.address;
										uni.getStorage({
											key: 'token',
											success: function(res) {
												console.log(res.data)
												that.token = res.data
											}
										})
										for (let i = 0;i < that.ImageList1.length;i++){
										   that.ImageList1string += that.ImageList1[i]
										   if (i != that.ImageList1.length - 1) {
											   that.ImageList1string += '+'
										   }
										   console.log(that.ImageList1string)
										}
										uni.request({
											url:'http://101.42.237.62:8080/api/question/send_question',
											method:'post',
											data:{
												community_id:that.nowCh,
												title:that.Ctitle,
												location:that.addrDel.country+that.addrDel.province+that.addrDel.city,
												content:that.Ccontent,
												image_list:that.ImageList1string
											},
											header: {
											'Authorization': 'Bearer ' + that.token,
											},
											success(res) {
												console.log(res)
												console.log(that.nowCh)
												that.issend = true
												uni.switchTab({
													url:"/pages/chat/chat"
												})
											}
										})
								    },
									fail: function (res) {
										uni.request({
											url:'http://101.42.237.62:8080/api/question/send_question',
											method:'post',
											data:{
												community_id:that.nowCh,
												title:that.Ctitle,
												location:"中国",
												content:that.Ccontent,
												image_list:that.ImageList1string
											},
											header: {
											'Authorization': 'Bearer ' + that.token,
											},
											success(res) {
												console.log(res)
												console.log(that.nowCh)
												that.issend = true
												uni.switchTab({
													url:"../tools/tools"
												})
											}
										})
									}
								});
				}
			},
			components:{
				headbar,

			},
		}
</script>

<style>
	.text-a{
		font-size: 25px;
	}
	.text{
		margin-top: 20px;
		margin-bottom: 10px;
		margin-left: 8px;
		margin-right: 8px;
		font-size: 30px;
		background-color: #ffffff;
		border-radius: 40rpx 40rpx 40rpx 40rpx;
	}
	.content{
		margin-top: 10px;
		margin-bottom: 10px;
		margin-left: 10px;
		margin-right: 10px;
		font-size: 30px;
	}
	.btn{
		margin-right: 10px;
		width: 150px;
		height: 100px;
		float: right;
		color: #000;
	}
</style>
