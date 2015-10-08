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
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
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

var cloneObject = function(obj, isHashKey) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if ((isHashKey || attr != '$$hashKey') && obj.hasOwnProperty(attr)) {
            copy[attr] = obj[attr];
        }
    }
    return copy;
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

        $scope.login = function () {
            $scope.auth.error = false;
            $scope.auth.loading = true;
            $scope.auth.wrongPass = false;
            $scope.auth.notActivated = false;
            $scope.auth.notRegistered = false;

            var data = "mail=" + $scope.auth.mail + "&password=" + $scope.auth.password;
            console.log("data:" + data);
            postFunction($http, '/web_war_exploded/login', data, function (data) {
                console.log("success:", data);
                $scope.auth.loading = false;
                if (data.login == 1) {
                    $location.path('/cabinet');
                } else {
                    if (data.login == -1) {
                        $scope.auth.wrongPass = true;
                    } else {
                        if (data.login == 2) {
                            $scope.auth.notActivated = true;
                        } else {
                            $scope.auth.notRegistered = true;
                        }
                    }
                }
            }, function (data, status) {
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

        $scope.register = function () {
            $scope.userInfo.error = false;
            $scope.userInfo.loading = true;
            $scope.userInfo.mailRegistered = false;

            var data = "action=check&mail=" + $scope.userInfo.mail;
            console.log("data:" + data);
            postFunction($http, '/web_war_exploded/register', data, function (data) {
                console.log("success:", data);
                if ("check" in data && data.check == 0) {
                    data = "action=adduser&mail=" + $scope.userInfo.mail + "&password=" + $scope.userInfo.password
                        + "&userName=" + $scope.userInfo.userName;
                    console.log("data:" + data);
                    postFunction($http, '/web_war_exploded/register', data, function (data) {
                        console.log("success:", data);
                        $scope.userInfo.loading = false;
                    }, function (data) {
                        console.log("error:", data);
                        $scope.userInfo.error = true;
                        $scope.userInfo.loading = false;
                    });
                } else {
                    $scope.userInfo.loading = false;
                    $scope.userInfo.mailRegistered = true;
                }
            }, function (data) {
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
                    goals_list: ['Развитие физической силы', 'Развитие мышечной массы', 'Улучшение рельефа фигуры']
                },
                {
                    title: 'Косметология',
                    goals_list: ['Здоровое лицо', 'Здоровая кожа (целлюлит)', 'Красивые волосы']
                },
                {
                    title: 'Питание',
                    goals_list: ['Сбалансированное здоровое питание', 'Контроль веса (похудение)']
                },
                {
                    title: 'Профилактика',
                    goals_list: ['Профилактика заболеваний', 'Укрепление иммунитета']
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
        $scope.checked_area = '';
        $scope.category_disabled = true;
        $scope.op_buttons_disabled = true;
        $scope.is_buttons_disabled = true;
        $scope.category = {};
        $scope.last_categories = [];
        $scope.operations = [];
        $scope.operations_codes = {
            bkt: [],
            logic: []
        };
        $scope.then_operations = [];
        $scope.then_operation = {};
        $scope.rule_parts = {
            if: [
                {
                    class: "operation-rule-block",
                    content: "(",
                    id: "1",
                    'operation-word': "",
                    type: "bkt"
                },
                {
                    category_id: "591",
                    class: "",
                    content: 'Развитие мышечной массы"',
                    id: 6,
                    'operation-word': "ЕСТЬ"
                },
                {
                    class: "operation-rule-block",
                    content: "ИЛИ",
                    id: "3",
                    'operation-word': "",
                    type: "logic"
                },
                {
                    category_id: "592",
                    class: "",
                    content: 'Улучшение рельефа фигуры"',
                    id: 6,
                    'operation-word': "ЕСТЬ"
                },
                {
                    class: "operation-rule-block",
                    content: ")",
                    id: "2",
                    'operation-word': "",
                    type: "bkt"
                },
                {
                    class: "operation-rule-block",
                    content: "И",
                    id: "4",
                    'operation-word': "",
                    type: "logic"
                },
                {
                    category_id: "593",
                    class: "",
                    content: 'Питание"',
                    id: 7,
                    'operation-word': "НЕТ"
                }
            ],
            then: [
                {
                    category_id: "594",
                    class: "",
                    content: 'Здоровое сбалансированное питание"'
                },
                {
                    class: "operation-rule-block",
                    content: "ИЛИ",
                    id: "3",
                    'operation-word': "",
                    type: "logic"
                },
                {
                    category_id: "595",
                    class: "",
                    content: 'Контроль веса (похудение)"'
                }
            ]
        };
        $scope.sortable_options_if = {
            containment: '#if-sortable-container'
        };
        $scope.sortable_options_then = {
            containment: '#then-sortable-container'
        };
        $scope.sortable_options_operations = {
            containment: '#op-sortable-container',
            clone: true
        };
        $scope.check_rule_error = '';
        $scope.check_rule_error_color = '';

        var data = "action=getoperations";
        postFunction($http, '/web_war_exploded/rules', data, function (data) {
            console.log("data:", data);
            if (data != null && data.list != null && data.list != "empty" && data.list.length > 0) {
                for (var o in data.list) {
                    var obj = {
                        id: data.list[o].id,
                        class: 'operation-rule-block',
                        type: data.list[o].type,
                        'operation-word': '',
                        content: data.list[o]['description']
                    };
                    if (data.list[o].type == 'then') {
                        $scope.then_operations.push(obj);
                    } else {
                        $scope.operations.push(obj);
                        if (data.list[o].type == 'logic' || data.list[o].type == 'bkt') {
                            $scope.operations_codes[data.list[o].type].push(obj.id);
                        }
                    }
                }
                console.log("$scope.operations:", $scope.operations, $scope.operations_codes);
            } else {
                $scope.operations = [];
            }
        }, function (data, status) {
            console.log("error in getoperations:", data, status);
        });

        $scope.refreshCategory = function (category) {
            if (category.length > 0) {
                var data = "action=getcategories&category=" + category;
                postFunction($http, '/web_war_exploded/rules', data, function (data) {
                    console.log("success:", data);
                    if (data != null && data.list != null && data.list != "empty" && data.list.length > 0) {
                        $scope.categories = data.list;
                    } else {
                        $scope.categories = [];
                    }
                }, function (data, status) {
                    console.log("error in getcategories:", data, status);
                });
            }
        };

        $scope.cleanRuleParts = function (area) {
            $scope.rule_parts[area] = [];
        };

        $scope.deleteRulePart = function (key, area) {
            $scope.rule_parts[area].splice(key, 1);
        };

        $scope.operation_button = function (button) {
            console.log("button:", button);
            if (button.id == 6 || button.id == 7) {

            } else {
                var obj = cloneObject(button, false);
                if ($scope.checked_area == 'checked-if') {
                    $scope.rule_parts.if.push(obj);
                }
                if ($scope.checked_area == 'checked-then') {
                    $scope.rule_parts.then.push(obj);
                }
            }
        };

        var add_to_lc = function (obj) {
            if ($scope.last_categories.length > 20) {
                $scope.last_categories.pop();
            }
            $scope.last_categories.unshift(obj);
        };

        $scope.select_option = function (option) {
            var obj = {
                category_id: option.id,
                class: '',
                content: '"' + option['description'] + '"'
            };

            if ($scope.checked_area == 'checked-if') {
                var id = $('.active-operation-block').data('id');
                if (id == 6 || id == 7) {
                    obj.id = id;
                    obj['operation-word'] = $('.active-operation-block').text().trim();
                    $scope.rule_parts.if.push(obj);
                    add_to_lc(obj);
                }
            }
            if ($scope.checked_area == 'checked-then') {
                $scope.rule_parts.then.push(obj);
                add_to_lc(obj);
            }
            $scope.category = {};
            console.log("select_option:", obj);
        };

        $scope.select_lc = function (lc) {
            var obj = cloneObject(lc, false);
            if ($scope.checked_area == 'checked-if') {
                if (("id" in obj) && (obj.id == 6 || obj.id == 7)) {
                    $scope.rule_parts.if.push(obj);
                    console.log("select_lc:", obj);
                }
            }
            if ($scope.checked_area == 'checked-then') {
                delete obj.id;
                delete obj['operation-word'];
                $scope.rule_parts.then.push(obj);
                console.log("select_lc:", obj);
            }
        };

        $scope.check_rule_part = function (array, ind, isBktOpened) {
            console.log("check_rule_part", array, ind, isBktOpened);
            ind = ind ? ind : 0;
            var rule_structure = "",
                part_operation_id = "",
                isBktOpened = isBktOpened || false;
            for (var i = ind; i < array.length; i++) {
                if (array[i].class.trim() == '') {
                    if (rule_structure == '' || rule_structure[rule_structure.length - 1] != '0') {
                        rule_structure += '0';
                    } else {
                        return {
                            error: "Операции и категории должны чередоваться!",
                            code: 4,
                            index: i,
                            array: array,
                            rule_structure: rule_structure
                        };
                    }
                } else {
                    if ($scope.operations_codes.logic.indexOf(array[i].id) < 0) {
                        if ($scope.operations_codes.bkt.indexOf(array[i].id) < 0) {
                            return {error: "Неизвестная операция!", code: 5, index: i, array: array};
                        } else {
                            if (array[i].content.trim() == '(') {
                                if (rule_structure != '' && rule_structure[rule_structure.length - 1] == '0') {
                                    return {
                                        error: "Выражение в скобках не может начинаться после категории!",
                                        code: 14,
                                        index: i,
                                        array: array,
                                        rule_structure: rule_structure
                                    };
                                } else {
                                    var result = $scope.check_rule_part(array, (i + 1), true);
                                    if (result && 'index' in result && parseInt(result.index) > 0 && !("error" in result)) {
                                        rule_structure += '0';
                                        i = result.index;
                                    } else {
                                        return result;
                                    }
                                }
                            } else {
                                if (array[i].content.trim() == ')') {
                                    if (isBktOpened) {
                                        if (rule_structure == '') {
                                            return {
                                                error: "Нет выражения в скобках!",
                                                code: 8,
                                                index: i,
                                                array: array
                                            };
                                        } else {
                                            if (rule_structure[rule_structure.length - 1] == '0') {
                                                if (rule_structure.length > 1) {
                                                    return {index: i};
                                                } else {
                                                    return {
                                                        error: "Выражения в скобках не может состоять только из категории!",
                                                        code: 10,
                                                        index: i,
                                                        array: array
                                                    };
                                                }
                                            } else {
                                                return {
                                                    error: "Выражения в скобках должно оканчиваться категорией!",
                                                    code: 9,
                                                    index: i,
                                                    array: array
                                                };
                                            }
                                        }
                                    } else {
                                        return {
                                            error: "Лишняя закрывающаяся скобка!",
                                            code: 7,
                                            index: i,
                                            array: array
                                        };
                                    }
                                } else {
                                    return {error: "Неизвестная операция!", code: 6, index: i, array: array};
                                }
                            }
                        }
                    } else {
                        if (part_operation_id == '' || part_operation_id == array[i].id) {
                            if (rule_structure == '') {
                                return {
                                    error: "Правило должно начинаться с категории!",
                                    code: 2,
                                    index: i,
                                    array: array
                                };
                            } else {
                                if (rule_structure[rule_structure.length - 1] == '0') {
                                    part_operation_id = array[i].id.trim();
                                    rule_structure += '1';
                                } else {
                                    return {
                                        error: "Операции и категории должны чередоваться!",
                                        code: 3,
                                        index: i,
                                        array: array
                                    };
                                }
                            }
                        } else {
                            return {error: "Различаются знаки в одном блоке!", code: 1, index: i, array: array};
                        }
                    }
                }
            }
            if (isBktOpened) {
                return {error: "Не найдена закрывающаяся скобка!", code: 12};
            }
            if (rule_structure != '' && rule_structure[rule_structure.length - 1] != '0') {
                return {error: "В конце правила должна быть категория!", code: 13};
            }
            if (array.length < 1) {
                return {error: "Введите правило!", code: 11};
            }
            return true;
        };

        $scope.save_rule = function () {
            console.log("rule_parts:", $scope.rule_parts);
            var result = $scope.check_rule_part($scope.rule_parts.if);
            console.log("call of check_rule_part:", result);
            if ("selected" in $scope.then_operation) {
                if (result == true) {
                    $scope.check_rule_error = "Правило составлено верно!";
                    result = $scope.check_rule_part($scope.rule_parts.then);
                    if (result == true) {
                        $scope.check_rule_error = "Правило составлено верно!";
                        $scope.check_rule_error_color = 'bg-primary';
                    } else {
                        $scope.check_rule_error = ("error" in result) ? "'THEN': " + result.error : "'THEN': Правило состалено неверно!";
                        $scope.check_rule_error_color = 'bg-danger';
                    }
                } else {
                    $scope.check_rule_error = ("error" in result) ? "'IF': " + result.error : "'IF': Правило состалено неверно!";
                    $scope.check_rule_error_color = 'bg-danger';
                }
            } else {
                $scope.check_rule_error = "Выберите действие для условия!";
                $scope.check_rule_error_color = 'bg-danger';
            }
        };

        $('.rules-editor').on('click', function (e) {
            var id = $(e.target).closest('.rule-editing-block').attr('id')
                || $(e.target).closest('.ui-select-container').attr('id');
            var //isSelect = $(e.target).hasClass('select-options'),
            //deleteRule = $(e.target).hasClass('delete-rule') || $(e.target).hasClass('delete-rule-part'),
                isOperation = $(e.target).hasClass('operation-block');

            //if (!(id == 'then-operations-select' || id == 'categories-select' || isSelect || isOperation || deleteRule)) {
            //$scope.category_disabled = true;
            //$scope.op_buttons_disabled = true;
            //$scope.is_buttons_disabled = true;
            //$scope.checked_area = '';
            //$scope.$apply();
            //}
            if (isOperation) {
                if ($(e.target).data('id') == 6 || $(e.target).data('id') == 7) {
                    $scope.category_disabled = false;
                    $scope.$apply();
                    if ($('.active-operation-block').data('id') != $(e.target).data('id')) {
                        $('.active-operation-block').toggleClass('active-operation-block');
                    }
                    $('.operation-block[data-id=' + $(e.target).data('id') + ']').toggleClass('active-operation-block');
                    return;
                }
            }
            if (id == 'if-sortable-container') {
                $scope.checked_area = 'checked-if';
                if ($('.active-operation-block').data('id') != 6 && $('.active-operation-block').data('id') != 7) {
                    $scope.category_disabled = true;
                }
                $scope.op_buttons_disabled = false;
                $scope.is_buttons_disabled = false;
                $scope.$apply();
                return;
            }
            if (id == 'then-sortable-container') {
                $scope.checked_area = 'checked-then';
                $scope.category_disabled = false;
                $scope.op_buttons_disabled = false;
                $scope.is_buttons_disabled = true;
                $scope.$apply();
                return;
            }
        });
    }]);