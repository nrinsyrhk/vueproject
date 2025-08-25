BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[TblKumpulan] (
    [idtable] INT NOT NULL IDENTITY(1,1),
    [KumpulanID] INT NOT NULL,
    [MohonID] INT NOT NULL,
    [PenggunaID] INT NOT NULL,
    CONSTRAINT [PK_TblKumpulan] PRIMARY KEY CLUSTERED ([idtable])
);

-- CreateTable
CREATE TABLE [dbo].[TblLampiran] (
    [LampiranID] INT NOT NULL IDENTITY(1,1),
    [NamaFolder] VARCHAR(100) NOT NULL,
    [TkhUpload] DATETIME NOT NULL,
    CONSTRAINT [PK_TblLampiran_1] PRIMARY KEY CLUSTERED ([LampiranID])
);

-- CreateTable
CREATE TABLE [dbo].[TblLulus] (
    [LulusID] INT NOT NULL IDENTITY(1,1),
    [MohonID] INT NOT NULL,
    [TindakanID] INT NOT NULL,
    [Ulasan] TEXT,
    [PenggunaID] INT NOT NULL,
    CONSTRAINT [PK_TblLulus] PRIMARY KEY CLUSTERED ([LulusID])
);

-- CreateTable
CREATE TABLE [dbo].[TblMOF] (
    [MOFID] INT NOT NULL IDENTITY(1,1),
    [MohonID] INT NOT NULL,
    [TindakanID] INT NOT NULL,
    [SuratLulus] VARCHAR(100),
    [Emel] VARCHAR(100),
    CONSTRAINT [PK_TblMOF] PRIMARY KEY CLUSTERED ([MOFID])
);

-- CreateTable
CREATE TABLE [dbo].[TblPengguna] (
    [PenggunaID] INT NOT NULL IDENTITY(1,1),
    [Nama] VARCHAR(100) NOT NULL,
    [NoKP] VARCHAR(14) NOT NULL,
    [NoPassport] VARCHAR(15),
    [Emel] VARCHAR(100),
    [PerananID] INT,
    [PerkhidmatanID] INT,
    [BahagianID] INT,
    [CawanganID] INT,
    [Jawatan] VARCHAR(200),
    [StatusPenggunaID] INT,
    [NoTel] VARCHAR(15),
    [KategoriPenggunaID] INT NOT NULL,
    [PenggunaDaftarID] INT,
    [TkhDaftar] DATE,
    [PegawaiKemaskiniID] INT,
    [TkhKemaskini] DATETIME,
    [PengesahID] INT,
    [TkhSah] DATETIME,
    [Justifikasi] VARCHAR(200),
    [LogMasukAkhir] DATETIME,
    CONSTRAINT [PK_TblPengguna] PRIMARY KEY CLUSTERED ([PenggunaID])
);

-- CreateTable
CREATE TABLE [dbo].[TblPeraku] (
    [PerakuanID] INT NOT NULL IDENTITY(1,1),
    [MohonID] INT,
    [SokongID] INT,
    [TindakanID] INT,
    [Ulasan] VARCHAR(200),
    [TkhPeraku] DATETIME,
    [PenggunaID] INT,
    CONSTRAINT [PK_TblPeraku] PRIMARY KEY CLUSTERED ([PerakuanID])
);

-- CreateTable
CREATE TABLE [dbo].[TblPermohonan] (
    [MohonID] INT NOT NULL IDENTITY(1,1),
    [ProgramID] NCHAR(10) NOT NULL,
    [Nama] VARCHAR(200) NOT NULL,
    [Tujuan] VARCHAR(200) NOT NULL,
    [KategoriProgramID] INT NOT NULL,
    [Kekerapan] INT NOT NULL,
    [TkhMula] DATE NOT NULL,
    [TkhTamat] DATE NOT NULL,
    [Tempoh] VARCHAR(50) NOT NULL,
    [KatPesertaID] INT NOT NULL,
    [JenisKhidmatID] INT NOT NULL,
    [Tempat] VARCHAR(50) NOT NULL,
    [NegaraID] INT NOT NULL,
    [Kedutaan] VARCHAR(50) NOT NULL,
    [LulusKDN] VARCHAR(200),
    [Faedah] TEXT NOT NULL,
    [PenggunaID] INT NOT NULL,
    [TkhHantar] DATETIME NOT NULL,
    [KumpulanID] INT NOT NULL,
    [PeruntukanID] INT NOT NULL,
    [LampiranID] INT NOT NULL,
    [StatusMohonID] INT NOT NULL,
    CONSTRAINT [PK_TblPermohonan] PRIMARY KEY CLUSTERED ([MohonID]),
    CONSTRAINT [TblPermohonan_ProgramID_key] UNIQUE NONCLUSTERED ([ProgramID])
);

-- CreateTable
CREATE TABLE [dbo].[TblPeruntukan] (
    [PeruntukanID] INT NOT NULL IDENTITY(1,1),
    [kewmohon] NCHAR(10) NOT NULL,
    [bakiPKLN] NCHAR(10) NOT NULL,
    [kewdisah] NCHAR(10) NOT NULL,
    [bakiPTJ] NCHAR(10) NOT NULL,
    [tanggungan] NCHAR(10) NOT NULL,
    [ulasan] NCHAR(10) NOT NULL,
    [tajaanperinci] NCHAR(10),
    [tajaanoleh] NCHAR(10),
    [LampiranID] NCHAR(10),
    [MohonID] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_TblPeruntukan] PRIMARY KEY CLUSTERED ([PeruntukanID])
);

-- CreateTable
CREATE TABLE [dbo].[TblRefBahagian] (
    [BahagianID] INT NOT NULL IDENTITY(1,1),
    [Keterangan] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_TblRefBahagian] PRIMARY KEY CLUSTERED ([BahagianID])
);

-- CreateTable
CREATE TABLE [dbo].[TblRefCawangan] (
    [CawanganID] INT NOT NULL IDENTITY(1,1),
    [KodCawangan] NCHAR(10),
    [Keterangan] NCHAR(10),
    CONSTRAINT [PK_TblRefCawangan] PRIMARY KEY CLUSTERED ([CawanganID])
);

-- CreateTable
CREATE TABLE [dbo].[TblRefJenisKhidmat] (
    [JenisKhidmatID] INT NOT NULL IDENTITY(1,1),
    [Keterangan] VARCHAR(20) NOT NULL,
    CONSTRAINT [PK_TblRefJenisKhidmat] PRIMARY KEY CLUSTERED ([JenisKhidmatID])
);

-- CreateTable
CREATE TABLE [dbo].[TblRefKategoriPengguna] (
    [KategoriPenggunaID] INT NOT NULL IDENTITY(1,1),
    [Keterangan] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_TblRefKategoriPengguna] PRIMARY KEY CLUSTERED ([KategoriPenggunaID])
);

-- CreateTable
CREATE TABLE [dbo].[TblRefKategoriPeserta] (
    [KatPesertaID] INT NOT NULL IDENTITY(1,1),
    [Keterangan] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_TblRefKategoriPeserta] PRIMARY KEY CLUSTERED ([KatPesertaID])
);

-- CreateTable
CREATE TABLE [dbo].[TblRefKategoriProgram] (
    [KategoriProgramID] INT NOT NULL IDENTITY(1,1),
    [keterangan] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_TblRefKategoriProgram] PRIMARY KEY CLUSTERED ([KategoriProgramID])
);

-- CreateTable
CREATE TABLE [dbo].[TblRefLampiran] (
    [LampiranID] INT NOT NULL IDENTITY(1,1),
    [Keterangan] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_TblLampiran] PRIMARY KEY CLUSTERED ([LampiranID])
);

-- CreateTable
CREATE TABLE [dbo].[TblRefNegara] (
    [NegaraID] INT NOT NULL IDENTITY(1,1),
    [KodNegara] NCHAR(10) NOT NULL,
    [Keterangan] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_TblRefNegara] PRIMARY KEY CLUSTERED ([NegaraID])
);

-- CreateTable
CREATE TABLE [dbo].[TblRefPeranan] (
    [PerananID] INT NOT NULL IDENTITY(1,1),
    [Keterangan] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_TblRefPeranan] PRIMARY KEY CLUSTERED ([PerananID])
);

-- CreateTable
CREATE TABLE [dbo].[TblRefPerkhidmatan] (
    [PerkhidmatanID] INT NOT NULL IDENTITY(1,1),
    [Keterangan] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_TblRefPerkhidmatan] PRIMARY KEY CLUSTERED ([PerkhidmatanID])
);

-- CreateTable
CREATE TABLE [dbo].[TblRefStatusMohon] (
    [StatusMohonID] INT NOT NULL IDENTITY(1,1),
    [Keterangan] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_TblRefStatusMohon] PRIMARY KEY CLUSTERED ([StatusMohonID])
);

-- CreateTable
CREATE TABLE [dbo].[TblRefStatusPengguna] (
    [StatusPenggunaID] INT NOT NULL IDENTITY(1,1),
    [Keterangan] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_TblRefStatusPengguna] PRIMARY KEY CLUSTERED ([StatusPenggunaID])
);

-- CreateTable
CREATE TABLE [dbo].[TblRefTindakan] (
    [TindakanID] INT NOT NULL IDENTITY(1,1),
    [Keterangan] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_TblRefTindakan] PRIMARY KEY CLUSTERED ([TindakanID])
);

-- CreateTable
CREATE TABLE [dbo].[TblSemak] (
    [SemakID] INT NOT NULL IDENTITY(1,1),
    [MohonID] NCHAR(10) NOT NULL,
    [TindakanID] NCHAR(10),
    [Ulasan] NCHAR(10),
    [KewDiperaku] NCHAR(10),
    [KuasaLulus] NCHAR(10),
    [TkhSemak] NCHAR(10),
    [PenggunaID] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_TblSemak] PRIMARY KEY CLUSTERED ([SemakID])
);

-- CreateTable
CREATE TABLE [dbo].[TblSenaraiLampiran] (
    [SenaraiLampiranID] INT NOT NULL IDENTITY(1,1),
    [LampiranID] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_TblSenaraiLampiran] PRIMARY KEY CLUSTERED ([SenaraiLampiranID])
);

-- CreateTable
CREATE TABLE [dbo].[TblSokong] (
    [SokongID] INT NOT NULL IDENTITY(1,1),
    [MohonID] NCHAR(10) NOT NULL,
    [SemakID] NCHAR(10) NOT NULL,
    [TindakanID] NCHAR(10) NOT NULL,
    [Ulasan] NCHAR(10),
    [TkhSokong] NCHAR(10) NOT NULL,
    [PenggunaID] NCHAR(10) NOT NULL,
    CONSTRAINT [PK_TblSokong] PRIMARY KEY CLUSTERED ([SokongID])
);

-- CreateTable
CREATE TABLE [dbo].[sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(max),
    CONSTRAINT [PK__sysdiagr__C2B05B61B9818289] PRIMARY KEY CLUSTERED ([diagram_id]),
    CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED ([principal_id],[name])
);

-- AddForeignKey
ALTER TABLE [dbo].[TblKumpulan] ADD CONSTRAINT [FK_TblKumpulan_TblPengguna] FOREIGN KEY ([PenggunaID]) REFERENCES [dbo].[TblPengguna]([PenggunaID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPermohonan] ADD CONSTRAINT [FK_TblPermohonan_TblPengguna] FOREIGN KEY ([PenggunaID]) REFERENCES [dbo].[TblPengguna]([PenggunaID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
