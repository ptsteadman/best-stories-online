---
---

var root = "{{ site.url }}";

$(document).ready(function(){
  
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

    this.init = function(selector){
      $(selector).click(function(){
	FB.ui({
	  method: 'share',
	  href: window.location.href
	}, function(response){});
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
  
  /* Make stuff happen */

  var socialButtons = new SocialButtons();
  socialButtons.init(".share-facebook");

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
