/**
 * Created by iyakhiev on 09.09.15.
 */
'use strict'

var alcora = angular.module('alcora', [
    'ngRoute',
    'ngCookies',
    'ngSanitize',
    'ui.select',
    'alcoraCtrls'
]);

alcora.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/login', {
            templateUrl: 'src/partials/login.html',
            controller: 'LoginCtrl'
        }).
        when('/register', {
            templateUrl: 'src/partials/register.html',
            controller: 'RegisterCtrl'
        }).
        when('/cabinet', {
            templateUrl: 'src/partials/cabinet.html',
            controller: 'CabinetCtrl'
        }).
        when('/questionary', {
            templateUrl: 'src/partials/questionary.html',
            controller: 'QuestionaryCtrl'
        }).
        when('/ruleseditor', {
            templateUrl: 'src/partials/rules_editor.html',
            controller: 'RulesEditorCtrl'
        }).
        otherwise({
            redirectTo: '/ruleseditor'
        });
}]);