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
                var friendsList = [];

                for (var i = 0; i < 12; ++i) {
                    console.log("performing scrolldown...");
                    browser.executeScript('window.scrollBy(0,27777);');
                    basePage.focusAndClick(trialsPage.seeMoreLink);
                    browser.sleep(5000);

                }

                friendsList = element.all(trialsPage.friendsListLocator);
//                friendsList = trialsPage.shuffleFriends(friendsList);

                var friendsListCnt = 0;

                friendsListCnt = friendsList.count().then(function(count){
                        friendsListCnt = count;
                        return count;
                });
                expect(friendsListCnt).toBeGreaterThan(0);

                friendsListCnt.then(function(cntResolved){
                    console.log("friendsListCnt " + friendsListCnt);
                    for (var i = 0; i < friendsListCnt; ++i) {
                        trialsPage.hoverOverFriend(friendsList.get(i),data.clientinfo[0]);
                    }
                });

            });

            it('should send messages to friends', function() {

                console.log("trialsPage.listOfFemaleFriends.length: " + trialsPage.listOfFemaleFriends.length);
                trialsPage.messageFriends(trialsPage.listOfFemaleFriends,data.clientinfo[0]);
            });
    


    });
});
