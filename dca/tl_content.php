<?php 


// when the CE editor is loaded
$GLOBALS['TL_DCA']['tl_content']['config']['onload_callback'][] = array('gp_grix','addGrixJs');


// when the CE is saved/submitted
$GLOBALS['TL_DCA']['tl_content']['config']['onsubmit_callback'][] = array('gp_grix','grixOnCeSubmit');




/**
 * Class gp_grix
 * Provide miscellaneous methods that are used by the data configuration array.
 */
class gp_grix extends tl_content
{

	/**
	 * Add the grix js for CE handling
	 */
    public function addGrixJs(DataContainer $dc)
    {

    	if(\Input::get('grix')=='create')
    	{
		    // add "jQuery.noConflict()" at the beginning of TL_JAVASCRIPT
			array_unshift($GLOBALS['TL_JAVASCRIPT'], 'system/modules/gp_grix/assets/js/jquery.noconflict.js');

			// get the jquery src, e.g.: assets/jquery/core/1.11.3/jquery.min.js";
			$strJQuerySrc = 'assets/jquery/core/' . reset((scandir(TL_ROOT . '/assets/jquery/core', 1))) . '/jquery.min.js';

		    // add the jquery-library at the beginning of TL_JAVASCRIPT
			array_unshift($GLOBALS['TL_JAVASCRIPT'], $strJQuerySrc);

			// add the js for ce handling
    		$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/gp_grix/assets/js/grixCE.js';
			
    	};

    }



	/**
	 * CE has been saved/submitted: 
	 * Now add the article id as a url parameter and redirect to GrixBE
	 */
    public function grixOnCeSubmit(DataContainer $dc)
    {

    	if (\Input::get('grix'))
    	{
    		// Only redirect when the save buttons have been pressed
    		// required to ignore the selection of a ce module 
    		if ($this->Input->post('saveNclose') || $this->Input->post('saveNback')) 
    		{
	    		if (\Input::get('grix')=='edit' || \Input::get('grix')=='create' ) 
	    		{
					$strCeId = \Input::get('id');
					$strArtId = \Input::get('pid');
				        
			        // add the tstamp, required!
					$this->import('Database');
					$this->Database->prepare("UPDATE tl_content SET tstamp=? WHERE id=?")->execute(time(), $strCeId);

		 			// go back to the grix module
		 			$this->redirect('contao/main.php?do=grixbe&id='.$strArtId);
	    		}

    		}
	    }

    }


}






 ?>