var basePage = require('../../sharedPageObjects/basePage');
var trialsPage = require('../pageObjects/trialsPage');
var trialsData = require('../../trial/data/trial.js');
var using = require('../../node_modules/jasmine-data-provider');
var fs = require('fs');

using(trialsData.TC905, function (data) {
    describe('[200211](4707324324){1221311} |trials| demo ', function() {

            beforeAll(function() {

                browser.ignoreSynchronization = true;
                browser.get('https://www.facebook.com');
                trialsPage.signIn(data.clientinfo[0]);

            });

            it('should collect urls of friends to message', function() {
                var friendsList = [];
                console.log("performing scrolldown...");
                browser.actions().sendKeys(protractor.Key.CONTROL, protractor.Key.END).perform();
                basePage.focusAndClick(trialsPage.seeMoreLink);

                for (var i = 5; i >= 0; --i) {
                    console.log("performing scrolldown...");
                    browser.actions().sendKeys(protractor.Key.CONTROL, protractor.Key.END).perform();
                    browser.sleep(3333);

                }

                friendsList = element.all(trialsPage.friendsListLocator);

                var friendsListCnt = 0;

                friendsListCnt = friendsList.count().then(function(count){
                        friendsListCnt = count;
                        return count;
                });
                expect(friendsListCnt).toBeGreaterThan(0);

                friendsListCnt.then(function(cntResolved){
                    console.log("friendsListCnt " + friendsListCnt);
                    basePage.openNewWindow();

                    for (var i = friendsListCnt - 1; i >= 0; --i) {
                        basePage.switchToWindow(0);
                        trialsPage.hoverOverFriend(friendsList.get(i),data.clientinfo[0]);
                    }
                });

            });

            it('should send messages to friends', function() {
                var targetsArray = fs.readFileSync("C:\\Users\\324109388\\Desktop\\Workspace\\rbc-drive-qa-protractor\\tmp\\" +data.clientinfo[0].textFile).toString().split('\n');
                for (var i= targetsArray.length - 1; i>=0; --i) {
                    if ( (!targetsArray[i].includes('facebook')) || targetsArray[i].includes('undefined')) {
                        targetsArray.splice(i, 1);
                    }
                    console.log("url: " + targetsArray[i])
                }


                var countSentMessages = 0;

                console.log("trialsPage.listOfFemaleFriends.length: " + trialsPage.listOfFemaleFriends.length);
                trialsPage.messageFriends(targetsArray,data.clientinfo[0],countSentMessages);
            });



    });
});
