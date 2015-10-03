$(function() {
    // check for WebRTC
    if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
        alert('WebRTC is not available in your browser.');
    }

    navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

    var preview_running = false;
    var canvas = $('#util-canvas-1').get(0);
    var video = $('#video-preview').get(0);

    //  local video preview
    $('#start-preview').click(function () {
        if (!preview_running) {
            navigator.getMedia( { video: true, audio: false },
                function (stream) {
                    if (navigator.mozGetUserMedia) {
                        video.mozSrcObject = stream;
                    } else {
                        var vendorURL = window.URL || window.webkitURL;
                        video.src = vendorURL.createObjectURL(stream);
                    }
                    video.play();
                    preview_running = true;
                },
                function (error) {
                    console.error('Unable to access local media', error);
                }
            );
        };
    });
});
