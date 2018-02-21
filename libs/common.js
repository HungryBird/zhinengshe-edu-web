const crypto = require('crypto');

module.exports = {
	MD5_SUFFIX: 'fds65g56324ds6f5s4sd5f1cxz*(8sd898asd879(_3z2xc32zxc',
	md5: function(str) {
		let obj = crypto.createHash('md5');

		obj.update(str);

		return obj.digest('hex');
	}
};