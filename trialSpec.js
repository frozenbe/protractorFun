var basePage = require('../../sharedPageObjects/basePage');
var gender = require('gender-detection');
var fs = require('fs');

var TrialsPage = function() {

    // Page elements

//    this.friendsListLocator = by.xpath("//a[contains(@href,'friends_tab')]");
    this.friendsListLocator = by.xpath("//div[contains(@class,'fwb')]/a[contains(@href,'?fref=')]");
    this.seeMoreLink = element(by.xpath("//a[text()='See More']"));
    var friendNameLocator = by.xpath("//div[contains(text(),'aren') or contains(text(),'mutual') or contains(text(),'Member')]/preceding-sibling::div");
    var email = element(by.xpath("//input[@name='email']"));
    var password = element(by.xpath("//input[@name='pass']"));
    this.searchName = element(by.xpath("//input[@placeholder='Find a member']"));

    var logIn = element(by.xpath("//input[@value='Log In']"));
    var sendMsgBtnLocator = by.xpath("//a[contains(@ajaxify,'messaging/composer')]");
    var msgInputField = element(by.xpath("//div[@role='combobox']"));
    var listOfFemaleFriends = [];
    this.listOfFemaleFriends = [];
    var changeColorOption = element.all(by.xpath("//div[text()='Change Color']"));
    var status = element(by.xpath("//div[@id='pagelet_relationships']//div//div//div//div"));
    var currentCity = element(by.xpath("//div/preceding-sibling::span/a"));

    // Page object methods

    this.signIn = function(userObj) {

        email.isPresent().then(function(present) {
            if (present) {
                email.clear();
                email.sendKeys(userObj.email);
                password.sendKeys(userObj.password);
                basePage.focusAndClick(logIn);
                browser.sleep(3000);
            }
        });
//        browser.get(userObj.friendUrl + "friends_current_city");
        browser.get(userObj.friendUrl);
        browser.sleep(3000);
//        searchName.sendKeys(basePage.generateRandomString(1));
//        browser.sleep(9333);

    };

    this.hoverOverFriend = function(friend,userObj) {
            var targetsArray = fs.readFileSync("C:\\Users\\324109388\\Desktop\\Workspace\\rbc-drive-qa-protractor\\tmp\\test.txt").toString().split('\n');

            friend.getText().then(function(result){
                g = "" + gender.detect(result);
                var isInTargetsListIndex = targetsArray.indexOf(result);
//                console.log("Target " +  result + " is in list index: " + isInTargetsListIndex);
                if (g == 'female' && isInTargetsListIndex == -1) {
//                    console.log("♀ Female detected! Its name is: " + result);
                    friend.getAttribute("href").then(function (url) {
                        if (url.indexOf("?fref") > 0) {
                            var friendSlug = url.substring(url.indexOf("facebook.com/")+"facebook.com/".length,url.indexOf("?fref"));
                            urlMessaging = "https://www.facebook.com/messages/t/" + friendSlug;
                            var femaleFriend = {url: urlMessaging, name: result};
                            basePage.openNewWindow();
							basePage.switchToWindow(1);

							// check current city if available
                            browser.get("https://www.facebook.com/" + friendSlug + "/about?section=living&pnref=about");

                            currentCity.isPresent().then(function(isPresentCurrentCity){

                                if (isPresentCurrentCity) {
                                    currentCity.getText().then(function(result){
                                    if (!result.includes('Toronto')) {
                                               basePage.switchToWindow(0);
                                               return;
                                       }
                                    });
                                }


                            });
                            // check status if available
                            browser.get("https://www.facebook.com/" + friendSlug + "/about?section=relationship&pnref=about");

                            status.isPresent().then(function(isPresentResult){
                                if (isPresentResult) {
                                    status.getText().then(function(result){
//                                        console.log("The status is:" + result);
                                        if (result.includes('Single') || result.includes('No relationship info')) {
                                            listOfFemaleFriends.push(femaleFriend);
//                                            console.log("Pushing female object fpr messaging purposes... " + femaleFriend.name + " and its url" + femaleFriend.url);
//                                            console.log("listOfFemaleFriends.length: " + listOfFemaleFriends.length);
                                        }
                                    });
//                                    basePage.openNewWindow();
        							basePage.switchToWindow(0);
                                }
                            });
                        }
                    });
                }
            });

            this.listOfFemaleFriends = listOfFemaleFriends;
    };


    this.messageFriends = function(listOfFemaleFriends,userObj) {

        listOfFemaleFriends.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} );

        for (i = 0; i < listOfFemaleFriends.length; i++) {

        fs.appendFile("C:\\Users\\324109388\\Desktop\\Workspace\\rbc-drive-qa-protractor\\tmp\\test.txt", listOfFemaleFriends[i].name + "\n", function (err) {
          if (err) {
            // append failed
//            console.log("append failed: " + err);

          } else {
//            console.log("append successful");
            // done
          }
        });

            var conversationStarted = false;
//            console.log("Navigating to: " + listOfFemaleFriends[i].url + " \n" + listOfFemaleFriends[i].name);
            browser.get("" + listOfFemaleFriends[i].url);
            browser.sleep(2000);
            basePage.focusAndClick(msgInputField);

            changeColorOption.count().then(function(result){
//                console.log("changeColorOption.length: " + result);
                conversationStarted = result > 0 ? true : false;
//                console.log("Conversation has been initiated with female? " + conversationStarted);
                if (conversationStarted == false) {
                    element(friendNameLocator).isPresent().then(function(present){
                    if (present) {
                        element(friendNameLocator).getText().then(function(name){
                            var firstMessage = "Hi " + name.substring(0,name.indexOf(" "));
                            msgInputField.sendKeys(firstMessage);
                            browser.sleep(3000);
                            browser.actions().sendKeys(protractor.Key.ENTER).perform();
//                            browser.sleep(3000);
//                            browser.refresh();
//                            expect(changeColorOption.count()).toBeGreaterThan(0, "debugging");
                            msgInputField.sendKeys(userObj.giphy);
                            browser.sleep(3000);
                            browser.actions().sendKeys(protractor.Key.ENTER).perform();
                            browser.sleep(3000);
                            msgInputField.sendKeys(userObj.message);
                            browser.actions().sendKeys(protractor.Key.ENTER).perform();
                            browser.sleep(3000);
                        });
                    }
                    });


                }
            });
            browser.sleep(3000);
        }
//        listOfFemaleFriends = [];
//        this.listOfFemaleFriends = listOfFemaleFriends;
    };
};
TrialsPage.prototype = basePage;
module.exports = new TrialsPage();
