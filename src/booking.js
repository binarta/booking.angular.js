(function (angular) {
    angular.module('bin.booking', ['binarta-applicationjs-angular1'])
        .service('binBooking', ['binarta', BinBookingService])
        .component('binBooking', new BookingComponent());

    var defaultDateFormat = 'YYYY-MM-DD';
    var defaultLocaleParamName = 'Language';
    var defaultArrivalParamName = 'Arrival';
    var defaultDepartureParamName = 'Departure';
    var defaultDiscountParamName = 'DiscountCode';
    var defaultUrl = 'https://reservations.cubilis.eu/HOTEL-ID/Rooms/Select'; //Existing hotel-id = 6331

    function BinBookingService(binarta) {
        var bookingConfigCode = 'booking.config';

        this.updateConfig = function (config, response) {
            if (!isUrlValid(config.url)) response.error('url.invalid');
            else {
                var value = {
                    url: config.url
                };
                if (config.params) value.params = config.params;


                binarta.application.config.addPublic({
                    id: bookingConfigCode,
                    value: value
                }, response);
            }
        };

        this.findConfig = function (callback) {
            return binarta.application.config.findPublic(bookingConfigCode, function (config) {
                callback(config || {});

                // if (!config) callback({});
                // else callback(JSON.parse(config));
            });
        };

        function isUrlValid(url) {
            return url && (url.substring(0, 7) == 'http://' || url.substring(0, 8) == 'https://');
        }
    }

    function BookingComponent() {
        this.templateUrl = 'bin-booking.html';
        this.controller = ['$scope', '$window', 'binBooking', 'moment', 'binarta', binComponentController(function ($scope, $window, binBooking, moment, binarta) {
            var $ctrl = this;
            $ctrl.minArrivalDate = moment();
            $ctrl.minDepartureDate = moment().add(1, 'days');
            $scope.arrivalDate = moment().add(1, 'days');
            $scope.departureDate = moment().add(3, 'days');

            $ctrl.submit = function () {
                binBooking.findConfig(function (config) {
                    var params = config.params || {};
                    var dateFormat = params.dateFormat || defaultDateFormat;
                    var url = config.url;
                    var localeParam = params.locale || defaultLocaleParamName;
                    var arrivalParam = params.arrival || defaultArrivalParamName;
                    var departureParam = params.departure || defaultDepartureParamName;
                    var discountParam = params.discount || defaultDiscountParamName;

                    var arrivalDate = moment($scope.arrivalDate).format(dateFormat);
                    var departureDate = moment($scope.departureDate).format(dateFormat);

                    url += getQueryStringSeperator(url) + localeParam + '=' + binarta.application.localeForPresentation();
                    url += getQueryStringSeperator(url) + arrivalParam + '=' + arrivalDate;
                    url += getQueryStringSeperator(url) + departureParam + '=' + departureDate;
                    if ($scope.discountCode) url += getQueryStringSeperator(url) + discountParam + '=' + $scope.discountCode;
    
                    $window.open(url);
                });
            };

            function getQueryStringSeperator(url) {
                return url.indexOf('?') === -1 ? '?' : '&';
            }
        })];
    }
})(angular);