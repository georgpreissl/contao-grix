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
			$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/gp_grix/assets/js/GrixElement.js';
			$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/gp_grix/assets/js/grixLightbox.js';
			$GLOBALS['TL_JAVASCRIPT'][] = 'system/modules/gp_grix/assets/js/grix.js';
			$GLOBALS['TL_CSS'][] = 'system/modules/gp_grix/assets/css/grix_backend.css';
			$GLOBALS["TL_CSS"][] = "system/modules/gp_grix/assets/css/bootstrap_backend.css";
		}



		// get the id of the article to edit
		$id = \Input::get('id');


		if(!$id)
		{
			$arrPages = array();
			// get all
			$objPages = \PageModel::findAll();
			// var_dump($objPages);

			

			if (null !== $objPages)  {
				while($objPages->next()) {
					
					$objPage = new \stdClass();
					$objPage->title = $objPages->title;
					$objPage->articles = array();
					$objArticles = \ArticleModel::findBy('pid',$objPages->id);

					if (null !== $objArticles) {
						$arrArticles = array();
						while($objArticles->next()) {
							$objArticle = new \stdClass();
							$objArticle->title = $objArticles->title;
						    $objPage->articles[] = $objArticle;
						}
					}

				    $arrPages[] = $objPage;
				}
			}



			$objTemplate = new \BackendTemplate('mod_grix_articles');
			$this->Template = $objTemplate;
			$this->Template->m = 'hello';
			$this->Template->pages = $arrPages;

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


		// get all the CEs of this article
		//$objCEs = \ContentModel::findPublishedByPidAndTable($id,'tl_article');

		// get all the CEs used in this article
		$objUsedCEs = $this->Database->prepare("SELECT CEsUsed from tl_article WHERE id=?")->execute($id);
		$arrUsedCEs = unserialize($objUsedCEs->CEsUsed);
		$objCEs = \ContentModel::findMultipleByIds($arrUsedCEs);

		// store the CEs in an array
		$arrCEs = array();
		if ($objCEs !== null)
		{
		 	while ($objCEs->next())
			{
				$arrCE = array();
				$arrCE['html'] = \Controller::getContentElement($objCEs->current(),'main');
				$arrCE['id'] = $objCEs->id;
				$arrCEs[] = $arrCE;
			}
		}

		// printf('<pre>%s</pre>', print_r($arrCEs,true));

		// get all the Classes of this article
		$objClasses = \GrixCssModel::findAll();

		// store the CEs in an array
		$arrClasses = array();
		if ($objClasses !== null)
		{
		 	while ($objClasses->next())
			{
				// printf('<pre>%s</pre>', print_r($objClasses->current(),true));
				$arrCl = array();
				$arrCl['name'] = $objClasses->styleDesignation;
				$arrCl['id'] = $objClasses->id;
				$arrCl['alias'] = $objClasses->cssClasses;
				$arrClasses[] = $arrCl;
			}
		}
// printf('<pre>%s</pre>', print_r($arrClasses,true));


		// get the grixJs of this article
		$result = $this->Database->prepare("SELECT grixJs FROM tl_article WHERE id=?")->execute($id);
		$strData = $result->grixJs;

		if ($strData == NULL) {
			$strData = '[{"type":"row","unitsConf":{"xs":12,"sm":12,"md":12,"lg":12},"classes":"","elements":[{"type":"col","units":"12","boot":{"xs":12,"sm":12,"md":12,"lg":12},"classes":"","elements":[]}]}]';
		}

		$this->loadLanguageFile('tl_grix');  




		$this->Template->id = $id;
		$this->Template->data = $strData;
		$this->Template->grixHtmlFrontend = $grixHtmlFrontend;
		$this->Template->ces = $arrCEs;
		$this->Template->action = ampersand(\Environment::get('request'));
		$this->Template->href = $this->getReferer(true);
		$this->Template->title = specialchars($GLOBALS['TL_LANG']['MSC']['backBTTitle']);
		// var_dump(TL_ROOT);
		$this->Template->lc = file_get_contents(TL_ROOT . '/system/modules/gp_grix/assets/img/lb-icons/lb-close.svg');
		// $this->Template->lc = "fuck";

		// not working, why?	
        $this->Template->headline = sprintf($GLOBALS['TL_LANG']['tl_grix']['headline'], \Input::get('id'));

		$this->Template->submit = specialchars($GLOBALS['TL_LANG']['MSC']['save']);		
		$this->Template->delete = specialchars($GLOBALS['TL_LANG']['tl_grix']['reset'][0]);		
		$this->Template->button = $GLOBALS['TL_LANG']['MSC']['backBT'];
		$this->Template->lbChooseCE = specialchars($GLOBALS['TL_LANG']['tl_grix']['lbChooseCE'][0]);		

		$this->Template->allArticles = $this->getArticleAlias();
		$this->Template->classes = $arrClasses;
;
		
	}



	/**
	 * Get all articles and return them as array (article alias)
	 * @param object
	 * @return array
	 */
	public function getArticleAlias()
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

			$objAlias = $this->Database->prepare("SELECT a.id, a.pid, a.title, a.inColumn, p.title AS parent FROM tl_article a LEFT JOIN tl_page p ON p.id=a.pid WHERE a.pid IN(". implode(',', array_map('intval', array_unique($arrPids))) .") ORDER BY parent, a.sorting")
									   ->execute();
		}
		else
		{
			$objAlias = $this->Database->prepare("SELECT a.id, a.pid, a.title, a.inColumn, p.title AS parent FROM tl_article a LEFT JOIN tl_page p ON p.id=a.pid ORDER BY parent, a.sorting")
									   ->execute();
		}

		if ($objAlias->numRows)
		{
			$this->loadLanguageFile('tl_article');

			while ($objAlias->next())
			{
				$key = $objAlias->parent . ' (ID ' . $objAlias->pid . ')';
				$arrAlias[$key][$objAlias->id] = $objAlias->title . ' (' . ($GLOBALS['TL_LANG']['tl_article'][$objAlias->inColumn] ?: $objAlias->inColumn) . ', ID ' . $objAlias->id . ')';
			}
		}

		return $arrAlias;
	}







}