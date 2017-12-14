var basePage = require('../../sharedPageObjects/basePage');
var trialsPage = require('../pageObjects/trialsPage');
var trialsData = require('../../trial/data/trial.js');
var using = require('../../node_modules/jasmine-data-provider');
var fs = require('fs');

using(trialsData.TC905, function(data) {
    describe('[200211](4707324324){1221311} |trials| demo ', function() {

        var countSentMessages = 0;


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

            // Each scroll down adds 15 more results, so the number of scrolls= membersCount/15
            for (var i = parseInt(data.clientinfo[0].membersCount / 15); i >= 0; --i) {
                console.log("performing scrolldown...");
                browser.actions().sendKeys(protractor.Key.CONTROL, protractor.Key.END).perform();
                browser.sleep(3333);

            }

            friendsList = element.all(trialsPage.friendsListLocator);

            var friendsListCnt = 0;

            friendsListCnt = friendsList.count().then(function(count) {
                friendsListCnt = count;
                return count;
            });
            expect(friendsListCnt).toBeGreaterThan(0);

            friendsListCnt.then(function(cntResolved) {
                console.log("friendsListCnt " + friendsListCnt);
                basePage.openNewWindow();

                for (var i = friendsListCnt - 1; i >= 0; --i) {
                    basePage.switchToWindow(0);
                    trialsPage.hoverOverFriend(friendsList.get(i), data.clientinfo[0]);
                }
            });

        });

        it('should send messages to friends', function() {
            var targetsArray = fs.readFileSync("C:\\Users\\324109388\\Desktop\\Workspace\\rbc-drive-qa-protractor\\tmp\\" + data.clientinfo[0].textFile).toString().split('\n');

            var uniqueTargetsArray = targetsArray.filter(function(elem, index, self) {
                return index === self.indexOf(elem);
            })

            for (var i = uniqueTargetsArray.length - 1; i >= 0; --i) {
                if ((!targetsArray[i].includes('facebook')) || targetsArray[i].includes('undefined') || targetsArray[i].length < 10) {
                    targetsArray.splice(i, 1);
                }
                //                    console.log("url: " + targetsArray[i])
            }



            console.log("trialsPage.listOfFemaleFriends.length: " + uniqueTargetsArray.length);
            //                trialsPage.messageFriends(uniqueTargetsArray,data.clientinfo[0],countSentMessages);
        });



    });
});
