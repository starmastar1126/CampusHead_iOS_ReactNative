const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.homePost = functions.https.onCall(data => {
  if (!data.some) {
    throw new functions.https.HttpsError(
      'invalid-argument', // code
      'Your error message goes here', // message
      { foo: 'bar' }, // details - optional and can be anything JSON serializable
    );
  }
  return sendPostNotification(data.some)
});

exports.homeComment = functions.https.onCall(data => {
  if (!data.some) {
    throw new functions.https.HttpsError(
      'invalid-argument', // code
      'Your error message goes here', // message
      { foo: 'bar' }, // details - optional and can be anything JSON serializable
    );
  }
  return sendCommentNotification(data.some)
});

exports.songPost = functions.https.onCall(data => {
  if (!data.some) {
    throw new functions.https.HttpsError(
      'invalid-argument', // code
      'Your error message goes here', // message
      { foo: 'bar' }, // details - optional and can be anything JSON serializable
    );
  }
  return sendPostNotification(data.some)
});

exports.songComment = functions.https.onCall(data => {
  if (!data.some) {
    throw new functions.https.HttpsError(
      'invalid-argument', // code
      'Your error message goes here', // message
      { foo: 'bar' }, // details - optional and can be anything JSON serializable
    );
  }
  return sendCommentNotification(data.some)
});

exports.joinNotify = functions.https.onCall(data => {
  if (!data.some) {
    throw new functions.https.HttpsError(
      'invalid-argument', // code
      'Your error message goes here', // message
      { foo: 'bar' }, // details - optional and can be anything JSON serializable
    );
  }
  return sendJoinNotification(data.some)
});

function sendPostNotification(data) {
  const teamId = JSON.parse(data).teamId;
  const userId = JSON.parse(data).created_by;
  const content = JSON.parse(data).content;
  const username = JSON.parse(data).username;
  const name = JSON.parse(data).name;
  const sendUsers = JSON.parse(data).users;
  let payload = []
  if (name === 0)
    payload = {
      notification: {
        title: username + " posted to your team.",
        body: content,
        sound: "default",
        badge: "1"
      }
    };
  else
    payload = {
      notification: {
        title: username + " posted on " + name,
        body: content,
        sound: "default",
        badge: "1"
      }
    };

  return admin
    .firestore()
    .collection("users")
    .where('teamId', '==', teamId)
    .get()
    .then(querySnapShot => {
      var users = [];
      var newData = [];
      if (sendUsers.length > 0) {
        querySnapShot.forEach(user => {
          newData = sendUsers.filter(item => {
            const itemData = `${item.toUpperCase()}`;
            const textData = user.data().nickname.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          if (newData.length > 0) {
            let pushToken = user.data().fcmToken;
            if (pushToken && pushToken !== '') {
              users.push(pushToken)
            }
          }
        });
      } else {
        querySnapShot.forEach(user => {
          let pushToken = user.data().fcmToken;
          if (pushToken && pushToken !== '') {
            users.push(pushToken)
          }
        });
      }
      return admin.messaging().sendToDevice(users, payload);
    })
}

function sendCommentNotification(data) {
  const teamId = JSON.parse(data).teamId;
  const userId = JSON.parse(data).created_by;
  const content = JSON.parse(data).content;
  const username = JSON.parse(data).username;
  const name = JSON.parse(data).name;
  const sendUsers = JSON.parse(data).users;
  let payload = []
  if (name === 0)
    payload = {
      notification: {
        title: username + " commented on a post.",
        body: content,
        sound: "default",
        badge: "1"
      }
    };
  else
    payload = {
      notification: {
        title: username + " commented on " + name,
        body: content,
        sound: "default",
        badge: "1"
      }
    };

  return admin
    .firestore()
    .collection("users")
    .where('teamId', '==', teamId)
    .get()
    .then(querySnapShot => {
      var users = [];
      var newData = [];
      if (sendUsers.length > 0) {
        querySnapShot.forEach(user => {
          newData = sendUsers.filter(item => {
            const itemData = `${item.toUpperCase()}`;
            const textData = user.data().nickname.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          if (newData.length > 0) {
            let pushToken = user.data().fcmToken;
            if (pushToken && pushToken !== '') {
              users.push(pushToken)
            }
          }
        });
      } else {
        querySnapShot.forEach(user => {
          let pushToken = user.data().fcmToken;
          if (pushToken && pushToken !== '') {
            users.push(pushToken)
          }
        });
      }
      return admin.messaging().sendToDevice(users, payload);
    })
}

function sendJoinNotification(data) {
  const ownerId = JSON.parse(data).ownerId;
  const username = JSON.parse(data).username;
  let payload = []

  payload = {
    notification: {
      title: "New Join Request",
      body: username + " has requested to join your team",
      sound: "default",
      badge: "1"
    }
  };

  return admin
    .firestore()
    .collection("users")
    .where('userId', '==', ownerId)
    .get()
    .then(querySnapShot => {
      var users = [];
      querySnapShot.forEach(user => {
        let pushToken = user.data().fcmToken;
        if (pushToken && pushToken !== '') {
          users.push(pushToken)
        }
      });
      return admin.messaging().sendToDevice(users, payload);
    })
}

