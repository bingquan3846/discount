// Initialize your app
var myApp = new Framework7({
    init: true
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,

    domCache: true
});

// ajax request url
var domain = "http://stage.freelancermap.de";
var loginUrl = domain + "/index.php?module=api&func=login";
var projectsUrl = domain + "/index.php?module=api&func=projects&local=0";
var applyUrl = domain + "/index.php?module=api&func=apply";
var wishListUrl = domain + "/index.php?module=api&func=wishList";
var projectContentUrl = domain + "/index.php?module=api&func=showContent";
var pageNum = 1;
var projectsTemplate = $$('script#projects').html();
var compiledProjectsTemplate = Template7.compile(projectsTemplate);

$$('#login').on('click', function(){
    var username = $$("input[name='username']").val();
    var password = $$("input[name='password']").val();
    if(username == ''){
        myApp.alert('Username', 'freelancermap');
        return;
    }
    if(password == ''){
        myApp.alert('Passwort', 'freelancermap');
        return;
    }
    myApp.showIndicator();
    $$.ajax({
        url: loginUrl,
        method: 'POST' ,
        data: { username: username, password: password },
        success: function(data){
            data = JSON.parse(data);
            if(data.error){
                myApp.hideIndicator();
                myApp.alert('Profil Fehler', 'Freelancermap login');
            }else{
                myApp.hideIndicator();
                myApp.ls['uid']= data.uid;
                myApp.ls['token'] = data.token;
                // replace template with firstname and lastname
                var template = $$('#settings-form textarea[name="template"]').val();
                var newTemplate = template.replace('{NAME DES USERS}', data.firstName + ' ' + data.lastName);
                $$('#settings-form textarea[name="template"]').val(newTemplate);

                welcomeScreen(myApp);
                $$('#login-close').click();
            }
        },
        error: function(data){
            myApp.hideIndicator();
            myApp.alert('Fehler', 'Freelancermap login');
        }
    });
});


// initialize
myApp.onPageInit('positive', function (page) {
    $$('.swipeout').on('delete', function () {
       refreshSlider();
    });
});

myApp.onPageInit('negative', function (page) {

    $$('.swipeout').on('delete', function () {
        refreshSlider();
    });
});

$$('input[name="addKeyword"]').blur(function(e){
    if($$(this).val().trim() != ''){
        var target = $$(this).data('target');
        var liHtml = '<li class="swipeout"> <label class="label-checkbox item-content swipeout-content"><input type="checkbox" name="' + target + '" value="'+ $$(this).val() + '" checked="true"><div class="item-inner"><div class="item-title"> ' + $$(this).val() + ' </div></div></label><div class="swipeout-actions-right"> <a href="#" class="swipeout-delete">löschen</a></div></li>'
        $$('#' + target + 'List').append(liHtml);
        $$(this).val('');
        myApp.formStoreData(target+'Keywords', myApp.formToJSON ('#'+target+'Keywords'));
        refreshSlider();
    }

});

$$('#logo').on("click",function(){
    refreshSlider();
});

myApp.initFormsStorage('.page');

var slider = new Swiper('.swiper-container', {
    loop: false,
    onTouchEnd : function(slider,event){
        if(slider.swipeDirection == 'next' && slider.isEnd){
            getProjects(pageNum,true);
        }

    }
});

initKeywordsForm();

// login
if(typeof myApp.ls['token'] ==  'undefined'){
    myApp.loginScreen();
}else{
    refreshSlider();
}

// functions refresh, getProjects, appy for projects, addwishlist, show description of project, initialize positive/negative keywords form, welcomescreen
function refreshSlider(){
    pageNum = 1;
    slider.removeAllSlides();
    getProjects(pageNum, false);
    slider.slideTo(0);
}

function getProjects(page, next){
    myApp.showIndicator();
    var formData = myApp.formToJSON('#settings-form');
    var positiveKeywords = myApp.formToJSON('#positiveKeywords');
    var negativeKeywords = myApp.formToJSON('#negativeKeywords');
    $$.ajax({
        url: projectsUrl + '&uid=' + myApp.ls['uid'] + '&page=' + page + '&token=' + myApp.ls['token'],
        type: "GET",
        data: {categoryPlace: formData, keywords: [positiveKeywords , negativeKeywords] },
        success: function(data, textStatus ){
            if(data != ''){
                data = JSON.parse(data);
                myApp.hideIndicator();
                if(data.projects.length){
                    var previousSize = slider.slides.length;
                    var itemHTML = compiledProjectsTemplate({
                            projects: data.projects}
                    );
                    slider.appendSlide(itemHTML);
                    slider.updateSlidesSize();
                    var currentSize = slider.slides.length;
                    //go to next page when none displayed
                    if(previousSize == currentSize){
                        pageNum = pageNum + 1;
                        getProjects(pageNum,next);
                    }
                    pageNum++;
                    if( next ){
                        slider.slideTo(previousSize);
                    }
                }else{
                    if(!next){
                        myApp.alert('Zu Ihren Suchparametern konnten wir leider keine Projekte finden','Freelancermap');
                    }else{
                        refreshSlider();
                    }
                }
            }
        }
    });
}

function apply(projectId, poster, obj){
    var formData = myApp.formToJSON('#settings-form');
    $$.ajax({
        url: applyUrl,
        type: "GET",
        data: {projectId: projectId, uid: myApp.ls['uid'], token: myApp.ls['token'], poster : poster, template: $$('#settings-form textarea[name="template"]').val(), attachment: formData.attachment[0]},
        success: function(data){
            data = JSON.parse(data);
            console.log(data);
            if( data.error == 0){
                myApp.alert("Sie haben sich erfolgreich auf die Stelle beworben.", "Freelancermap");
                $$(obj).parent().html('<i class="fa fa-envelope-o"></i>beworben');
            }else{
                myApp.alert("blocked oder Fehler", "Freelancermap");
            }
        }
    });
}

function addWishlist(projectId, obj){
    $$.ajax({
        url: wishListUrl,
        type: "GET",
        data: {projectId: projectId, uid: myApp.ls['uid'], token: myApp.ls['token']},
        success: function(data){
            data = JSON.parse(data);
            if( !data.error ){
                $$(obj).parent().html('<i class="fa fa-star"></i>gemerkt');
            }
        }
    });
}

function showContent(projectId, obj){
    if($$(obj).next().html().trim() == ''){
        $$.ajax({
            url: projectContentUrl,
            type: "GET",
            data: {projectId: projectId, uid: myApp.ls['uid'], token: myApp.ls['token']},
            success: function(data){
                data = JSON.parse(data);
                if( !data.error ){

                    $$(obj).next().html(data.content)
                        .css('height', 'auto');
                }
            }
        });
    }
}

function initKeywordsForm(){
    if(myApp.ls['f7form-positiveKeywords']){
        var pKeywords = JSON.parse(myApp.ls['f7form-positiveKeywords']);
        if(pKeywords.positive){
            for( i = 0; i < pKeywords.positive.length; i++){
                var target = 'positive';
                var liHtml = '<li class="swipeout"> <label class="label-checkbox item-content swipeout-content"><input type="checkbox" name="' + target + '" value="'+ pKeywords.positive[i] + '" checked="true"><div class="item-inner"><div class="item-title"> ' + pKeywords.positive[i] + ' </div></div></label>       <div class="swipeout-actions-right"> <a href="#" class="swipeout-delete">löschen</a></div></li>'
                $$('#' + target + 'List').append(liHtml);
            }
        }
    }

    if(myApp.ls['f7form-negativeKeywords']){
        var nKeywords = JSON.parse(myApp.ls['f7form-negativeKeywords']);
        if(nKeywords.negative){
            for( i = 0; i < nKeywords.negative.length; i++){
                var target = 'negative';
                var liHtml = '<li class="swipeout"> <label class="label-checkbox item-content swipeout-content"><input type="checkbox" name="' + target + '" value="'+ nKeywords.negative[i] + '" checked="true"><div class="item-inner"><div class="item-title"> ' + nKeywords.negative[i] + ' </div></div></label>       <div class="swipeout-actions-right"> <a href="#" class="swipeout-delete">löschen</a></div></li>'
                $$('#' + target + 'List').append(liHtml);
            }
        }
    }
}

function welcomeScreen(myapp){
    var options = {
            'bgcolor': '#0da6ec',
            'fontcolor': '#fff',
            'onOpened': function () {
                console.log("welcome screen opened");
            },
            'onClosed': function () {
                refreshSlider();
            }
        },
        welcomescreen_slides = [
            {
                id: 'slide0',
                picture: '<div class="tutorialicon">♥</div>',
                text: '<p>Herzlich Willkommen zu unserer App. Hier finden Sie aktuelle Projektangebote und können sich mit nur einem Klick bewerben.</p><p>Unter dem Punkt "Einstellungen" können Sie einen Suchfilter für die Projekte setzen und einen Standardtext angeben mit dem Sie sich auf die Projekte bewerben.</p>'
            },
            {
                id: 'slide2',
                picture: '<div class="tutorialicon">☆</div>',
                text: '<a class="tutorial-close-btn" href="#">start</a>'
            }
        ],
        welcomescreen = myapp.welcomescreen(welcomescreen_slides, options);

    $$(document).on('click', '.tutorial-close-btn', function () {
        welcomescreen.close();
    });
}



