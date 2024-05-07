var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
//Tambahkan body-parser
var bodyParser = require("body-parser");
//assertation
const assert = require("assert");

// const debug = require('debug')('express_restapi:main');

//Tambahkan modul jsonwebtoken
const jwt = require("jsonwebtoken");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
const port = 5000;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// gunakan body parser sebgai middleware
app.use(bodyParser.json());
// data yang kita gunakan adalah kelas pada karakter game
var kelas = [
	{ id: 1, nama_kelas: "Backend" },
	{ id: 2, nama_kelas: "Frontend" },
	{ id: 3, nama_kelas: "Fullstack" },
];
app.get("/api/kelas", function (req, res) {
	// debugger;
	res.json({ data: kelas });
	res.send({ data: kelas });
});

//get api kelas/id
app.get('/api/kelas/:id', function (req,res) {

    const kls =  kelas.find(k => k.id === parseInt(req.params.id));
    if (!kls) res.status(404).send("Kelas tidak ditemukan");// tampilkan status 404
    res.json({data: kls});
    res.send({data: kls});
});

//get api kelas id dengan try catch
// app.get('/api/kelas/:id', function (req, res) {
//     try {
//         const kls = kelas.find(k => k.id === parseInt(req.params.id));
//         if (!kls) res.status(404).json({ error: "ID_NOT_FOUND", message:`ID Kelas ${req.params.id} tidak ada`});// tampilkan status 404
//         res.status(200).json({ data: kls });
//         res.send({ data: kls });
//         res.send(err)
//     } catch (err) {
//         // tampilkan status 500
//        res.status(500).json({ error: "INTERNAL_SERVER_ERROR", message: err.message});
//     }
// });

// get api kelas id dengan assertation
// app.get("/api/kelas/:id", function (req, res) {
// 	try {
// 		const kls = kelas.find((k) => k.id === parseInt(req.params.id));
// 		assert(kls, `ID Kelas ${req.params.id} tidak ditemukan`);
// 		res.status(200).json({ data: kls });
// 		res.send({ data: kls });
// 		res.send(err);
// 	} catch (err) {
// 		if (err.name === "AssertionError") {
// 			res.status(404).json({ error: err.message });
// 		} else {
// 			res.status(500).json({ error: err.message });
// 		}
// 	}
// });

// Menambahkan data

app.post("/api/kelas", function (req, res) {
	//Kondisi apabila nama kelas kosong
	if (!req.body.nama_kelas) {
		// Menampilkan pesan error ketika field nama kelas kosong
		res.status(400).send("Nama kelas harus diisi");
		return;
	}

	const kls = {
		id: kelas.length + 1,
		nama_kelas: req.body.nama_kelas,
	};
	kelas.push(kls);
	res.send(kls);
});

// Mengupdate data
app.put("/api/kelas/:id", function (req, res) {
	//Cek id kelas
	const klas = kelas.find((k) => k.id === parseInt(req.params.id));
	if (!klas) res.status(404).send("Kelas tidak ditemukan"); // tampilkan status 404

	if (!req.body.nama_kelas) {
		// Menampilkan pesan error ketika field nama kelas kosong
		res.status(400).send("Nama kelas harus diisi");
		return;
	}

	klas.nama_kelas = req.body.nama_kelas;
	res.send({ pesan: "Data berhasil diupdate.", data: klas });
});

// Menghapus data
app.delete("/api/kelas/:id", function (req, res) {
	//Cek id kelas
	const klas = kelas.find((k) => k.id === parseInt(req.params.id));
	if (!klas) res.status(404).send("Kelas tidak ditemukan"); // tampilkan status 404

	const index = kelas.indexOf(klas);
	kelas.splice(index, 1);
	res.send({ pesan: "Data berhasil dihapus.", data: klas });
});

app.get("/", (req, res) => {
	// code yang mungkin menyebabkan error
	const result = someFunctionThatMightHaveBug();
	console.log("Result:", result);
	res.send(result);
});

//Auth JWT
app.post("/api/login", (req, res) => {
	const user = {
		id: Date.now(),
		userEmail: "TrainerBE3@gmail.com",
		password: "trainerBE3",
	};
	//Untuk generate token user
	jwt.sign({ user }, "secretkey", (err, token) => {
		res.json({
			token
		});
	});
});

app.get("/api/profile", verifyToken, (req, res) => {
	jwt.verify(req.token, "secretkey", (err, authData) => {
		if (err) res.sendStatus(403);
		else {
			res.json({
				message: "Selamat Datang di Gamelab Indonesia",
				userData: authData,
			});
		}
	});
});

//Verifikasi Token
function verifyToken(req, res, next) {
	const bearerHeader = req.headers["authorization"];
	//cek jika bearer kosong/tidak ada
	if (typeof bearerHeader !== "undefined") {
		const bearer = bearerHeader.split(" ");
		//Get token
		const bearerToken = bearer[1];

		//set the token
		req.token = bearerToken;

		//next middleware
		next();
	} else {
		//Jika tidak bisa akses mengarahkan ke halaman forbidden
		res.sendStatus(403);
	}
}

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.listen(port, () => {
	console.log(`Server berjalan pada http://localhost:${port}`);
});

module.exports = app;
