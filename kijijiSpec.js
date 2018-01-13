var basePage = require('../client/pages/basePage');
var trialsPage = require('../kijiji/trialsPage');
var trialsData = require('../kijiji/trials.js');
var using = require('../node_modules/jasmine-data-provider');
var fs = require('fs');

using(trialsData.TC905, function (data) {
    describe('[200211](4707324324){1221311} |trials| demo ', function() {

            beforeAll(function() {

                browser.ignoreSynchronization = true;
                browser.get('https://www.kijiji.ca/t-login.html');
                browser.sleep(5000);
                trialsPage.signIn(data.clientinfo[0]);
                browser.sleep(5000);

            });

            it('should post all ads', function() {
                trialsPage.postAds(data.clientinfo[0]);

            });


    });
});
