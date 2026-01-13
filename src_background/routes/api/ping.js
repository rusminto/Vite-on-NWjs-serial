const c$express = require('express.helper');
const router = c$express.Router();

const helper = require('common.helper');
const l$ping = require(`${__libdir}/ping`);

router.get('/', async function (req, res, next) {
	const result = await l$ping.getResponse();

	helper.sendResponse(res, result);
});

module.exports = router;
