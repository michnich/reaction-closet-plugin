Template.closetProduct.helpers({
  isUser: function(){
    return Meteor.userId() === FlowRouter.getParam("userId");
  },
  isOwner: function(){
    return Roles.userIsInRole(Meteor.userId(),['dashboard','owner','admin']);
  },
  productImage: function() {
    return this.image[0];
  },
  /*shouldShow: function() {
  	if (this.published) { //everyone can see published products
  		return true;
  	}
  	//product owners and site admins can see all products
  	else if (Meteor.userId() === FlowRouter.getParam("userId") || Roles.userIsInRole(Meteor.userId(),['dashboard','owner','admin'])) {
  		return true;
  	}
  	//otherwise don't show (unpublished product to other site users)
  	else {
  		return false;
  	}
  }*/
});