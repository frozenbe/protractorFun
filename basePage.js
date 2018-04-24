var franc = require('franc');

var BasePage = function() {
    /**
     * wait and verify that a page is loaded
     * @returns {promise}
     * @requires a page to include `pageLoaded` method
     */
    this.at = function() {
        browser.sleep(3000);
        return browser.wait(this.pageLoaded(), this.timeout.xl);
    };

    /**
     * navigate to a page via it's `url` var
     * and verify/wait via at()
     *
     * @requires page have both `url` and `pageLoaded` properties
     */
    this.to = function() {
        console.log("navigating to: " + this.url);
        browser.get(this.url, this.timeout.xl);
        return this.at();
    };

    /**
    *  Set true for synchronization from angular
    *  Set false to ignore synchronization
    */
    this.isAngular = function(trueFalse) {
        browser.ignoreSynchronization = !trueFalse;
        if(trueFalse) {
            browser.waitForAngular();
        }
    };

    /**
     * Wrappers for expected conditions
     *
     * I find ECs are generally poorly named, so we wrap them in
     * methods that are 9% more sexy, and allow us to add logging, etc...
     *
     * @returns {ExpectedCondition}
     */
    var EC = protractor.ExpectedConditions;

    this.isVisible = function(locator) {
        return EC.visibilityOf(locator);
    };

    this.isNotVisible = function(locator) {
        return EC.invisibilityOf(locator);
    };

    this.inDom = function(locator) {
        return EC.presenceOf(locator);
    };

    this.notInDom = function(locator) {
        return EC.stalenessOf(locator);
    };

    this.isClickable = function(locator) {
        return EC.elementToBeClickable(locator);
    };

    this.hasText = function(locator, text) {
        return EC.textToBePresentInElement(locator, text);
    };

    this.and = function(arrayOfFunctions) {
        return EC.and(arrayOfFunctions);
    };

    this.titleIs = function(title) {
        return EC.titleIs(title);
    };

    this.titleContains = function(partialTitle) {
        return EC.titleContains(partialTitle);
    }

    this.urlContains = function(partialUrl) {
        return EC.urlContains(partialUrl);
    }

    /**
     * wrap this.timeout. (ms) in t-shirt sizes
     */
    this.timeout = {
        'xs': 420,
        's' : 1000,
        'm' : 2000,
        'l' : 5000,
        'xl': 15000,
        'xxl':1000
    };

    /**
     * test if an element has a class
     *
     * @param  {elementFinder} locator - eg. $('div#myId')
     * @param  {string}  klass  - class name
     * @return {Boolean} - does the element have the class?
     */
    this.hasClass = function(locator, klass) {
        return locator.getAttribute('class').then(function(classes) {
            return classes.split(' ').indexOf(klass) !== -1;
        });
    };

    /**
     * Webdriver equivilant to hitting Enter/Return key.
     */
    this.hitEnter = function() {
        return browser.actions().sendKeys(protractor.Key.ENTER).perform();
    };

    /**
     * switches focus to a new window
     * @param  {int} windowHandleIndex - the nth window to switch to
     * @param  {pageObject} targetPage - the page we'll be on after the switch
     */
    this.switchToWindow = function(windowHandleIndex) {
        browser.getAllWindowHandles().then(function(handles) {

        browser.switchTo().window(handles[windowHandleIndex]);
        });

    };


    /**
     * switches focus to an iframe
     * @param  {String} frameId - the id of the frame
     * @param  {int} frameIndex - the index of the frame matches by id
     */
    this.switchToIFrame = function(frameId, frameIndex) {
       browser.switchTo().defaultContent();

       var iframesList = element.all(by.id(frameId));

//       iframesList.count().then(function (size) {
//           console.log("How many iframes with matching id? " + size);
//      });


        for (var i=0; i<  frameIndex+1; i++) {
//            console.log("switching to frame: " + frameId +  " and frame index: " + i);
            browser.switchTo().frame(frameId);
        }

    };

    
    /**
     * open new window
     * @param  {int} windowHandleIndex - the second window to open
     
     */
    
    this.openNewWindow = function(){
    	       	 
         browser.getAllWindowHandles().then(function(handles) {
                     	 
        	 if(handles.length == 1){
      			browser.driver.executeScript("$(window.open())");
 
        	 }
          });
     };

    /**
     * close new window
     * @param  {int} windowHandleIndex - the window to close

     */

    this.closeNewWindow = function(){

         browser.getAllWindowHandles().then(function(handles) {

        	 if(handles.length > 1){
      			browser.driver.executeScript("$(window.close())");

        	 }
          });
     };

    /**
     * set base url
     */
    
    this.setBaseUrl = function(){
		this.getConfParameterValue = function() {
		     return browser.getProcessedConfig().then(function(config) {
		           console.log("config.baseUrl set to: " + config.baseUrl);
		           return config.baseUrl;
		     }) 
		}
	};
    
    /**
     * get an element's width
     * extend's protractors ElementFinder
     *
     * @return {int} - the width of the element
     */
    protractor.ElementFinder.prototype.getWidth = function () {
        return this.getSize().then(function(size) {
            return size.width;
        });
    };

    /**
     * Generate random string
     *
     * @return {string} - the randomly generated text
     */
    this.generateRandomString = function(stringLength){
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz";

        for( var i=0; i < stringLength; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };

    /**
     * Generate random number string
     *
     * @return {string} - the randomly generated text
     */
    this.generateRandomNumberString = function(stringLength){
        var text = "";
        var possible = "1234567890";

        for( var i=0; i < stringLength; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    };

    /**
     * Focus on element, then click it
     *
     */
    this.focusAndClick = function(element){

        this.waitToBePresentInDOM(element);

        browser.executeScript('arguments[0].scrollIntoView(true)', element );
        browser.executeScript('arguments[0].focus()',element);
        browser.executeScript('arguments[0].style.border=\'3px double orangered\'',element);
        browser.executeScript('arguments[0].click()',element);
    };

    /**
     * Get element's outer html for debugging
     *
     */
    this.getElementOuterHTML = function(element){
        return element.getAttribute('outerHTML');
    };

    /**
     * Change the browser zoom
     *
     */
//    this.zoomBrowser = function(zoomPercentage){
//        browser.executeScript("document.body.style.zoom='" + zoomPercentage + "%'");
//    };

    /**
     * Wait for element to be clickable
     *
     */
    this.waitToBeClickable = function(element){
        browser.wait(EC.elementToBeClickable(element), 100000);
    };
    
    /**
     * Get Month Name
     *
     */
    
    this.getMonthName = function(element){
    	var months = new Array(12);
		months[0] = "January";
		months[1] = "February";
		months[2] = "March";
		months[3] = "April";
		months[4] = "May";
		months[5] = "June";
		months[6] = "July";
		months[7] = "August";
		months[8] = "September";
		months[9] = "October";
		months[10] = "November";
		months[11] = "December";
		var monthName = months[element - 1];
		return monthName;
    };

    /**
     * Wait for element to be in DOM
     *
     */
    this.waitToBePresentInDOM = function(element){
        browser.wait(EC.presenceOf(element), 99999, 'Element is taking too long to appear in the DOM!');
    };

    /**
     * Wait for element to be visible
     *
     */
    this.waitToBeVisible = function(element){
        browser.wait(EC.visibilityOf(element), 30000, 'Element is taking too long to become visible!');
    };

    /**
     * Get all text on a particular page. Used to verify language text is in.
     *
     */
    this.getAndVerifyAllCopyOnPage = function(language) {
    pageCopyText = ' ';

    element.all(by.xpath("//p[position() >= 1 and not(position() > 5)]")).map(function(elm) {
        return elm.getText();
        }).then(function(texts) {
          texts.forEach(function(element) {
          pageCopyText = pageCopyText + element;
          // Don't check language if string is too short, because NLP isn't reliable for short strings
          if (pageCopyText.length < 30) {
              return;
          }
          switch(language){
          case 'FR':
              expect(franc(pageCopyText)).toBe("fra", "Because user should be on French dashboard ui and paragraph text copy should be in French. Actual: " + pageCopyText);
              break;
          case 'EN':
              expect(franc(pageCopyText)).toBe("eng", "Because user should be on English dashboard ui and paragraph text copy should be in English. Actual: " + pageCopyText);
              break;
          }
          });
        });
    };

};
module.exports = new BasePage();
