const { Router } = require('express');
const vaController = require('../controllers/vaController');

const router = Router();
   
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}


router.get('/',vaController.index);
router.get('/index/view/:tools',vaController.index2);
router.post('/index/redirect', vaController.post_index);
router.post('/index/view/:tools', vaController.post_index2);
router.get('/index/history/:product/:platform', vaController.get_index_history);

router.get('/filter', vaController.filter);

router.get('/configure', isLoggedIn, vaController.get_configure);
router.get('/configure/ownership', isLoggedIn, vaController.get_ownership);
router.get('/configure/product', isLoggedIn, vaController.get_product);
router.get('/configure/product/:product', isLoggedIn, vaController.get_product_details);
router.get('/configure/define', isLoggedIn, vaController.get_define);
router.get('/configure/define/:tools/:product', isLoggedIn, vaController.get_define_details);
router.get('/configure/history/:product', isLoggedIn, vaController.get_history);
router.get('/configure/account', isLoggedIn, vaController.get_account);

router.post('/configure/ownership', isLoggedIn, vaController.post_ownership);
router.post('/configure/product/:product', isLoggedIn, vaController.post_add_version);
router.post('/configure/define/redirect', isLoggedIn, vaController.post_define);
router.post('/configure/define/commit', isLoggedIn, vaController.post_commit);
router.post('/configure/history/:product', isLoggedIn, vaController.post_history);

module.exports = router;