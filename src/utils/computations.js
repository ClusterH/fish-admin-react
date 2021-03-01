export const getDateTimeByISOFormat = (date) => {
    const d = new Date(date);

    const newDate = [
        d.getFullYear(),
        ('0' + (d.getMonth() + 1)).slice(-2),
        ('0' + d.getDate()).slice(-2)
    ].join('-');

    const newTime = [
        ('0' + (d.getHours())).slice(-2),
        ('0' + (d.getMinutes())).slice(-2),
        ('0' + (d.getSeconds())).slice(-2),
    ].join(':');

    return [newDate, newTime].join('T');
}

export const getDateByISOFormat = (date) => {
    const d = new Date(date);

    return [
        d.getFullYear(),
        ('0' + (d.getMonth() + 1)).slice(-2),
        ('0' + d.getDate()).slice(-2)
    ].join('-');
}

export const getStatus = (start, end) => {
    const now = (new Date()).getTime();
    const st = (new Date(start.toLocaleString())).getTime();
    const en = (new Date(end.toLocaleString())).getTime();

    if (now > en) {
        return 1; // ended
    } else if (now >= st) {
        return 2; // processing
    } else {
        return 3; // will process
    }
}

export const setBreadcrumbs = (path) => {
    // console.log(path.split("/")[1])
    const data = path.split("/")[1];
}
