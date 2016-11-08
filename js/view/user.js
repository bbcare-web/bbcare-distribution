bbcare.util.importPkg("control","User");
bbcare.view.user={};

bbcare.view.user.init=function(){
	var params={
		name:,
		tel:,
	}
	
	var user=new bbcare.control.User();
	user.addUser(params,function(success,data,message){
		if(success){
			console.log(data);
		}else{
			
		}
	})
	
}
