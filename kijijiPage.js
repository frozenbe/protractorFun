var basePage = require('../client/pages/basePage');
var fs = require('fs');
var path = require('path');

var TrialsPage = function() {

    // Page elements
    var email = element(by.xpath("//input[@name='emailOrNickname']"));
    var password = element(by.xpath("//input[@name='password']"));
    var logIn = element(by.xpath("//button[@id='SignInButton']"));


    var postAdLink = element(by.xpath("//button[@name='saveAndCheckout']"));
    var basicPackageOption = element(by.xpath("//button[@data-qa-id='package-0-bottom-select']"));
    var price = element(by.xpath("//input[@id='PriceAmount']"));
    var saleByOwner = element(by.xpath("//label[@for='forsaleby_s']/following-sibling::span"));
    var title = element(by.xpath("//input[@id='postad-title']"));
    var description = element(by.xpath("//textarea[@id='pstad-descrptn']"));
    var postalCode = element(by.xpath("//input[@id='PostalCode']"));
    var address = element(by.xpath("//input[@id='pstad-map-address']"));
    var locationSelector = element(by.xpath("//select[@id='locationLevel0']"));
    var torontoLocation = element(by.xpath("//option[contains(text(),'Toronto')]"));
    var rotate = element(by.xpath("//a[contains(@class,'rotate-right')]"));

    // Page object methods

    this.signIn = function(userObj) {
        browser.sleep(3333);

        email.sendKeys(userObj.email);
        password.sendKeys(userObj.password);
        basePage.focusAndClick(logIn);
        browser.sleep(6000);
    };

    this.postAds = function(userObj) {

        browser.get('https://www.kijiji.ca/p-post-ad.html?categoryId=' + userObj.category);

        browser.sleep(3000);

//        basicPackageOption.isPresent().then(function(present) {
//            if (present) {
//                basePage.focusAndClick(basicPackageOption);
//            }
//        });
//        browser.sleep(3000);

        var fileToUpload = '/Users/frozenbe/Workspace/myadvisor-protractor/kijiji/' + userObj.picture1,
            absolutePath = path.resolve(__dirname, fileToUpload);

        element(by.css('input[type="file"]')).sendKeys(absolutePath);

        console.log("uploaded file");
        browser.sleep(3000);

        price.sendKeys(userObj.price);
        basePage.focusAndClick(saleByOwner);

        title.sendKeys(userObj.title);
        browser.sleep(3000);

        description.sendKeys(userObj.description);
        browser.sleep(3000);

        postalCode.sendKeys(userObj.postalCode);
        browser.sleep(3000);

        address.sendKeys(userObj.address);
        browser.sleep(3000);

        locationSelector.click();
        browser.sleep(3000);
        torontoLocation.click();
        browser.sleep(3000);

        basePage.focusAndClick(rotate);
        browser.sleep(7000);

        basePage.focusAndClick(postAdLink);
        browser.sleep(3000);

    };

};
TrialsPage.prototype = basePage;
module.exports = new TrialsPage();
