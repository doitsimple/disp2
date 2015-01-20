^^var port = global.port;$$
rootApp.factory('authService', function($http, $routeParams, $cookieStore, $location){
  var currentUser = $cookieStore.get('user') || { username: ''};
	function getUsername(){
		var username;
    try{
      username = $cookieStore.get('username^^=port$$');
    }catch(e){
      return null;
    }
    return username;
	}
	function getId(){
		var id;
    try{
      id = $cookieStore.get('id^^=port$$');
    }catch(e){
      return null;
    }
    return id;
	}
	function getToken(){
		var token;
		try{
			token = $cookieStore.get('token^^=port$$');
		}catch(e){
			return null;
		}
		return token;
	};
  return {
		getId: getId,
		getToken: getToken,
		getUsername: getUsername,
    signin: function(data) {
			if(data.token){
				$cookieStore.put("token^^=port$$", data.token);
				$cookieStore.put("username^^=port$$", data.username);
				$cookieStore.put("id^^=port$$", data.id);
				if($routeParams.redirect)
					window.location = "#" + decodeURIComponent($routeParams.redirect);
				else
					window.location = "#/";
			}else{
				alert("登陆失败");
			}
    },
    signout: function() {
			$cookieStore.remove("token^^=port$$");
			$cookieStore.remove("username^^=port$$");
			$cookieStore.remove("id^^=port$$");
			$location.path($location.path());
    }
  };
});

