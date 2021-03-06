(function (angular) {
    var bookingConfigCode = 'booking.config';
    angular.module('bin.booking', ['binarta-applicationjs-angular1', 'momentx', 'notifications'])
        .service('binBooking', ['binarta', 'editModeRenderer', '$rootScope', '$q', BinBookingService])
        .component('binBooking', new BookingComponent());

    function BinBookingService(binarta, editModeRenderer, $rootScope, $q) {
        var self = this;

        this.updateConfig = function (config, response) {
            if (config.url === '' || isUrlValid(config.url)) {
                var value = {
                    url: config.url,
                    discountActive: config.discountActive,
                };

                value.params = config.params ? config.params : {};


                binarta.application.config.addPublic({
                    id: bookingConfigCode,
                    value: value
                }, response);
            } else {
                response.error('url.invalid');
            }
        };

        this.findConfig = function (callback) {
            return binarta.application.config.findPublic(bookingConfigCode, function (config) {
                if (!config) callback({});
                else if (typeof config === 'string') callback(JSON.parse(config));
                else callback(config);
            });
        };

        this.openSettings = function () {
            var scope = $rootScope.$new();
            scope.fields = {};
            scope.lang = binarta.application.localeForPresentation();

            self.findConfig(function (config) {
                scope.fields = config;
            });

            scope.close = function () {
                editModeRenderer.close();
            };

            scope.submit = function () {
                scope.violations = [];

                scope.working = true;

                self.updateConfig(scope.fields, {
                    success: function () {
                        scope.working = false;
                        scope.close();
                    }
                });
            };

            editModeRenderer.open({
                templateUrl: 'bin-booking-edit.html',
                scope: scope
            });
        };

        function isUrlValid(url) {
            return url && (url.substring(0, 7) == 'http://' || url.substring(0, 8) == 'https://');
        }
    }

    function BookingComponent() {
        this.templateUrl = 'bin-booking.html';
        this.bindings = {
            dateFormat: '@',

            localeParamName: '@',
            arrivalParamName: '@',
            departureParamName: '@',
            discountParamName: '@',

            baseUrl: '@',
            hotelId: '@',
            urlSuffix: '@',
            completeUrlWithoutParams: '@',

            discountCode: '@',
        };
        this.controller = ['$scope', '$window', 'binBooking', 'moment', 'binarta', 'topicRegistry',
            binComponentController(function ($scope, $window, binBooking, moment, binarta, topicRegistry) {
                var $ctrl = this;
                var binBookingObserver;

                $ctrl.$onInit = function () {
                    $ctrl.minArrivalDate = moment();
                    $ctrl.minDepartureDate = moment().add(1, 'days');
                    $ctrl.arrivalDate = moment().add(1, 'days');
                    $ctrl.departureDate = moment().add(3, 'days');


                    if ($ctrl.completeUrlWithoutParams && ($ctrl.baseUrl || $ctrl.hotelId || $ctrl.urlSuffix)) {
                        throw new Error('You should use a completeUrlWithoutParams or the separete segments baseUrl, hotelId, urlSuffix');
                    }

                    binBookingObserver = binarta.application.config.observePublic(bookingConfigCode, function () {
                        $ctrl.findConfig();
                    });
                };

                $ctrl.findConfig = function() {
                    binBooking.findConfig(function (_config_) {
                        $ctrl.config = _config_;

                        if ($ctrl.config.params === undefined) {
                            $ctrl.config.params = {};
                        }
                    });
                }

                $ctrl.openSettings = binBooking.openSettings;

                $ctrl.submit = function () {

                    if ($ctrl.completeUrlWithoutParams)
                        $ctrl.url = $ctrl.completeUrlWithoutParams;
                    else if ($ctrl.baseUrl && $ctrl.hotelId && $ctrl.urlSuffix)
                        $ctrl.url = $ctrl.composeBookingUrl($ctrl.baseUrl, $ctrl.hotelId, $ctrl.urlSuffix);
                    else if ($ctrl.config.url)
                        $ctrl.url = $ctrl.config.url;
                    else throw new Error('Should have a URL to navigate too');

                    $ctrl.dateFormat = $ctrl.config.params.dateFormat || $ctrl.dateFormat || 'YYYY-MM-DD';
                    $ctrl.localeParamName = $ctrl.config.params.locale || $ctrl.localeParamName || 'Language';
                    $ctrl.arrivalParamName = $ctrl.config.params.arrival || $ctrl.arrivalParamName || 'Arrival';
                    $ctrl.departureParamName = $ctrl.config.params.departure || $ctrl.departureParamName || 'Departure';
                    $ctrl.discountParamName = $ctrl.config.params.discount || $ctrl.discountParamName || 'Discount';

                    var arrivalDate = moment($ctrl.arrivalDate).format($ctrl.dateFormat);
                    var departureDate = moment($ctrl.departureDate).format($ctrl.dateFormat);

                    $ctrl.url += getQueryStringSeperator($ctrl.url) + $ctrl.localeParamName + '=' + binarta.application.localeForPresentation();
                    $ctrl.url += getQueryStringSeperator($ctrl.url) + $ctrl.arrivalParamName + '=' + arrivalDate;
                    $ctrl.url += getQueryStringSeperator($ctrl.url) + $ctrl.departureParamName + '=' + departureDate;

                    if ($ctrl.discountCode) {
                        $ctrl.url += getQueryStringSeperator($ctrl.url) + $ctrl.discountParamName + '=' + $ctrl.discountCode;
                    }

                    $window.open($ctrl.url);
                };

                $ctrl.composeBookingUrl = function (baseUrl, hotelId, urlSuffix) {
                    if (baseUrl[baseUrl.length - 1] !== '/') {
                        throw new Error('Base URL should end with a "/"');
                    }

                    if (urlSuffix[0] === '/') {
                        throw new Error('urlSuffix can\'t start with a "/"');
                    }

                    return baseUrl + hotelId + '/' + urlSuffix;
                }

                $ctrl.onArrivalChange = function(oldVal, newVal) {
                    var arrivalTime = new Date($ctrl.arrivalDate).getTime();
                    var departureTime = new Date($ctrl.departureDate).getTime();

                    if (departureTime < arrivalTime) {
                        $ctrl.departureDate = $ctrl.arrivalDate.clone();
                    }
                };

                $ctrl.$onDestroy = function () {
                    topicRegistry.unsubscribe('edit.mode', editModeListener);
                    binBookingObserver.disconnect();
                };

                topicRegistry.subscribe('edit.mode', editModeListener);

                function getQueryStringSeperator(url) {
                    return url.indexOf('?') === -1 ? '?' : '&';
                }

                function editModeListener(editing) {
                    $ctrl.editing = editing;
                }
            })];
    }
})(angular);