rootApp.factory('authService', function($http, $routeParams, $cookieStore, $location){
  var currentUser = $cookieStore.get('user') || { username: ''};
	function getUsername(){
		var username;
    try{
      username = $cookieStore.get('username');
    }catch(e){
      return null;
    }
    return username;
	}
	function getId(){
		var id;
    try{
      id = $cookieStore.get('id');
    }catch(e){
      return null;
    }
    return id;
	}
	function getToken(){
		var token;
		try{
			token = $cookieStore.get('token');
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
				$cookieStore.put("token", data.token);
				$cookieStore.put("username", data.username);
				$cookieStore.put("id", data.id);
				if($routeParams.redirect)
					window.location = "#" + decodeURIComponent($routeParams.redirect);
				else
					window.location = "#/";
			}else{
				alert("登陆失败");
			}
    },
    signout: function() {
			$cookieStore.remove("token");
			$cookieStore.remove("username");
			$cookieStore.remove("id");
			$location.path($location.path());
    }
  };
});

