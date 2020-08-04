var tabLinks;

window.onload = function() {
    
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