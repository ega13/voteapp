
angular.module('pollApp')

    .controller('MenuController', ['$scope', '$rootScope', 'menuFactory', '$localStorage', '$sessionStorage', function($scope, $rootScope, menuFactory,  $localStorage, $sessionStorage) {

        $scope.showMenu = false;
        $scope.message = "Loading ...";
        $scope.polls= [];
        menuFactory.getPolls()
            .then(
                function(response) {
                    if (response.data.user){
                        
                        $localStorage.$default({'user': response.data.user.username, 'twitter_id':response.data.user.id_str});
                        
                        
                        for(var key in  response.data.user){
                             //console.log(' response.data.user[key]  = '+ key + ' == ' +  response.data.user[key]);
                         }

                         console.log('$scope.loggedIn = ' + $rootScope.loggedIn);
                        $rootScope.refreshing_user();
                        
                        console.log('response.data.user = ' + response.data.user);
                        console.log('response.data.user.username = ' + response.data.user.username)
                        
                    };
                        
                        
                    $scope.polls = response.data.db_polls;
                    $scope.showMenu = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
        );
    }])
    
    
    .controller('PollController', ['$scope', '$stateParams', '$state', 'menuFactory', 'voteFactory',  '$localStorage', '$sessionStorage',  'Socialshare',  function($scope, $stateParams, $state, menuFactory, voteFactory, $localStorage, $sessionStorage,  Socialshare) {
       
       $scope.loggedIn = false;
      
        $scope.twitter_share = function(){
            Socialshare.share({
                    'provider': 'twitter',
                      'attrs': {
                        'socialshareText': 'Vote for this poll on Fcc-vote'
                        
                      }
            });
        }
    
       

        if($localStorage.user){
            $scope.loggedIn = true;
            $scope.username = $localStorage.user;
        }
       
       
       
        $scope.user_ip = {};
        menuFactory.get_user_ip()
            .then(
                function(response) {
                    $scope.user_ip = response.data.user_ip;
                    //console.log ('$scope.user_ip = '+ $scope.user_ip);
                    poll_view();
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
        );

        $scope.delete_poll = function(){
            var send_obj = {"name": $scope.poll.name};
            var yes_delete = confirm('you really wont delete this poll: '+ send_obj.name + "?");
            if (yes_delete){
                $state.go('app');
                 //console.log ("deleting poll" + ' =  ' + send_obj.name);
                 voteFactory.deleteVote(send_obj);
            }

        }
        
        $scope.own_option = '';
        $scope.item = '';
        $scope.show_custom = false;
        $scope.can_show_custom = false;
        
        if($localStorage.user){
            $scope.can_show_custom = true;
            console.log('$scope.can_show_custom = ' +$scope.can_show_custom);
        }
        
        $scope.show_own_option = function(item, own_option){
            $scope.item = item;
            $scope.own_option = own_option;
            if ($scope.item == "I'd like a custom option" && $scope.can_show_custom){
                $scope.show_custom = true;
            }else{
                $scope.show_custom = false;
            }
            //console.log ('$scope.item = '+ $scope.item);
            //console.log ('$scope.own_option = '+ $scope.own_option);
        }

        $scope.send_my_vote = function(own_option){
            
            var voted_arr = $scope.poll.voted;
            
            function check(){
                if ($scope.poll.voted){
                    for (var i in voted_arr){
                        //console.log ('this.user_ip = '+$scope.user_ip);
                        if(voted_arr[i] == $scope.user_ip){
                            return true;
                        }
                         return false;
                    }
                    return false;
                }    
            }
            

            if ( check() ){
                alert('you already voted');
            }else{
                if ($scope.item == "I'd like a custom option"){
                    $scope.own_option = own_option.replace(/\s+/g,' ').substr(0,30);
                    var send_obj = {"name": $scope.poll.name, "vote":$scope.own_option};
                    $scope.show_custom = false;
                    alert('you vote for: '+ $scope.own_option);
                }else{
                   var send_obj = {"name": $scope.poll.name, "vote":$scope.vote_option.vote}; 
                   alert('you vote for: '+ $scope.vote_option.vote)
                }
                voteFactory.sendVote(send_obj)
                    .then(function(response) {
                           poll_view();
                        }, 
                        function(response) { 
                            alert('Error on server')
                    });
                
            }
        }

        $scope.poll = [];
        $scope.showPoll = false;
        $scope.showDonut = false;
        $scope.message = "Loading ...";
        
        var poll_view = function(){
            menuFactory.getPoll($stateParams.id)
                .then(
                    function(response){
                        $scope.vote_option = {"options":[]};
                        $scope.poll = response.data;
                        $scope.labels = [];
                        $scope.data = [];
                        
                        if ($scope.poll.voted.length > 0) {
                            $scope.showDonut = true;
                            //console.log("$scope.poll.voted  =  " + $scope.poll.voted )
                            
                        } else {
                            //console.log("noo voted   =  " + $scope.poll.voted)
                            
                        }

                        for (var key in $scope.poll.options){
                            $scope.vote_option.options.push(key);
                            $scope.labels.push(key);
                            $scope.data.push($scope.poll.options[key]) ;
                        }
                        if ($scope.can_show_custom){$scope.vote_option.options.push("I'd like a custom option")};
                        $scope.options = {legend: {display: true}};
                        $scope.showPoll = true;
                        if ($scope.poll.owner == $scope.user_ip){
                            $scope.showDeleteButton = true;
                        }
                    }
                );
        }
            
            
    }])

    .controller('NewpollController', ['$scope', '$stateParams', '$state', 'newpollFactory', 'menuFactory', function($scope, $stateParams, $state, newpollFactory, menuFactory) {
    
        $scope.user_ip = {};
        menuFactory.get_user_ip()
            .then(
                function(response) {
                    $scope.user_ip = response.data.user_ip;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
        );
        
        $scope.polls= [];
        menuFactory.getPolls()
            .then(
                function(response) {
                    $scope.polls = response.data;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
        );
        
        function chek_text(obj) {
            var new_arr = [];
            var arr = obj.split(/\r|\n/);
            //var arr = obj.split(' ');
            for (var i in arr){
                var str = arr[i].replace(/\s+/g,' ').substr(0,30);
                if (str.length>0){
                    new_arr.push(str)
                }
            }
            return new_arr;
        };

        $scope.addNewPoll  = function(){
                var polls_arr = [];
                for (var i in $scope.polls){
                    polls_arr.push($scope.polls[i].name);
                }
                function already_in(item) {
                    return item != $scope.new_poll_name;
                }
                if ( polls_arr.every(already_in) ){
                        if($scope.new_poll_name && $scope.new_poll_options && $scope.new_poll_options[0].split(/\r|\n/).length > 1){
                            var options_arr = chek_text( $scope.new_poll_options[0] );
                            var new_poll_name_checked =  $scope.new_poll_name.replace(/\s+/g,' ').substr(0,30);
                            //console.log("new_poll_name_checked  =  "  + new_poll_name_checked );
                            var options_obj = {};
                            for (var i in options_arr){
                                if (!options_obj[options_arr[i]] && options_arr[i].length>0){
                                    options_obj[options_arr[i]] = 0;
                                }
                            }
                            var new_poll_obj ={"name":new_poll_name_checked, "options":options_obj, "owner": $scope.user_ip};
                            $scope.sendPoll = newpollFactory.sendPoll(new_poll_obj);
                            $state.go('app.poll', {id: new_poll_name_checked});
                        }else{
                             alert('please type name or 2 options')
                        }
                }else{
                    alert('already have this poll, choose anover name')
                }
            }


    }])

    .controller('MyPollsController', ['$scope','menuFactory', function($scope, menuFactory) {

        $scope.showMenu = false;
        $scope.message = "Loading ...";
        $scope.polls= [];
        menuFactory.getMyPolls()
            .then(
                function(response) {
                    $scope.polls = response.data;
                    $scope.showMenu = true;
                },
                function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                }
        );
    }])
    
    .controller('HeaderController', ['$scope', '$state', '$rootScope', '$localStorage', '$sessionStorage', 'Socialshare',  function ($scope, $state, $rootScope, $localStorage, $sessionStorage, Socialshare ) {


    
    $scope.loggedIn = false;
   
    
    
    for(var key in $localStorage){
        //console.log(' $localStorage[key]  = '+ key + ' == ' + $localStorage[key]);
    }
    
    
    
    
    
    
    $rootScope.refreshing_user = function () {
        //console.log('Doing refreshing_user');
        if($localStorage.user){
            $scope.loggedIn = true;
            $scope.username = $localStorage.user;
            //console.log('$localStorage = ' + $localStorage.user);
        }
     };
     
     if($localStorage.user){ $rootScope.refreshing_user() };
    
    $scope.logout = function () {
        $scope.loggedIn = false;
        console.log('Doing logout');
        delete $localStorage.user;
     };

        

    
}])



;