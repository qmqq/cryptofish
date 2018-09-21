var myApp = angular.module('myApp', []);

myApp.controller('MainController', function($scope) {
   //登录弹窗
    $("#login").click(function () {
        $(".hide-center").fadeIn("slow");
        $(".overCurtain").fadeIn("slow");
    })
    $("#close").click(function () {
        $(".hide-center").fadeOut("slow")
        $(".overCurtain").fadeOut("slow")
    })
});
