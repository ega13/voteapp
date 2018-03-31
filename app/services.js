angular.module('pollApp')

    .service('menuFactory', ['$http', 'baseURL', function($http,baseURL) {
        var polls2 = [{name:'colors', number: 0}, {name:'car', number: 1}, {name:'food', number: 2}, {name:'drink', number: 3}];


        this.getPolls2 = function(){
            return polls;
        };
        this.getPoll2 = function (index) {
            return polls[index];

        };
        
        this.get_user_ip = function(){
            return $http.get('/getip');
        };
        
        this.getPolls = function(){
            return $http.get('/polls');
        };
        
        this.getPoll = function (index) {
            //console.log('hello 3');
            //console.log(index);
            return $http.get('/poll/'+ index);
        }  
        
        this.getMyPolls = function(){
            return $http.get('/mypolls');
        };
        

    }])
    
    .service('newpollFactory', ['$http', 'baseURL', function($http, baseURL) {


        this.sendPoll = function (obj) {
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

            $http({
                url: '/newpoll',
                method: "POST",
                data: obj
            })
            .then(function(response) {
                    // success
            }, 
            function(response) { // optional
                    // failed
            });

        };

    }])
    
    .service('voteFactory', ['$http', 'baseURL', function($http, baseURL) {
        
        function vote_fun (vote){
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $http({
                url: '/vote',
                method: "POST",
                data: vote
            })
            .then(function(response) {
               console.log("response in server") 
                return "response return in service";
            }, 
            function(response) { 
                // optional
                // failed
            });
        }
        
        this.sendVote = function (vote) {
                var req = {
                     method: 'POST',
                     url: '/vote',
                     headers: {'Content-Type':  "application/x-www-form-urlencoded"},
                     data: vote
                    }
                    return $http(req);
        };
        
        this.deleteVote = function (object) {
            
                        $http({
                            url: '/poll/'+ object.name,
                            method: 'DELETE',
                            data: {
                                id: object.id
                            },
                            headers: {
                                "Content-Type": "application/json;charset=utf-8"
                            }
                        }).then(function(res) {
                            console.log(res.data);
                        }, function(error) {
                            console.log(error);
                        });

        };
    }])
    

