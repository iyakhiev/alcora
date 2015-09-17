<%-- Created by IntelliJ IDEA. --%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html ng-app="alcora">
<head>
  <title></title>
  <link rel="stylesheet" type="text/css" href="src/components/fontawesome/css/font-awesome.min.css">
  <link rel="stylesheet" type="text/css" href="src/components/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="src/css/style.css">
</head>
<body>
<div class="container-fluid" ng-view>
</div>
<script src="src/components/angular/angular/angular.min.js"></script>
<script src="src/components/angular/angular-route/angular-route.min.js"></script>
<script src="src/components/angular/angular-resource/angular-resource.min.js"></script>
<script src="src/components/angular/angular-cookies/angular-cookies.min.js"></script>
<script src="src/js/app.js"></script>
<script src="src/js/controllers.js"></script>
<script src="src/components/jquery/jquery.min.js"></script>
<script src="src/components/bootstrap/js/bootstrap.min.js"></script>
</body>
</html>