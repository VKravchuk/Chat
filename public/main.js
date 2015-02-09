var app = angular.module('chatApp',[]);

app.factory('socket', function(){
    var socket = io();
    return socket;
});

app.controller('chatCtrl', function($scope, socket){
    //variable declaration
    $scope.msgs = [];
    $scope.msg = {};
    $scope.inputMsg = '';
    $scope.users = [];
    $scope.typingUsr = '';
    $scope.newUsr = '';
    $scope.discUsr = '';


    var typingTimeout;//variable for cleaning timeout of typing

    //Checking is user type something
    $scope.$watch(function(scope) { return scope.inputMsg },
        function() {
            socket.emit('typing');
        }
    );

    //Send message
    $scope.sendMsg = function(){
        socket.emit('send message', $scope.inputMsg);
        $scope.inputMsg = '';
    };

    //Add new user
    $scope.setUser = function(){
        if($scope.user){
            $scope.userExist = true;
            socket.emit('set user', $scope.user);
        }
    };
    //Get messages
    socket.on('get message', function(data){
        $scope.msgs.push(data);
        $scope.$digest();
    });

    //Write if another user type something
    socket.on('typing', function(usr){
        $scope.typingUsr = usr;
        $scope.$digest();
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(function(){
            $scope.typingUsr = '';
            $scope.$digest();
        }, 1000);
    });

    //Write if new user join the chat
    socket.on('get new user', function(usr){
        $scope.newUsr = usr;
        $scope.$digest();
        setTimeout(function(){
            $scope.newUsr = '';
            $scope.$digest();
        }, 3000);
    });

    //Write if new user disconnected from the chat
    socket.on('user disconnect', function(usr){
        $scope.discUsr = usr;
        $scope.$digest();
        setTimeout(function(){
            $scope.discUsr = '';
            $scope.$digest();
        }, 3000);
    });


});

app.directive('fileInput', ['$parse', function($parse){
    return{
        restrict: 'A',
        link : function(scope, elm, attrs){
            elm.bind('change',function(){
                $parse(attrs.fileInput)
                    .assign(scope, elm[0].files);
                scope.$apply();
            })
        }
    }
}]);
app.controller('uploader',['$scope', '$http', function($scope, $http){
    $scope.upload = function(){
        console.log($scope.files);
        var fd = new FormData();
        angular.forEach($scope.files, function(file){
            fd.append('file', file);
        });
        $http.post('/', fd,{
            transformRequest: angular.identity,
            headers:{'Content-Type': undefined}
        }).success(function(d){
            console.log(d)
        })
    }
}]);
