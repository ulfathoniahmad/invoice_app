const API_URL = "https://script.google.com/macros/s/AKfycbxn59dew_a75v2199W2R3LpUWfWDd2g5EYl-iGYQOQtbuOrs8glHCKyXqRAF290ot7Z0g/exec"; // ganti dengan URL Web App Apps Script

// Tabs
function openTab(evt, tabName){
  document.querySelectorAll('.tablink').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tabcontent').forEach(tc => tc.classList.remove('active'));
  evt.currentTarget.classList.add('active');
  document.getElementById(tabName).classList.add('active');

  if(tabName==='lihat') loadAllData();
}

// Ambil pembeli dari sheet
async function loadPembeli(){
  const res = await fetch(API_URL+"?function=getPembeliList");
  const data = await res.json();
  const select1 = document.getElementById('pembeli');
  const select2 = document.getElementById('filterPembeli');
  select1.innerHTML=""; select2.innerHTML="";
  data.forEach(p=>{
    const opt1 = document.createElement('option'); opt1.value=p; opt1.text=p;
    const opt2 = document.createElement('option'); opt2.value=p; opt2.text=p;
    select1.appendChild(opt1); select2.appendChild(opt2);
  });
}
loadPembeli();

// Tambah Invoice
document.getElementById('formInvoice').addEventListener('submit', async function(e){
  e.preventDefault();
  const tanggal = document.getElementById('tanggal').value;
  const namaProduk = document.getElementById('namaProduk').value;
  const jumlah = parseInt(document.getElementById('jumlah').value);
  const harga = parseFloat(document.getElementById('harga').value);
  const pembeli = document.getElementById('pembeli').value;

  const response = await fetch(API_URL, {
    method:"POST",
    body: JSON.stringify({tanggal, namaProduk, jumlah, harga, total: jumlah*harga, pembeli})
  });

  const result = await response.json();
  alert("Invoice berhasil ditambahkan! No Invoice: "+result.noInvoice);
  document.getElementById('formInvoice').reset();
});

// Cetak Invoice
document.getElementById('btnFilter').addEventListener('click', async function(){
  const tanggal = document.getElementById('filterTanggal').value;
  const pembeli = document.getElementById('filterPembeli').value;

  const res = await fetch(`${API_URL}?function=getInvoiceJSON&tanggal=${tanggal}&pembeli=${encodeURIComponent(pembeli)}`);
  const data = await res.json();

  if(data.length==0){document.getElementById('invoiceResult').innerHTML="Tidak ada data."; return;}

  let html = "<h3>Invoice</h3><table><tr><th>Produk</th><th>Jumlah</th><th>Harga</th><th>Total</th><th>No. Invoice</th></tr>";
  data.forEach(d=>{
    html += `<tr><td>${d.namaProduk}</td><td>${d.jumlah}</td><td>${d.harga}</td><td>${d.total}</td><td>${d.noInvoice}</td></tr>`;
  });
  html += "</table>";
  document.getElementById('invoiceResult').innerHTML = html;
});

// Lihat semua data
async function loadAllData(){
  const res = await fetch(API_URL+"?function=getAllDataJSON");
  const data = await res.json();
  const tbody = document.querySelector('#tableData tbody');
  tbody.innerHTML="";
  data.forEach(d=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${d.tanggal}</td><td>${d.namaProduk}</td><td>${d.jumlah}</td><td>${d.harga}</td><td>${d.total}</td><td>${d.pembeli}</td><td>${d.noInvoice}</td>`;
    tbody.appendChild(tr);
  });
}
