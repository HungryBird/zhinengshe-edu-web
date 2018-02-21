const express = require('express');
const common = require('../libs/common');
const mysql = require('mysql');

const router = express.Router();
const db = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'edu'
})

router.use((req, res, next)=> {
	if(!req.session['admin_id'] && req.url != '/login') {
		res.redirect('/admin/login');
	}else{
		next();
	}
});

router.get('/login', (req, res)=> {
	res.render('./admin/login.ejs', {});
})

router.post('/login', (req, res)=> {

	let username = req.body.username;
	let password = common.md5(req.body.password + common.MD5_SUFFIX);

	db.query(`SELECT * FROM admin_table WHERE username = '${username}'`, (err, data)=> {
		if(err) {
			res.status(500).send('database err').end();
		} else {
			if(data.length == 0) {
				res.status(400).send('no this admin').end();
			} else {
				if(data[0].password === password) {
					req.session['admin_id'] = data[0].ID;
					res.redirect('/admin/');
				} else {
					console.log('data', data[0].password);
					res.status(400).send('password err');
				}
			}
		}
	})
});

router.get('/', (req, res)=> {
	res.render('admin/index.ejs', {});
});

router.get('/banner', (req, res)=> {
	res.render('admin/banners.ejs');
});

router.post('/banners', (req, res)=> {
	let title = req.body.title;
	let description = req.body.description;
	let href = req.body.href;

	if( !title || !description || !href ) {
		res.status(400).send('arg err').end();
	} else {
		db.query(`INSERT INTO banner_table (title, description, href) VALUE('${title}', '${description}', '$(href)')`, (err, data)=> {
			if(err) {
				res.status(500).send('database err').end()
			} else {
				res.redirect('/admin/banners')
			}
		})
	}
})

module.exports = router;
