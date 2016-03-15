// Initialize your app
var myApp = new Framework7({
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('setting', function (page) {
    // run createContentPage func after link was clicked
    console.log('settings');
});
var isLogin = false;
if(!isLogin){
    myApp.popup('.popup-login');
}
$$('#login').on('click', function(){
    isLogin = true;
    $$('#login-close').click();
});

var projectsTemplate = $$('script#projects').html();
var compiledProjectsTemplate = Template7.compile(projectsTemplate);
var ptrContent = $$('.pull-to-refresh-content');

ptrContent.on('refresh', function (e) {
    setTimeout(function () {

        ptrContent.find('.swiper-container')
            .css('visibility', 'hidden')
            .css('height', '0');
//        var itemHTML = '<div  data-pagination=".swiper-pagination .hidden" data-pagination-hide="true" class="swiper-container swiper-init ks-demo-slider"><div class="swiper-pagination"></div><div class="swiper-wrapper"><div class="swiper-slide">Slide 1</div><div class="swiper-slide">Slide 2</div></div></div>';
        var itemHTML = compiledProjectsTemplate({
                data: [{id: Math.random(), title: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)},{id: Math.random(),title: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}]}
                );

        ptrContent.append(itemHTML);
        var slider = new Swiper('.swiper-container');

        //ptrContent.remove('#slider');
        myApp.pullToRefreshDone();
    }, 2000);
});

function apply(projectId){
    myApp.popup('.popup-apply');
    console.log(projectId);
}