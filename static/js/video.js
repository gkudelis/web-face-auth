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
        var ctx = canvas.getContext('2d');
        if (preview_streaming) {
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(video, 0, 0, width, height);
            data = canvas.toDataURL('image/png');
            //photo.setAttribute('src', data);
            
            // ajax back to the server
            $.ajax('/photo', {
                type: 'POST',
                data: data.split(',')[1],
                processData: false,
                complete: function(response) {
                    //var faces = response.responseJSON.faces;
                    //ctx = canvas.getContext('2d');
                    //faces.forEach(function(face) {
                    //    console.log(face);
                    //    ctx.strokeRect(face.x, face.y, face.w, face.h);
                    //});
                    //data = canvas.toDataURL('image/png');
                    //photo.setAttribute('src', data);
                    console.log(response.responseText);
                    if (response.responseText == 'true') {
                        swal("Great!", "You are authenticated.", "success")
                    } else {
                        swal("Sorry!", "Couldn't authenticate you.", "error")
                    }
                },
                contentType: 'text/plain',
            });
        } else {
            alert('Yeah. Too early cowboy!');
        }
    });
});
