import LegalLayout from "@/app/legal/LegalLayout";
import Link from "next/link";

export const metadata = {
  title: "Kullanım Koşulları | Memento Mori",
  description: "Memento Mori web sitesi ve hizmet kullanım koşulları.",
};

export default function KullanimKosullariPage() {
  return (
    <LegalLayout title="Kullanım Koşulları" updated="Şubat 2024">
      <p>
        Memento Mori web sitesini ve ilgili hizmetleri kullanarak bu koşulları kabul
         etmiş sayılırsınız. Lütfen dikkatlice okuyunuz.
      </p>
      <h2>1. Hizmet Tanımı</h2>
      <p>
        Sitemiz üzerinden ürün inceleme, sipariş verme, hesap oluşturma, bülten aboneliği
        ve iletişim formu kullanımı gibi hizmetler sunulmaktadır. Hizmet kapsamı önceden
        bildirim yapılmaksızın güncellenebilir.
      </p>
      <h2>2. Hesap ve Sorumluluk</h2>
      <p>
        Hesap oluşturduğunuzda bilgilerinizin doğru ve güncel olmasından siz sorumlusunuz.
        Hesap güvenliğinizi sağlamak ve yetkisiz kullanımı bildirmek sizin yükümlülüğünüzdür.
      </p>
      <h2>3. Kullanım Kuralları</h2>
      <p>
        Siteyi yasalara, bu koşullara ve üçüncü kişi haklarına aykırı şekilde kullanmak,
        zararlı yazılım yaymak, sistemlere yetkisiz erişim denemek veya başkalarının
        deneyimini bozmak yasaktır. İhlal durumunda hesap kapatılabilir ve hukuki
        yollara başvurulabilir.
      </p>
      <h2>4. Fikri Mülkiyet</h2>
      <p>
        Sitedeki metin, görsel, logo ve tasarımlar Memento Mori veya lisans verenlerine
        aittir. İzinsiz kopyalama, dağıtma veya ticari kullanım yasaktır.
      </p>
      <h2>5. Sipariş ve Ödeme</h2>
      <p>
        Siparişler, ödeme onayı ve stok durumuna göre kabul edilir. Fiyat ve kargo
        bilgileri sipariş anındaki koşullara göre geçerlidir. Detaylar için
        <Link href="/iade-degisim"> İade ve Değişim</Link> ile
        <Link href="/kargo"> Kargo ve Teslimat</Link> sayfalarına bakınız.
      </p>
      <h2>6. Sınırlama ve Uygulanacak Hukuk</h2>
      <p>
        Yürürlük kanunlarının izin verdiği ölçüde, hizmetler “olduğu gibi” sunulur.
        Türkiye Cumhuriyeti kanunları uygulanır; uyuşmazlıklarda yetkili mahkemeler
        Türkiye mahkemeleridir.
      </p>
      <p className="legal-contact">
        Sorularınız için <Link href="/contact">İletişim</Link> sayfamızı kullanabilirsiniz.
      </p>
    </LegalLayout>
  );
}
