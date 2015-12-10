

Tasks = new Mongo.Collection("tasks");
console.log("start");
if (Meteor.isServer) {

  Meteor.startup(function(){
    var globalObject=Meteor.isClient?window:global;
    for(var property in globalObject){
        var object=globalObject[property];
        if(object instanceof Meteor.Collection){
            object.remove({});
        }
    }
});

  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish("tasks", function () {
    return Tasks.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });

  Meteor.methods({

  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
 
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username|| Meteor.user().profile.name ,
      email: Meteor.user().email
    });
  },

  deleteTask: function (taskId) {
        var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
 
    Tasks.remove(taskId);
  },
  // setChecked: function (taskId, setChecked) {
  //   var task = Tasks.findOne(taskId);
  //   if (task.private && task.owner !== Meteor.userId()) {
  //     // If the task is private, make sure only the owner can check it off
  //     throw new Meteor.Error("not-authorized");
  //   }

  //   Tasks.remove(taskId);
  // },
  setChecked: function (taskId, setChecked) {
     var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, { $set: { checked: setChecked} });
  },

  setPrivate: function (taskId, setToPrivate) {

    console.log("here-2");
    var task = Tasks.findOne(taskId);
 
    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
 
    Tasks.update(taskId, { $set: { private: setToPrivate } });
    console.log("here-3");
  }


 });
}

// if (Meteor.isClient) {
//   // This code only runs on the client

//   Template.body.helpers({
//     tasks: [
//       { text: "Setup-AWS" },
//       { text: "Create Website" },
//       { text: "Create Wordpress Blog" },
//       { text: "Get Domain name and Hosting space" },
//       { text: "Place Website with blog on the Hosting space" },
//     ]
//   });
// }
 
if (Meteor.isClient) {

  Meteor.subscribe("tasks");
  // This code only runs on the client

  // Template.body.helpers({
  //   tasks: function () {
  //     return Tasks.find({}, {sort: {createdAt: -1}});
  //   }
  // });
  
  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },

    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }


  });
  


  
    Template.body.events({


    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      console.log(event);

      // Get value from form element
      var text = event.target.text.value;
 
      // // Insert a task into the collection
      // Tasks.insert({
      //   text: text,
    
      //   createdAt: new Date(),            // current time
      //   owner: Meteor.userId(),           // _id of logged in user
      //   username: Meteor.user().username  // username of logged in user
      // });

      // Insert a task into the collection
      Meteor.call("addTask", text);
 
      // Clear form
      event.target.text.value = "";


    },

    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }

    });



     Template.task.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });
 
 Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Meteor.call("setChecked", this._id, ! this.checked);
    },
    "click .delete": function () {
      Meteor.call("deleteTask", this._id);
    }
  });

    Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      // Tasks.update(this._id, {
      //   $set: {checked: ! this.checked}

        Meteor.call("setChecked", this._id, ! this.checked);
      
    },
    "click .delete": function () {
      // Tasks.remove(this._id);
      Meteor.call("deleteTask", this._id);
    
    },
    "click .toggle-private": function () {
      console.log("here-1");

      Meteor.call("setPrivate", this._id, ! this.private);

    }
     
  
    });



    Accounts.ui.config({
      requestOfflineToken: {
        google: true
      },
      passwordSignupFields: 'USERNAME_AND_EMAIL'});



  Meteor.methods({

     



  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
 
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      email:Meteor.user().email
    });
  },

  deleteTask: function (taskId) {
        var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
 
    Tasks.remove(taskId);
  },
  // setChecked: function (taskId, setChecked) {
  //   var task = Tasks.findOne(taskId);
  //   if (task.private && task.owner !== Meteor.userId()) {
  //     // If the task is private, make sure only the owner can check it off
  //     throw new Meteor.Error("not-authorized");
  //   }

  //   Tasks.remove(taskId);
  // },
  setChecked: function (taskId, setChecked) {
     var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, { $set: { checked: setChecked} });
  },

  setPrivate: function (taskId, setToPrivate) {

    console.log("here-2");
    var task = Tasks.findOne(taskId);
 
    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
 
    Tasks.update(taskId, { $set: { private: setToPrivate } });
    console.log("here-3");
  }


 });

}

