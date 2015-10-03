//var endpoint;
//var activeConversation;
var previewMedia;

// check for WebRTC
if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
  alert('WebRTC is not available in your browser.');
}

// generate an access token in the Twilio Account Portal - https://www.twilio.com/user/account/video/testing-tools
//window.accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1zYXQ7dj0xIn0.eyJqdGkiOiJTSzY1NDdkZDAyNDAyOTRkMjNlYWVkNzQyYzBhM2IyYTgzLTE0NDM4NzQ3MzUiLCJpc3MiOiJTSzY1NDdkZDAyNDAyOTRkMjNlYWVkNzQyYzBhM2IyYTgzIiwic3ViIjoiQUMzNGMzOGFiOWM0NzFjMmFkZGFmMmUzOWQxYTMxN2M1YSIsIm5iZiI6MTQ0Mzg3NDczNSwiZXhwIjoxNDQzOTYxMTM1LCJncmFudHMiOlt7InJlcyI6Imh0dHBzOlwvXC9hcGkudHdpbGlvLmNvbVwvMjAxMC0wNC0wMVwvQWNjb3VudHNcL0FDMzRjMzhhYjljNDcxYzJhZGRhZjJlMzlkMWEzMTdjNWFcL1Rva2Vucy5qc29uIiwiYWN0IjpbIlBPU1QiXX0seyJyZXMiOiJzaXA6cXVpY2tzdGFydEBBQzM0YzM4YWI5YzQ3MWMyYWRkYWYyZTM5ZDFhMzE3YzVhLmVuZHBvaW50LnR3aWxpby5jb20iLCJhY3QiOlsibGlzdGVuIiwiaW52aXRlIl19XX0.wpqtP8wcq-bzGO4GhzDb_Uuwe_o45x6IA8CPqZ3Pu2I";

//// create an Endpoint and connect to Twilio
//endpoint = new Twilio.Endpoint(accessToken);
//endpoint.listen().then(
//  endpointConnected,
//  function (error) {
//    log('Could not connect to Twilio: ' + error.message);
//  }
//);

//// successfully connected!
//function endpointConnected() {
//  document.getElementById('invite-controls').style.display = 'block';
//  log("Connected to Twilio. Listening for incoming Invites as '" + endpoint.address + "'");
//
//  endpoint.on('invite', function (invite) {
//    log('Incoming invite from: ' + invite.from);
//    invite.accept().then(conversationStarted);
//  });
//
//  // bind button to create conversation
//  document.getElementById('button-invite').onclick = function () {
//    var inviteTo = document.getElementById('invite-to').value;
//
//    if (activeConversation) {
//      // add a participant
//      activeConversation.invite(inviteTo);
//    } else {
//      // create a conversation
//      var options = {};
//      if (previewMedia) {
//        options.localMedia = previewMedia;
//      }
//      endpoint.createConversation(inviteTo, options).then(
//        conversationStarted,
//        function (error) {
//          log('Unable to create conversation');
//          console.error('Unable to create conversation', error);
//        }
//      );
//    }
//  };
//};
//
//// conversation is live
//function conversationStarted(conversation) {
//  log('In an active Conversation');
//  activeConversation = conversation;
//  // draw local video, if not already previewing
//  if (!previewMedia) {
//    conversation.localMedia.attach('#local-media');
//  }
//  // when a participant joins, draw their video on screen
//  conversation.on('participantConnected', function (participant) {
//    log("Participant '" + participant.address + "' connected");
//    participant.media.attach('#remote-media');
//  });
//  // when a participant disconnects, note in log
//  conversation.on('participantDisconnected', function (participant) {
//    log("Participant '" + participant.address + "' disconnected");
//  });
//  // when the conversation ends, stop capturing local video
//  conversation.on('ended', function (conversation) {
//    log("Connected to Twilio. Listening for incoming Invites as '" + endpoint.address + "'");
//    conversation.localMedia.stop();
//    conversation.disconnect();
//    activeConversation = null;
//  });
//};

//  local video preview
$('#start-preview').click(function () {
  if (!previewMedia) {
    previewMedia = new Twilio.LocalMedia();
    Twilio.getUserMedia().then(
      function (mediaStream) {
        previewMedia.addStream(mediaStream);
        previewMedia.attach('#video-preview');
      },
      function (error) {
        console.error('Unable to access local media', error);
        log('Unable to access Camera and Microphone');
      }
    );
  };
};

// activity log
function log(message) {
  document.getElementById('log-content').innerHTML = message;
};
