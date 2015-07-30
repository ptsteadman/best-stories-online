$(document).ready(function(){
  
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

});
