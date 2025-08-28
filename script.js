const API_URL = "YOUR_APPS_SCRIPT_URL"; // ganti dengan URL Apps Script mu

// List pembeli (bisa ambil dari Sheet)
const pembeliList = ["SPPG Po 001","SPPG Slah 002"];

function fillPembeli(){
  const select1 = document.getElementById('pembeli');
  const select2 = document.getElementById('filterPembeli');
  pembeliList.forEach(p=>{
    const opt1 = document.createElement('option'); opt1.value=p; opt1.text=p;
    const opt2 = document.createElement('option'); opt2.value=p; opt2.text=p;
    select1.appendChild(opt1);
    select2.appendChild(opt2);
  });
}

fillPembeli();

// Tambah Invoice
document.getElementById('formInvoice').addEventListener('submit', async function(e){
  e.preventDefault();
  const tanggal = document.getElementById('tanggal').value;
  const namaProduk = document.getElementById('namaProduk').value;
  const jumlah = parseInt(document.getElementById('jumlah').value);
  const harga = parseFloat(document.getElementById('harga').value);
  const pembeli = document.getElementById('pembeli').value;

  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({tanggal, namaProduk, jumlah, harga, total: jumlah*harga, pembeli})
  });

  const result = await response.json();
  alert("Invoice berhasil ditambahkan! No Invoice: "+result.noInvoice);

  // reset form
  document.getElementById('formInvoice').reset();
});

// Cetak Invoice
document.getElementById('btnFilter').addEventListener('click', async function(){
  const tanggal = document.getElementById('filterTanggal').value;
  const pembeli = document.getElementById('filterPembeli').value;

  const response = await fetch(`${API_URL}?function=getInvoiceJSON&tanggal=${tanggal}&pembeli=${encodeURIComponent(pembeli)}`);
  const data = await response.json();

  if(data.length==0){document.getElementById('invoiceResult').innerHTML="Tidak ada data."; return;}

  let html = "<h3>Invoice</h3><table><tr><th>Produk</th><th>Jumlah</th><th>Harga</th><th>Total</th><th>No. Invoice</th></tr>";
  data.forEach(d=>{
    html += `<tr><td>${d.namaProduk}</td><td>${d.jumlah}</td><td>${d.harga}</td><td>${d.total}</td><td>${d.noInvoice}</td></tr>`;
  });
  html += "</table>";
  document.getElementById('invoiceResult').innerHTML = html;
});
