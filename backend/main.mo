import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Data Types
  public type BinState = {
    id : Text;
    location : Text;
    fillLevel : Nat; // Percentage
    lastCollected : Time.Time;
    alerts : [AlertEntry];
  };

  public type AlertEntry = {
    timestamp : Time.Time;
    level : Nat;
    resolved : Bool;
  };

  public type CollectionLogEntry = {
    binId : Text;
    time : Time.Time;
    collectedBy : Principal;
    fillLevelBefore : Nat;
  };

  // Persistent Storage
  let bins = Map.empty<Text, BinState>();
  let collectionLog = List.empty<CollectionLogEntry>();

  // Public Methods

  // Reading bin state is open to everyone including guests
  public query ({ caller }) func getBinState(binId : Text) : async ?BinState {
    if (not (AccessControl.hasPermission(accessControlState, caller, #guest))) {
      Runtime.trap("Unauthorized: Only guests can read bin state");
    };
    bins.get(binId);
  };

  // Reading all bins is open to everyone including guests
  public query ({ caller }) func getAllBins() : async [BinState] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #guest))) {
      Runtime.trap("Unauthorized: Only guests can read all bins");
    };
    bins.values().toArray();
  };

  // Updating bin fill levels requires at least user role
  public shared ({ caller }) func updateBinFillLevel(binId : Text, newLevel : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update bin fill levels");
    };
    if (newLevel > 100) { Runtime.trap("Invalid fill level. Bin fill level > 100 are not supported") };
    switch (bins.get(binId)) {
      case (?bin) {
        let updatedBin : BinState = {
          id = bin.id;
          location = bin.location;
          fillLevel = newLevel;
          lastCollected = bin.lastCollected;
          alerts = bin.alerts;
        };
        bins.add(binId, updatedBin);
      };
      case (null) { Runtime.trap("Bin not found") };
    };
  };

  // Adding alerts requires at least user role
  public shared ({ caller }) func addAlert(binId : Text, level : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add alerts");
    };
    switch (bins.get(binId)) {
      case (?bin) {
        if (bin.fillLevel < level) { Runtime.trap("Threshold is not reached. Alert has not been triggered!") };
        let alert : AlertEntry = {
          timestamp = Time.now();
          level;
          resolved = false;
        };
        let alertsList = List.fromArray<AlertEntry>(bin.alerts);
        alertsList.add(alert);
        let updatedBin : BinState = {
          id = bin.id;
          location = bin.location;
          fillLevel = bin.fillLevel;
          lastCollected = bin.lastCollected;
          alerts = alertsList.toArray();
        };
        bins.add(binId, updatedBin);
      };
      case (null) { Runtime.trap("Bin not found") };
    };
  };

  // Dispatching a collection is an admin-only operation
  public shared ({ caller }) func dispatchCollection(binId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can dispatch collections");
    };
    switch (bins.get(binId)) {
      case (?bin) {
        let logEntry : CollectionLogEntry = {
          binId;
          time = Time.now();
          collectedBy = caller;
          fillLevelBefore = bin.fillLevel;
        };
        collectionLog.add(logEntry);

        let updatedBin : BinState = {
          id = bin.id;
          location = bin.location;
          fillLevel = 0;
          lastCollected = Time.now();
          alerts = bin.alerts.map(
            func(alert) {
              {
                timestamp = alert.timestamp;
                level = alert.level;
                resolved = true;
              };
            }
          );
        };
        bins.add(binId, updatedBin);
      };
      case (null) { Runtime.trap("Bin not found") };
    };
  };

  // Retrieving collection history is open to everyone including guests
  public query ({ caller }) func getCollectionLog() : async [CollectionLogEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #guest))) {
      Runtime.trap("Unauthorized: Only guests can read collection log");
    };
    collectionLog.toArray();
  };
};
