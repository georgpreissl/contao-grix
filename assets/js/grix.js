(function($){


	window.Grix = function(obCfg){
		var debug = true;
		var obData = obCfg.data;
		var level = 0;
		var device = 'lg';
		var arAct = [];
		var arResKeys = [38,40,49,50,51,52,83,37,39,27,32];
		var arBootProps = ['width','offset','push','pull','margin'];
		var arDevices = ['xs','sm','md','lg'];
		var arConfDefault = ['12','6-6','3-3-3-3','3-9','9-3','3-3-6','6-3-3','3-6-3','4-4-4','4-8','8-4'];
		var $grix = $('.grix');
		var $body = $('body');



		this.init = function(){
			initUi();
			drawGrix();
		}


		function initUi(){

			$(document).keydown(function(e){
				var key = e.keyCode;
				// console.log(key);

			    if (arResKeys.indexOf(key) != -1) {

				    // save
					if((e.ctrlKey || e.metaKey) && e.which == 83) $('input.grix_save').trigger('click');

					// change device
					if (key == 49) $('.grix_device_xs').trigger('click');
					if (key == 50) $('.grix_device_sm').trigger('click');
					if (key == 51) $('.grix_device_md').trigger('click');
					if (key == 52) $('.grix_device_lg').trigger('click');

			    	// left and right keys
					if (key == 37 && arAct.length) $('.grix_bt_width_minus').trigger('click');
					if (key == 39 && arAct.length) $('.grix_bt_width_plus').trigger('click');

			    	// up and down keys
					if (key == 38 && arAct.length) $('.grix_bt_margin_minus').trigger('click');
					if (key == 40 && arAct.length) $('.grix_bt_margin_plus').trigger('click');

				    // esc-key – unselect every column
				    if (key == 27) $('.grix_deselect').trigger('click');

				    // space bar – toggle preview
				    if (key == 32) $body.toggleClass('grix_preview');

			    	e.preventDefault();
				}
			});

			$('.grix_device').click(function(e){
				device = $(this).data('device');
				$(this).addClass('active').siblings().removeClass('active');
				$body.removeClass('grix_xs grix_sm grix_md grix_lg');
				for (var i = 0; i <= $(this).index('.grix_device'); i++) {
					$body.addClass('grix_'+arDevices[i]);
				};
				drawGrix();
			})

			$('.grix_device_switch').click(function(e){
				var ix = $('.grix_device.active').index('.grix_device');
				ix = $(this).data('direction') == 'next' ?  (ix+1 > 3 ? 0 : ix+1 ) : (ix-1 < 0 ? 3 : ix-1);
				$('.grix_device').eq(ix).trigger('click');
			})

			$('.grix_toggle_preview').click(function(e) {
				$body.toggleClass('grix_preview');
			});

			$('.grix_bt').click(function(e){

				e.preventDefault();
				var prop = $(this).data('prop');
				var dir = $(this).data('dir');
				if (arAct.length) {

					for (var i = 0; i < arAct.length; i++) {
						
				    	var obEl = getTarget(arAct[i]);

						if (dir == 'remove') {
							nrV = '';
						} else{


							var nrMin = 0;
							var nrMax = 12;
							var nrV = '';

							if (prop == 'width') nrMin = 1;
							if (prop == 'margin') nrMax = 20;

							// if (prop == 'margin') {
							// 	nrV = obEl.margin[device];
							// } else {
								for (var dev in obEl[prop]) {
									var cv = obEl[prop][dev];
									if (cv != '') nrV = cv;
									if (dev == device) break;
								};
							// }
							// console.log('nrV: ',nrV);

							// no value has been set yet
					    	if (nrV == '') {
								if (prop == 'width') {
						    		nrV = 12;
								} else {
						    		nrV = 0;
								}
					    	};
					    	
					    	nrV = parseInt(nrV);
							dir == 'minus' ? nrV-- : nrV++;
							if (nrV < nrMin) nrV = nrMin;
							if (nrV > nrMax) nrV = nrMax;
						};



				    	$('.info_'+prop).text(nrV);
					    obEl[prop][device] = String(nrV);
					    // console.log('obEl[prop][device]: ',obEl[prop][device]);
					    // eg: obEl.width.lg = 6


					    // adapt unitsConf of parent row
						if(obEl.type=='col' && prop=='width') {
							var obP = getTarget(arAct[i],1);
							var arConf = [];
							for (var z = 0; z < obP.elements.length; z++) {
								var obCol = obP.elements[z];
								arConf.push(obCol.width[device]);
							}
							obP.unitsConf[device] = arConf.join('-');
						}


			    	};
			    	// redraw the grid every time the values are changed
					drawGrix();
				}
			});


			$('.grix_deselect').click(function(e) {
				arAct = [];
				$('.x').removeClass('active');
				$grix.removeClass('act_row act_col act_ce');
				$('.info').text('');
			});

			$('.grix_back').click(function(e) {
				history.go(-1);
			});


			$('.grix_duplicate').click(function(e) {
				if (arAct.length) {
					for (var i = 0; i < arAct.length; i++) {
						var id = String(arAct[i]);
						var obT = getTarget(id);
						var obP = getTarget(id,1);
						var obTCopy = JSON.parse(JSON.stringify(obT));
						obP.elements.splice(getIndex(id), 0, obTCopy);
						drawGrix();
					};
				} else {
					alert('Please select the elements to be duplicated first.')
				}
			});


			$('.grix_save').click(function(e) {
				// saveGrix();
				// e.preventDefault();
			});

		}



		function getTarget(el,ix){
			ix = ix == undefined ? 0 : ix;

			var stId = typeof el == 'string' ? el : String(el.data('id'));
			var arId = stId.split('_');

			var obRetObj = { elements: obData };
			for (var i=0; i < arId.length-ix; i++) {
				obRetObj = obRetObj.elements[arId[i]];
			};
			return obRetObj;
		}

		function getIndex(el,ix){
			ix = ix == undefined ? 0 : ix;
			var stId = typeof el == 'string' ? el : String(el.data("id"));
			var arId = stId.split("_");
			var index = arId[ arId.length-(ix+1) ];
			return index;
		}

		function scanForCEs(obj,ar){
			if (obj.type == 'ce') ar.push(obj.id);
			if (obj.elements) {
				for (var i = 0; i < obj.elements.length; i++) {
					ar = scanForCEs(obj.elements[i],ar);
				};
			};
			return ar;
		};		

		// row functions


		function insertCol(el){
			var obRow = getTarget(el);
			var obCol = new GrixCol();

			// give it the width of the first column sibling
			obCol.width[device] = obRow.elements[0].width[device];

			obRow.elements.push(obCol);
			drawGrix();
		}

		function addRow(el){
			var obCol = getTarget(el,1);

			// create a new row with one containing column
			var obRowNew = new GrixRow();
			obRowNew.addCol(new GrixCol());

			// insert the new row after the clicked one
			obCol.elements.splice(getIndex(el)+1, 0, obRowNew);

			drawGrix();
		}


		function reorderRow(el,stDir){
			var obP = getTarget(el,1);
			// console.log('obP: ',obP);

			var nrSwapIx;
			var arRows = obP.elements;

			var nrPos = parseInt(getIndex(el));
			// console.log('nrPos: ',nrPos);

			var obRow = obP.elements[nrPos];

			if (stDir == 'up') {
				nrSwapIx = (nrPos-1 == -1 ? arRows.length-1 : nrPos-1);
			} else {
				nrSwapIx = (nrPos+1 == arRows.length ? 0 : nrPos+1);
			};
			// console.log('nrSwapIx: ',nrSwapIx);
			arRows[nrPos] = arRows[nrSwapIx];
			arRows[nrSwapIx] = obRow;
			drawGrix();
		}	

		function deleteRow(el){
			var obP = getTarget(el,1);
			var obT = getTarget(el);

			var arCEsFound = scanForCEs(obT,[]);
			// console.log('arCEsFound: ',arCEsFound);

			obP.elements.splice(getIndex(el),1);
			$.ajax({
				type: 'POST',
				data: {
					'ces': arCEsFound,
					'articleId': obCfg.articleId,
					'action':'updateUsedCEs',
					'REQUEST_TOKEN':Contao.request_token
				},
				dataType: 'json',
				cache: false		     	
			}).done(function(obj) {
				// console.log(obj);
				// console.log('UsedCEs: ',obj.usedCEs);
				// console.log('CEsToDelete: ',obj.CEsToDelete);
				// console.log('newUsedCEs: ',obj.newUsedCEs);
				// console.log('affectedRows: ',obj.affectedRows);
				drawGrix();
			});
		}

		function splitCol(el,stUnits){

			var obRow = getTarget(el);
			obRow.unitsConf[device] = stUnits;
			var arCols = obRow.elements;
			var arUnits = isNaN(stUnits) ? stUnits.split('-') : [stUnits];

			// how many cols do we have
			var nrColsOld = arCols.length;
			// console.log('nrColsOld: ',nrColsOld);

			// how many cols do we need at least
			var nrColsNew = arUnits.length;
			// console.log('nrColsNew: ',nrColsNew);

			if (nrColsNew > nrColsOld) {
				var nrColsToCreate = nrColsNew - nrColsOld;
				for (var i = 0; i < nrColsToCreate; i++) {
					var obNewCol = new GrixCol();
					arCols.push(obNewCol);
				};
			};

			// change existing cols
			var z = 0;
			for(var i=0; i < arCols.length; i++){
					arCols[i].width[device] = arUnits[z];
					if (z == arUnits.length-1){
						z = 0;
					} else {
						z++;
					}
			}
			drawGrix();
		}




		

		// col functions


		// funktioniert NICHT!!!
		// speichert im NULL in grixJs !!!
		function addCEXXX(el){
			var stPhId = el.data('id');

			var stFormData = $("#grixBeForm").serialize()+'&'+$.param({ action: 'saveBeforeAddCE'});

			// Save the current status
			$.ajax({
				type: 'POST',
				data: stFormData,
				dataType: 'json',				
				success: function(data){
					// console.log(data);
					// Status has been saved, now create the new CE
					// window.location.href = 'contao/main.php?do=article&table=tl_content&act=create&mode=2&pid='+obCfg.articleId+'&id='+obCfg.articleId+'&grix=create&rt='+obCfg.requTok+'&phid='+stPhId;
				},
				error: function (xhr, textStatus, errorThrown) {
					alert('ajax error ' + (errorThrown ? errorThrown : xhr.status));
				}
			});
		}



		function addCE(el){
			var stPhId = el.data('id');

			// Serialize the data in the form
			var stFormData = $("#grixBeForm").serialize();
			stFormData += '&grixAction=save';
			// console.log(stFormData);
			// return;
			// Save the current status
			$.ajax({
				type: 'POST',
				url: 'system/modules/gp_grix/ajax/ajax.php',
				data: stFormData,
				success: function(data){
					// console.log(data);
					// Status has been saved, now create the new CE
					window.location.href = 'contao/main.php?do=article&table=tl_content&act=create&mode=2&pid='+obCfg.articleId+'&id='+obCfg.articleId+'&grix=create&rt='+obCfg.requTok+'&phid='+stPhId;
				},
				error: function (xhr, textStatus, errorThrown) {
					alert('ajax error ' + (errorThrown ? errorThrown : xhr.status));
				}
			});
		}



		function insertRow(el){
			var obCol = getTarget(el);

			var obRow = new GrixRow();
			obRow.addCol(new GrixCol());

			obCol.elements.push(obRow);
			drawGrix();
		}

		function deleteCol(el){
			var obRow = getTarget(el,1);
			var obCol = getTarget(el);
			// console.log(obRow.elements.length);

			// dont delete the last column
			if (obRow.elements.length == 1) return false;

			var arCEsFound = scanForCEs(obCol,[]);
			// console.log('arCEsFound: ',arCEsFound);

			var arCols = obRow.elements;
			// console.log('arCols:',arCols);

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
			arCols.splice(getIndex(el),1);

			var nrColsRemain = arCols.length;
			// console.log('nrColsRemain: ',nrColsRemain);

			var nrUnitsRemain = nrUnitsExist - nrUnitsToSubtr;
			// console.log('nrUnitsRemain: ',nrUnitsRemain);

			if (nrUnitsRemain <= 12) {

				var arUnitsConf = [];

				// add the new units-val to each col
				for(i=0; i<arCols.length; i++){
					var obCol = arCols[i];
					arUnitsConf.push(obCol.width[device]);
				}

				// console.log('stUnitsConf:',stUnitsConf);
				obRow.unitsConf[device] = arUnitsConf.join('-');
			} else {
				obRow.unitsConf[device] = arCols[0].width[device];

			}
			if (arCEsFound.length > 0) {
				$.ajax({
					type: 'POST',
					data: {
						'action':'updateUsedCEs',
						'ces': arCEsFound,
						'articleId': obCfg.articleId,
						'REQUEST_TOKEN':Contao.request_token
					},
					dataType: 'json',
					cache: false		     	
				}).done(function(obj) {
					// console.log('UsedCEs: ',obj.usedCEs);
					// console.log('CEsToDelete: ',obj.CEsToDelete);
					// console.log('newUsedCEs: ',obj.newUsedCEs);
					// console.log('affectedRows: ',obj.affectedRows);
					drawGrix();
				});
			} else {
				drawGrix();
			}

		}



		// general functions


		function editElement(el){

			$.ajax({
				method: 'post',
				url: 'system/modules/gp_grix/ajax/ajax.php',
				data: $("#grixBeForm").serialize()+ '&grixAction=save',
				success: function(data){
					// current status has been saved, now edit the CE
					window.location.href= 'contao/main.php?do=article&table=tl_content&act=edit&id='+getTarget(el).id+'&grix=edit&pid='+obCfg.articleId+'&rt='+obCfg.requTok;
				},
				error: function (xhr, textStatus, errorThrown) {
					alert('ajax error ' + (errorThrown ? errorThrown : xhr.status));
				}
			});

		}

		function removeElement(el){
			// remove the element, don't delete it permanently
			var id = el.data('id');
			var obCol = getTarget(id,1);
			var obEl = getTarget(id);

			obCol.elements.splice(getIndex(id),1);

			$.ajax({
				type: 'POST',
				data: {
					'action':'updateUsedCEs',
					'ces': [obEl.id],
					'articleId': obCfg.articleId,
					'REQUEST_TOKEN': Contao.request_token
				},
				dataType: 'json',
				cache: false		     	

			}).done(function(obj) {
				// console.log('UsedCEs: ',obj.usedCEs);
				// console.log('CEsToDelete: ',obj.CEsToDelete);
				// console.log('newUsedCEs: ',obj.newUsedCEs);
				// console.log('affectedRows: ',obj.affectedRows);
				drawGrix();
			});	

		}

		function deleteElement(el){
			// delete the element permanently
			var obCol = getTarget(el,1);
			var obCE = getTarget(el);
			// console.log('dle');
			$.ajax({
				type: 'POST',
				url: 'system/modules/gp_grix/ajax/ajax.php',
				data: {
					ceId: obCE.id,
					articleId: obCfg.articleId,
					grixAction: 'delete',
					'REQUEST_TOKEN':Contao.request_token
				},
				success: function(data){
					// console.log("deleted!");
					// console.log(data);
					obCol.elements.splice(getIndex(el),1);
					drawGrix();
				},
				error: function (xhr, textStatus, errorThrown) {
					alert('ajax error ' + (errorThrown ? errorThrown : xhr.status));
				}
			});
		}

		function adjustRow(obRow, obCfgLb){
			// add the choosen css classes to the row
			obRow.classes = obCfgLb.arClasses;

			var arCols = obRow.elements;
			// console.log('arCols: ',arCols);

			for (var dev in obCfgLb.unitsConf) {
				var stConf = String(obCfgLb.unitsConf[dev]);
				obRow.unitsConf[dev] = stConf;

				var arConf = stConf.split('-');

				for (var i = 0; i < arCols.length; i++) {
					var obCol = arCols[i];
					if (arConf[i] == undefined) {
						obCol.width[dev] = arConf[0];
					} else {
						obCol.width[dev] = arConf[i];
					}
				};
			}
			drawGrix();
		}

		function adjustCol(obCol, obLbCfg){

			// add the choosen css classes to the col
			obCol.classes = obLbCfg.arClasses;

			// console.log('obLbCfg.arCEs: ',obLbCfg.arCEs);
			if (!obLbCfg.arCEs.length) {
				drawGrix();
			} else {
				// CEs have been selected in the lightbox
				for (var i = 0; i < obLbCfg.arCEs.length; i++) {


					var obCE = new GrixCE();
					obCE.id = String(obLbCfg.arCEs[i]);
					// var obNewCE = {
					// 	type: "ce",
					// 	id: String(obLbCfg.arCEs[i])
					// };
					obCol.elements.push(obCE);
					$('#grixce_'+obLbCfg.arCEs[i]).clone().appendTo('.grix_celist');
				};
				// console.log('obCol.elements: ',obCol.elements);
				// console.log('obCfg.articleId: ',obCfg.articleId);

				// update the CEsUsed-field of the article
				$.ajax({
					type: 'POST',
					url: 'system/modules/gp_grix/ajax/ajax.php',
					data: {
						articleId: obCfg.articleId,
						arCEs: JSON.stringify(obLbCfg.arCEs),
						grixAction: 'insertce',
						'REQUEST_TOKEN':Contao.request_token
					},
					// dataType: 'json',
					success: function(msg){
						// console.log('insertce-message: ',msg);
						drawGrix();
					},
					error: function (xhr, textStatus, errorThrown) {
						alert('ajax error ' + (errorThrown ? errorThrown : xhr.status));
					}
				});

			};
			

		}




		function addUi(){


			for (var i = 0; i < arAct.length; i++) {
				$grix.find("[data-id='"+ arAct[i] +"']").addClass('active');

				var obEl = getTarget(arAct[i]);

				for (var z = 0; z < arBootProps.length; z++) {
					var prop = arBootProps[z];
					if (obEl[prop]) {
						$('.info_'+prop).text(obEl[prop][device]);
					};
				};
			}

			$('.x').click(function(e) {
				var id = String($(this).data('id'));
				
				if ($(this).hasClass('c')) {
					stType = 'col';
				};
				if ($(this).hasClass('r')) {
					stType = 'row';
				}
				if ($(this).hasClass('ce')) {
					stType = 'ce';
				}

				// dont add elements with a different type to the selection
				if (arAct.length > 0 && e.shiftKey) {
					if(getTarget(arAct[0]).type != stType) {
						return false;
					};
				};

				var index = $.inArray(id, arAct);

				if (index >= 0) {
					// the element is already selected, remove it from selection
					arAct.splice(index,1);
				} else {
					// select the element
					e.shiftKey ? arAct.push(id) : arAct = [id];
					if (stType == 'col') {
						var obCol = getTarget($(this));
						for (var i = 0; i < arBootProps.length; i++) {
							var prop = arBootProps[i]
							var nrV = obCol[prop][device];
							$('.info_'+prop).text(nrV);
						};
					};
				}

				$grix.removeClass('act_row act_col act_ce')
				if (arAct.length>0) {
					$grix.addClass('act_'+stType)
				} else {
					$('.info').text('');
				}

				$('.x').removeClass('active');
				for (var i = 0; i < arAct.length; i++) {
					$grix.find("[data-id='" + arAct[i] + "']").addClass('active');
				}

				// console.log('arAct: ',arAct);
				e.stopPropagation();
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
					$elColMenu = $(this).siblings('.c_menu');
				},
		        stop: function(event, ui) {
		            // if the ce has been sorted in the same col
		            if(typeof $elColMenu === 'undefined'){
						$elColMenu = $(this).siblings('.c_menu');
		            };
		            // get the id of the targeted col
		            var id = $elColMenu.data('id');

		            // get the dragged dom element
		            var $elCE = $(ui.item);

					// get the origin col
					var obOCol = getTarget($elCE,1);
					// console.log('obOCol: ',obOCol);
		            
					// get the index of the element to delete
					var nrIDel = getIndex($elCE);
					// console.log('nrIDel: ',nrIDel);

					// get the sorted content element
					var obCE = obOCol.elements[nrIDel];
					// console.log('obCE: ',obCE);

					// get the targeted row
					var obTRow = getTarget(id,1);
					// console.log('obOCol.pos: ',obOCol.pos);

					// get the targeted col
					var obTCol = getTarget(id);
					// console.log('obTCol: ',obTCol);
					
					var boIsSameCol = (obOCol==obTCol);
					// console.log('boIsSameCol: ',boIsSameCol);

					// get the target index
					var nrTIndex = ui.item.index();
					// console.log('nrTIndex: ',nrTIndex);

					if (boIsSameCol) {
						if (getIndex(id) > nrTIndex) {
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
					
		        }
		    });

		    $('.c_content').disableSelection();


			// row menu

			$('.ins_col').click(function(e){
				insertCol($(this).parent());
				e.preventDefault();
				e.stopPropagation();
			})

			$('.add_row').click(function(e){
				addRow($(this).parent());
				e.preventDefault();
				e.stopPropagation();
			})

			$('.hmi_sc').click(function(e){
				splitCol($(this).parent().parent().parent(),$(this).data("units"));
				e.preventDefault();
				e.stopPropagation();
			})

			$('.reorder').click(function(e){
				reorderRow($(this).parent(),$(this).data('dir'));
				e.preventDefault();
				e.stopPropagation();
			})

			$('.del_row').click(function(e){
				deleteRow($(this).parent());
				e.preventDefault();
				e.stopPropagation();
			})
			

			// column menu

			$('.add_ce').click(function(e){
				addCE($(this).parent());
				e.preventDefault();
				e.stopPropagation();
			})

			$('.ins_row').click(function(e){
				insertRow($(this).parent());
				e.preventDefault();
				e.stopPropagation();
			})

			$('.adj_row').click(function(e){
				obCfg.grixLightbox.activate({
					'obTarget': getTarget($(this).parent()),
					'callBackFunction': adjustRow
				});
				e.preventDefault();
				e.stopPropagation();
			})

			$('.adj_col').click(function(e){
				obCfg.grixLightbox.activate({
					'obTarget': getTarget($(this).parent()),
					'callBackFunction': adjustCol
				});
				e.preventDefault();
				e.stopPropagation();
			})

			$('.del_col').click(function(e){
				// console.log('del');
				deleteCol($(this).parent());
				e.preventDefault();
				e.stopPropagation();
			})



			// general

			$('.edi_ele').click(function(e){
				editElement($(this).parent());
				e.preventDefault();
				e.stopPropagation();
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
				e.stopPropagation();
			})



		}	
		

		function checkIcon(el) {
			// console.log(el);
			var stConf = el.unitsConf[device];
			if (arConfDefault.indexOf(stConf) < 0) stConf = 'unknown';
			return "system/modules/gp_grix/assets/img/col-icons/col-icon-"+stConf+".svg";
		}

			
		function createBeHtmlCode(arEls,level,id){
			level++;
			var html = "";
			var nrElsY = arEls.length;
			var stClassSingle = (nrElsY==1 && level==0 ? " single_row" : "");
			// console.log('arEls:',arEls);

			for(var y=0; y < nrElsY; y++){
				var obEl = arEls[y];

				// lets build a row
				if(obEl.type == 'row'){
					var idx = (id=='' ? y : id+"_"+y);
					
					html += "<div class='x r"+stClassSingle+"' data-id='"+idx+"' >\
								<div class='r_content'>";

					if(obEl.elements){
						// lets build some cols
						var arCols = obEl.elements;
						var nrEls = arCols.length;
						var stClassSingle = (nrEls==1 ? " single_col" : "");
				
						for(var x=0; x < nrEls; x++){
							var obCol = arCols[x];
							var stNewId = (id=='' ? y+"_"+x : id+"_"+y+"_"+x);
							var stClass = "x c l"+level+stClassSingle;

							// add the bootstrap classes
							for (var i = 0; i < arBootProps.length; i++) {
								var prop = arBootProps[i]
								for (var dev in obCol[prop]) {
									var stU = obCol[prop][dev];
									if (stU !== "") {
										if (prop=="width") {
											stClass += " col-"+dev+"-"+stU;
										} else{
											stClass += " col-"+dev+"-"+prop+"-"+stU;
										};
									}
								}					
							};

							html += "<div class='"+stClass+"' data-id='"+stNewId+"' >\
										<div class='c_content'>";
						
							if(obCol.elements && obCol.elements.length > 0){
								html += createBeHtmlCode(obCol.elements,level,stNewId);
							}
						
							html += "</div>\
										<div class='menu c_menu cf' data-id='"+stNewId+"' data-type='col' >\
											<a class='btn ins_row' ></a>\
											<a class='btn add_ce' ></a>\
											<a class='btn adj_col' ></a>\
											<a class='btn del_col' ></a>\
											<span class='db_info db_id'>"+stNewId+"</span>\
											<span class='db_info db_level'>"+level+"</span>\
										</div>\
									</div>";
						}
					}

					html += "</div>\
								<div class='menu r_menu cf' data-id='"+idx+"' data-type='row' >\
									<a class='btn ins_col' data-type='row' ></a>\
									<a class='btn add_row' data-type='row' ></a>\
									<a class='btn adj_row' ></a>\
									<div class='btn split_col' style='background-image:url("+checkIcon(obEl)+")' >\
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
									<span class='db_info db_id'>"+idx+"</span>\
								</div>\
								<div class='ce_mb'>"+createBeMargin(obEl)+"</div>\
							</div>";
				}

				// lets build a content-element
				if(obEl.type == "ce"){
					var stNewId = (id=='' ? y : id+"_"+y);
					var stCeHtml = $('#grixce_'+obEl.id).html();
					var stClass = "x ce";

					html += "<div class='"+stClass+"' data-id='"+stNewId+"' >\
								<div class='ce_content'>"+stCeHtml+"</div>\
								<div class='menu ce_menu cf' data-id='"+stNewId+"' >\
									<a class='btn edi_ele' ></a>\
									<a class='btn ins_ele' ></a>\
									<a class='btn del_ele' ></a>\
									<span class='db_info db_id'>"+stNewId+"</span>\
								</div>\
								<div class='ce_mb'>"+createBeMargin(obEl)+"</div>\
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
				var stClassCust = obEl.classes ? " " + obEl.classes.join(" ") : "";
				stClassCust = createFeMargin(obEl,stClassCust);

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
							stClass = createFeMargin(obCol,stClass);

							// add the bootstrap classes
							for (var i = 0; i < arBootProps.length; i++) {
								var prop = arBootProps[i]
								for (var dev in obCol[prop]) {
									var stU = obCol[prop][dev];
									if (stU !== "") {
										if (prop=="width") {
											stClass += " col-"+dev+"-"+stU;
										} else{
											stClass += " col-"+dev+"-"+prop+"-"+stU;
										};
									}
								}					
							};

							// Add the classes selected by the user
							stClass = obCol.classes ? stClass + " " + obCol.classes.join(" ") : stClass;

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
					var stNewId = (id=="" ? y : id+"_"+y);
					var stClass = "ce";
					stClass = createFeMargin(obEl,stClass);

					html += "<div class='"+stClass+"' id='el_"+stNewId+"' >";
					html += "{{insert_content::"+obEl.id+"}}";
					html += "</div>";
				}
			}
			return html;
		}



		function createBeMargin(el) {
			// console.log('margin: ',el.margin[device]);
			// return el.margin[device];

			var stM = "";
			for (var z = 0; z < arDevices.length; z++) {
				var cmb = el.margin[arDevices[z]];
				if (cmb!="") {
					stM = cmb;
				};
				if (arDevices[z] == device) {
					break;
				};
			};
			return stM;
		}

		function createFeMargin(el,cl) {
			for (var dev in el.margin) {
				var stV = el.margin[dev];
				// console.log(stV);
				if (stV !== "") {
					cl += " mb-"+dev+"-"+stV;
				}
			}
			return cl;
		}

		function drawGrix(){
			var stHtmlBe = createBeHtmlCode(obData,0,'');
			var stHtmlFe = createFeHtmlCode(obData,0,'');
			var stJson = JSON.stringify(obData);

			// show the grid in the backend
			$('.grix_grid').html(stHtmlBe);

			// fill the backend form inputs
			$('#ctrl_grixHtmlFrontend').val(stHtmlFe);
			$('#ctrl_grixJson').val(stJson);
			addUi();

			if (debug) {
				$body.addClass('grix_debug');
				var stJsonBeautyfied = JSON.stringify(obData,null, "\t");
				stJsonBeautyfied = syntaxHighlight(stJsonBeautyfied);
				$('.grix_beautyfied').html(stJsonBeautyfied);
			};

			// $grix.removeClass('saved');
			// saveGrix(stJson,stHtmlFe);
		}


		// Save with Ajax – due to cache problems not working :(

		function saveGrix(){
			$grix.addClass('saving');
			var stFormData = $("#grixBeForm").serialize();
			stFormData += '&grixAction=save';
			$.ajax({
				type: 'POST',
				url: 'system/modules/gp_grix/ajax/ajax.php',
				data: stFormData,
				success: function(data){
					// console.log(data);
					$grix.removeClass('saving');
					$grix.addClass('saved');

				},
				error: function (xhr, textStatus, errorThrown) {
					alert('ajax error ' + (errorThrown ? errorThrown : xhr.status));
				}
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