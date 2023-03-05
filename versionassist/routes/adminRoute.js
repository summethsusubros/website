const { Router } = require('express');
const adminController = require('../controllers/adminController');
const User = require('../models/User');

const router = Router();

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

function isAdmin(req, res, next) {
    User.findOne({email: req.user.email}, "role", (err, loggedInUser) => {
        if (err) return handleError(err);
        loggedInUser.role.includes('admin') ? next() : res.sendStatus(401);
    }); 
}

router.get('/administrate', isLoggedIn, isAdmin,adminController.getAdministrate);
router.post('/administrate/add-products', isLoggedIn, isAdmin,adminController.postAdministrateAddProducts);
router.post('/administrate/add-admin', isLoggedIn, isAdmin,adminController.postAdministrateAddAdmin);
router.post('/administrate/approve-manager', isLoggedIn, isAdmin,adminController.postAdministrateApproveManager);
router.post('/administrate/decline-manager', isLoggedIn, isAdmin,adminController.postAdministrateDeclineManager);
router.post('/administrate/add-platforms', isLoggedIn, isAdmin,adminController.postAdministrateAddPlatforms);
router.post('/administrate/add-tools', isLoggedIn, isAdmin,adminController.postAdministrateAddTools);
router.post('/administrate/pre-add-builds', isLoggedIn, isAdmin,adminController.postAdministratePreAddBuilds);
router.post('/administrate/add-builds', isLoggedIn, isAdmin,adminController.postAdministrateAddBuilds);


module.exports = router;