var basePage = require('../../sharedPageObjects/basePage');
var trialsPage = require('../pageObjects/trialsPage');
var trialsData = require('../../trial/data/trial.js');
var using = require('../../node_modules/jasmine-data-provider');

using(trialsData.TC905, function (data) {
    describe('[200211](4707324324){1221311} |trials| demo ', function() {

            beforeAll(function() {

                browser.ignoreSynchronization = true;
                browser.get('https://www.facebook.com');
                trialsPage.signIn(data.clientinfo[0]);
            });
    
            it('should collect urls of friends to message', function() {
                for (var i = 0; i < 32; ++i) {
                    trialsPage.hoverOverFriend(trialsPage.friendsList.get(i),data.clientinfo[0]);
//                    window.scrollBy(0, 100);
                }

            });

            it('should send messages to friends', function() {

                console.log("trialsPage.listOfFemaleFriendsUrl.length: " + trialsPage.listOfFemaleFriendsUrl.length);
                trialsPage.messageFriends(trialsPage.listOfFemaleFriendsUrl,data.clientinfo[0]);
            });
    


    });
});
