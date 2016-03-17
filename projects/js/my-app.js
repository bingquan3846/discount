// Initialize your app
var myApp = new Framework7({
    material: true
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,

    domCache: true
});

myApp.initFormsStorage('.page');

// ajax request url
//var loginUrl = "http://dev.freelancermap.de/index.php?module=user&func=appLogin&processmode=ajax"
var loginUrl = "http://192.168.119.105/?module=api&func=login"
var projectsUrl = "http://dev.freelancermap.de/index.php?module=projekt&func=appProjects&processmode=ajax"
var pageNum = 0;
var projectsTemplate = $$('script#projects').html();
var compiledProjectsTemplate = Template7.compile(projectsTemplate);
var isLogin = false;
var uid = 12113;
// login
if(!isLogin){
    myApp.loginScreen();
}
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
            myApp.hideIndicator();
            uid = data.uid;
            token = data.token;
            getProjects(pageNum);
            myApp.alert('success', 'Freelancermap login');
            isLogin = true;
            $$('#login-close').click();
        },
        error: function(data){
            myApp.hideIndicator();
            myApp.alert('Fehler', 'Freelancermap login');
        }
    });
});


var slider = new Swiper('.swiper-container', {
    loop: false,
    onSlideNextEnd: function(slider, event){
        if(slider.swipeDirection == 'next' && slider.isEnd){
            getProjects(pageNum);
        }
    }
});

myApp.onPageInit('settings', function (page) {
    // run createContentPage func after link was clicked
    $$("#settings-form").attr('action', projectsUrl + '&uid=' + uid + '&page=0&init=true' );

    $$('#settings-form').on('submitted', function (e) {
        myApp.showIndicator();
        var itemHTML = compiledProjectsTemplate({
                projects: JSON.parse(e.detail.data)}
        );
        console.log(itemHTML);
        slider.removeAllSlides();
        slider.appendSlide(itemHTML);
        slider.updateSlidesSize();
        myApp.hideIndicator();
    });
});

myApp.onPageInit('positive', function (page) {

    $$('input[name="addKeyword"]').blur(function(e){

        if($$(this).val().trim() != ''){
            var target = $$(this).data('target');
            var liHtml = '<li class="swipeout"> <label class="label-checkbox item-content swipeout-content"><input type="checkbox" name="' + target + '" value="'+ $$(this).val() + '" checked="true"><div class="item-inner"><div class="item-title"> ' + $$(this).val() + ' </div></div></label>       <div class="swipeout-actions-right"> <a href="#" class="swipeout-delete">löschen</a></div></li>'
            $$('#' + target + 'List').append(liHtml);
            $$(this).val('');
            myApp.formStoreData(target+'Keywords', myApp.formToJSON ('#'+target+'Keywords'));
        }

    });

    initPositiveKeywordsForm();

});

myApp.onPageInit('negative', function (page) {

    $$('input[name="addKeyword"]').blur(function(e){

        if($$(this).val().trim() != ''){
            var target = $$(this).data('target');
            var liHtml = '<li class="swipeout"> <label class="label-checkbox item-content swipeout-content"><input type="checkbox" name="' + target + '" value="'+ $$(this).val() + '" checked="true"><div class="item-inner"><div class="item-title"> ' + $$(this).val() + ' </div></div></label>       <div class="swipeout-actions-right"> <a href="#" class="swipeout-delete">löschen</a></div></li>'
            $$('#' + target + 'List').append(liHtml);
            $$(this).val('');
            myApp.formStoreData(target+'Keywords', myApp.formToJSON ('#'+target+'Keywords'));
        }

    });

    initNegativeKeywordsForm();

});


function getProjects(page, next){
    myApp.showIndicator();
    var formData = myApp.formToJSON('#settings-form');
    console.log(formData);
    $$.ajax({
        url: projectsUrl + '&uid=' + uid + '&page=' + page,
        type: "POST",
        success: function(data, textStatus ){
            if(data != ''){
                myApp.hideIndicator();
                var itemHTML = compiledProjectsTemplate({
                        projects: JSON.parse(data)}
                );
                slider.appendSlide(itemHTML);
                slider.updateSlidesSize();
                if(next){
                    slider.slideNext();
                }
                pageNum++;
            }
        }
    });
}

function apply(projectId){
    console.log(projectId);
    console.log(uid);
    myApp.alert('Bewerbung','Freelancermap');
}

function addWishlist(projectId){
    console.log(projectId);
    console.log(uid);
    myApp.alert('Merken','Freelancermap');
}

function showWishlist(){
    myApp.alert("Merkliste", "Freelancermap");
}

function initPositiveKeywordsForm(){
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
}

function initNegativeKeywordsForm(){
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






