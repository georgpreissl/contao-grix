(function($){





	window.Grix = function(obGrixCfg){

		var obData = obGrixCfg.data;
		var level = 0;
		var device = 'lg';
		var boColIsAct = false;
		var arColAct = [];
		var arResKeys = [37,39,27,32];
		var arBootProps = ['width','offset','push','pull'];

		this.init = function(){

			$('body').addClass('grix_lg');

			$(document).keydown(function(e){
				var key = e.keyCode;
				// console.log(key);
			    // 37 = left
			    // 39 = right
			    // 27 = esc
			    // 32 = space bar
			    if (arResKeys.indexOf(key) != -1) {

			    	// left and right keys
			    	if (key == 39 || key == 37) {
						if (arColAct.length) {
							// a column is active, change unit values
					    	$('.c.active').each(function(index, el) {
					    		
						    	var obRow = getObjectsById($(this));
						    	var arCols = obRow.elements;
						    	var obCol = obRow.elements[obRow.pos];
						    	var nrU = obCol.width[device];
							    key == 39 ? nrU++ : nrU--;
							    obCol.width[device] = String(nrU);
					    	});
					    	// redraw the grid every time the col units are changed
							drawGrix();
							addUi();
						} else {
						    // no column active, change device
						    if (key == 39) {
						    	$('.grix_device_switch_next').trigger('click');
						    }
						    if (key == 37) {
						    	$('.grix_device_switch_prev').trigger('click');
						    }
						}
			    	}

				    // esc-key – unselect every column
				    if (key == 27) { 
						if (boColIsAct) {
					    	// console.log('unselect');
					    	arColAct = [];
					    	$('.c').removeClass('active');
					    	boColIsAct = false;
					    	$(".info").text('');
				    	}
				    }

				    // space bar – toggle preview
				    if (key == 32) { 
						$('body').toggleClass('grix_preview');
				    }
			    	e.preventDefault();
				}
					

			});


			$('.grix_toggle_preview').click(function(e) {
				e.preventDefault();
				$('body').toggleClass('grix_preview');
			});

			$('.grix_device_switch').click(function(e){
				e.preventDefault();
				if ($(this).data('direction')=='next') {
					$next = $('.grix_device.active').next('.grix_device').length == 0 ? $('.grix_device').first() : $('.grix_device.active').next();
				} else{
					$next = $('.grix_device.active').prev('.grix_device').length == 0 ? $('.grix_device').last() : $('.grix_device.active').prev();
				};
				$next.trigger('click');
			})

			arDvX = ['xs','sm','md','lg'];

			$('.grix_device').click(function(e){
				e.preventDefault();
				$(this).addClass('active').siblings('.grix_device').removeClass('active');
				device = $(this).data('device');

				$('body').removeClass('grix_xs grix_sm grix_md grix_lg');
				for (var i = 0; i < arDvX.length; i++) {
					if (arDvX[i] != device) {
						$('body').addClass('grix_'+arDvX[i]);
					} else {
						break;
					};
					
				};
				$('body').addClass('grix_'+device);
				// $('body').removeClass('grix_sm grix_md grix_lg').addClass('grix_'+device);
				drawGrix();
				addUi();
			})


			$('.grix_bt').click(function(e){
				e.preventDefault();
				var order = $(this).data('bt');
				var dir = $(this).data('dir');
				console.log(order);
				if (arColAct.length) {
					// a column is active, change unit values
			    	$('.c.active').each(function(index, el) {
			    		
				    	var obRow = getObjectsById($(this));
				    	var arCols = obRow.elements;
				    	var obCol = obRow.elements[obRow.pos];
				    	var nrU = obCol[order][device];
				    	if (nrU=="x") {
				    		if (order=="width") {
					    		nrU = 12;
				    			
				    		} else {
					    		nrU = 0;

				    		};

				    	};
				    	nrU = parseInt(nrU);
				    	console.log(nrU);
				    	if (dir=='minus') {
						    if (nrU>0) {
						    	nrU--;
						    };
				    		
				    	} else{
				    		if (nrU<12) {
				    			nrU++;
				    		};
				    	};
				    	$('.info_'+order).text(nrU);
					    // dir == 'minus' ? nrU-- : nrU++;
					    obCol[order][device] = String(nrU);
			    	});
			    	// redraw the grid every time the cols push units are changed
					drawGrix();
					addUi();
				}

				drawGrix();
				addUi();
			})	
			drawGrix();
			addUi();
		}



		function getObjectsById(el){
			var stId = String(el.data("id"));
			// console.log('stId: ',stId);
	
			var arId = stId.split("_");
			// console.log('arId: ',arId);
			// console.log('arId.length: ',arId.length);

			var obParent = {
				elements: obData,
				pos: parseInt(arId[0])
			};
			// console.log(arId[3]);
			for (var i=0; i < arId.length-1; i++) {
				obParent = obParent.elements[arId[i]];
				obParent.pos = parseInt(arId[i+1]);
			};
				
			// console.log('obParent: ',obParent);
			return obParent;
		}
		

		// row functions


		function addCol(el){

			var obP = getObjectsById(el);

			var arSibls = obP.elements[obP.pos].elements;

			// Get the unit value of the first column sibling
			var nrSiblsUnits = arSibls[0].width[device];

			// Add the new column
			var obCol = new GrixCol();
			obCol.width[device] = nrSiblsUnits;
			arSibls.push(obCol);
			
			drawGrix();
			addUi();
		}

		function addRow(el){

			var obP = getObjectsById(el);

			// Create a new row with one containing column
			var obRow = new GrixRow();
			obRow.addCol(new GrixCol());

			if (el.data('type') == 'row') {
				// Insert the new row after the clicked one
				obP.elements.splice(obP.pos+1, 0, obRow);
			} else {
				// Insert the new row into the clicked column
				obP.elements[obP.pos].elements.push(obRow);
			};
			drawGrix();
			addUi();
		}

		function reorderRow(el){
			var obP = getObjectsById(el);
			var nrSwapIx;
			var arRows = obP.elements;
			var nrPos = obP.pos;
			var obRow = obP.elements[obP.pos];

			// console.log('stDir: ',stDir);
			// console.log('nrPos: ',nrPos);
			// console.log('arRows: ',arRows);

			if (el.data('dir') == 'up') {
				nrSwapIx = (nrPos-1 == -1 ? arRows.length-1 : nrPos-1);
			} else {
				nrSwapIx = (nrPos+1 == arRows.length ? 0 : nrPos+1);
			};
			// console.log('nrSwapIx: ',nrSwapIx);
			arRows[nrPos] = arRows[nrSwapIx];
			arRows[nrSwapIx] = obRow;
			drawGrix();
			addUi();
		}	
		
		function deleteRow(el){
			var obP = getObjectsById(el);
			obP.elements.splice(obP.pos,1);
			drawGrix();
			addUi();
		}

		function splitCol(el,stUnits){

			var obP = getObjectsById(el);

			// var nrPos = obP.pos;
			var obRow = obP.elements[obP.pos];
			obRow.unitsConf[device] = stUnits;
			//console.log('obRow.unitsConf: ',obRow.unitsConf);
			//console.log('obRow: ',obRow);
			var arCols = obRow.elements;
			//console.log('arCols: ',arCols);
			var arUnits = isNaN(stUnits) ? stUnits.split('-') : [stUnits];

			// how many cols do we have
			var nrColsOld = arCols.length;

			// console.log(arUnits);
			var cc = 0;
			for(i=0; i < arCols.length; i++){
					// change existing col
					// arCols[i].units = arUnits[i];
					// console.log(arUnits[cc]);
					arCols[i].width[device] = arUnits[cc];
					if (cc==arUnits.length-1 ){
						cc = 0;
					} else {
						cc++;
					}
			}
			drawGrix();
			addUi();
		}



		function splitColOld(el,stUnits){

			var obP = getObjectsById(el);

			var arTarget = obP.elements;
			// var nrPos = obP.pos;
			var obRow = obP.elements[obP.pos];
			obRow.unitsConf = stUnits;
			//console.log('obRow.unitsConf: ',obRow.unitsConf);
			//console.log('obRow: ',obRow);
			var arElements = obRow.elements;
			//console.log('arElements: ',arElements);
			var arUnits = isNaN(stUnits) ? stUnits.split('-') : [stUnits];

			// how many cols do we have
			var nrColsOld = arElements.length;

			// How many columns are to be created
			var nrColsNew = arUnits.length;
			
			// delete useless columns
			if(nrColsOld > nrColsNew ){
				var nrCut = nrColsOld - nrColsNew;
				arElements.splice(-nrCut,nrCut)
			}
			
			for(i=0; i < nrColsNew; i++){
				if(arElements[i] != undefined){
					// change existing col
					// arElements[i].units = arUnits[i];
					arElements[i].width[device] = arUnits[i];
				} else {
					// create new column
					var obNewCol = new GrixCol();
					obNewCol.width[device] = parseInt(arUnits[i]);
					console.log(obNewCol.width);
					arElements.push(obNewCol)
				}
			}
			drawGrix();
			addUi();
		}
		

		// col functions

		function addCE(el){
			var stPhId = el.data('id');

			// Serialize the data in the form
			var stFormData = $("#grixBeForm").serialize();

			// Save the current status
			$.ajax({
				method: 'post',
				url: 'system/modules/gp_grix/ajax/ajax_save.php',
				data: stFormData,
				success: function(data){
					// console.log(data);
					// Status has been saved, now create the new CE
					window.location.href = 'contao/main.php?do=article&table=tl_content&act=create&mode=2&pid='+obGrixCfg.articleId+'&id='+obGrixCfg.articleId+'&grix=create&rt='+obGrixCfg.requTok+'&phid='+stPhId;
				},
				error: function (xhr, textStatus, errorThrown) {
					alert('ajax error ' + (errorThrown ? errorThrown : xhr.status));
				}
			});
		}

		function deleteCol(el){

			var obP = getObjectsById(el);
			// console.log('obP:',obP);

			var arCols = obP.elements;
			// console.log('arCols:',arCols);

			// dont delete the last column
			if (obP.pos==0 && arCols.length==1) {
				return false;
			};

			var obCol = arCols[obP.pos];
			//console.log('obCol:',obCol);

			// how many units exist before deleting
			var nrUnitsExist = 0;
			for (var i = 0; i < arCols.length; i++) {
				nrUnitsExist += parseInt(arCols[i].width[device]);
			}
			// console.log('nrUnitsExist: ',nrUnitsExist);

			// how many units will be subtracted
			var nrUnitsToSubtr = obCol.width[device];
			// console.log('nrUnitsToSubtr: ',nrUnitsToSubtr);

			// delete the col from the array
			arCols.splice(obP.pos,1);

			var nrColsRemain = arCols.length;
			// console.log('nrColsRemain: ',nrColsRemain);

			var nrUnitsRemain = nrUnitsExist - nrUnitsToSubtr;
			console.log('nrUnitsRemain: ',nrUnitsRemain);

			if (nrUnitsRemain <= 12) {


				// var nrUnitsEachAdd = nrUnitsToSubtr / nrColsRemain;
				// console.log('nrUnitsEachAdd:',nrUnitsEachAdd);

				var arUnitsConf = [];

				// add the new units-val to each col
				for(i=0; i<arCols.length; i++){
					var obCol = arCols[i];
					// var nrUnitsNew = parseInt(obCol.units);// + nrUnitsEachAdd;
					// obCol.units = nrUnitsNew;
					arUnitsConf.push(obCol.width[device]);
				}

				obP.unitsConf[device] = arUnitsConf.join('-');
				// console.log('stUnitsConf:',stUnitsConf);
			} else {
				obP.unitsConf[device] = arCols[0].width[device];

			}

			drawGrix();
			addUi();
		}



		// general functions


		function editElement(el){
			var obP = getObjectsById(el);
			var stId = obP.elements[obP.pos].id;

			// Serialize the data in the form
			var stData = $("#grixBeForm").serialize();

			$.ajax({
				method: 'post',
				url: 'system/modules/gp_grix/ajax/ajax_save.php',
				data: stData,
				success: function(data){
					// current status has been saved, now edit the CE
					window.location.href= 'contao/main.php?do=article&table=tl_content&act=edit&id='+stId+'&grix=edit&pid='+obGrixCfg.articleId+'&rt='+obGrixCfg.requTok;
				},
				error: function (xhr, textStatus, errorThrown) {
					alert('ajax error ' + (errorThrown ? errorThrown : xhr.status));
				}
			});

		}

		function removeElement(el){
			// remove the element, don't delete it permanently
			var obP = getObjectsById(el);
			obP.elements.splice(obP.pos,1);
			drawGrix();
			addUi();

		}

		function deleteElement(el){
			// delete the element permanently
			var obP = getObjectsById(el);
			console.log('dle');
			$.ajax({
				method: 'get',
				url: 'system/modules/gp_grix/ajax/ajax_delete.php',
				data: {
					id: obP.elements[obP.pos].id,
					articleId: obGrixCfg.articleId,
				},
				success: function(data){
					// console.log("deleted!");
					console.log(data);
					obP.elements.splice(obP.pos,1);
					drawGrix();
					addUi();
				},
				error: function (xhr, textStatus, errorThrown) {
					alert('ajax error ' + (errorThrown ? errorThrown : xhr.status));
				}
			});
		}

		function adjustElement(obP, obCfg){
			
			// The element which should be adjusted
			var obElement = obP.elements[obP.pos];
			console.log('obElement: ',obElement);

			// Adjust css classes choosen in the lightbox
			obElement.classes = obCfg.arClasses;


			// Adjust rows

			if (obElement.type == 'row') {

				var arCols = obElement.elements;
				// console.log('arCols: ',arCols);

				for (var property in obCfg.unitsConf) {

					var stNewUnitsConf = obCfg.unitsConf[property];
					console.log('stNewUnitsConf: ', stNewUnitsConf);
					stNewUnitsConf = stNewUnitsConf+'';

					if (stNewUnitsConf.indexOf('-') > -1) {
						arNewUnitsConf = stNewUnitsConf.split('-');
					  // alert("hello found inside your_string");
					} else {
						arNewUnitsConf = [stNewUnitsConf,stNewUnitsConf,stNewUnitsConf,stNewUnitsConf,stNewUnitsConf,stNewUnitsConf,stNewUnitsConf]
					}

					// console.log('arNewUnitsConf: ', arNewUnitsConf);


					obElement.unitsConf[property] = stNewUnitsConf;

					for (var i = 0; i < arCols.length; i++) {
						var obCol = arCols[i];
						// obCol.width[property] = obCfg.unitsConf[property];
						if (arNewUnitsConf[i]==undefined) {
							obCol.width[property] = arNewUnitsConf[0];
							
						} else {
							obCol.width[property] = arNewUnitsConf[i];

						}
						// console.log(obCol.width);
					};

				}
			}


			// Adjust cols

			if (obElement.type == 'col') {

				if (!obCfg.arCEs.length) {
					drawGrix();
					addUi();
				};

				// console.log('obCfg.arCEs: ',obCfg.arCEs);

				// if CEs have been selected in the lightbox
				if (obCfg.arCEs.length) {
					for (var i = 0; i < obCfg.arCEs.length; i++) {
						var obNewCE = {
							type: "ce",
							id: obCfg.arCEs[i]+""
						};
						$('#grixce_'+obCfg.arCEs[i]).clone().appendTo('.grix_celist');
						obElement.elements.push(obNewCE);
					};
					// console.log('obElement.elements: ',obElement.elements);
					console.log('obGrixCfg.articleId: ',obGrixCfg.articleId);
					// update the CEsUsed-field of the article
					// console.log('obCfg.arCEs: ',obCfg.arCEs);
					var jsonString = JSON.stringify(obCfg.arCEs);
					
					$.ajax({
						type: 'GET',
						url: 'system/modules/gp_grix/ajax/ajax_insertce.php',
						data: {
							articleId: obGrixCfg.articleId,
							arCEs: jsonString
						},
						success: function(msg){
							console.log('insertce-message: ',msg);
							//console.log('obCol:',obCol);
							drawGrix();
							addUi();

							
						},
						error: function (xhr, textStatus, errorThrown) {
							alert('ajax error ' + (errorThrown ? errorThrown : xhr.status));
						}
					});

				};
			}

		}




		function addUi(){


			for (var i = 0; i < arColAct.length; i++) {
				$(".grix").find("[data-id='" + arColAct[i] + "']").addClass('active')
			}

			$(".c").click(function(event) {

				if ($(this).hasClass('active')) {
					arColAct.splice($.inArray($(this).data('id'), arColAct),1);
				} else {
					if (event.shiftKey) {
						arColAct.push($(this).data('id'));
					} else {
						arColAct = [$(this).data('id')];
					}

					var obRow = getObjectsById($(this));
					var arCols = obRow.elements;
					var obCol = obRow.elements[obRow.pos];


					for (var i = 0; i < arBootProps.length; i++) {
						var prop = arBootProps[i]
						var nrU = obCol[prop][device];
						$('.info_'+prop).text(nrU);
					};
					// console.log(nrU);

				}
				boColIsAct = arColAct.length ? true : false;
				$('.c').removeClass('active');
				for (var i = 0; i < arColAct.length; i++) {
					$(".grix").find("[data-id='" + arColAct[i] + "']").addClass('active')
				}
				if (arColAct.length==0) {
					$(".info").text('');
				};
				// console.log('boColIsAct: ',boColIsAct);
				// console.log('arColAct: ',arColAct);
				event.stopPropagation();
			});




		    $(".c_content").sortable({
		    	connectWith: ".c_content",
		    	forcePlaceholderSize: true,
		    	placeholder: "ui-state-highlight",
		    	addClasses: false,
				start: function(event, ui) {
				},
				drag: function() {
				},				
				receive: function(event, ui) {
					// get the menu of the targeted col
					$targetGrixColMenu = $(this).siblings('.c_menu');
				},
		        stop: function(event, ui) {
		            // if the ce has been sorted in the same col
		            if(typeof $targetGrixColMenu === 'undefined'){
						$targetGrixColMenu = $(this).siblings('.c_menu');
		            };
		            // get the dragged dom element
		            var $elCE = $(ui.item);

					// get the origin col
					var obOCol = getObjectsById($elCE);
					// console.log('obOCol: ',obOCol);
		            
					// get the index of the element to delete
					var nrIDel = obOCol.pos;
					// console.log('nrIDel: ',nrIDel);

					// get the sorted content element
					var obCE = obOCol.elements[obOCol.pos];
					// console.log('obCE: ',obCE);

					// get the targeted row
					var obTRow = getObjectsById($targetGrixColMenu);
					// console.log('obOCol.pos: ',obOCol.pos);

					// get the targeted col
					var obTCol = obTRow.elements[obTRow.pos];
					// console.log('obTCol: ',obTCol);
					
					var boIsSameCol = (obOCol==obTCol);
					// console.log('boIsSameCol: ',boIsSameCol);

					// get the target index
					var nrTIndex = ui.item.index();
					// console.log('nrTIndex: ',nrTIndex);

					if (boIsSameCol) {
						if (obOCol.pos > nrTIndex) {
							// the element was been dragged upwards
							nrIDel +=1;
						} else{
							// the element was been dragged downwards
							nrTIndex++;
						};
					} 
					// insert dragged element into the targeted array
					obTCol.elements.splice(nrTIndex, 0, obCE);

					// remove dragged element from the origin array
					obOCol.elements.splice(nrIDel, 1);
						
					drawGrix();
					addUi();
					
		        }
		    });

		    $('.c_content').disableSelection();

			// row menu

			$('.add_col').click(function(e){
				addCol($(this).parent());
				e.preventDefault();
			})

			$('.add_row').click(function(e){
				addRow($(this).parent());
				e.preventDefault();
			})

			$('.hmi_sc').click(function(e){
				splitCol($(this).parent().parent().parent(),$(this).data("units"));
				e.preventDefault();
			})

			$('.reorder').click(function(e){
				reorderRow($(this).parent());
				e.preventDefault();
			})

			$('.del_row').click(function(e){
				deleteRow($(this).parent());
				e.preventDefault();
			})
			

			// column menu

			$('.add_ce').click(function(e){
				addCE($(this).parent());
				e.preventDefault();
				e.stopPropagation();
			})

			$('.adj_ele').click(function(e){
				obGrixCfg.grixLightbox.activate({
					'obTarget': getObjectsById($(this).parent()),
					'callBackFunction': adjustElement
				});
				e.preventDefault();
				e.stopPropagation();
			})

			$('.del_col').click(function(e){
				deleteCol($(this).parent());
				e.preventDefault();
			})



			// general

			$('.edi_ele').click(function(e){
				editElement($(this).parent());
				e.preventDefault();
			})

			$('.ins_ele').click(function(e){
				addCE($(this).parent());
				e.preventDefault();
				e.stopPropagation();
			})

			$('.del_ele').click(function(e){
				if (e.altKey) {
					deleteElement($(this).parent());
				} else{
					removeElement($(this).parent());
				};
				e.preventDefault();
			})



		}	
		
			
		function createBeHtmlCode(arEls,level,id){
			level++;
			var html = "";
			var nrElsY = arEls.length;
			var stClassSingle = (nrElsY==1 && level==0 ? " single_row" : "");
			// console.log('arEls:',arEls);

			for(var y=0; y<nrElsY; y++){
				var obEl = arEls[y];

				// lets build a row
				if(obEl.type == "row"){
					
					html += "<div class='r"+stClassSingle+"' >\
								<div class='r_content'>";

					if(obEl.elements){
						// lets build some cols
						var arCols = obEl.elements;
						var nrEls = arCols.length;
						var stClassSingle = (nrEls==1 ? " single_col" : "");
				
						for(var x=0; x < nrEls; x++){
							var obCol = arCols[x];
							var stNewId = (id=='' ? y+"_"+x : id+"_"+y+"_"+x);
							var stClass = "c l"+level+stClassSingle;


							for (var dev in obCol.width) {
								var stU = obCol.width[dev];
								if (stU !== "x") {
									stClass += " col-"+dev+"-"+stU;
								}
							}
							for (var dev in obCol.offset) {
								var stU = obCol.offset[dev];
								if (stU !== "x") {
									stClass += " col-"+dev+"-offset-"+stU;
								}
							}
							for (var dev in obCol.push) {
								var stU = obCol.push[dev];
								if (stU !== "x") {
									stClass += " col-"+dev+"-push-"+stU;
								}
							}
							for (var dev in obCol.pull) {
								var stU = obCol.pull[dev];
								if (stU !== "x") {
									stClass += " col-"+dev+"-pull-"+stU;
								}
							}

							html += "<div class='"+stClass+"' data-id='"+stNewId+"' >\
											<div class='c_content'>";
						
							if(obCol.elements && obCol.elements.length > 0){
								html += createBeHtmlCode(obCol.elements,level,stNewId);
							}
						
							html += "</div>\
										<div class='menu c_menu cf' data-id='"+stNewId+"' data-type='col' >\
											<a class='btn add_row' data-type='col' ></a>\
											<a class='btn add_ce' ></a>\
											<a class='btn adj_ele' ></a>\
											<a class='btn del_col' ></a>\
											<span class='db_info db_id'>"+stNewId+"</span>\
											<span class='db_info db_level'>"+level+"</span>\
										</div>\
									</div>";
						}
					}

					var stNewId = (id=='' ? y : id+"_"+y);
					html += "</div>\
								<div class='menu r_menu cf' data-id='"+stNewId+"' data-type='row' >\
									<a class='btn add_col' data-type='row' ></a>\
									<a class='btn add_row' data-type='row' ></a>\
									<a class='btn adj_ele' ></a>\
									<div class='btn split_col' style='background-image:url(system/modules/gp_grix/assets/img/col-icons/col-icon-"+obEl.unitsConf[device]+".png)' >\
										<div class='h_menu h_menu_split_col'>\
											<a class='btn hmi_sc' data-units='12' ></a>\
											<a class='btn hmi_sc' data-units='6-6' ></a>\
											<a class='btn hmi_sc' data-units='3-3-3-3' ></a>\
											<a class='btn hmi_sc' data-units='3-9' ></a>\
											<a class='btn hmi_sc' data-units='9-3' ></a>\
											<a class='btn hmi_sc' data-units='3-3-6' ></a>\
											<a class='btn hmi_sc' data-units='6-3-3' ></a>\
											<a class='btn hmi_sc' data-units='3-6-3' ></a>\
											<a class='btn hmi_sc' data-units='4-4-4' ></a>\
											<a class='btn hmi_sc' data-units='4-8' ></a>\
											<a class='btn hmi_sc' data-units='8-4' ></a>\
										</div>\
									</div>\
									<a class='btn reorder' data-dir='up' ></a>\
									<a class='btn reorder' data-dir='down' ></a>\
									<a class='btn del_row' ></a>\
									<span class='db_info db_id'>"+stNewId+"</span>\
								</div>\
							</div>";
				}

				// lets build a content-element
				if(obEl.type == "ce"){
					var stNewId = (id=='' ? y : id+"_"+y);
					var stCeHtml = $('#grixce_'+obEl.id).html();

					html += "<div class='ce' data-id='"+stNewId+"' >\
								<div class='ce_content'>"+stCeHtml+"</div>\
								<div class='menu ce_menu cf' data-id='"+stNewId+"' >\
									<a class='btn edi_ele' ></a>\
									<a class='btn ins_ele' ></a>\
									<a class='btn del_ele' ></a>\
									<span class='db_info db_id'>"+stNewId+"</span>\
								</div>\
							</div>";

				}

			}
			return html;
		}


		function createFeHtmlCode(arEls,level,id){
			
			level++;
			var html = "";

			for(var y=0; y < arEls.length; y++){
				var obEl = arEls[y];
				var stClassCust = obEl.classes ? " " + obEl.classes.join(' ') : "";

				// lets build a row
				if(obEl.type == "row"){
					html += "<div class='row cfix"+stClassCust+"' >";

					// lets build cols
					if(obEl.elements){
					
						var arCols = obEl.elements;
						
						for(var x=0; x < arCols.length; x++){
							var obCol = arCols[x];
							var stNewId = (id=="" ? y+"_"+x : id+"_"+y+"_"+x);
							var stClass = "l"+level;

							for (var i = 0; i < arBootProps.length; i++) {
								var prop = arBootProps[i]
								for (var dev in obCol[prop]) {
									var stU = obCol[prop][dev];
									if (stU !== "x") {
										if (prop=="width") {
											stClass += " col-"+dev+"-"+stU;
										} else{
											stClass += " col-"+dev+"-"+prop+"-"+stU;
										};
									}
								}					
							};

							// for (var dev in obCol.width) {
							// 	var stU = obCol.width[dev];
							// 	if (stU !== "x") {
							// 		stClass += " col-"+dev+"-"+stU;
							// 	}
							// }
							// for (var dev in obCol.offset) {
							// 	var stU = obCol.offset[dev];
							// 	if (stU !== "x") {
							// 		stClass += " col-"+dev+"-offset-"+stU;
							// 	}
							// }
							// for (var dev in obCol.push) {
							// 	var stU = obCol.push[dev];
							// 	if (stU !== "x") {
							// 		stClass += " col-"+dev+"-push-"+stU;
							// 	}
							// }
							// for (var dev in obCol.pull) {
							// 	var stU = obCol.pull[dev];
							// 	if (stU !== "x") {
							// 		stClass += " col-"+dev+"-pull-"+stU;
							// 	}
							// }

							stClass = obCol.classes ? stClass + " " + obCol.classes.join(' ') : stClass;

							html += "<div class='"+stClass+"' id='el_"+stNewId+"' >";
							if(obCol.elements){
								html += createFeHtmlCode(obCol.elements,level,stNewId);
							}
							html += "</div>";
						}
					}

					var stNewId = (id=='' ? y : id+"_"+y);
				
					html += "</div>";
				}

				// lets build a content-element
				if(obEl.type == "ce"){
					var stNewId = (id=='' ? y : id+"_"+y);
					var stClass = "ce"+stClassCust;
					html += "<div class='"+stClass+"' id='el_"+stNewId+"' >";
					html += "{{insert_content::"+obEl.id+"}}";
					html += "</div>";
				}
			}
			return html;
		}


		function drawGrix(){
			var stHtmlBe = createBeHtmlCode(obData,level,'');
			var stHtmlFe = createFeHtmlCode(obData,level,'');
			var stJson = JSON.stringify(obData);

			// show the grid in the backend
			$('.grix_grid').html(stHtmlBe);

			// fill the backend form inputs
			$('#ctrl_grixHtmlFrontend').val(stHtmlFe);
			$('#ctrl_grixJson').val(stJson);

			var stJsonBeautyfied = JSON.stringify(obData,null, "\t");
			stJsonBeautyfied = syntaxHighlight(stJsonBeautyfied);
			$('.grix_beautyfied').html(stJsonBeautyfied);

			// saveGrix(stJson,stHtmlFe);
		}


		function saveGrix(stJson,stHtmlFe){
			// console.log(obGrixCfg.articleId);
			$('.grixJs').addClass('loading');
			$.ajax({
				type: 'POST',
				// url: '',
				data: {
					'action': 'saveGrix',
					'id': obGrixCfg.articleId,
					'grixJs': stJson,
					'grixHtml': escape(stHtmlFe),
					'REQUEST_TOKEN': Contao.request_token
				},
			    dataType: 'json',
				cache: false		     	
	        }).done(function(msg) {
				$('.grixJs').removeClass('loading');
				$('.grixJs').addClass('saved');
				console.log(msg);
			});	
		}


		function syntaxHighlight(json) {
		    if (typeof json != 'string') {
		         json = JSON.stringify(json, undefined, 2);
		    }
		    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
		        var cls = 'number';
		        if (/^"/.test(match)) {
		            if (/:$/.test(match)) {
		                cls = 'key';
		            } else {
		                cls = 'string';
		            }
		        } else if (/true|false/.test(match)) {
		            cls = 'boolean';
		        } else if (/null/.test(match)) {
		            cls = 'null';
		        }
		        return '<span class="' + cls + '">' + match + '</span>';
		    });
		}


	}



})(jQuery);