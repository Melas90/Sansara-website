/**
 * The site’s whole client-side script, loaded once from BaseLayout so a page makes
 * one small request instead of one per block. Each module is a no-op when its
 * markup is not on the page.
 */
import './consent';
import './menu';
import './diagram';
import './reveal';
import './booking';
