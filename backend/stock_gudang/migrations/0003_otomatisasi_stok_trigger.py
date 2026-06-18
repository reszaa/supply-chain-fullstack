from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [

        ('stock_gudang', '0002_masterstokgudang'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
            -- 1. MEMBUAT MESIN FUNGSI (STORED PROCEDURE)
            CREATE OR REPLACE FUNCTION update_stok_master_gudang()
            RETURNS TRIGGER AS $$
            BEGIN
                -- Jika ada data transaksi PACKAGING BARU (Masuk Gudang)
                IF TG_OP = 'INSERT' THEN
                    -- Logika UPSERT (Jika barang belum ada di master, buat baru. Jika ada, tambahkan stoknya)
                    INSERT INTO master_stok_gudang (sku, nama_item, akun_entitas, total_stok_aktual, batas_minimum)
                    VALUES (NEW.name_item, NEW.name_item, NEW.akun_entitas, NEW.total_akumulasi, 10)
                    ON CONFLICT (sku) DO UPDATE 
                    SET total_stok_aktual = master_stok_gudang.total_stok_aktual + EXCLUDED.total_stok_aktual;
                    
                    RETURN NEW;
                
                -- Jika ada data transaksi yang DIHAPUS (Batal Masuk)
                ELSIF TG_OP = 'DELETE' THEN
                    UPDATE master_stok_gudang
                    SET total_stok_aktual = total_stok_aktual - OLD.total_akumulasi
                    WHERE sku = OLD.name_item;
                    RETURN OLD;
                
                -- Jika ada data transaksi yang DIEDIT (Koreksi Jumlah)
                ELSIF TG_OP = 'UPDATE' THEN
                    UPDATE master_stok_gudang
                    SET total_stok_aktual = total_stok_aktual - OLD.total_akumulasi + NEW.total_akumulasi
                    WHERE sku = NEW.name_item;
                    RETURN NEW;
                END IF;
                RETURN NULL;
            END;
            $$ LANGUAGE plpgsql;

            -- 2. MEMASANG PELATUK (TRIGGER) KE TABEL TRANSAKSI
            DROP TRIGGER IF EXISTS trigger_packaging_stok ON transaksi_packaging_gudang;
            CREATE TRIGGER trigger_packaging_stok
            AFTER INSERT OR UPDATE OR DELETE ON transaksi_packaging_gudang
            FOR EACH ROW EXECUTE FUNCTION update_stok_master_gudang();
            """,
            reverse_sql="""
            DROP TRIGGER IF EXISTS trigger_packaging_stok ON transaksi_packaging_gudang;
            DROP FUNCTION IF EXISTS update_stok_master_gudang();
            """
        )
    ]