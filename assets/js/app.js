---
---

var root = "{{ site.url }}";

$(document).ready(function(){
  
  $(".post-content img").captionjs({
    'is_responsive': true,
    'inherit_styles': true
  });
 
  /* Helper Functions */

  function shuffleArray(a){
    for(var i = 0; i < a.length; i++){
      var randomIndex = Math.floor(Math.random() * a.length);
      var tmp = a[randomIndex];
      a[randomIndex] = a[i];
      a[i] = tmp;
    }
    return a;
  }

  /* Social Buttons */
  
  function SocialButtons(){

    this.shareFB = function(selector){
      $(selector).click(function(){
	FB.ui({
	  method: 'share',
	  href: window.location.href,
	}, function(response){});
      });
    }

    this.popUp = function(selector){
      $(selector).click(function(e){
	console.log("click");
	e.preventDefault();
	window.open($(this).attr("href"),"popupWindow","width=520,height=570");
      });
    }
  }

  /* Random Post List */

  function RandomPostList(posts, numPosts){
    this.posts = shuffleArray(posts);
    this.numPosts = numPosts;
  }

  // appends this.numPosts posts to a selector
  RandomPostList.prototype.generate = function(selector){
      var postList = $("<ul></ul>");
      for(var i = 0; i < this.numPosts; i++){
	var title = this.posts[i].title;
	var href = this.posts[i].href;
	postList.append("<li><a href='" + href + "'>" + title + "</a></li>");
      }
      $(selector).append(postList);
    }




  function Ticker(posts, selector, speed){
    this.posts = shuffleArray(posts);
    this.selector = selector;
    this.speed = speed;

    for(var i = 0; i < this.posts.length; i++){
	var tickerItem = $("<a class='tickerItem'></a>");
	tickerItem.attr("href", root + this.posts[i].href);
	tickerItem.text(this.posts[i].shortTitle);
	$(this.selector).append(tickerItem);
    }
    // because we don't have enough stories yet
    for(var i = 0; i < this.posts.length; i++){
	var tickerItem = $("<a class='tickerItem'></a>");
	tickerItem.attr("href", root + this.posts[i].href);
	tickerItem.text(this.posts[i].shortTitle);
	$(this.selector).append(tickerItem);
    }

    this.animate = function(currentItem){
      var self = this;
      var distance = currentItem.outerWidth();
      var time = (distance - Math.abs(parseInt(currentItem.css("marginLeft")))) / 0.025;
      var animation = {
	"margin-left": -distance
      }
      currentItem.animate(animation, time, "linear", function(){
	currentItem.appendTo(currentItem.parent()).css("margin-left", 0);
	self.animate($(selector).children(":first"));
      });
    }

    this.start = function(){
      this.animate($(this.selector).children(":first"));
    }

    this.stop = function(){
      $(this.selector).children().stop();
    }
  }


  /* Meme Popup */

  function PopUp(meme, post){
    this.displayed = false;
    if($(window).scrollTop() + $(window).height() > .65*$(document).height()) {
      this.displayed = true;
    }

    $("#meme-popup img").attr("src", root + meme);
    $("#meme-popup a:first").attr("href", root + post.href);
    $("#meme-popup a:first").html(post.title);

    this.show = function(){
      if(!this.displayed){
	this.displayed = true;
	$.magnificPopup.open({
	  items: {
	    src: "#meme-popup",
	    type: 'inline'
	  },
	  removalDelay: 500, //delay removal by X to allow out-animation
	  callbacks: {
	    beforeOpen: function() {
	      this.st.mainClass = "mfp-newspaper";
	    }
	  },
	  midClick: true // allow opening popup on middle mouse click.
	});
      }
    }
  }

  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
  }


  /* Cookies */

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + ";domain=beststoriesonline.com;path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

  /* Make stuff happen */

  var socialButtons = new SocialButtons();
  socialButtons.shareFB(".share-facebook");
  socialButtons.popUp(".share-pinterest");
  socialButtons.popUp(".share-linkedin");

  $.getJSON(root + "/search.json", function(data){
    var skyPosts = new RandomPostList(data, 3);
    skyPosts.generate(".sky-random-posts");

    var ticker = new Ticker(data, ".ticker-stories", 1000);
    setTimeout(function(){ticker.start()}, 1500);

    $(".ticker").mouseenter(function(){
      ticker.stop();
    })

    $(".ticker").mouseleave(function(){
      ticker.start();
    })

    var memes = [
      "/watermarked/meme_rapper.jpg",
      "/watermarked/meme_bso.jpg",
      "/watermarked/meme_selfie.png",
    ];

    // get hot post
    var hotPost;
    for(var i = 0; i < data.length; i++){
      if($.inArray("hot", data[i].tags) != -1 && data[i].href != window.location.pathname){
	hotPost = data[i];
	break;
      }
    }

    var popupNotShown = (getCookie("popupShown") == null || getCookie("popupShown") == "");
    if($("#meme-popup").length == 1  && hotPost && popupNotShown){
      // only show popup on posts
      var meme = memes[getRandomInt(0, memes.length)];
      var popUp = new PopUp(meme, hotPost);
      $(window).scroll(function() {
	if($(window).scrollTop() + $(window).height() > .85*$(document).height()) {
	  popUp.show();
          setCookie("popupShown","true", 2);
	}
      });
    }

  });




  /* Weather */

  /* Does your browser support geolocation? */
  if ("geolocation" in navigator) {
    $('.js-geolocation').show(); 
  } else {
    $('.js-geolocation').hide();
  }

  /* Where in the world are you? */
  $('.js-geolocation').on('click', function() {
    navigator.geolocation.getCurrentPosition(function(position) {
      loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
    });
  });

  /* 
  * Test Locations
  * Austin lat/long: 30.2676,-97.74298
  * Austin WOEID: 2357536
  */
  $(document).ready(function() {
    loadWeather('Seattle',''); //@params location, woeid
  });

  function loadWeather(location, woeid) {
    $.simpleWeather({
      location: location,
      woeid: woeid,
      unit: 'f',
      success: function(weather) {
	html = '<i class="icon-'+weather.code+'"></i> ';
	html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
        html += '<li>'+weather.temp+'&deg;'+weather.units.temp+'</li>';
	html += '<li class="currently">'+weather.currently+'</li>';
	html += '</ul>';
	
	$("#weather").html(html);
      },
      error: function(error) {
	$("#weather").html('<p>'+error+'</p>');
      }
    });
  }



});
