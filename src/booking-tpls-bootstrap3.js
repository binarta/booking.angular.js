angular.module("bin.booking").run(["$templateCache", function($templateCache) {$templateCache.put("bin-booking-edit.html","<form name=\"form\" ng-submit=\"submit()\"><div class=\"bin-menu-edit-body\"><bin-violations src=\"violations\" fade-after=\"7000\" code-prefix=\"booking.params\"></bin-violations><div class=\"form-group\"><label for=\"bin-booking-url\" i18n=\"\" code=\"booking.params.url\" read-only=\"\" ng-bind=\"::var\"></label><div class=\"input-group\"><div class=\"input-group-addon\"><i class=\"fa fa-globe\"></i></div><input type=\"text\" id=\"bin-booking-url\" class=\"form-control\" name=\"url\" ng-model=\"fields.url\" placeholder=\"{{::var}}\" i18n=\"\" code=\"booking.params.url.placeholder\" read-only=\"\"></div></div><div class=\"form-group\"><div class=\"checkbox-switch\"><input type=\"checkbox\" id=\"bin-booking-discount-active\" ng-model=\"fields.discountActive\"> <label for=\"bin-booking-discount-active\"></label> <span i18n=\"\" code=\"booking.config.is-discount-active\" read-only=\"\" ng-bind=\"var\"></span></div></div></div><div class=\"bin-menu-edit-actions\"><button type=\"submit\" class=\"btn btn-primary\" i18n=\"\" code=\"clerk.menu.save.button\" read-only=\"\" ng-disabled=\"working\"><span ng-show=\"working\"><i class=\"fa fa-spinner fa-spin fa-fw\"></i></span> <span ng-bind=\"::var\"></span></button> <button type=\"reset\" class=\"btn btn-default\" ng-click=\"close()\" i18n=\"\" code=\"clerk.menu.cancel.button\" read-only=\"\" ng-bind=\"::var\" ng-disabled=\"working\"></button></div></form>");
$templateCache.put("bin-booking.html","<div class=\"bin-widget\"><div class=\"container\"><bin-edit><bin-edit-actions><bin-edit-action action=\"$ctrl.openSettings()\" icon-class=\"fa-cog\" i18n-code=\"booking.config.change.params\"></bin-edit-action></bin-edit-actions><bin-edit-body ng-if=\"$ctrl.editing || $ctrl.config.url\"><div ng-if=\"!$ctrl.config.url\" class=\"alert alert-warning\"><span i18n=\"\" code=\"booking.params.url.warning\" ng-bind=\"::var\" read-only=\"\"></span> <a ng-click=\"$ctrl.openSettings()\" i18n=\"\" code=\"booking.params.url.click.to.activate\" ng-bind=\"::var\" read-only=\"\"></a></div><h1 i18n=\"\" code=\"booking.title\" ng-bind=\"var\"></h1><form name=\"form\" ng-submit=\"$ctrl.submit()\"><div class=\"row hidden-xs\"><div class=\"col-sm-3\"><label for=\"binBookingArrivalDate\" i18n=\"\" code=\"booking.arrival-date\" ng-bind=\"var\"></label></div><div class=\"col-sm-3\"><label for=\"binBookingDepartureDate\" i18n=\"\" code=\"booking.departure-date\" ng-bind=\"var\"></label></div><div ng-if=\"$ctrl.config.params.discountActive\" class=\"col-sm-3\"><label for=\"binBookingDiscountCode\" i18n=\"\" code=\"booking.discount-code\" ng-bind=\"var\"></label></div><div class=\"col-sm-3\"></div></div><div class=\"row\"><div class=\"form-group col-xs-12 col-sm-3\"><label for=\"binBookingArrivalDate\" class=\"visible-xs\" i18n=\"\" code=\"booking.arrival-date\" ng-bind=\"var\"></label> <input class=\"form-control\" id=\"binBookingArrivalDate\" change=\"$ctrl.onArrivalChange(newValue, oldValue)\" ng-model=\"$ctrl.arrivalDate\" moment-picker=\"$ctrl.arrivalDate\" format=\"DD/MM/YYYY\" min-view=\"year\" max-view=\"day\" start-view=\"month\" min-date=\"$ctrl.minArrivalDate\" required=\"\"></div><div class=\"form-group col-xs-12 col-sm-3\"><label for=\"binBookingDepartureDate\" class=\"visible-xs\" i18n=\"\" code=\"booking.departure-date\" ng-bind=\"var\"></label> <input class=\"form-control\" id=\"binBookingDepartureDate\" ng-model=\"$ctrl.departureDate\" moment-picker=\"$ctrl.departureDate\" format=\"DD/MM/YYYY\" min-view=\"year\" max-view=\"day\" start-view=\"month\" min-date=\"$ctrl.minDepartureDate\" required=\"\"></div><div class=\"form-group col-xs-12 col-sm-3\" ng-if=\"$ctrl.config.params.discountActive\"><label for=\"binBookingDiscountCode\" class=\"visible-xs\" i18n=\"\" code=\"booking.discount-code\" ng-bind=\"var\"></label> <input type=\"text\" class=\"form-control\" id=\"binBookingDiscountCode\" ng-model=\"$ctrl.discountCode\"></div><div class=\"form-group col-xs-12 col-sm-3\"><button type=\"submit\" class=\"btn btn-primary btn-block\" i18n=\"\" code=\"booking.btn-submit\" ng-bind=\"var\"></button></div></div></form></bin-edit-body></bin-edit></div></div>");}]);