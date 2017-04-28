import { check } from "meteor/check";
import { Meteor } from 'meteor/meteor';
import { Packages, Shops, Accounts } from "/lib/collections";
import { Hooks, Reaction } from "/server/api";
import { UserProducts } from '../../product_upload/lib/collections';

function addRolesToVisitors() {
  // Add the about permission to all default roles since it's available to all
  const shop = Shops.findOne(Reaction.getShopId());
  Shops.update(shop._id, {
    $addToSet: { defaultVisitorRole: "closet" }
  });
  Shops.update(shop._id, {
    $addToSet: { defaultRole: "closet" }
  });
}

/**
 * Hook to make additional configuration changes
 */
Hooks.Events.add("afterCoreInit", () => {
  addRolesToVisitors();
});

//Same function can probably use to update?
function addCloset(accountId, profile) {
	//check all parameters
	check(accountId, String);
	check(profile, Object);
	check(profile.first_name, String);
	check(profile.last_name, String);
	check(profile.about, String);
	//update account
	Accounts.update({"userId": accountId},  {$set: {"profile.closet": profile}}, {upsert: true});
};

function updateCloset(accountId, profile) {
	//check all parameters
	check(accountId, String);
	check(profile, Object);
	check(profile.first_name, String);
	check(profile.last_name, String);
	check(profile.about, String);
	//update account
	Accounts.update({"userId": accountId},  {$set: {"profile.closet": profile}});
};

function addProfilePic(accountId, profilePic) {
	check(accountId, String);
	check(profilePic, String);
	Accounts.update({"userId": accountId}, {$set: {"profile.closet.profile_pic": profilePic}}, {upsert: true});
};

function editProfilePic(accountId, profilePic) {
	check(accountId, String);
	check(profilePic, String);
	Accounts.update({"userId": accountId}, {$set: {"profile.closet.profile_pic": profilePic}});
	//delete old pic from cloudinary??
};



Meteor.methods({
  "closet/addCloset": addCloset,
  "closet/updateCloset": updateCloset,
  "closet/addProfilePic": addProfilePic,
  "closet/editProfilePic": editProfilePic
});


Meteor.publish('userCloset', function (id) {
  check(id, String);
  return Accounts.find({"userId": id}, {
    fields: { "profile.closet": 1 }
  });
});
