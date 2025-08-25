const data = [
    {
      MohonID: 1,
      ProgramID: 101,
      Nama: 'Program A',
      Tujuan: 'Objective A',
      KategoriProgramID: 1,
      Kekerapan: 'Monthly',
      TkhMula: '2024-01-01',
      TkhTamat: '2024-12-31',
      Tempoh: 12,
      KatPesertaID: 1,
      JenisKhidmatID: 1,
      Tempat: 'Location A',
      NegaraID: 1,
      Kedutaan: 'Embassy A',
      LulusKDN: true,
      Faedah: 'Benefit A',
      PenggunaID: 1,
      TkhHantar: '2024-01-01',
      KumpulanID: 1,
      PeruntukanID: 1,
      LampiranID: 1,
      StatusMohonID: 1
    },
    // Add more data as needed
  ];
  
  exports.createPermohonan = (req, res) => {
    const newPermohonan = req.body;
    data.push(newPermohonan);
    res.status(201).send(newPermohonan);
  };
  
  exports.getAllPermohonan = (req, res) => {
    res.send(data);
  };
  
  exports.getPermohonanById = (req, res) => {
    const permohonan = data.find(d => d.MohonID == req.params.id);
    if (permohonan) {
      res.send(permohonan);
    } else {
      res.status(404).send({ message: 'Permohonan not found' });
    }
  };
  
  exports.updatePermohonan = (req, res) => {
    const index = data.findIndex(d => d.MohonID == req.params.id);
    if (index !== -1) {
      data[index] = { ...data[index], ...req.body };
      res.send(data[index]);
    } else {
      res.status(404).send({ message: 'Permohonan not found' });
    }
  };
  
  exports.deletePermohonan = (req, res) => {
    const index = data.findIndex(d => d.MohonID == req.params.id);
    if (index !== -1) {
      const deletedPermohonan = data.splice(index, 1);
      res.send(deletedPermohonan);
    } else {
      res.status(404).send({ message: 'Permohonan not found' });
    }
  };