var basePage = require('../../sharedPageObjects/basePage');
var gender = require('gender-detection');

var TrialsPage = function() {

    // Page elements

    this.friendsListLocator = by.xpath("//a[contains(@href,'friends_tab')]");
    var friendNameLocator = by.xpath("//div[contains(text(),'mutual')]/preceding-sibling::div");
    var email = element(by.xpath("//input[@name='email']"));
    var password = element(by.xpath("//input[@name='pass']"));
    var logIn = element(by.xpath("//input[@value='Log In']"));
    var sendMsgBtnLocator = by.xpath("//a[contains(@ajaxify,'messaging/composer')]");
    var msgInputField = element(by.xpath("//div[@role='combobox']"));
    var listOfFemaleFriends = [];
    this.listOfFemaleFriends = [];
    var changeColorOption = element.all(by.xpath("//div[text()='Change Color']"));

    // Page object methods

    this.signIn = function(userObj) {

        email.isPresent().then(function(present) {
            if (present) {
                email.sendKeys(userObj.email);
                password.sendKeys(userObj.password);
                basePage.focusAndClick(logIn);
                browser.sleep(3000);
            }
        });
        browser.get(userObj.friendUrl + "friends_current_city");
        browser.sleep(3000);
    };

    this.hoverOverFriend = function(friend,userObj) {

            friend.getText().then(function(result){
                g = "" + gender.detect(result);
                if (g == 'female') {
                    console.log("♀ Female detected! Its name is: " + result);
                    friend.getAttribute("href").then(function (url) {
                        if (url.indexOf("?fref") > 0) {
                            urlMessaging = "https://www.facebook.com/messages/t/" + url.substring(url.indexOf("facebook.com/")+"facebook.com/".length,url.indexOf("?fref"));
                            console.log("Pushing its url for messaging purposes... " + urlMessaging);
                            var femaleFriend = {url: urlMessaging, name: result};
                            listOfFemaleFriends.push(femaleFriend);
                            console.log("listOfFemaleFriends.length: " + listOfFemaleFriends.length);
                        }
                    });
                }
            });

            this.listOfFemaleFriends = listOfFemaleFriends;
    };

    this.messageFriends = function(listOfFemaleFriends,userObj) {

        for (i = 0; i < listOfFemaleFriends.length; i++) {
            var conversationStarted = false;
            console.log("Navigating to: " + listOfFemaleFriends[i].url + " \n" + listOfFemaleFriends[i].name);
            browser.get("" + listOfFemaleFriends[i].url);
            browser.sleep(3000);
            basePage.focusAndClick(msgInputField);

            changeColorOption.count().then(function(result){
                console.log("changeColorOption.length: " + result);
                conversationStarted = result > 0 ? true : false;
                console.log("Conversation has been initiated with female? " + conversationStarted);
                if (conversationStarted == false) {
                    element(friendNameLocator).getText().then(function(name){
                        var firstMessage = "Hi " + name;
                        msgInputField.sendKeys(firstMessage);
                        browser.sleep(3000);
                        browser.actions().sendKeys(protractor.Key.ENTER).perform();
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
            browser.sleep(3000);
        }
    };
};
TrialsPage.prototype = basePage;
module.exports = new TrialsPage();
