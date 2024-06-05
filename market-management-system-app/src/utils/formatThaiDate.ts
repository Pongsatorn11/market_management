export function formatDateThai(date: Date | string): string {
    const monthsThai = [
        'ม.ค', 'ก.พ', 'มี.ค', 'ม.ย', 'พ.ค', 'มิ.ย',
        'ก.ค', 'ส.ค', 'ก.ย', 'ต.ค', 'พ.ย', 'ธ.ค'
    ];

    // const FullnameMonthsThai =[
    //     'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    //     'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    // ];

    if (typeof date === 'string') {
        date = new Date(date);
    }

    const day = date.getDate();
    const month = monthsThai[date.getMonth()];
    const year = date.getFullYear() + 543;

    return `${day} ${month} ${year}`;
}