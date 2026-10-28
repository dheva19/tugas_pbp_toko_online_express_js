const express = require('express');
const cors = require('cors');
const db = require('./database');

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.get('/api/produk', async(req, res)=> {
    try{
        const [ rows ] = await db.query("SELECT * FROM produk");

        return res.json({
            error: false,
            message: 'Berhasil mendapat data',
            data: rows
        }, 200);
    }catch(err){
        return res.json({
            error: true,
            message: `Terjadi Error: ${err.message}`
        }, 500)
    }
});

app.get('/api/produk/:id', async(req,res) => {
    try{
        const id_produk = req.params.id;
        const [ produk ] = await db.query("SELECT * FROM produk WHERE id=?",[
            id_produk
        ]);

        return res.json({
            error: false,
            message: "Berhasil mendapat data",
            data: produk
        }, 200);
    }catch(err){
        return res.json({
            error: true,
            message: `Terjadi Error: ${err.message}`
        }, 500);
    }
});

app.post("/api/produk", async(req, res) => {
    try{
        const { kode_produk, nama_produk, harga, stok } = req.body;

        const create = await db.query("INSERT INTO produk (kode_produk, nama_produk, harga, stok) VALUES (?,?,?,?)",
            [kode_produk, nama_produk, harga, stok]
        );

        if(create){
            return res.json({
                error: false,
                message: "Produk berhasil ditambahkan",
                data: {
                    kode_produk, nama_produk, harga, stok
                }
            }, 202);
        }
    }catch(err){
        return res.json({
            error: true,
            message: `Terjadi Error: ${err.message}`
        }, 500);
    }
});

app.put('/api/produk/:id', async(req, res) => {
    try{
        const id_produk = req.params.id;
        const  { kode_produk, nama_produk, harga, stok } = req.body;

        const [ rows ] = await db.query("SELECT nama_produk FROM produk WHERE id=?", [id_produk]);

        if(rows.length < 1){
            return res.json({
                error: true,
                message: `Produk dengan id ${id_produk} tidak ditemukan`
            })
        }

        const update = await db.query("UPDATE produk SET kode_produk=?, nama_produk=?, harga=?, stok=? WHERE id=?",[
            kode_produk, nama_produk, harga, stok, id_produk
        ]);

        if(update){
            return res.json({
                error: false,
                message: "Data produk berhasil diupdate",
                data: {
                    kode_produk, nama_produk, harga, stok
                }
            }, 200);
        }
    }catch(err){
        return res.json({
            error: true,
            message: `Terjadi Error: ${err.message}`
        }, 500);
    }
});

app.delete('/api/produk/:id', async(req, res) => {
    try{
        const id_produk = req.params.id;

        const [ rows ] = await db.query("SELECT nama_produk FROM produk WHERE id=?", [id_produk]);

        if(rows.length < 1){
            return res.json({
                error: true,
                message: `Produk dengan id ${id_produk} tidak ditemukan`
            })
        }

        const hapus = await db.query("DELETE FROM produk WHERE id=?", [id_produk]);
        if(hapus){
            return res.json({
                error: false,
                message: `Produk dengan id ${id_produk} berhasil dihapus`
            }, 200);
        }

    }catch(err){
        return res.json({
            error: true,
            message: `Terjadi Error: ${err.message}`
        }, 500);
    }
});

app.post('/api/checkout', async(req, res) => {
    try{
        const  { id_produk, jumlah } = req.body;

        const [ produk ] = await db.query("SELECT * FROM produk WHERE id=?", [id_produk]);

        if(produk.length < 1){
            return res.json({
                error: true,
                message: `Tidak ditemukan produk dengan id ${id_produk}` 
            }, 404);
        }

        if(produk[0]['stok'] < jumlah){
            return res.json({
                error: true,
                message: "Transaksi Gagal: Stok produk tidak mencukupi"
            }, 500);
        }

        const stok_baru = produk[0]['stok'] - jumlah;
        const update = await db.query("UPDATE produk SET stok=? WHERE id=?", [stok_baru, id_produk]);
        if(update){
            return res.json({
                error: false,
                message: "Berhasil melakukan transaksi",
                data: {
                    nama_produk : produk[0].nama_produk,
                    harga_produk : produk[0].harga,
                    jumlah_beli : jumlah
                }
            }, 200);    
        }
    }catch(err){
        return res.json({
            error: true,
            message: `Terjadi Error: ${err.message}`
        }, 500);
    }
});

app.listen(PORT, () => {
    console.log(`[Server]: Berjalan di localhost:${PORT}`);
});