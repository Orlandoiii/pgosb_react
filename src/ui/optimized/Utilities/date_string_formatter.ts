export function formatDateString(date: Date) {
    const year = date.getFullYear().toString().padStart(4, "0")
    const month = date.getMonth().toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")

    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")

    return `${year}'-'${month}'-'${day} ${hours}:${minutes}:${seconds}`

    return date.toLocaleString('es-VE', { timeZone: 'America/Caracas', hour12: false }).replace(',', '').replace('/', '-').replace('/', '-')
}

export function parseDateString(dateString: string): Date {
    const parts = dateString.split(' ');
    if (parts.length !== 2) return new Date(2024, 1, 1, 0, 0, 0);// Invalid format

    const dateParts = parts[0].split('-');
    const timeParts = parts[1].split(':');

    if (dateParts.length !== 3 || timeParts.length !== 3) new Date(2024, 1, 1, 0, 0, 0); // Invalid format

    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(dateParts[2], 10);
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);

    return new Date(year, month, day, hours, minutes, seconds);
}