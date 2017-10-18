(function($){
	$(document).ready(function(){
		


		window.GrixLightbox = function(){
			
			var self = this;
		

			// Bind the event handler to the elements

			self.bindEvents = function(){

				// Choose the units config
				$(".grix_lb_unitsconf").click(function(e) {

					$(this).addClass('selected').siblings().removeClass('selected');


					
					e.preventDefault();
				});


				$(".grix_lb_unitsconf_custom").focus(function(e) {
					
				});

				$(".grix_lb_unitsconf_custom").change(function(e) {
					console.log('change');
					var val = $(this).val();
					$(this).parent().addClass('selected').siblings().removeClass('selected');
					$(this).parent().data('config',val);
					e.preventDefault();
				});



				// Load the CE's of the selected article
				$(".grix_lb_articles select").change(function(){
				    var nrArtId = $(this).val();

					$.ajax({
						type: 'POST',
						// url: '',
						data: {
							'action':'loadGrixCEs',
							'id':nrArtId,
							'REQUEST_TOKEN':Contao.request_token
						},
					    dataType: 'json',
						cache: false		     	
			        }).done(function(obj) {
			        	// Insert the loaded CE's
						$('.grix_lb_ces').html(obj.content);
					});	
			        return false;
				});

				$('.grix_lb').on("click", '.grix_lb_ce', function(event) { 
					$(this).toggleClass('selected');
				});
				
				$('.grix_lb_overlay').click(function(e){
					self.close();
					e.preventDefault();
				});

				$('.grix_lb_cancel').click(function(e){
					self.close();
					e.preventDefault();
				});

				$('.grix_lb_class').click(function(e) {
					$(this).toggleClass('selected');
				});
				
				$('#grix_lb_apply').click(function(e){
					console.log('apply');

					// collect the selected unit-configs
					$(".grix_lb_uc.selected").each(function(i,el){
						self.obCfg.unitsConf[$(el).data('device')] = $(el).data('config');
					});

					// collect the selected CEs
					$('.grix_lb_ce.selected').each(function(i,el){
						self.arCEchecked.push($(this).data("ceid"));
					});

					// collect the selected classes
					$('.grix_lb_class.selected').each(function(i,el){
						self.arCLchecked.push($(this).data("alias"));
					});

					// create the return object
					self.obCfg.classes = self.arCLchecked;
					self.obCfg.arCEs = self.arCEchecked;

					// call the callback function
					self.apply();
				});

			}



			// Open the lightbox window

			self.activate = function(settings){
				self.obCfg = {
					unitsConf:{}
				};
				self.settings = settings;

				// Start without a selection
				self.arCEchecked = [];
				self.arCLchecked = [];




				// Get the clicked row/column
				var obClicked = self.settings.obTarget.elements[self.settings.obTarget.pos];
				// console.log('obClicked: ',obClicked);

				// Open the lightbox
				$('body').addClass('grix_lb_active grix_lb_'+obClicked.type);

				// Get the css classes of it
				self.arClasses = obClicked.classes;
				// console.log('self.arClasses: ',self.arClasses);


				if (obClicked.type == 'row') {

					var arCols = obClicked.elements;
					// console.log('arCols: ',arCols);

					var obFirstColumn = arCols[0];
					var arDevices = ['xs','sm','md','lg'];

					// Mark the choosen units config as selected
					$('.grix_lb_colmenu').each(function(index, el) {
						var stUnCfg = obClicked.unitsConf[arDevices[index]];
						console.log('stUnCfg: ',stUnCfg);
						var $unConf = $(this).find('*[data-config="'+stUnCfg+'"]');
						if ($unConf.length) {
							$unConf.addClass('selected');
						} else {
							$('.grix_lb_colmenu').find('.grix_lb_unitsconf_custom').val(stUnCfg);
						}
					});
				};


				// Mark the choosen css classes as selected
				for (var i = 0; i < self.arClasses.length; i++) {
					$('.grix_lb_classes').find('[data-alias="'+self.arClasses[i]+'"]').addClass('selected');
				}


			}


			// Close the lightbox window and apply

			self.apply = function(){
				self.settings.callBackFunction(self.settings.obTarget,self.obCfg);
				self.close();
			}


			// Close the lightbox window

			self.close = function(){

				self.obCfg = {
					unitsConf:{}
				};


				// Deselect everything
				$(".grix_lb_unitsconf").removeClass('selected');
				$('.grix_lb_class').removeClass('selected');
				$('.grix_lb_ce').removeClass('selected');

				$(".grix_lb_unitsconf_custom").each(function(index, el) {
					$(this).val('');
				});

				$('body').removeClass('grix_lb_active grix_lb_row grix_lb_col');

			}


		}




		
		
	});
})(jQuery);