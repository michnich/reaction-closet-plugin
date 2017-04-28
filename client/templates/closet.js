import { Router } from "/client/api";
import { Accounts } from '/lib/collections';
import { Meteor } from "meteor/meteor";
import { Template } from 'meteor/templating';
import { ProfileImages } from '../../lib/profileImages.js';

//FOR PROFILE IMAGE FORM
const Collections = {
  ProfileImages
};

Template.registerHelper('Collections', Collections);

Template.closet.onCreated(function() {
  Session.set("userCloset", {});
  Session.set("editImage", false);
});

Template.closet.rendered = function(){
  var userId = FlowRouter.getParam("userId");
  this.subscribe("userCloset", userId, function() {
    var account = Accounts.findOne({
      "userId": userId
    });
    Session.set('userCloset', account);
  });
  this.subscribe('userProductsByUser', userId);

  //account of logged in user
  var accountId = Meteor.userId();

  //if this is the logged in users profile and the first name isn't set
  //show modal to set up closet
  if ((accountId == closet.userId) && (_.isEmpty(closet.profile.closet))){
    $('#editProfile').modal('show');
  };
  //$('[data-toggle="tooltip"]').tooltip();

  //if the user clicks set up later, redirects to homepage and closes modal
  /*$('#setUpLater').on('click',function(){
    $('.modal-backdrop').remove();
    $('#editProfile').close();
    Router.go('/');
  });*/

  /*$('.edit-profile').on('click',function(){
    $('#editExistingProfile').modal('show');
  });*/
}

/*
  can change these helpers once the user directory subscription issue is fixed
  right now subscribes to all users so need to limit search
  after should only be subscribed to the seller and can be returned from router
*/

Template.closet.helpers({
  isUser: function(){
    return Meteor.userId() === FlowRouter.getParam("userId");
  },
  isOwner: function(){
    return Roles.userIsInRole(Meteor.userId(),['dashboard','owner','admin']);
  },
  /*username: function(){
    return Meteor.users.findOne({"_id": Router.current().params.userId}).profile.username;
  },
  userEmail: function(){
    var user = Router.current().params.userId;
    return Meteor.users.findOne({"_id":user}).emails[0].address;
  },
  userId: function() {
    return Router.current().params.userId;;
  },*/
  //super important function that allows us to index the current user that is showed in closet
  firstName: function(){
    return Session.get("userCloset").profile.closet.first_name;
  },
  lastName: function() {
    return Session.get("userCloset").profile.closet.last_name;
  },
  aboutYou: function(){
    return Session.get("userCloset").profile.closet.about;
  },
  /*products: function(){
    var user = Router.current().params.userId;
    var email = Meteor.users.findOne({"_id":user}).emails[0].address;
    return userProducts.find({author: email}).fetch()
  },
  isVerified: function(){
    var user = Router.current().params.userId;
    return Meteor.users.findOne({"_id":user}).emails[0].verified;
  },
  isListed: function(){
    return userProducts.findOne({_id:this._id}).link_id;
  },
  profileUrl: function(){
    var imageSource = $('.uploaded-image').attr('src');
    return imageSource;
  },*/
  profilePic: function () {
    return Session.get("userCloset").profile_pic;
  },
  edit: function() {
    return Session.get("editImage");
  }
});


// verify product has been listed by adding link_id
Template.closet.events({
  //INITIAL PROFILE SETUP
  "submit .closetinfo": function (event) {
    event.preventDefault();
   
    // Get the first name, last name and about
    var profile = {
      "first_name": $('#firstName').val(),
      "last_name": $('#lastName').val(),
      "about": $('#aboutYou').val()
    };

    //Update user profile using reaction Account id
    var id = Meteor.userId();
    Meteor.call('closet/addCloset', id, profile);

    // close current modal
    $('#editProfile').modal('hide');

    Session.set("userCloset", profile);
  },

  //EDIT PROFILE
  "submit .closetUpdate": function(event) {
    event.preventDefault();
   
    // Get the first name, last name and about
    var profile = {
      "first_name": $('#first').val(),
      "last_name": $('#last').val(),
      "about": $('#about').val(),
      "profile_pic": Session.get('userCloset').profile_pic
    };

    //Update user profile using reaction Account id
    var id = Meteor.userId();
    Meteor.call('closet/updateCloset', id, profile);

    // hide modal
    $('#editExistingProfile').modal('hide');

    Session.set("userCloset", profile);

  },
  "click #setUpLater": function(event) {
    $('#editProfile').modal('hide');
    $('.modal-backdrop').remove();
    Router.go('/');
    $('.modal-backdrop').remove();
  },
  /*"click .updateIdTrigger": function(event){
    //Modal.show('#updateModal');
  },
  "submit .idUpdate": function (event){
    event.preventDefault();
    var oldId = this._id;
    var newId = event.target.text.value;
    alert(oldId);
    alert(newId);
    userProducts.update(oldId, {
      $set: {link_id: newId}
    });

    //send email to user saying that the product has been listed
    var user = Router.current().params.username;
    var userEmail = Meteor.users.findOne({"_id":user}).emails[0].address;
    Meteor.call('sendEmail', {
      to: userEmail,
      from: 'no-reply@huntrs.com',
      subject: 'Your product has been listed!',
      text: 'Mailgun is totally awesome for sending emails!',
      html: '<h1>Congratulations</h1> <br> <h2>Your Product has been listed on the shop! You are well on your way to cashing in!</h2>'
    });
  },*/
  //initial profile image set
  "click .add-profile-image": function(event){
    var profileImage = $('.afCloudinary-thumbnail a').attr('href');
    var id = Meteor.userId();
    Meteor.call('closet/addProfilePic', id, profileImage, function(error, result) {
      if (!error) {
        var user = Session.get('userCloset');
        user.profile_pic = profileImage;
        Session.set("userCloset", user);
      }
      else {
        //style this
        alert("Something went wrong. Please try again. " + error.message);
      }
    });
  },
  //hides current profile image and edit button
  //sets session variable so edit form and submit button is shown
  "click .edit-profile-image": function(event) {
    $(".edit-profile-image").hide();
    $(".user-header-avatar").hide();
    Session.set("editImage", true);
  },
  //when the user edits their profile image
  "click .submit-profile-image": function(event) {
    var profileImage = $('.afCloudinary-thumbnail a').attr('href');
    var id = Meteor.userId();
    Meteor.call('closet/editProfilePic', id, profileImage, function(error, result) {
      if (!error) {
        var user = Session.get('userCloset');
        user.profile_pic = profileImage;
        Session.set("userCloset", user);
      }
      else {
        //style this
        alert("Something went wrong. Please try again. " + error.message);
      }
    });
    Session.set("editImage", false);
    $(".edit-profile-image").show();
    $(".user-header-avatar").show();
  }
});