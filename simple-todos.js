if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: [
      { text: "Setup Meteor Dev Stack" },
      { text: "Create Website" },
      { text: "Create Wordpress Blog" },
      { text: "Get Domain name and Hosting space" },
      { text: "Place Website with blog on the Hosting space" },
    ]
  });
}