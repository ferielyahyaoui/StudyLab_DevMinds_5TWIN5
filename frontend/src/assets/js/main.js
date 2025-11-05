(function($) {
  "use strict";

  // Commente stellar (cause getClientRects error)
  // $(window).stellar({
  //   responsive: true,
  //   parallaxBackgrounds: true,
  //   parallaxElements: true,
  //   horizontalScrolling: false,
  //   hideDistantElements: false,
  //   scrollProperty: 'scroll'
  // });

  var fullHeight = function() {
    $('.js-fullheight').css('height', $(window).height());
    $(window).resize(function(){
      $('.js-fullheight').css('height', $(window).height());
    });
  };
  fullHeight();

  // Loader
  var loader = function() {
    setTimeout(function() { 
      if($('#ftco-loader').length > 0) {
        $('#ftco-loader').removeClass('show');
      }
    }, 1);
  };
  loader();

  // Skip Scrollax – CSS alternative
  // $.Scrollax();

  var carousel = function() {
    $('.carousel-testimony').owlCarousel({
      center: false,
      loop: true,
      items:1,
      margin: 30,
      stagePadding: 0,
      nav: false,
      navText: ['<span class="ion-ios-arrow-back">', '<span class="ion-ios-arrow-forward">'],
      responsive:{
        0:{
          items: 1
        },
        600:{
          items: 2
        },
        1000:{
          items: 4
        }
      }
    });
  };
  carousel();

  // Navbar hover
  $('nav .dropdown').hover(function(){
    var $this = $(this);
    $this.addClass('show');
    $this.find('> a').attr('aria-expanded', true);
    $this.find('.dropdown-menu').addClass('show');
  }, function(){
    var $this = $(this);
    $this.removeClass('show');
    $this.find('> a').attr('aria-expanded', false);
    $this.find('.dropdown-menu').removeClass('show');
  });

  // Scroll Window
  var scrollWindow = function() {
    $(window).scroll(function(){
      var $w = $(this),
          st = $w.scrollTop(),
          navbar = $('.ftco_navbar'),
          sd = $('.js-scroll-wrap');

      if (st > 150) {
        if ( !navbar.hasClass('scrolled') ) {
          navbar.addClass('scrolled');	
        }
      } 
      if (st < 150) {
        if ( navbar.hasClass('scrolled') ) {
          navbar.removeClass('scrolled sleep');
        }
      } 
      if ( st > 350 ) {
        if ( !navbar.hasClass('awake') ) {
          navbar.addClass('awake');	
        }
        
        if(sd.length > 0) {
          sd.addClass('sleep');
        }
      }
      if ( st < 350 ) {
        if ( navbar.hasClass('awake') ) {
          navbar.removeClass('awake');
          navbar.addClass('sleep');
        }
        if(sd.length > 0) {
          sd.removeClass('sleep');
        }
      }
    });
  };
  scrollWindow();

  // Commente counter (waypoint conflict – remplace par CSS animation si besoin)
  // var counter = function() { ... };
  // counter();

  // Content WayPoint – Commente (conflict)
  // var contentWayPoint = function() { ... };
  // contentWayPoint();

  // Magnific Popup
  $('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: 'mfp-no-margins mfp-with-zoom',
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1]
    },
    image: {
      verticalFit: true
    },
    zoom: {
      enabled: true,
      duration: 300
    }
  });

  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });

  // Date Picker
  $('.checkin_date, .checkout_date').datepicker({
    'format': 'm/d/yyyy',
    'autoclose': true
  });

})(jQuery);