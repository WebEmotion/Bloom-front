export const generateVoucher = () => {
    const date = new Date()
    const year = `${date.getFullYear()}`.substring(2)
    const month = `${date.getMonth() + 1}`.padStart(2, '0')
    const day = `${date.getDate()}`.padStart(2, '0')
    const hour = date.getHours()
    const fh = `${hour}`.padStart(2, '0')
    const f1 = `${year}${month}${day}`
    const minutes = date.getMinutes()
    const fm = `${minutes}`.padStart(2, '0')
    const seconds = date.getSeconds()
    const fs = `${seconds}`.padStart(2, '')
    const f2 = `${fh}${fm}${fs}`
    return `${f1}-${f2}`
}

export const getHoursAndMinutes = minutes => {
    const hours = parseInt(parseInt(minutes)/60)
    const mins = minutes % 60
    if (mins !== 0) {
        return `${hours} hora(s) y ${mins} minuto(s)`
    }
    return `${hours} hora(s)`
}