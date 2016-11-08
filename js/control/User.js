bbcare.util.importPkg("store","User");

bbcare.control.User=bbcare.comm.Object.extend({
	init:function(){
		this.store=new bbcare.store.User();
	},
	addUser:function(params,callback){
		this.store.addUser(params,function(success,data){
			callback(success,data);
		})
	},
		
})
