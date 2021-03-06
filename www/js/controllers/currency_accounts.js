angular.module('generic-client.controllers.currency_accounts', [])

    .controller('CurrencyAccountsCtrl', function ($scope, $window, $ionicPopup, $ionicModal, $state, $stateParams, $ionicLoading, $translate, CurrencyAccounts, Conversions) {
        'use strict';

        $scope.listData = function () {
            CurrencyAccounts.list().success(
                function (res) {
                    var items = [];

                    for (var i = 0; i < res.data.length; i++) {
                        res.data[i].balance = Conversions.from_cents(res.data[i].balance);
                        items.push(res.data[i]);
                        console.log(res.data[i])
                    }

                    $scope.items = items;
                    $window.localStorage.setItem('myAccountTokens', JSON.stringify(items));
                    $scope.$broadcast('scroll.refreshComplete');
                }
            );
        };

        $scope.setToken = function (currency, account, issuer) {
            $ionicLoading.show({
                template: $translate.instant("LOADER_SWITCHING_ACCOUNT")
            });

            CurrencyAccounts.set(currency, account, issuer).then(function (res) {
                if (res.status === 200) {
                    $window.localStorage.setItem('myCurrency', JSON.stringify(res.data.data.currency));
                    $ionicLoading.hide();
                    $scope.listData();
                } else {
                    $ionicLoading.hide();
                    $ionicPopup.alert({title: $translate.instant("ERROR"), template: res.message});
                }
            }).catch(function (error) {
                $ionicPopup.alert({title: $translate.instant("AUTHENTICATION_ERROR"), template: error.message});
                $ionicLoading.hide();
            });
        };

        $scope.listData();
    });