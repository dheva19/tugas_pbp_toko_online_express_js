const API = "/api/produk"

const getAllProduk =  async() => {
    const res = await fetch(API);
    const result = await res.json();
    const data = result.data;

    return data;
}

const assignProdukTable = (data) => {
    const table = document.querySelector('#produk-table-body');
    table.innerHTML = "";

    data.forEach((item, index) => {
        table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item['kode_produk']}</td>
                <td>${item['nama_produk']}</td>
                <td>Rp${item['harga']}</td>
                <td>${item['stok']}</td>
                <td>
                    <button class='btn btn-primary' onclick="handleEditProduk('${item['id']}')">Edit</button>
                    <button class='btn btn-danger' onclick="handleDelete('${item['id']}')">Hapus</button>
                </td>
            </tr>
        `;
    });
}

const updateDisplayDataProduk = async() => {
    const data = await getAllProduk();
    assignProdukTable(data);
}

const produkForm = document.querySelector('#create-produk-form');

produkForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const formData = new FormData(produkForm);

    const res = await fetch(API, {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            kode_produk: formData.get('kode_produk'),
            nama_produk: formData.get('nama_produk'),
            harga: formData.get('harga'),
            stok: formData.get('stok')
        })
    });

    const result = await res.json();
    if(!result.error){
        updateDisplayDataProduk();
    }else{
        alert(result.message);
    }
});

const handleDelete = async(id) =>     {
    if(confirm(`Apakah yakin menghapus produk dengan id ${id}`)){
        const res = await fetch(`${API}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type" : "application/json"
            }
        });

        const result = res.json();
        if(!result.error){
            updateDisplayDataProduk();
        }else{
            alert(result.message);
        }
    }
}

const handleEditProduk = async(id) => {
    const kodeProduk = document.querySelector('#edit_kode_produk');
    const namaProduk = document.querySelector('#edit_nama_produk');
    const harga = document.querySelector('#edit_harga');
    const stok = document.querySelector('#edit_stok');
    const button = document.querySelector('#button-open-edit-modal');
    const id_produk = document.querySelector('#id_edit_produk');

    const res = await fetch(`${API}/${id}`);
    const result = await res.json();
    const produk = result.data[0];

    kodeProduk.value = produk['kode_produk'];
    namaProduk.value = produk['nama_produk'];
    harga.value = produk['harga'];
    stok.value = produk['stok'];
    id_produk.value = id;
    button.click();
}

const editProdukForm = document.querySelector('#edit_produk_form');

editProdukForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const formData = new FormData(editProdukForm);

    const id_produk = formData.get('id_edit_produk');
    const body = {
        kode_produk: formData.get('kode_produk'),
        nama_produk: formData.get('nama_produk'),
        harga: formData.get('harga'),
        stok: formData.get('stok')
    }

    const res = await fetch(`${API}/${id_produk}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const result = res.json();
    if(!result.error){
        updateDisplayDataProduk();
        document.querySelector('#button-close-modal').click();
        alert('Berhasil update produk');
    }else{
        alert(result.message);
    }
});

window.addEventListener("DOMContentLoaded", () => {
    updateDisplayDataProduk();
})