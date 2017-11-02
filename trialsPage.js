var basePage = require('../../sharedPageObjects/basePage');
var gender = require('gender-detection');

var TrialsPage = function() {

    // Page elements
    this.friendsList = element.all(by.xpath("//a[contains(@href,'friends_tab')]"));
    this.email = element(by.xpath("//input[@name='email']"));
    this.password = element(by.xpath("//input[@name='pass']"));
    this.logIn = element(by.xpath("//input[@value='Log In']"));
    var sendMsgBtn = element.all(by.xpath("//a[contains(@ajaxify,'messaging/composer')]"));
    var msgInputField = element(by.xpath("//div[@role='combobox']"));
    var listOfFemaleFriendsUrl = [];
    this.listOfFemaleFriendsUrl = [];
    var changeColorOption = element.all(by.xpath("//div[text()='Change Color']"));

    // Page object methods
    this.signIn = function(userObj) {
        this.email.sendKeys(userObj.email);
        this.password.sendKeys(userObj.password);
        basePage.focusAndClick(this.logIn);
        browser.sleep(3000);
        browser.get(userObj.friendUrl);
        browser.sleep(3000);

    };

    this.hoverOverFriend = function(friend,userObj) {

        browser.actions().mouseMove(friend).perform();
        browser.sleep(3000);

        friend.getText().then(function(result){
            g = "" + gender.detect(result);
            if (g == 'female') {
                console.log("♀ Female detected! Its name is: " + result);
                sendMsgBtn.get(2).getAttribute("href").then(function (url) {
                    console.log("Pushing its url for messaging purposes... " + url);
                    listOfFemaleFriendsUrl.push(url);
                    console.log("listOfFemaleFriendsUrl.length: " + listOfFemaleFriendsUrl.length);

                });
            }


        });

        this.listOfFemaleFriendsUrl = listOfFemaleFriendsUrl;
    };

    this.messageFriends = function(listOfFemaleFriendsUrl,userObj) {
        var conversationStarted = false;


        for (i = 0; i < listOfFemaleFriendsUrl.length; i++) {
            console.log("Navigating to: " + listOfFemaleFriendsUrl[i]);
            browser.get("" + listOfFemaleFriendsUrl[i]);
            browser.sleep(3000);

            basePage.focusAndClick(msgInputField);
            conversationStarted = changeColorOption.length > 0 ? true : false;
            console.log("Conversation has been initiated with female? " + conversationStarted);
            msgInputField.sendKeys(userObj.message);
            browser.actions().sendKeys(protractor.Key.ENTER).perform();

            browser.sleep(3000);

        }

    };


    this.pageLoaded = this.and(
        this.inDom($('.offer-box'))
    );

};
TrialsPage.prototype = basePage;
module.exports = new TrialsPage();
