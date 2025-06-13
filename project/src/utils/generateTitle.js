module.exports = async (list, object = false, isStatic = false) => {
    const titles = [
        {
            name: 'Statü',
            key: 'status'
        },
        {
            name: 'Personel',
            key: 'personName'
        },
        {
            name: 'Plaka',
            key: 'plate'
        },
        {
            name: 'Çalışma Numarası',
            key: 'workNumber'
        },
        {
            name: 'İş Saati',
            key: 'totalMinutes'
        },
        {
            name: 'Mola Saati',
            key: 'totalHalfMinutes'
        },
        {
            name: 'Çalışma Saati',
            key: 'totalWorkMinutes'
        },
        {
            name: 'Başlangıç Zamanı',
            key: 'startDate'
        },
        {
            name: 'Bitiş Zamanı',
            key: 'endDate'
        },
        {
            name: 'Partner',
            key: 'partner.name'
        },
        {
            name: 'Bölge',
            key: 'region.name'
        },
        {
            name: 'Kondisyon',
            key: 'condition.name'
        }
    ]

    if (isStatic) {
        return titles
    }

    list.forEach(item => {
        item.workValues.forEach(work => {
            const name = work.attribute?.name
            if (name) {
                const isSome = titles.some(x => x.name === name)
                if (!isSome) {
                    titles.push({
                        name: name,
                        key: 'workValues'
                    })
                }
            }
        })
    })

    let returnTitles = []
    if (!object) {
        titles.forEach(i => {
            returnTitles.push(i.name)
        })
    } else {
        returnTitles = titles
    }

    return returnTitles
}