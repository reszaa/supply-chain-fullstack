
export const calculatePOFinance = (po) => {
    let subtotal = 0
    if (po.daftar_item && po.daftar_item.length > 0) {
        po.daftar_item.forEach(item => {
            subtotal += (parseFloat(item.total_unit || 0) * parseFloat(item.harga_satuan || 0))
        })
    }

    const ppn = subtotal * 0.11
    const grandTotal = subtotal + ppn

    let totalTerbayar = 0
    if (po.riwayat_pembayaran && po.riwayat_pembayaran.length > 0) {
        po.riwayat_pembayaran.forEach(bayar => {
            totalTerbayar += parseFloat(bayar.nominal_dibayar || 0)
        })
    }


    const sisaTagihan = grandTotal - totalTerbayar
    let status = 'Unpaid'
    if (totalTerbayar >= grandTotal && grandTotal > 0) {
        status = 'Paid'
    } else if (totalTerbayar > 0 && sisaTagihan > 0) {
        status = 'Partial'
    } else {
        if (po.tanggal_jatuh_tempo) {
            const today = new Date()
            const due = new Date(po.tanggal_jatuh_tempo)
            if (today > due) {
                status = 'Overdue'
            }
        }
    }

    return {
        subtotal,
        grandTotal,
        totalTerbayar,
        sisaTagihan,
        status
    }
}