$(function() {
    // check for WebRTC
    if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
        alert('WebRTC is not available in your browser.');
    }

    navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

    var preview_connected = false, preview_streaming = false;
    var canvas = $('#util-canvas-1').get(0);
    var video = $('#video-preview').get(0);
    var photo = $('#snapshot-img').get(0);
    var width, height;

    //  local video preview
    $('#start-preview').click(function () {
        if (!preview_connected) {
            navigator.getMedia( { video: true, audio: false },
                function (stream) {
                    if (navigator.mozGetUserMedia) {
                        video.mozSrcObject = stream;
                    } else {
                        var vendorURL = window.URL || window.webkitURL;
                        video.src = vendorURL.createObjectURL(stream);
                    }
                    video.play();
                    // mark as connected
                    preview_connected = true;
                },
                function (error) {
                    console.error('Unable to access local media', error);
                }
            );
        };
    });

    // sorthing out some width/height stuff
    $(video).on('canplay', function() {
        if (!preview_streaming) {
            width = video.videoWidth;
            height = video.videoHeight;
            if (isNaN(height)) {
                height = width / (4/3);
            }
            // debug!
            console.log( { width: width, height: height } );
            // set up canvas size and stuff
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            // mark as streaming
            preview_streaming = true;
        }
    });

    $('#snapshot').click(function() {
        var context = canvas.getContext('2d');
        if (preview_streaming) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);
            data = canvas.toDataURL('image/png');
            console.log(data);
            photo.setAttribute('src', data);
        } else {
            alert('Yeah. Too early cowboy!');
        }
    });
});
