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

alcoraCtrls.controller('QuestionaryCtrl', ['$scope', '$http',
    function($scope, $http) {
        var caret_down = 'fa fa-caret-down',
            caret_right = 'fa fa-caret-right',
            radio = ['fa fa-circle-o', 'fa fa-check-circle'],
            checkbox = ['fa fa-square-o', 'fa fa-check-square'];

        var loading_id = 0;

        var checkItem = function (obj, listItem, action) {
            if (action == "check") {
                if (obj.checked.indexOf(listItem.id) < 0) {
                    obj.checked.push(listItem.id);
                }
            } else {
                var index = obj.checked.indexOf(listItem.id);
                if (index > -1) {
                    obj.checked.splice(index, 1);
                }
            }
        };

        var checkRadioItem = function (obj, listItem) {
            if (listItem.icon == radio[1]) {
                listItem.icon = radio[0];
            } else {
                listItem.icon = radio[1];
            }

            if (listItem.parent_id in obj.radio) {
                var list = obj.radio[listItem.parent_id];
                if (list.length > 0) {
                    if (list[0].id != listItem.id) {
                        list[0].icon = radio[0];
                        list.pop();
                        list.push(listItem);
                    } else {
                        list.pop();
                    }
                } else {
                    list.push(listItem);
                }
            } else {
                obj.radio[listItem.parent_id] = [];
                obj.radio[listItem.parent_id].push(listItem);
            }
        };

        $scope.questionary = {
            required_fields: ['anthropometry', 'meal_pattern', 'sleep_pattern', 'sports_experience', 'pernicious_habits',
                'training_frequency', 'training_day', 'doctor_visit_pattern'],
            gender: '0',
            age: "0",
            growth: "0",
            weight: "0",
            genderList: ["Мужской", "Женский"],
            agesList: (Array.from(Array(76).keys(), x => x + 15)),
            growthList: (Array.from(Array(151).keys(), x => x + 100)),
            weightList: (Array.from(Array(201).keys(), x => x + 30)),
            food: [
                {
                    level: 1,
                    title: "Нежелательные продукты",
                    id: 322,
                    showInner: "hideInnerList",
                    icon: caret_right,
                    list: {
                        "323": {
                            level: 2,
                            title: "Вызывающие неприязнь",
                            id: "323",
                            parent_id: "323",
                            showInner: null,
                            icon: "fa fa-caret-right",
                            list: [],
                            select_type: "none",
                            type_description: "category",
                            checked: []
                        },
                        "324": {
                            level: 2,
                            title: "Вызывающие аллергию",
                            id: "324",
                            parent_id: "324",
                            showInner: null,
                            icon: "fa fa-caret-right",
                            list: [],
                            select_type: "none",
                            type_description: "category",
                            checked: []
                        }
                    }
                }
            ],
            disease: [
                {
                    level: 1,
                    title: "Болезни",
                    id: 326,
                    showInner: null,
                    icon: caret_right,
                    list: [],
                    select_type: "none",
                    type_description: "category",
                    checked: [],
                    radio: {}
                }
            ],
            anthropometry: [
                {
                    level: 1,
                    title: "Антропометрия",
                    id: 494,
                    showInner: null,
                    icon: caret_right,
                    list: [],
                    select_type: "none",
                    type_description: "category",
                    checked: [],
                    radio: []
                }
            ],
            meal_pattern: [
                {
                    level: 1,
                    title: "Регулярность питания",
                    id: 503,
                    showInner: null,
                    icon: caret_right,
                    list: [],
                    select_type: "single",
                    type_description: "category",
                    checked: [],
                    radio: []
                }
            ],
            sleep_pattern: [
                {
                    level: 1,
                    title: "Сон",
                    id: 508,
                    showInner: null,
                    icon: caret_right,
                    list: [],
                    select_type: "single",
                    type_description: "category",
                    checked: [],
                    radio: []
                }
            ],
            sports_experience: [
                {
                    level: 1,
                    title: "Опыт занятий спортом",
                    id: 513,
                    showInner: null,
                    icon: caret_right,
                    list: [],
                    select_type: "single",
                    type_description: "category",
                    checked: [],
                    radio: []
                }
            ],
            pernicious_habits: [
                {
                    level: 1,
                    title: "Вредные привычки",
                    id: 518,
                    showInner: null,
                    icon: caret_right,
                    list: [],
                    select_type: "none",
                    type_description: "category",
                    checked: [],
                    radio: []
                }
            ],
            training_frequency: [
                {
                    level: 1,
                    title: "Ожидаемая частота тренировок в неделю",
                    id: 521,
                    showInner: null,
                    icon: caret_right,
                    list: [],
                    select_type: "single",
                    type_description: "category",
                    checked: [],
                    radio: []
                }
            ],
            doctor_visit_pattern: [
                {
                    level: 1,
                    title: "Регуляность посещения врача",
                    id: 584,
                    showInner: null,
                    icon: caret_right,
                    list: [],
                    select_type: "single",
                    type_description: "category",
                    checked: [],
                    radio: []
                }
            ],
            training_day: [
                {
                    level: 1,
                    title: "Свободные дни для занятий",
                    id: 527,
                    showInner: null,
                    icon: caret_right,
                    list: [],
                    select_type: "single",
                    type_description: "category",
                    checked: [],
                    radio: []
                }
            ],

            goals: [
                {
                    title: 'Спорт',
                    goals_list: [ 'Развитие физической силы', 'Развитие мышечной массы', 'Улучшение рельефа фигуры' ]
                },
                {
                    title: 'Косметология',
                    goals_list: [ 'Здоровое лицо', 'Здоровая кожа (целлюлит)', 'Красивые волосы' ]
                },
                {
                    title: 'Питание',
                    goals_list: [ 'Сбалансированное здоровое питание', 'Контроль веса (похудение)' ]
                },
                {
                    title: 'Профилактика',
                    goals_list: [ 'Профилактика заболеваний', 'Укрепление иммунитета' ]
                }
            ]
        };

        $scope.toggleList = function (listItem) {
            console.log("listItem:", listItem);
            if (listItem.showInner == null) {
                if (loading_id != listItem.id) {
                    loading_id = listItem.id;
                    var data = "id_parent=" + listItem.id;
                    console.log("data:" + data);
                    postFunction($http, '/web_war_exploded/questionary', data, function (data) {
                        console.log("success:", data);
                        if (data != null && data.list != null && data.list != "empty" && data.list.length > 0) {
                            for (var d in data.list) {
                                data.list[d]["level"] = listItem.level + 1;
                                data.list[d]["list"] = [];
                                data.list[d]["parent_id"] = data.list[d]["type_description"] == "food" ? listItem.parent_id : listItem.id;
                                if (data.list[d]["nodes"] == "null") {
                                    data.list[d]["showInner"] = "lastNode";
                                    data.list[d]["icon"] = listItem.select_type == 'single' ? radio[0] : checkbox[0];
                                    data.list[d]["selected"] = false;
                                } else {
                                    data.list[d]["showInner"] = null;
                                    data.list[d]["icon"] = caret_right;
                                }
                                listItem.list.push(data.list[d]);
                            }
                            listItem.showInner = "showInnerList";
                            listItem.icon = caret_down;
                        }
                    }, function (data) {
                        console.log("error:", data);
                    });
                }
            } else {
                if (listItem.showInner != "lastNode") {
                    if (listItem.showInner != "showInnerList") {
                        listItem.showInner = "showInnerList";
                        listItem.icon = caret_down;
                    } else {
                        listItem.showInner = "hideInnerList";
                        listItem.icon = caret_right;
                    }
                } else {
                    if (listItem.icon == radio[0] || listItem.icon == radio[1]) {
                        if (listItem['type_description'] == 'training_day') {

                        } else {
                            checkRadioItem($scope.questionary[listItem['type_description']][0], listItem);
                        }
                    }
                    if ((listItem.icon == checkbox[0] || listItem.icon == checkbox[1]) && listItem['type_description'] != 'anthropometry') {
                        if (listItem.icon == checkbox[1]) {
                            listItem.icon = checkbox[0];

                            if (listItem['type_description'] == 'food') {
                                checkItem($scope.questionary[listItem['type_description']][0].list[listItem.parent_id], listItem, "unblock");
                            } else {
                                checkItem($scope.questionary[listItem['type_description']][0], listItem, "unblock");
                            }
                        } else {
                            listItem.icon = checkbox[1];

                            if (listItem['type_description'] == 'food') {
                                checkItem($scope.questionary[listItem['type_description']][0].list[listItem.parent_id], listItem, "check");
                            } else {
                                checkItem($scope.questionary[listItem['type_description']][0], listItem, "check");
                            }
                        }
                    }
                }
            }
            console.log("obj:", $scope.questionary);
        };


        for (var r in  $scope.questionary.required_fields) {
            var obj = $scope.questionary[$scope.questionary.required_fields[r]][0];
            obj.title += " (обязательно для заполнения)";
            $scope.toggleList(obj);
        }
    }]);

alcoraCtrls.controller('RulesEditorCtrl', ['$scope', '$http',
    function($scope, $http) {
        $scope.disabled = false;
        $scope.category = {};

        $scope.refreshCategory = function(category) {
            if(category.length > 0) {
                var data = "category=" + category;
                postFunction($http, '/web_war_exploded/rules', data, function (data) {
                    console.log("success:", data);
                    if (data != null && data.list != null && data.list != "empty" && data.list.length > 0) {
                        $scope.categories = data.list;
                    } else {
                        $scope.categories = [];
                    }
                }, function (data, status) {
                    console.log("error:", data, status);
                });
            }
        };
    }]);