export function generateWaLink({
  phone,
  userName,
  date,
  time,
  serviceName,
}: {
  phone: string;
  userName: string;
  date: string;
  time: string;
  serviceName: string;
}) {
  const text = `
Halo Kak, saya ingin konfirmasi pembayaran booking:

Nama: ${userName}
Tanggal: ${date}
Jam: ${time}
Treatment: ${serviceName}
Status DP : Lunas sebesar Rp. 50.000
  `.trim();

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
