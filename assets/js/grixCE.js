(function($){
	$(document).ready(function(){


		// the new CE should be saved
		// Let's paste it into the grix JSON before
		$('#saveNclose').click(function(e) {

			var phId = getUrlParameter('phid');
			var articleId = getUrlParameter('pid');
			var ceId = getUrlParameter('id');
			
			loadGrixJs(articleId,phId,ceId);
			
		    e.preventDefault();
			return false;
		});


		// load the grix js for the current article and insert the CE
		function loadGrixJs(articleId,phId,ceId) {
			$.ajax({
				url: 'system/modules/gp_grix/ajax/ajax_load.php',
				data: {
					articleId: articleId
				},
				success: function(data){

					// Convert the JSON to js
					var obGrixJs = JSON.parse(data);

					// Find the place where the element is to be inserted
					var arId = phId.split("_");
					var obP = {
						elements: obGrixJs,
						pos: parseInt(arId[0])
					};
					for (var i = 0; i < arId.length-1; i++) {
						obP = obP.elements[arId[i]];
						obP.pos = parseInt(arId[i+1]);
					};

					// Create the new element
					var newCE = {
						type: "ce",
						id: ceId
					};

					if (obP.elements[obP.pos].elements) {
						// Insert the element
						obP.elements[obP.pos].elements.push(newCE);
						
					} else{
						obP.elements.splice(obP.pos+1, 0, newCE);
						// console.log(obP.elements[obP.pos]);
					};

					// Convert back to JSON and save it
					var stGrixJs = JSON.stringify(obGrixJs);
			        saveGrixJs(stGrixJs,articleId,ceId);
					
				},
				error: function (xhr, textStatus, errorThrown) {
					alert('ajax error ' + (errorThrown ? errorThrown : xhr.status));
				}
			});	
		}


		// save the grix js of the current article
		function saveGrixJs(grixjs,articleId,ceId) {
			$.ajax({
				url: 'system/modules/gp_grix/ajax/ajax_insert.php',
				data: {
					grixjs: grixjs,
					articleId: articleId,
					ceId: ceId
				},
				success: function(msg){
					// console.log(msg);

					// dont execute 'loadGrixJs' again
					$('#saveNclose').off('click');

					// submit the ce form
					$('#saveNclose').trigger('click');
				},
				error: function (xhr, textStatus, errorThrown) {
					alert('ajax error ' + (errorThrown ? errorThrown : xhr.status));
				}
			});
		}


		var getUrlParameter = function getUrlParameter(sParam) {
		    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
		        sURLVariables = sPageURL.split('&'),
		        sParameterName,
		        i;

		    for (i = 0; i < sURLVariables.length; i++) {
		        sParameterName = sURLVariables[i].split('=');

		        if (sParameterName[0] === sParam) {
		            return sParameterName[1] === undefined ? true : sParameterName[1];
		        }
		    }
		};


	});
})(jQuery);