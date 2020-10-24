const admin = require('firebase-admin');
const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
admin.initializeApp(functions.config().firebase);

exports.notificationTrigger = functions.firestore.document('/complaints/{complaintId}').onUpdate(
  (change, context) => {
    const complaintId = context.params.complaintId;
    const data = change.after.data();
    const previousData = change.before.data();

    functions.logger.info(`Complaint ${complaintId} Updated!`);

    if (data.status !== previousData.status) {
      const userId = data.uid;
      const userNotificationCollection = admin.firestore().collection(`/users/${userId}/notifications`);
      const notificationTime = new Date();
      userNotificationCollection.add({ time: notificationTime, complaintId: complaintId, title: data.title});
      console.log(`Added Notification to the person of complaint ${complaintId}`)
      return true;

      /*
      const bookmarkers = data.bookmarkers;
      if (bookmarkers) {
        for (let index in bookmarkers) {
          admin.firestore().collection(`/users/${bookmarkers[index]}/notifications`).add({ time: notificationTime, complaintId: complaintId, title: data.title});
        }
        console.log('Added Notification to all bookmarkers');
      }
      */
    }

    return null;

  }
);