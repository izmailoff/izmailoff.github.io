if (sessionStorage.getItem("theme") == "dark") {
	$('html').addClass("dark");
}

$(document).ready(function() {
	$(".theme-toggle").click(function(e) {
		e.preventDefault();
		$('html').toggleClass("dark");
		if ($('html').hasClass("dark")) {
			sessionStorage.setItem("theme", "dark");
		}
		else {
			sessionStorage.setItem("theme", "light");
		}
	})
});
