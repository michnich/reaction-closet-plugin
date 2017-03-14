import { check } from "meteor/check";
import { Packages, Shops } from "/lib/collections";
import { Hooks, Reaction } from "/server/api";

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
