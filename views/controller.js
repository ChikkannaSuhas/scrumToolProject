var app=angular.module('mainApp'),['ng-Route']);
app.config(function($routeProvider){
$routeProvider
.when('/',{templateUrl:'login.html'
	})
.when('/abc',{templateUrl:'login.html'
	})
.otherwise({
	redirectTo:'/'
});
});

app.controller('loginCtrl',function($scope,$location){
	$scope.update = function(login) {
                    $scope.master = angular.copy(login);
                     $http.post('/login', $scope.master)
                     .success(function (data) {
        if(data.status==200)
            console.log('im in')
             $location.path('/');
         })
})