beforeEach(module('bin.booking'));

describe('binBooking service', function () {
    var sut, binarta;
    var validUrl = 'http://test.com';

    beforeEach(inject(function (binBooking, _binarta_) {
        sut = binBooking;
        binarta = _binarta_;
        reset();
    }));

    function reset() {
        binarta.application.config.cache('booking.config', '');
        sessionStorage.clear();
        localStorage.clear();
    }

    describe('on update config', function () {
        it('update url', function () {
            sut.updateConfig({
                url: validUrl
            });

            binarta.application.config.findPublic('booking.config', function (actual) {
                expect(actual).toEqual({
                    url: validUrl
                });
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