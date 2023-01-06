<script>
	export default {
		data() {
		  return {
		    value: "",
			username: "",
			password: "",
			token:"",
			isSocketOpen:false,  //socket是否打开
			pingpangTimes:null,  //socket心跳计时器
			sendaddrDel:"",
			addrDel:{}
		  };
		},
		onLaunch: function() {
			  
			console.log('App Launch')
			
		},
		onShow: function() {
			console.log('App Show')
            
			 
			
		},
		onHide: function() {
			console.log('App Hide')
			
		},
		
		
		
		
			
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
</style>