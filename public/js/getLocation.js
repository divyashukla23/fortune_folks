window.onload = function () {
	var lat = document.getElementById("latitude");
	var lon = document.getElementById("longitude");
	var z = document.getElementById("demo");
	getLocation();
	function getLocation() {
		console.log("HERE");
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(getPosition, showError);
		} else {
			z.innerHTML = "Geolocation is not supported by this browser.";
		}
	}

	function getPosition(position) {
		console.log(position);
		lat.value = position.coords.latitude;
		lon.value = position.coords.longitude;
	}

	function showError(error) {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				z.innerHTML = "User denied the request for Geolocation.";
				break;
			case error.POSITION_UNAVAILABLE:
				z.innerHTML = "Location information is unavailable.";
				break;
			case error.TIMEOUT:
				z.innerHTML = "The request to get user location timed out.";
				break;
			case error.UNKNOWN_ERROR:
				z.innerHTML = "An unknown error occurred.";
				break;
		}
	}
};
