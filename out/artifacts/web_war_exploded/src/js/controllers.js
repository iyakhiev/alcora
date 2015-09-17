/**
 * Created by iyakhiev on 01.09.15.
 */
'use strict';

var alcoraCtrls = angular.module('alcoraCtrls', []);

var postFunction = function($http, url, data, successCallback, errorCallback) {
    var req = {
        method: "POST",
        url: url,
        data: data,
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8'
        }
    };

    $http(req).
        success(function (data, status, headers, config) {
            if (successCallback != undefined) {
                successCallback(data, status, headers, config);
            } else {
                console.log("success:", data, status);
            }
        }).
        error(function (data, status, headers, config) {
            if (errorCallback != undefined) {
                errorCallback(data, status, headers, config);
            } else {
                console.log("error:", data, status);
            }
        });
};

alcoraCtrls.controller('LoginCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {
        $scope.auth = {
            error: false,
            loading: false,
            wrongPass: false,
            notActivated: false,
            notRegistered: false
        };

        $scope.login = function() {
            $scope.auth.error = false;
            $scope.auth.loading = true;
            $scope.auth.wrongPass = false;
            $scope.auth.notActivated = false;
            $scope.auth.notRegistered = false;

            var data = "mail=" + $scope.auth.mail + "&password=" + $scope.auth.password;
            console.log("data:" + data);
            postFunction($http, '/web_war_exploded/login', data, function(data) {
                console.log("success:", data);
                $scope.auth.loading = false;
                if(data.login == 1) {
                    $location.path('/cabinet');
                } else {
                    if(data.login == -1) {
                        $scope.auth.wrongPass = true;
                    } else {
                        if(data.login == 2) {
                            $scope.auth.notActivated = true;
                        } else {
                            $scope.auth.notRegistered = true;
                        }
                    }
                }
            }, function(data, status) {
                console.log("error:", data, status);
                $scope.auth.loading = false;
                $scope.auth.error = true;
            });
        };
    }]);

alcoraCtrls.controller('RegisterCtrl', ['$scope', '$http', '$location',
    function($scope, $http, $location) {
        $scope.userInfo = {
            error: false,
            loading: false,
            mailRegistered: false
        };

        $scope.register = function() {
            $scope.userInfo.error = false;
            $scope.userInfo.loading = true;
            $scope.userInfo.mailRegistered = false;

            var data = "action=check&mail=" + $scope.userInfo.mail;
            console.log("data:" + data);
            postFunction($http, '/web_war_exploded/register', data, function(data) {
                console.log("success:", data);
                if("check" in data && data.check == 0) {
                    data = "action=adduser&mail=" + $scope.userInfo.mail + "&password=" + $scope.userInfo.password
                        + "&userName=" + $scope.userInfo.userName;
                    console.log("data:" + data);
                    postFunction($http, '/web_war_exploded/register', data, function(data) {
                        console.log("success:", data);
                        $scope.userInfo.loading = false;
                    }, function(data) {
                        console.log("error:", data);
                        $scope.userInfo.error = true;
                        $scope.userInfo.loading = false;
                    });
                } else {
                    $scope.userInfo.loading = false;
                    $scope.userInfo.mailRegistered = true;
                }
            }, function(data) {
                console.log("error:", data);
                $scope.userInfo.error = true;
                $scope.userInfo.loading = false;
            });
        };
    }]);

alcoraCtrls.controller('CabinetCtrl', ['$scope',
    function($scope) {

    }]);

alcoraCtrls.controller('QuestionaryCtrl', ['$scope', '$sce',
    function($scope, $sce) {
        $scope.questionary = {
            gender: 'male',
            age: "0",
            growth: "0",
            weight: "0",
            agesList: (Array.from(Array(76).keys(), x => x + 15)),
            growthList: (Array.from(Array(151).keys(), x => x + 100)),
            weightList: (Array.from(Array(201).keys(), x => x + 30)),
            undesirableProducts: [
                { title: "Нежелательные продукты",
                    list: [
                        {
                            title: "Продукты, вызывающие неприязнь",
                            list: [
                                {
                                    title: "Фрукты и ягоды",
                                    list: [
                                        {
                                            title: "Яблоки",
                                            list: []
                                        },
                                        {
                                            title: "Груши",
                                            list: []
                                        },
                                        {
                                            title: "Мандарины",
                                            list: []
                                        },
                                        {
                                            title: "Апельсины",
                                            list: []
                                        }
                                    ]
                                },
                                {
                                    title: "Овощи",
                                    list: [
                                        {
                                            title: "Помидоры",
                                            list: []
                                        },
                                        {
                                            title: "Огурцы",
                                            list: []
                                        },
                                        {
                                            title: "Картофель",
                                            list: []
                                        },
                                        {
                                            title: "Репа",
                                            list: []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: "Продукты, вызывающие аллергию",
                            list: [
                                {
                                    title: "Фрукты и ягоды",
                                    list: [
                                        {
                                            title: "Персик",
                                            list: []
                                        },
                                        {
                                            title: "Слива",
                                            list: []
                                        },
                                        {
                                            title: "Вишня",
                                            list: []
                                        },
                                        {
                                            title: "Черешня",
                                            list: []
                                        }
                                    ]
                                },
                                {
                                    title: "Овощи",
                                    list: [
                                        {
                                            title: "Капуста",
                                            list: []
                                        },
                                        {
                                            title: "Хрен",
                                            list: []
                                        },
                                        {
                                            title: "Укроп",
                                            list: []
                                        },
                                        {
                                            title: "Репа",
                                            list: []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }]);