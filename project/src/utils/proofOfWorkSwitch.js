const moment = require('moment')

const minutesToHours = minutes => {
    let hours = Math.floor(minutes / 60);
    let minutesRemaining = minutes % 60;
    return `${hours.toString().padStart(2, '0')}H ${minutesRemaining.toString().padStart(2, '0')}M`;
}

module.exports = (key, value, language) => {
    let switchValue = value
    switch (key) {
        case 'status' :
            switchValue = value === 1 ? 'İş Başlatıldı' : value === 2 ? 'İş Molada' : value === 3 ? '' : value === 4 ? 'İş Tamamlandı' : 'Bilinmiyor';
            break;
        case 'totalMinutes' :
            switchValue = minutesToHours(value);
            break;
        case 'totalHalfMinutes' :
            switchValue = minutesToHours(value);
            break;
        case 'totalWorkMinutes' :
            switchValue = minutesToHours(value);
            break;
        case 'startDate' :
            switchValue = moment(value).add('hours', 1).format('DD.MM.YYYY HH:mm')
            break;
        case 'endDate' :
            switchValue = moment(value).add('hours', 1).format('DD.MM.YYYY HH:mm')
            break;
    }

    return switchValue
}