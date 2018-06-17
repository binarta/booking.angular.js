
beforeEach(module('toggle.edit.mode'));
beforeEach(module('bin.booking'));

var binarta;
var validUrl = 'http://test.com';
var bookingConfigCode = 'booking.config';

describe('binBooking service', function () {
    var sut;

    beforeEach(inject(function (binBooking, _binarta_) {
        sut = binBooking;
        binarta = _binarta_;
        reset();
    }));

    describe('on update config', function () {
        it('update url', function () {
            sut.updateConfig({
                url: validUrl
            });

            binarta.application.config.findPublic(bookingConfigCode, function (actual) {
                expect(actual.url).toEqual(validUrl);
            });
        });

        it('url should be a valid url', function () {
            var errorSpy = jasmine.createSpy('error');

            sut.updateConfig({
                url: 'test'
            }, {
                    error: errorSpy
                });

            expect(errorSpy).toHaveBeenCalledWith('url.invalid');
        });

        it('update with params', function () {
            sut.updateConfig({
                url: validUrl,
                params: {
                    test: 'test'
                }
            });

            binarta.application.config.findPublic('booking.config', function (actual) {
                expect(actual).toEqual({
                    url: validUrl,
                    params: {
                        test: 'test'
                    }
                });
            });
        });

        it('update can have a success callback', function () {
            var successSpy = jasmine.createSpy('success');

            sut.updateConfig({
                url: validUrl
            }, {
                    success: successSpy
                });

            expect(successSpy).toHaveBeenCalled();
        });
    });

    describe('on find config', function () {
        it('when config has never be updated', function () {
            sut.findConfig(function (actual) {
                expect(actual).toEqual({});
            });
        });

        it('with config', function () {
            binarta.application.config.cache('booking.config', {
                url: validUrl
            });

            sut.findConfig(function (actual) {
                expect(actual).toEqual({
                    url: validUrl
                });
            });
        });
    });
});

describe('binBooking component', function () {
    var $ctrl;
    var moment, $componentController;
    var scope;
    var windowMock;
    var bookingBaseUrl = 'https://reservations.cubilis.eu/6331/Rooms/Select';
    var openUrlSpy, observePublicSpy;
    var bookingConfigCode;
    var binBooking;
    var genericMomentDate;
    var $rootScope;

    beforeEach(inject(function (_binarta_) {
        binarta = _binarta_;
        reset();
    }));

    beforeEach(inject(function (_$componentController_, _moment_, _$rootScope_, _binBooking_, _$timeout_) {
        moment = _moment_;
        $timeout = _$timeout_;
        $componentController = _$componentController_;
        binBooking = _binBooking_;
        $rootScope = _$rootScope_;
        genericMomentDate = '2019-08-05';

        bookingConfig = {
            params: {
                dateFormat: 'YYYY-MM-DD',
                locale: 'Language',
                departure: 'Departure',
                arrival: 'Arrival',
                discount: 'Discount',
            },
            url: bookingBaseUrl,
        };

        binBooking.updateConfig(JSON.parse(JSON.stringify(bookingConfig)));

        openUrlSpy = jasmine.createSpy('open');
        observePublicSpy = jasmine.createSpy('observePublic');

        windowMock = {
            open: openUrlSpy,
        };

        binartaMock = {
            application: {
                localeForPresentation: function () {
                    return 'nl-NL';
                },
                config: {
                    observePublic: observePublicSpy,
                },
            },
        };

        scope = $rootScope.$new();

        const momentFunc = function () {
            return moment(genericMomentDate);
        };

        momentMock = momentFunc;

        $ctrl = $componentController('binBooking', {
            $scope: scope,
            $window: windowMock,
            binarta: binartaMock,
            moment: momentMock,
        });
    }));

    describe('Initializing component -', function () {

        describe('Config loaded -', function () {

            beforeEach(function () {
                $ctrl.$onInit();
            });

            it('Should have a minimumArrivalDate initialized', function () {
                expect($ctrl.minArrivalDate instanceof moment).toBeTruthy();
            });

            it('Should have a minDepartureDate initialized', function () {
                expect($ctrl.minDepartureDate instanceof moment).toBeTruthy();
            });

            it('Should have a arrivalDate initialized', function () {
                expect($ctrl.arrivalDate instanceof moment).toBeTruthy();
            });

            it('Should have a departureDate initialized', function () {
                expect($ctrl.departureDate instanceof moment).toBeTruthy();
            });

            it('Should observe the booking config', function () {
                expect(observePublicSpy).toHaveBeenCalledWith('booking.config', jasmine.any(Function));
            });

            it('Should set the $config', function () {
                $ctrl.findConfig();
                expect($ctrl.config.url).toBe(bookingConfig.url);
                expect($ctrl.config.params).toEqual(bookingConfig.params);
            });

        });

        describe('On error -', function () {

            it('Should throw an error when both a completeBaseUrl and a baseUrl are passed', function () {
                $ctrl.completeUrlWithoutParams = bookingBaseUrl.slice();
                $ctrl.baseUrl = 'https://reservations.cubilis.eu/';
                try {
                    $ctrl.$onInit();
                } catch (err) {
                    expect(err.message).toBe('You should use a completeUrlWithoutParams or the separete segments baseUrl, hotelId, urlSuffix');
                }
            });


            it('Should throw an error when both a completeBaseUrl and a hotelId are passed', function () {
                $ctrl.completeUrlWithoutParams = bookingBaseUrl.slice();
                $ctrl.hotelId = '6631';
                expect(function () {
                    $ctrl.$onInit();
                }).toThrowError();
            });


            it('Should throw an error when both a completeBaseUrl and a urlSuffix are passed', function () {
                $ctrl.completeUrlWithoutParams = bookingBaseUrl.slice();
                $ctrl.urlSuffix = 'Rooms/Select';
                expect(function () {
                    $ctrl.$onInit();
                }).toThrowError();
            });
        });
    });

    describe('Submit -', function () {

        beforeEach(function () {
            $ctrl.config = bookingConfig;
        });

        it('Should open a new window', function () {
            $ctrl.$onInit();
            $ctrl.submit();
            expect(windowMock.open).toHaveBeenCalledWith('https://reservations.cubilis.eu/6331/Rooms/Select?Language=nl-NL&Arrival=2019-08-05&Departure=2019-08-05');
        });

        it('Should have the correct base URL', function () {
            $ctrl.config.url = 'http://config.be/6634/Rooms/Select'
            $ctrl.submit();
            expect($ctrl.url.split('?')[0]).toBe($ctrl.config.url);

            $ctrl.baseUrl = 'http://completeUrlWithoutParams.be/';
            $ctrl.hotelId = '6344';
            $ctrl.urlSuffix = 'Rooms/Select';
            $ctrl.submit();
            expect($ctrl.url.split('?')[0]).toBe($ctrl.composeBookingUrl($ctrl.baseUrl, $ctrl.hotelId, $ctrl.urlSuffix));

            $ctrl.completeUrlWithoutParams = 'http://completeUrlWithoutParams.be';
            $ctrl.submit();
            expect($ctrl.url.split('?')[0]).toBe($ctrl.completeUrlWithoutParams);
        });

        describe('Param names in url -', function () {
            beforeEach(function () {
                $ctrl.config.url = bookingBaseUrl;
            });

            it('Should add the localeparam', function () {
                $ctrl.submit();
                expect(getParamsArr($ctrl.url)[$ctrl.localeParamName]).toBe(binartaMock.application.localeForPresentation());
            });

            it('Should add the arrivalParam', function () {
                $ctrl.submit();
                expect(getParamsArr($ctrl.url)[$ctrl.arrivalParamName]).toBe(genericMomentDate);
            });

            it('Should add the departureParam', function () {
                $ctrl.submit();
                expect(getParamsArr($ctrl.url)[$ctrl.departureParamName]).toBe(genericMomentDate);
            });

            it('Should add discountCode if available', function () {
                $ctrl.submit();
                expect(getParamsArr($ctrl.url)[$ctrl.discountParamName]).toBe(undefined);
            });
        });

        describe('Config params available, but no bindings -', function () {

            beforeEach(function () {
                $ctrl.config = bookingConfig;
                $ctrl.submit();
            });

            it('Should use the config param for dateFormat', function () {
                expect($ctrl.dateFormat).toBe(bookingConfig.params.dateFormat);
            });

            it('Should use the config param for locale', function () {
                expect($ctrl.localeParamName).toBe(bookingConfig.params.locale);
            });

            it('Should use the config param for arrival', function () {
                expect($ctrl.arrivalParamName).toBe(bookingConfig.params.arrival);
            });

            it('Should use the config param for departure', function () {
                expect($ctrl.departureParamName).toBe(bookingConfig.params.departure);
            });

            it('Should use the config param for discount', function () {
                expect($ctrl.discountParamName).toBe(bookingConfig.params.discount);
            });
        });

        describe('Default values available, no bindings and no config params -', function () {

            beforeEach(function () {
                binBooking.updateConfig({
                    url: validUrl,
                });
                $ctrl.$onInit();
                $ctrl.submit();
            });

            it('Should have a default for dateFormat', function () {
                expect($ctrl.dateFormat).toBe('YYYY-MM-DD');
            });

            it('Should have a default paramName for locale', function () {
                expect($ctrl.localeParamName).toBe('Language');
            });

            it('Should have a default paramName for arrival', function () {
                expect($ctrl.arrivalParamName).toBe('Arrival');
            });

            it('Should have a default paramName for departure', function () {
                expect($ctrl.departureParamName).toBe(bookingConfig.params.departure);
            });

            it('Should have a default paramName for discount', function () {
                expect($ctrl.discountParamName).toBe('Discount');
            });
        });

        describe('On Errors -', function () {

            beforeEach(function () {
                $ctrl.$onInit();
            });

            it('Should throw an error when no url is provided', function () {
                $ctrl.config.url = undefined;
                expect($ctrl.submit).toThrowError('Should have a URL to navigate too');
            });


        });
    });

    describe('ComposeUrl -', function () {
        var baseUrl;
        var hotelId;
        var urlSuffix;
        var composedUrl;


        beforeEach(function () {
            baseUrl = 'https://reservations.cubilis.eu/';
            hotelId = '6331';
            urlSuffix = 'Rooms/Select';
            composedUrl = $ctrl.composeBookingUrl(baseUrl, hotelId, urlSuffix);
        });

        it('Should return a composed URL', function () {
            expect(composedUrl).toEqual(bookingBaseUrl);
        });

        describe('on Error -', function () {

            it('Should throw an error if baseUrl doesn\'t end with "/"', function () {
                expect(function () {
                    $ctrl.composeBookingUrl('http://url.be', hotelId, urlSuffix);
                }).toThrowError();
            });

            it('Should throw an error if urlSuffix starts with "/"', function () {
                expect(function () {
                    $ctrl.composeBookingUrl(baseUrl, hotelId, '/' + urlSuffix);
                }).toThrowError('urlSuffix can\'t start with a "/"');
            });
        });
    });
    
});

function reset() {
    binarta.application.config.cache('booking.config', '');
    sessionStorage.clear();
    localStorage.clear();
}

function getParamsArr(url) {
    var params = url.split('?')[1];
    var obj = {};
    params.split('&').map(function (el) {
        var split = el.split('=');
        obj[split[0]] = split[1];
    });
    return obj;
}