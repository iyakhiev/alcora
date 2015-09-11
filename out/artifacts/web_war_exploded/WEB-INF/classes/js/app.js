/**
 * Created by iyakhiev on 09.09.15.
 */
'use strict'

var alcora = angular.module('alcora', [
    'ngRoute',
    'ngCookies',
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
        otherwise({
            redirectTo: '/register'
        });
}]);