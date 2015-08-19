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
  
  function SocialButtons(){}

  SocialButtons.prototype.init = function(){
    $(".share-facebook").click(function(){
      FB.ui({
	method: 'share',
	href: window.location.href
      }, function(response){});
    });
  }
  

  var socialButtons = new SocialButtons();
  socialButtons.init();


  /* Random Post List */

  function RandomPostList(numPosts){
    this.numPosts = numPosts;
  }

  // appends this.numPosts posts to a selector
  RandomPostList.prototype.generate = function(selector){
      var self = this;
      $.getJSON('search.json', function(posts){
	posts = shuffleArray(posts);
	var postList = $("<ul></ul>");
	for(var i = 0; i < self.numPosts; i++){
	  var title = posts[i].title;
	  var href = posts[i].href;
	  postList.append("<li><a href='" + href + "'>" + title + "</a></li>");
	}
	$(selector).append(postList);
      })
    }

  var skyPosts = new RandomPostList(3);
  skyPosts.generate(".sky-random-posts");


  

});
