bbcare.store.User=bbcare.comm.Store.extend({
	init:function(params){
		_this=this;
	},
	addUser:function(params,callback){
		bbcare.comm.post({
			url:base.url.user.addUser,
			data:params,
			success:function(data){
				callback(true,data);
			},
			error:function(state,message){
				callback(false,state,message);
			}
		})
	}
	
})
