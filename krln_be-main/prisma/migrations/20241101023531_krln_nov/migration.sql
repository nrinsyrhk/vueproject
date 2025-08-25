/*
  Warnings:

  - The primary key for the `TblKumpulan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idtable` on the `TblKumpulan` table. All the data in the column will be lost.
  - You are about to drop the column `PenggunaID` on the `TblLulus` table. All the data in the column will be lost.
  - You are about to alter the column `Ulasan` on the `TblLulus` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(400)`.
  - You are about to drop the column `Emel` on the `TblMOF` table. All the data in the column will be lost.
  - You are about to drop the column `Justifikasi` on the `TblPengguna` table. All the data in the column will be lost.
  - You are about to drop the column `PenggunaID` on the `TblPeraku` table. All the data in the column will be lost.
  - You are about to alter the column `TkhPeraku` on the `TblPeraku` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Date`.
  - You are about to drop the column `ProgramID` on the `TblPermohonan` table. All the data in the column will be lost.
  - You are about to alter the column `kewmohon` on the `TblPeruntukan` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `Decimal(18,2)`.
  - You are about to alter the column `bakiPKLN` on the `TblPeruntukan` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `Decimal(18,2)`.
  - You are about to alter the column `kewdisah` on the `TblPeruntukan` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `Decimal(18,2)`.
  - You are about to alter the column `bakiPTJ` on the `TblPeruntukan` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `Decimal(18,2)`.
  - You are about to alter the column `tanggungan` on the `TblPeruntukan` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `VarChar(200)`.
  - You are about to alter the column `ulasan` on the `TblPeruntukan` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `VarChar(400)`.
  - You are about to alter the column `tajaanperinci` on the `TblPeruntukan` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `VarChar(200)`.
  - You are about to alter the column `tajaanoleh` on the `TblPeruntukan` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `VarChar(200)`.
  - You are about to alter the column `LampiranID` on the `TblPeruntukan` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `Int`.
  - You are about to alter the column `MohonID` on the `TblPeruntukan` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `Int`.
  - You are about to drop the column `KodCawangan` on the `TblRefCawangan` table. All the data in the column will be lost.
  - You are about to drop the column `KodNegara` on the `TblRefNegara` table. All the data in the column will be lost.
  - You are about to alter the column `Keterangan` on the `TblRefTindakan` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `VarChar(50)`.
  - You are about to drop the column `KuasaLulus` on the `TblSemak` table. All the data in the column will be lost.
  - You are about to drop the column `PenggunaID` on the `TblSemak` table. All the data in the column will be lost.
  - You are about to alter the column `MohonID` on the `TblSemak` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `Int`.
  - You are about to alter the column `TindakanID` on the `TblSemak` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `Int`.
  - You are about to alter the column `Ulasan` on the `TblSemak` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `VarChar(1200)`.
  - You are about to alter the column `KewDiperaku` on the `TblSemak` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `VarChar(50)`.
  - You are about to alter the column `TkhSemak` on the `TblSemak` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `Date`.
  - You are about to drop the column `PenggunaID` on the `TblSokong` table. All the data in the column will be lost.
  - You are about to alter the column `MohonID` on the `TblSokong` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `Int`.
  - You are about to alter the column `SemakID` on the `TblSokong` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `Int`.
  - You are about to alter the column `TindakanID` on the `TblSokong` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `Int`.
  - You are about to alter the column `Ulasan` on the `TblSokong` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `VarChar(1200)`.
  - You are about to alter the column `TkhSokong` on the `TblSokong` table. The data in that column could be lost. The data in that column will be cast from `NChar(10)` to `DateTime`.
  - The primary key for the `TblLampiran` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Keterangan` on the `TblRefBahagian` table. All the data in the column will be lost.
  - The primary key for the `TblSenaraiLampiran` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `SenaraiLampiranID` on the `TblSenaraiLampiran` table. All the data in the column will be lost.
  - You are about to alter the column `LampiranID` on the `TblSenaraiLampiran` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `ID` to the `TblKumpulan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PelulusID` to the `TblLulus` table without a default value. This is not possible if the table is not empty.
  - Made the column `PerkhidmatanID` on table `TblPengguna` required. This step will fail if there are existing NULL values in that column.
  - Made the column `BahagianID` on table `TblPengguna` required. This step will fail if there are existing NULL values in that column.
  - Made the column `CawanganID` on table `TblPengguna` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `BahagianID` to the `TblRefCawangan` table without a default value. This is not possible if the table is not empty.
  - Made the column `Keterangan` on table `TblRefCawangan` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `PenyemakID` to the `TblSemak` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PenyokongID` to the `TblSokong` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ID` to the `TblLampiran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Keterangan` to the `TblSenaraiLampiran` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[TblPermohonan] DROP CONSTRAINT [TblPermohonan_ProgramID_key];

-- AlterTable
ALTER TABLE [dbo].[TblKumpulan] DROP CONSTRAINT [PK_TblKumpulan];
EXEC SP_RENAME N'dbo.PK_TblKumpulan', N'PK__TblKumpu__3214EC27EEA4F050';
ALTER TABLE [dbo].[TblKumpulan] ALTER COLUMN [KumpulanID] INT NULL;
ALTER TABLE [dbo].[TblKumpulan] ALTER COLUMN [PenggunaID] INT NULL;
ALTER TABLE [dbo].[TblKumpulan] DROP COLUMN [idtable];
ALTER TABLE [dbo].[TblKumpulan] ADD CONSTRAINT PK__TblKumpu__3214EC27EEA4F050 PRIMARY KEY CLUSTERED ([ID]);
ALTER TABLE [dbo].[TblKumpulan] ADD [ID] INT NOT NULL IDENTITY(1,1),
[Kapal] VARCHAR(100),
[KehadiranID] INT,
[PindaanID] INT;

-- AlterTable
ALTER TABLE [dbo].[TblLulus] ALTER COLUMN [Ulasan] VARCHAR(400) NULL;
ALTER TABLE [dbo].[TblLulus] DROP COLUMN [PenggunaID];
ALTER TABLE [dbo].[TblLulus] ADD [PelulusID] INT NOT NULL,
[PindaanID] INT,
[TkhLulus] DATE;

-- AlterTable
ALTER TABLE [dbo].[TblMOF] ALTER COLUMN [MohonID] INT NULL;
ALTER TABLE [dbo].[TblMOF] ALTER COLUMN [TindakanID] INT NULL;
ALTER TABLE [dbo].[TblMOF] DROP COLUMN [Emel];
ALTER TABLE [dbo].[TblMOF] ADD [DateLulus] DATE;

-- AlterTable
ALTER TABLE [dbo].[TblPengguna] ALTER COLUMN [PerkhidmatanID] INT NOT NULL;
ALTER TABLE [dbo].[TblPengguna] ALTER COLUMN [BahagianID] INT NOT NULL;
ALTER TABLE [dbo].[TblPengguna] ALTER COLUMN [CawanganID] INT NOT NULL;
ALTER TABLE [dbo].[TblPengguna] DROP COLUMN [Justifikasi];
ALTER TABLE [dbo].[TblPengguna] ADD [Keycloak_ID] VARCHAR(255);

-- AlterTable
ALTER TABLE [dbo].[TblPeraku] ALTER COLUMN [Ulasan] VARCHAR(400) NULL;
ALTER TABLE [dbo].[TblPeraku] ALTER COLUMN [TkhPeraku] DATE NULL;
ALTER TABLE [dbo].[TblPeraku] DROP COLUMN [PenggunaID];
ALTER TABLE [dbo].[TblPeraku] ADD [PerakuID] INT,
[PindaanID] INT;

-- AlterTable
ALTER TABLE [dbo].[TblPermohonan] ALTER COLUMN [Nama] VARCHAR(300) NOT NULL;
ALTER TABLE [dbo].[TblPermohonan] ALTER COLUMN [Tujuan] VARCHAR(300) NOT NULL;
ALTER TABLE [dbo].[TblPermohonan] ALTER COLUMN [Kedutaan] VARCHAR(50) NULL;
ALTER TABLE [dbo].[TblPermohonan] ALTER COLUMN [KumpulanID] INT NULL;
ALTER TABLE [dbo].[TblPermohonan] ALTER COLUMN [PeruntukanID] INT NULL;
ALTER TABLE [dbo].[TblPermohonan] ALTER COLUMN [LampiranID] INT NULL;
ALTER TABLE [dbo].[TblPermohonan] DROP COLUMN [ProgramID];
ALTER TABLE [dbo].[TblPermohonan] ADD [No Fail] NVARCHAR(50),
[PerkhidmatanID] INT,
[PindaanID] INT,
[RayuanID] INT;

-- AlterTable
ALTER TABLE [dbo].[TblPeruntukan] ALTER COLUMN [kewmohon] DECIMAL(18,2) NOT NULL;
ALTER TABLE [dbo].[TblPeruntukan] ALTER COLUMN [bakiPKLN] DECIMAL(18,2) NOT NULL;
ALTER TABLE [dbo].[TblPeruntukan] ALTER COLUMN [kewdisah] DECIMAL(18,2) NOT NULL;
ALTER TABLE [dbo].[TblPeruntukan] ALTER COLUMN [bakiPTJ] DECIMAL(18,2) NOT NULL;
ALTER TABLE [dbo].[TblPeruntukan] ALTER COLUMN [tanggungan] VARCHAR(200) NOT NULL;
ALTER TABLE [dbo].[TblPeruntukan] ALTER COLUMN [ulasan] VARCHAR(400) NOT NULL;
ALTER TABLE [dbo].[TblPeruntukan] ALTER COLUMN [tajaanperinci] VARCHAR(200) NULL;
ALTER TABLE [dbo].[TblPeruntukan] ALTER COLUMN [tajaanoleh] VARCHAR(200) NULL;
ALTER TABLE [dbo].[TblPeruntukan] ALTER COLUMN [LampiranID] INT NULL;
ALTER TABLE [dbo].[TblPeruntukan] ALTER COLUMN [MohonID] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[TblRefCawangan] ALTER COLUMN [Keterangan] NCHAR(200) NOT NULL;
ALTER TABLE [dbo].[TblRefCawangan] DROP COLUMN [KodCawangan];
ALTER TABLE [dbo].[TblRefCawangan] ADD [BahagianID] INT NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[TblRefKategoriPeserta] ALTER COLUMN [Keterangan] NCHAR(35) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[TblRefKategoriProgram] ALTER COLUMN [keterangan] NCHAR(12) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[TblRefNegara] DROP COLUMN [KodNegara];

-- AlterTable
ALTER TABLE [dbo].[TblRefStatusMohon] ALTER COLUMN [Keterangan] NCHAR(25) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[TblRefStatusPengguna] ALTER COLUMN [Keterangan] NCHAR(15) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[TblRefTindakan] ALTER COLUMN [Keterangan] VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[TblSemak] ALTER COLUMN [MohonID] INT NOT NULL;
ALTER TABLE [dbo].[TblSemak] ALTER COLUMN [TindakanID] INT NULL;
ALTER TABLE [dbo].[TblSemak] ALTER COLUMN [Ulasan] VARCHAR(1200) NULL;
ALTER TABLE [dbo].[TblSemak] ALTER COLUMN [KewDiperaku] VARCHAR(50) NULL;
ALTER TABLE [dbo].[TblSemak] ALTER COLUMN [TkhSemak] DATE NULL;
ALTER TABLE [dbo].[TblSemak] DROP COLUMN [KuasaLulus],
[PenggunaID];
ALTER TABLE [dbo].[TblSemak] ADD [KuasaLulusID] INT,
[PenyemakID] INT NOT NULL,
[PindaanID] INT;

-- AlterTable
ALTER TABLE [dbo].[TblSokong] ALTER COLUMN [MohonID] INT NOT NULL;
ALTER TABLE [dbo].[TblSokong] ALTER COLUMN [SemakID] INT NOT NULL;
ALTER TABLE [dbo].[TblSokong] ALTER COLUMN [TindakanID] INT NOT NULL;
ALTER TABLE [dbo].[TblSokong] ALTER COLUMN [Ulasan] VARCHAR(1200) NULL;
ALTER TABLE [dbo].[TblSokong] ALTER COLUMN [TkhSokong] DATETIME NOT NULL;
ALTER TABLE [dbo].[TblSokong] DROP COLUMN [PenggunaID];
ALTER TABLE [dbo].[TblSokong] ADD [PenyokongID] INT NOT NULL,
[PindaanID] INT;

-- CreateTable
CREATE TABLE [dbo].[TblAuditTrail] (
    [id_audittrail] INT NOT NULL IDENTITY(1,1),
    [MohonID] INT NOT NULL,
    [action] VARCHAR(400) NOT NULL,
    [actiontime] DATETIME NOT NULL,
    [PenggunaID] INT NOT NULL
);

-- CreateTable
CREATE TABLE [dbo].[TblPenggunaJenisKhidmat] (
    [id] BIGINT,
    [PenggunaID] INT,
    [JenisKhidmatID] INT
);

-- CreateTable
CREATE TABLE [dbo].[TblPindaan] (
    [PindaanID] INT NOT NULL IDENTITY(1,1),
    [JenisPindaID] INT NOT NULL,
    [Justifikasi] VARCHAR(500),
    [Kewdisah] DECIMAL(18,2),
    [BakiPTJ] DECIMAL(18,2),
    [Ulasan] VARCHAR(500),
    [LampiranID] INT,
    [TkhHantar] DATE,
    CONSTRAINT [PK_TblPindaan] PRIMARY KEY CLUSTERED ([PindaanID])
);

-- CreateTable
CREATE TABLE [dbo].[TblRayuan] (
    [RayuanID] INT NOT NULL IDENTITY(1,1),
    [Justifikasi] VARCHAR(200),
    [Kepentingan] VARCHAR(200),
    [Impak] VARCHAR(200),
    [KewMohon] DECIMAL(18,2),
    [KewDisah] DECIMAL(18,2),
    [BakiPTJ] DECIMAL(18,2),
    [ulasan] VARCHAR(200),
    [LampiranID] INT,
    [TkhRayuan] DATE,
    CONSTRAINT [PK_TblRayuan] PRIMARY KEY CLUSTERED ([RayuanID])
);

-- CreateTable
CREATE TABLE [dbo].[TblRefDokumen] (
    [ID] BIGINT,
    [Tajuk Dokumen] VARCHAR(1),
    [URL Dokumen] VARCHAR(1),
    [Tarikh] DATETIME
);

-- CreateTable
CREATE TABLE [dbo].[TblRefJenisPinda] (
    [JenisPindaID] INT NOT NULL IDENTITY(1,1),
    [Keterangan] VARCHAR(20) NOT NULL,
    CONSTRAINT [PK_TblRefJenisPinda] PRIMARY KEY CLUSTERED ([JenisPindaID])
);

-- CreateTable
CREATE TABLE [dbo].[TblRefKehadiran] (
    [KehadiranID] INT NOT NULL IDENTITY(1,1),
    [Keterangan] VARCHAR(50) NOT NULL,
    CONSTRAINT [PK_TblRefKehadiran] PRIMARY KEY CLUSTERED ([KehadiranID])
);

-- CreateTable
CREATE TABLE [dbo].[TblRefKuasaLulus] (
    [KuasaLulusID] INT NOT NULL IDENTITY(1,1),
    [Keterangan] NCHAR(10),
    CONSTRAINT [PK_TblRefKuasaLulus] PRIMARY KEY CLUSTERED ([KuasaLulusID])
);

-- RedefineTables
BEGIN TRANSACTION;
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'TblLampiran'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_TblLampiran] (
    [ID] INT NOT NULL IDENTITY(1,1),
    [NamaFolder] VARCHAR(200) NOT NULL,
    [TkhUpload] DATETIME,
    [LampiranID] INT NOT NULL,
    CONSTRAINT [PK__TblLampi__3214EC275A22B9D2] PRIMARY KEY CLUSTERED ([ID])
);
IF EXISTS(SELECT * FROM [dbo].[TblLampiran])
    EXEC('INSERT INTO [dbo].[_prisma_new_TblLampiran] ([LampiranID],[NamaFolder],[TkhUpload]) SELECT [LampiranID],[NamaFolder],[TkhUpload] FROM [dbo].[TblLampiran] WITH (holdlock tablockx)');
DROP TABLE [dbo].[TblLampiran];
EXEC SP_RENAME N'dbo._prisma_new_TblLampiran', N'TblLampiran';
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'TblRefBahagian'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_TblRefBahagian] (
    [BahagianID] INT NOT NULL,
    [PerkhidmatanID] INT,
    [BUOrgChart1] VARCHAR(15),
    [BUTitle1] VARCHAR(100),
    [BUOrgChart2] VARCHAR(20),
    [BUTitle2] VARCHAR(100),
    CONSTRAINT [PK__TblRefBa__5577C6F70F083643] PRIMARY KEY CLUSTERED ([BahagianID])
);
IF EXISTS(SELECT * FROM [dbo].[TblRefBahagian])
    EXEC('INSERT INTO [dbo].[_prisma_new_TblRefBahagian] ([BahagianID]) SELECT [BahagianID] FROM [dbo].[TblRefBahagian] WITH (holdlock tablockx)');
DROP TABLE [dbo].[TblRefBahagian];
EXEC SP_RENAME N'dbo._prisma_new_TblRefBahagian', N'TblRefBahagian';
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'TblSenaraiLampiran'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_TblSenaraiLampiran] (
    [LampiranID] INT NOT NULL IDENTITY(1,1),
    [Keterangan] VARCHAR(250) NOT NULL,
    [MohonID] INT,
    [FilePath] VARCHAR(250),
    [FileType] VARCHAR(250),
    [FileSize] VARCHAR(50),
    [TkhUpload] DATETIME,
    CONSTRAINT [PK_TblSenaraiLampiran] PRIMARY KEY CLUSTERED ([LampiranID])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_TblSenaraiLampiran] ON;
IF EXISTS(SELECT * FROM [dbo].[TblSenaraiLampiran])
    EXEC('INSERT INTO [dbo].[_prisma_new_TblSenaraiLampiran] ([LampiranID]) SELECT [LampiranID] FROM [dbo].[TblSenaraiLampiran] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_TblSenaraiLampiran] OFF;
DROP TABLE [dbo].[TblSenaraiLampiran];
EXEC SP_RENAME N'dbo._prisma_new_TblSenaraiLampiran', N'TblSenaraiLampiran';
COMMIT;

-- RenameForeignKey
EXEC sp_rename 'dbo.FK_TblKumpulan_TblPengguna', 'FK__TblKumpul__Pengg__63A3C44B', 'OBJECT';

-- RenameForeignKey
EXEC sp_rename 'dbo.FK_TblPermohonan_TblPengguna', 'FK__TblPermoh__Pengg__15702A09', 'OBJECT';

-- AddForeignKey
ALTER TABLE [dbo].[TblKumpulan] ADD CONSTRAINT [FK_TblKumpulan_TblPindaan] FOREIGN KEY ([PindaanID]) REFERENCES [dbo].[TblPindaan]([PindaanID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblKumpulan] ADD CONSTRAINT [FK_TblKumpulan_TblRefKehadiran] FOREIGN KEY ([KehadiranID]) REFERENCES [dbo].[TblRefKehadiran]([KehadiranID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblLulus] ADD CONSTRAINT [FK_TblLulus_TblMohon] FOREIGN KEY ([MohonID]) REFERENCES [dbo].[TblPermohonan]([MohonID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblLulus] ADD CONSTRAINT [FK_TblLulus_TblPengguna] FOREIGN KEY ([PelulusID]) REFERENCES [dbo].[TblPengguna]([PenggunaID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblLulus] ADD CONSTRAINT [FK_TblLulus_TblRefTindakan] FOREIGN KEY ([TindakanID]) REFERENCES [dbo].[TblRefTindakan]([TindakanID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblMOF] ADD CONSTRAINT [FK_TblMOF_TblPermohonan] FOREIGN KEY ([MohonID]) REFERENCES [dbo].[TblPermohonan]([MohonID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPengguna] ADD CONSTRAINT [FK_TblPengguna_TblPengguna] FOREIGN KEY ([PenggunaID]) REFERENCES [dbo].[TblPengguna]([PenggunaID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPengguna] ADD CONSTRAINT [FK_TblPengguna_TblRefBahagian] FOREIGN KEY ([BahagianID]) REFERENCES [dbo].[TblRefBahagian]([BahagianID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPengguna] ADD CONSTRAINT [FK_TblPengguna_TblRefCawangan] FOREIGN KEY ([CawanganID]) REFERENCES [dbo].[TblRefCawangan]([CawanganID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPengguna] ADD CONSTRAINT [FK_TblPengguna_TblRefKategoriPengguna] FOREIGN KEY ([KategoriPenggunaID]) REFERENCES [dbo].[TblRefKategoriPengguna]([KategoriPenggunaID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPengguna] ADD CONSTRAINT [FK_TblPengguna_TblRefPeranan] FOREIGN KEY ([PerananID]) REFERENCES [dbo].[TblRefPeranan]([PerananID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPengguna] ADD CONSTRAINT [FK_TblPengguna_TblRefPerkhidmatan] FOREIGN KEY ([PerkhidmatanID]) REFERENCES [dbo].[TblRefPerkhidmatan]([PerkhidmatanID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPengguna] ADD CONSTRAINT [FK_TblPengguna_TblRefStatusPengguna] FOREIGN KEY ([StatusPenggunaID]) REFERENCES [dbo].[TblRefStatusPengguna]([StatusPenggunaID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPeraku] ADD CONSTRAINT [FK_TblPeraku_TblPengguna] FOREIGN KEY ([PerakuID]) REFERENCES [dbo].[TblPengguna]([PenggunaID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPeraku] ADD CONSTRAINT [FK_TblPeraku_TblPermohonan] FOREIGN KEY ([MohonID]) REFERENCES [dbo].[TblPermohonan]([MohonID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPeraku] ADD CONSTRAINT [FK_TblPeraku_TblRefTindakan] FOREIGN KEY ([TindakanID]) REFERENCES [dbo].[TblRefTindakan]([TindakanID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPermohonan] ADD CONSTRAINT [FK_TblPermohonan_TblPindaan] FOREIGN KEY ([PindaanID]) REFERENCES [dbo].[TblPindaan]([PindaanID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPermohonan] ADD CONSTRAINT [FK_TblPermohonan_TblRefJenisKhidmat] FOREIGN KEY ([JenisKhidmatID]) REFERENCES [dbo].[TblRefJenisKhidmat]([JenisKhidmatID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPermohonan] ADD CONSTRAINT [FK_TblPermohonan_TblRefKategoriPeserta] FOREIGN KEY ([KatPesertaID]) REFERENCES [dbo].[TblRefKategoriPeserta]([KatPesertaID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPermohonan] ADD CONSTRAINT [FK_TblPermohonan_TblRefKategoriProgram] FOREIGN KEY ([KategoriProgramID]) REFERENCES [dbo].[TblRefKategoriProgram]([KategoriProgramID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPermohonan] ADD CONSTRAINT [FK_TblPermohonan_TblRefNegara] FOREIGN KEY ([NegaraID]) REFERENCES [dbo].[TblRefNegara]([NegaraID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPermohonan] ADD CONSTRAINT [FK_TblPermohonan_TblRefStatusMohon] FOREIGN KEY ([StatusMohonID]) REFERENCES [dbo].[TblRefStatusMohon]([StatusMohonID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPeruntukan] ADD CONSTRAINT [FK_TblPeruntukan_TblPeruntukan] FOREIGN KEY ([MohonID]) REFERENCES [dbo].[TblPermohonan]([MohonID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblPindaan] ADD CONSTRAINT [FK_TblPindaan_TblRefJenisPinda] FOREIGN KEY ([JenisPindaID]) REFERENCES [dbo].[TblRefJenisPinda]([JenisPindaID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblRefLampiran] ADD CONSTRAINT [FK_TblRefLampiran_TblSenaraiLampiran] FOREIGN KEY ([LampiranID]) REFERENCES [dbo].[TblSenaraiLampiran]([LampiranID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblSemak] ADD CONSTRAINT [FK_TblSemak_TblPengguna] FOREIGN KEY ([PenyemakID]) REFERENCES [dbo].[TblPengguna]([PenggunaID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblSemak] ADD CONSTRAINT [FK_TblSemak_TblRefTindakan] FOREIGN KEY ([TindakanID]) REFERENCES [dbo].[TblRefTindakan]([TindakanID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblSemak] ADD CONSTRAINT [FK_TblSemak_TblSemak] FOREIGN KEY ([MohonID]) REFERENCES [dbo].[TblPermohonan]([MohonID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblSokong] ADD CONSTRAINT [FK_TblSokong_TblPengguna] FOREIGN KEY ([PenyokongID]) REFERENCES [dbo].[TblPengguna]([PenggunaID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblSokong] ADD CONSTRAINT [FK_TblSokong_TblRefTindakan] FOREIGN KEY ([TindakanID]) REFERENCES [dbo].[TblRefTindakan]([TindakanID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TblSokong] ADD CONSTRAINT [FK_TblSokong_TblSokong] FOREIGN KEY ([MohonID]) REFERENCES [dbo].[TblPermohonan]([MohonID]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
