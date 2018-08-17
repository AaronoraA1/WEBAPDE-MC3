$(document).ready(function() {
	$(".meme").click(function(e) {
        var id = $(this).attr("data-id")
        console.log("WORKING " + id)
        e.preventDefault
		$(".memesidebar[data-id="+id+"]").toggleClass("togglesidebar") 
        console.log("asd")
	})
})
    
//	$("#registerbutton").click(function(e) {
//		e.preventDefault
//		if ($("#wrapper").hasClass("toggledlogin")) {
//			$("#wrapper").removeClass("toggledlogin")
//			$("#wrapper").addClass("toggledregister")
//		} else if ($("#wrapper").hasClass("toggledregister")) {
//			$("#wrapper").removeClass("toggledregister")
//		} else {
//			$("#wrapper").addClass("toggledregister")
//		}
//	})
//});