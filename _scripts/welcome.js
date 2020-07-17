var tabLinks;

window.onload = function() {
    
    tabLinks = document.getElementById("tabsFlexHeader").getElementsByTagName("div");
    for (var i = 0; i < tabLinks.length; i++) {
        tabLinks[i].onclick = function() { 
			playVideo(this); 
			return false;
		}
        tabLinks[i].onfocus = function() { 
			playVideo(this); 
			return false;
		}
    }
    
    imageArray = document.getElementsByClassName("leftImageContainer");
    for (var i = 0; i < imageArray.length; i++) {
        imageArray[i].onclick = function() { 
			enlargePhoto(this); 
			return false;
		}
        imageArray[i].onfocus = function() { 
			enlargePhoto(this); 
			return false;
		}
    }

}

function playVideo(tabToActivate) {
    if (tabToActivate.classList.contains("selectedVideo")) {
        return;
    }
    for (var i = 0; i < tabLinks.length; i++) {
        if (i.toString() == tabToActivate.id) {
            tabLinks[i].classList.add("selectedVideo");
            tabLinks[i].classList.remove("unSelectedVideo");
            document.getElementById("videoPlayer".concat(i.toString())).classList.add("selectedVideoPlayer");
            document.getElementById("videoPlayer".concat(i.toString())).classList.remove("unSelectedVideoPlayer");

        } else {
            tabLinks[i].classList.add("unSelectedVideo");
            tabLinks[i].classList.remove("selectedVideo");
            document.getElementById("videoPlayer".concat(i.toString())).pause();
            document.getElementById("videoPlayer".concat(i.toString())).classList.remove("selectedVideoPlayer");
            document.getElementById("videoPlayer".concat(i.toString())).classList.add("unSelectedVideoPlayer");

        }
	}
}

function enlargePhoto(imageToDisplay) {
    var img = imageToDisplay.getElementsByTagName("img")[0];
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    modal.style.display = "block";
    modalImg.src = img.src;
    captionText.innerHTML = img.alt;

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() { 
      modal.style.display = "none";
    }
}