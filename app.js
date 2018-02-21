const express = require('express');
const static = require('express-static');
const ejs = require('ejs');
const mysql	= require('mysql');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerObj = multer({dest: './static/upload'});
const expressRoute = require('express-route');
const opn = require('opn');

const app = express();

app.listen(8080);

//1.获取请求数据
//get自带

app.use(bodyParser());
app.use(multer().any());

//2.cookie、session

app.use(cookieParser());
!function() {
	let keys = [];
	for(let i = 0; i < 100000; i++) {
		keys[i] = 'a_' + Math.random();
	}
	app.use(cookieSession({
		name: 'sess_id',
		keys: keys,
		maxAge: 20*60*1000 //20min
	}));
}();

//3.模板

app.engine('html', consolidate.ejs);
app.set('views', 'template');
app.set('view enigne', 'html');

//4.route

const adminRouter = require('./route/admin');
const webRouter = require('./route/web.js');

app.use('/admin/', adminRouter);
app.use('/', webRouter);


//5.default: static

app.use(static('./static/'));

console.log('server running at 8080');

opn('http://localhost:8080');