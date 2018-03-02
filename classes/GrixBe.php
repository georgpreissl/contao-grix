<?php

/**
 * Grid Extension for Contao
 *
 * Copyright (c) 2017 Georg Preissl
 *
 * @package gp_grix
 * @link    http://www.georg-preissl.at
 * @license http://opensource.org/licenses/MIT MIT
 */

/**
 * Namespace
 */
namespace Grix;


class GrixBe extends \BackendModule
{

	protected $strTemplate = 'mod_grix';


	public function compile()
	{

		$this->loadLanguageFile('tl_grix'); 

		/**
		 * CSS & Javascripts
		 */
		if (TL_MODE=='FE') 
		{
			// $GLOBALS["TL_CSS"][] = "system/modules/gp_grix/assets/css/bootstrap.css";
		}

		if (TL_MODE=='BE')
		{
			if (!is_array($GLOBALS['TL_JAVASCRIPT']))
			{
				$GLOBALS['TL_JAVASCRIPT'] = array();
			}
		    // add "jQuery.noConflict()" at the beginning of TL_JAVASCRIPT
			array_unshift($GLOBALS['TL_JAVASCRIPT'], 'system/modules/gp_grix/assets/js/jquery.noconflict.js');

			// get the jquery src, e.g.: assets/jquery/core/1.11.3/jquery.min.js";
			$strJQuerySrc = 'assets/jquery/core/' . reset((scandir(TL_ROOT . '/assets/jquery/core', 1))) . '/jquery.min.js';

		    // add the jquery-library at the beginning of TL_JAVASCRIPT
			array_unshift($GLOBALS['TL_JAVASCRIPT'], $strJQuerySrc);

			$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/gp_grix/assets/js/jquery-ui-1.12.1/jquery-ui.min.js';
			$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/gp_grix/assets/js/grixElement.js';
			$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/gp_grix/assets/js/grixLightbox.js';
			$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/gp_grix/assets/js/grix.js';
			$GLOBALS['TL_CSS'][] = 'system/modules/gp_grix/assets/css/grix_backend.css';
			$GLOBALS["TL_CSS"][] = 'system/modules/gp_grix/assets/css/bootstrap_backend.css';
		}



		// get the id of the article to edit
		// eg. main.php ? do=grixbe & id=4 & ref=f450a0f36c3019d4030aeab540292c3d
		$id = \Input::get('id');


		// if grix is activated in the backend-module-pannel
		if(!$id)
		{
			$objTemplate = new \BackendTemplate('mod_grix_help');
			$this->Template = $objTemplate;
			return $this->Template->parse();;		
		}


		// if the grixBeForm has been submitted, save js and html to the database
		if (\Input::post('FORM_SUBMIT') == 'tl_grix')
		{
			// save the frontend html
			$grixHtmlFrontend = $_POST['grixHtmlFrontend'];
			$this->Database->prepare("UPDATE tl_article SET grixHtmlFrontend=? WHERE id=?")->execute($grixHtmlFrontend, $id);
			
			// save the js string
			$grixJs = $_POST['grixJs'];
			$this->Database->prepare("UPDATE tl_article SET grixJs=? WHERE id=?")->execute($grixJs, $id);
		}





		// get all the CEs of this article created by Grix
		$objCEsUsed = $this->Database->prepare("SELECT CEsUsed from tl_article WHERE id=?")->execute($id);
		$arrCEsUsed = unserialize($objCEsUsed->CEsUsed);
		if ($arrCEsUsed == false) 
		{
			$arrCEsUsed = array();
		}
		$intCEsUsedNr = count($arrCEsUsed);


		// get all the CEs of this article created by contao directly
		$objCEs = \ContentModel::findPublishedByPidAndTable($id,'tl_article');
        $arrCEs = array();
	    if ($objCEs == null)
	    {
	        $intCEsNr = 0;
	    } else {
	        $intCEsNr = $objCEs->count();

	        while ($objCEs->next()) 
	        {
	            $objCE = $objCEs->current();
	            $arrCEs[] = $objCE->id;
	        }
	    	
	    }


	    // add the contao-created CEs to the collection
		$arrOverall = array_merge($arrCEsUsed, $arrCEs);
		
		// delete duplicates
		$arrOverall = array_unique($arrOverall);

		// now we have all the CEs for this article
		$objCEsOverall = \ContentModel::findMultipleByIds($arrOverall);

		// store all the CEs in an array
		$arrCEsOverall = array();
		if ($objCEsOverall !== null)
		{
		 	while ($objCEsOverall->next())
			{
				$arrCE = array();
				$arrCE['html'] = \Controller::getContentElement($objCEsOverall->current(),'main');
				$arrCE['id'] = $objCEsOverall->id;
				$arrCEsOverall[] = $arrCE;
			}
		}


		// get all the css-classes of this article
		$objClasses = \GrixCssModel::findAll();

		// store the css-classes in an array
		$arrClasses = array();
		if ($objClasses !== null)
		{
		 	while ($objClasses->next())
			{
				$arrCl = array();
				$arrCl['name'] = $objClasses->styleTitle;
				$arrCl['id'] = $objClasses->id;
				$arrCl['alias'] = $objClasses->cssClasses;
				$arrCl['description'] = $objClasses->styleDescription;
				$arrClasses[] = $arrCl;
			}
		}


		// get the grixJs of this article
		$result = $this->Database->prepare("SELECT grixJs FROM tl_article WHERE id=?")->execute($id);
		$strData = $result->grixJs ? : '';
		
		 


		$this->Template->id = $id;
		$this->Template->data = $strData;
		$this->Template->grixHtmlFrontend = $grixHtmlFrontend;
		$this->Template->ces = $arrCEsOverall;
		$this->Template->action = ampersand(\Environment::get('request'));
		// $this->Template->href = $this->getReferer(true);
		// $this->Template->referer = 'javascript:history.go(-1)';
		$this->Template->title = specialchars($GLOBALS['TL_LANG']['MSC']['backBTTitle']);
		$this->Template->lc = file_get_contents(TL_ROOT . '/system/modules/gp_grix/assets/img/lb-icons/lb-close.svg');

		// not working, why?	
        $this->Template->headline = sprintf($GLOBALS['TL_LANG']['tl_grix']['headline'], \Input::get('id'));

		$this->Template->submit = specialchars($GLOBALS['TL_LANG']['MSC']['save']);		
		$this->Template->delete = specialchars($GLOBALS['TL_LANG']['tl_grix']['reset'][0]);		
		$this->Template->button = $GLOBALS['TL_LANG']['MSC']['backBT'];
		$this->Template->lbChooseCE = specialchars($GLOBALS['TL_LANG']['tl_grix']['lbChooseCE'][0]);		

		$this->Template->allArticles = $this->getArticleAlias($id);
		$this->Template->classes = $arrClasses;

		// for debugging
		$this->Template->CEsNr = $intCEsNr;
		$this->Template->CEs = count($arrCEs) ? 'IDs: ' . implode(", ", $arrCEs) : '';
		$this->Template->CEsUsedNr = $intCEsUsedNr;
		$this->Template->CEsUsed = count($arrCEsUsed) ? 'IDs: ' . implode(", ", $arrCEsUsed) : '';

		
	}



	/**
	 * Get all articles and return them as array (article alias)
	 * @param object
	 * @return array
	 */
	public function getArticleAlias($id)
	{
		$arrPids = array();
		$arrAlias = array();

	    $this->import('BackendUser', 'User');

		if (!$this->User->isAdmin)
		{
			foreach ($this->User->pagemounts as $id)
			{
				$arrPids[] = $id;
				$arrPids = array_merge($arrPids, $this->Database->getChildRecords($id, 'tl_page'));
			}

			if (empty($arrPids))
			{
				return $arrAlias;
			}

			$objArticles = $this->Database->prepare("SELECT a.id, a.pid, a.title, a.inColumn, p.title AS parent FROM tl_article a LEFT JOIN tl_page p ON p.id=a.pid WHERE a.pid IN(". implode(',', array_map('intval', array_unique($arrPids))) .") ORDER BY parent, a.sorting")
									   ->execute();
		}
		else
		{

			$objArticles = $this->Database->prepare("SELECT a.id, a.pid, a.title, a.inColumn, p.title AS parent FROM tl_article a LEFT JOIN tl_page p ON p.id=a.pid ORDER BY parent, a.sorting")
									   ->execute();
		}

		if ($objArticles->numRows)
		{
			$this->loadLanguageFile('tl_article');

			while ($objArticles->next())
			{
					$result = $this->Database->prepare("SELECT * FROM tl_content WHERE pid=?")->execute($objArticles->id);
					if ($result->numRows) 
					{
						$key = $objArticles->parent . ' (ID ' . $objArticles->pid . ')';
						if ($id == $objArticles->id ) 
						{
							// show the current edited article as first option in the dropdown
							$arrCurrent = array();
							$arrCurrent[$key][$objArticles->id] = $objArticles->title . ' (' . ($GLOBALS['TL_LANG']['tl_article'][$objArticles->inColumn] ?: $objArticles->inColumn) . ', ID ' . $objArticles->id . ')';
							

						} else {
							$arrAlias[$key][$objArticles->id] = $objArticles->title . ' (' . ($GLOBALS['TL_LANG']['tl_article'][$objArticles->inColumn] ?: $objArticles->inColumn) . ', ID ' . $objArticles->id . ')';

						}
					}
			}

			if (isset($arrCurrent)) 
			{
				$arrAlias = array_merge($arrCurrent, $arrAlias);
			}
		}
		// printf('<pre>%s</pre>', print_r($arrAlias,true));
		return $arrAlias;
	}







}