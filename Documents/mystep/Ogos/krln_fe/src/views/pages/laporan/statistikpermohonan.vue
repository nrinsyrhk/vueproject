<script setup>
import { ref } from 'vue';

const statistikList = ref([
  { bulan: 'JANUARI', bilMohon: 0, jumlahMohon: 0, bilLulus: 0, jumlahLulus: 0, penjimatan: 0, bilTidakLulus: 0, bilAmbilMaklum: 0 },
  { bulan: 'FEBRUARI', bilMohon: 0, jumlahMohon: 0, bilLulus: 0, jumlahLulus: 0, penjimatan: 0, bilTidakLulus: 0, bilAmbilMaklum: 0 },
  { bulan: 'MAC', bilMohon: 0, jumlahMohon: 0, bilLulus: 0, jumlahLulus: 0, penjimatan: 0, bilTidakLulus: 0, bilAmbilMaklum: 0 },
  { bulan: 'APRIL', bilMohon: 0, jumlahMohon: 0, bilLulus: 0, jumlahLulus: 0, penjimatan: 0, bilTidakLulus: 0, bilAmbilMaklum: 0 },
  { bulan: 'MEI', bilMohon: 0, jumlahMohon: 0, bilLulus: 0, jumlahLulus: 0, penjimatan: 0, bilTidakLulus: 0, bilAmbilMaklum: 0 },
  { bulan: 'JUN', bilMohon: 0, jumlahMohon: 0, bilLulus: 0, jumlahLulus: 0, penjimatan: 0, bilTidakLulus: 0, bilAmbilMaklum: 0 },
  { bulan: 'JULAI', bilMohon: 0, jumlahMohon: 0, bilLulus: 0, jumlahLulus: 0, penjimatan: 0, bilTidakLulus: 0, bilAmbilMaklum: 0 },
  { bulan: 'OGOS', bilMohon: 0, jumlahMohon: 0, bilLulus: 0, jumlahLulus: 0, penjimatan: 0, bilTidakLulus: 0, bilAmbilMaklum: 0 },
  { bulan: 'SEPTEMBER', bilMohon: 0, jumlahMohon: 0, bilLulus: 0, jumlahLulus: 0, penjimatan: 0, bilTidakLulus: 0, bilAmbilMaklum: 0 },
  { bulan: 'OKTOBER', bilMohon: 0, jumlahMohon: 0, bilLulus: 0, jumlahLulus: 0, penjimatan: 0, bilTidakLulus: 0, bilAmbilMaklum: 0 },
  { bulan: 'NOVEMBER', bilMohon: 0, jumlahMohon: 0, bilLulus: 0, jumlahLulus: 0, penjimatan: 0, bilTidakLulus: 0, bilAmbilMaklum: 0 },
  { bulan: 'DISEMBER', bilMohon: 0, jumlahMohon: 0, bilLulus: 0, jumlahLulus: 0, penjimatan: 0, bilTidakLulus: 0, bilAmbilMaklum: 0 },
  { bulan: 'JUMLAH', bilMohon: 0, jumlahMohon: 0, bilLulus: 0, jumlahLulus: 0, penjimatan: 0, bilTidakLulus: 0, bilAmbilMaklum: 0 },
]);

const isJumlahRow = (row) => row.bulan === 'JUMLAH';
</script>

<template>
  <div class="layout-empty">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <div class="flex justify-content-between items-center mb-3">
            <h5>Statistik Permohonan</h5>
          </div>

          <div class="table-responsive">
            <DataTable
              :paginator="false" 
              :rows="statistikList.length" 
              class="p-datatable-gridlines"
              :row-hover="true"
              responsive-layout="scroll"
              :value="statistikList"
              :rowClass="(rowData) => (isJumlahRow(rowData) ? 'jumlah-row' : '')"
            >
              <template #header>
                <div class="flex justify-content-between flex-column sm:flex-row"></div>
              </template>

              <Column field="bulan" header="BULAN" style="width:6rem;"></Column>
              <Column field="bilMohon" header="BIL. MOHON" style="width:6rem;"></Column>
              <Column field="jumlahMohon" header="JUMLAH (RM)" style="width:6rem;"></Column>
              <Column field="bilLulus" header="BIL. LULUS" style="width:6rem;"></Column>
              <Column field="jumlahLulus" header="JUMLAH (RM)" style="width:6rem;"></Column>
              <Column field="penjimatan" header="PENJIMATAN (RM)" style="width:6rem;"></Column>
              <Column field="bilTidakLulus" header="BIL. TIDAK LULUS" style="width:6rem;"></Column>
              <Column field="bilAmbilMaklum" header="BIL. AMBIL MAKLUM" style="width:6rem;"></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-empty {
  margin-bottom: 20px;
}

.table-responsive {
  overflow-x: auto; 
  padding: 0.2rem; /* Reduce padding around table */
  background-color: #f9f9f9;
  border-radius: 8px;
}

.p-datatable-gridlines {
  width: 100%;
  table-layout: fixed; /* Fixed table layout */
  border-spacing: 0; /* Remove extra space between cells */
}

.p-datatable-gridlines th,
.p-datatable-gridlines td {
  padding: 0.1rem; /* Tight padding */
  font-size: 12px; 
  text-align: center; 
  width: 6rem; /* Ensure fixed width for each column */
}

.jumlah-row {
  background-color: #b0c4de; /* Highlight the total row */
  color: #000;
  font-weight: bold;
}

@media (max-width: 768px) {
  .table-responsive {
    width: 100%;
    display: block;
    overflow-x: scroll;
  }
}
</style>
