$(function() {
  // Constants
  const DESKTOP_WIDTH = 639;
  const BACKGROUND_COLORS = [
    '#FFEB82',
    '#FAAF73',
    '#F77787',
    '#FAAFD7',
    '#BE96FF',
    '#7D9BE1',
    '#96E1FA',
    '#A0F0C3'
  ];

  // Runtime variables
  var isMenuActive = false;
  var isCategoryMenuActive = false;
  var prevScrollTop = 0;
  var menuScrollTop = 0;
  var scrollTop = 0;
  var backgroundColorCounter = 1;

  // Homepage intro animation
  animateHomepageIntro();

  function animateHomepageIntro() {
    $('.homepage-intro, .full-width-banner').animate({
      'background-color': BACKGROUND_COLORS[backgroundColorCounter]
    }, 9000, function() {
      backgroundColorCounter++;

      if (backgroundColorCounter === BACKGROUND_COLORS.length) {
        backgroundColorCounter = 0;
      }

      animateHomepageIntro();
    });
  }

  // Category floating menu
  $('.category-nav-dismiss').click(function(e) {
    e.preventDefault();

    closeCategoryMenu();
  });

  function openCategoryMenu() {
    if ($('.pattern-category-title').hasClass('fixed')) {
      $('.category-nav').css({
        'top': $('.pattern-category-title')[0].getBoundingClientRect().top + $('.pattern-category-title').outerHeight()
      }).fadeIn(250);
    }

    $('.category-nav').fadeIn(250);

    $('.category-nav-dismiss').show();

    $('.pattern-category-title img').attr('src', '/images/up.svg');

    isCategoryMenuActive = true;
  }

  function closeCategoryMenu() {
    $('.category-nav').fadeOut(250);
    $('.category-nav-dismiss').hide();

    $('.pattern-category-title img').attr('src', '/images/down.svg');

    isCategoryMenuActive = false;
  }

  // Mobile menu
  $('header .menu').click(function(e) {
    e.preventDefault();

    if (isMenuActive) {
      isMenuActive = false;

      $('html, body').scrollTop(menuScrollTop);

      $('.page-menu').fadeOut(250);

      if (scrollTop > $('header').outerHeight()) {
        $('header .logo, header .title').animate({
          'opacity': 0
        }, 250, function() {
          $('header .logo, header .title').attr('style', '');
        });
      }

      $('header').animate({
        'background-color': 'rgba(255, 255, 255, 0.0)'
      }, 250, function() {
        $('header').attr('style', '');
      });

      $('header .menu').removeClass('menu-opened');
    } else {
      isMenuActive = true;
      menuScrollTop = $(window).scrollTop();

      $('.page-menu').fadeIn(250);

      if (scrollTop > $('header').outerHeight()) {
        $('header .logo, header .title').css({
          'opacity': 0
        }).animate({
          'opacity': 1
        }, 250);
      }

      $('header').attr('class', 'grid-container').animate({
        'background-color': 'rgb(255, 255, 255)'
      }, 250).css({
        'position': 'fixed',
        'top': 0,
        'left': 0
      });

      $('header .menu').addClass('menu-opened');
    }
  });

  // Category menu
  $('.pattern-category-title').click(function(e) {
    e.preventDefault();

    if (isCategoryMenuActive) {
      closeCategoryMenu();
    } else {
      openCategoryMenu();
    }
  });

  // Scrolling interactions mobile
  $(window).scroll(function() {
    if (isMenuActive) {
      return;
    }

    scrollTop = $(window).scrollTop();

    if ($('.pattern-category-title').length > 0) {
      if (scrollTop > $('.pattern-category-title-anchor').position().top) {
        // Make category menu and pages menu fixed
        $('.pattern-category-title').addClass('fixed');

        $('.category-nav').addClass('fixed').css({
          'top': $('.pattern-category-title')[0].getBoundingClientRect().top + $('.pattern-category-title').outerHeight()
        });

        if ($(window).width() > DESKTOP_WIDTH) {
          $('header').addClass('desktop-fixed');
          $('header .page-menu').show();

          $('.patterns-grid').css({
            'padding-top': $('.pattern-category-title').outerHeight() + 20
          });
        } else {
          $('header .menu').addClass('fixed').show();

          $('.patterns-grid').css({
            'padding-top': $('.pattern-category-title').outerHeight()
          });
        }
      } else {
        // Make category menu and pages menu unfixed
        $('.pattern-category-title').removeClass('fixed');

        $('.patterns-grid').css({
          'padding-top': 0
        });

        $('.category-nav').removeClass('fixed').css({ 'top': '0px' });

        if (scrollTop > $('header').outerHeight()) {
          if ($(window).width() > DESKTOP_WIDTH) {
            //$('header .page-menu').hide();
            $('header').removeClass('desktop-fixed');
          } else {
            $('header .menu').hide().removeClass('fixed');
          }
        } else {
          if ($(window).width() > DESKTOP_WIDTH) {
            $('header .page-menu').finish().show();
            $('header').removeClass('desktop-fixed').attr('style', '');
          } else {
            $('header .menu').removeClass('fixed').attr('style', '');
          }
        }
      }
    }

    prevScrollTop = scrollTop;
  });

  // Carousel
  var currentImage = 0;
  var numImages = 0;
  var carouselActive = false;

  function createCarousel() {
    numImages = $('.pattern-image').find('.cell').length;

    if (numImages <= 1 || (numImages > 1 && $(window).width() > DESKTOP_WIDTH)) {
      return;
    }

    for (var i = 0; i < numImages; i++) {
      $('.carousel-indicator .wrapper').append('<a href="#" class="dot">dot</a>');
    }

    $('.carousel-indicator .dot').first().addClass('active');

    $('.pattern-image .cell').not(':first').hide();
    $('.carousel-indicator').addClass('active');

    $('.carousel-control').fadeIn(250);
    $('.carousel-indicator').animate({
      'opacity': 1
    }, 250);

    carouselActive = true;
  }

  function changeImage() {
    $('.pattern-image .cell').hide();
    $('.pattern-image .cell').eq(currentImage).show();
    $('.carousel-indicator .dot').removeClass('active');
    $('.carousel-indicator .dot').eq(currentImage).addClass('active');

    if (currentImage == 0) {
      $('.carousel-control.previous').css({ 'opacity': 0.25 });
    }

    if (currentImage >= 1) {
      $('.carousel-control.previous').css({ 'opacity': 1 });
    }

    if (currentImage == numImages - 1) {
      $('.carousel-control.next').css({ 'opacity': 0.25 });
    } else {
      $('.carousel-control.next').css({ 'opacity': 1 });
    }
  }

  function removeCarousel() {
    currentImage = 0;
    numImages = 0;
    carouselActive = false;

    $('.pattern-image .cell').show();
    $('.carousel-indicator .wrapper').empty();
    $('.carousel-control, .carousel-indicator').hide();
  }

  $('.carousel-control.previous').click(function(e) {
    e.preventDefault();

    if (currentImage == 0) {
      return;
    }

    currentImage--;

    changeImage();
  });

  $('.carousel-control.next').click(function(e) {
    e.preventDefault();

    if (currentImage == numImages - 1) {
      return;
    }

    currentImage++;

    changeImage();
  });

  $(window).resize(function() {
    // Carousel
    if ($(window).width() > DESKTOP_WIDTH) {
      if (carouselActive) {
        removeCarousel();
      }

      if ($('.pattern-category-title').hasClass('fixed')) {
        $('header .menu').hide();
        $('header .page-menu').show();
        $('header').addClass('desktop-fixed');
      }
    } else if ($(window).width() < DESKTOP_WIDTH) {
      if (!carouselActive) {
        createCarousel();
      }

      if ($('.pattern-category-title').hasClass('fixed')) {
        $('header .menu').show();
      }
    }

    // WIP banner height
    wipBannerHeight();
  });

  if ($(window).width() < DESKTOP_WIDTH) {
    createCarousel();
  } else {
    wipBannerHeight();
  }

  function wipBannerHeight() {
    $('.wip-banner-full-length').css({
      'height': $('.wip-banner').outerHeight()
    });
  }
});
