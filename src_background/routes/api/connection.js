const c$express = require('express.helper');
const router = c$express.Router();

const helper = require('common.helper');
const l$deviceConnection = require(`${__libdir}/deviceConnection`);

router.get('/list/serial', async function (req, res, next) {
	const result = await l$deviceConnection.getSerialList();

	helper.sendResponse(res, result);
});

router.post('/connect', async function (req, res, next) {
	const result = await l$deviceConnection.connect(req.body);

	helper.sendResponse(res, result);
});

router.get('/events', async function (req, res, next) {
	l$deviceConnection.listenEvent(req, res);
})

module.exports = router;
