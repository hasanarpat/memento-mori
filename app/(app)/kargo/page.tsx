import LegalLayout from '@/app/(app)/legal/LegalLayout';
import Link from 'next/link';
import { buildPageMetadata } from '@/app/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Kargo ve Teslimat',
  description:
    'Memento Mori kargo ve teslimat. Süreler, ücretler, takip. Ücretsiz kargo fırsatları.',
  path: '/kargo',
  keywords: [
    'kargo',
    'teslimat',
    'gönderi süresi',
    'ücretsiz kargo',
    'memento mori',
  ],
});

export default function KargoPage() {
  return (
    <LegalLayout title='Kargo ve Teslimat' updated='Şubat 2024'>
      <p>
        Siparişiniz, seçtiğiniz kargo seçeneğine ve teslimat adresine göre
        güvenli şekilde size ulaştırılır. Aşağıda teslimat süreleri, ücretler ve
        takip bilgileri yer almaktadır.
      </p>
      <h2>1. Teslimat Süreleri</h2>
      <p>
        Siparişiniz onaylandıktan ve ödemeniz alındıktan sonra{' '}
        <strong>1–2 iş günü</strong> içinde kargoya verilir. Standart teslimat
        süresi <strong>5–7 iş günü</strong>dür (adrese göre değişiklik
        gösterebilir). Express seçeneği ile daha kısa süreler sunulmaktadır;
        ödeme sayfasında güncel seçenekler görüntülenir.
      </p>
      <h2>2. Kargo Ücretleri</h2>
      <p>
        Belirli tutarın üzerindeki siparişlerde (ör. 500 TL ve üzeri) standart
        kargo ücretsizdir. Altındaki siparişlerde kargo ücreti sepette ve ödeme
        sayfasında gösterilir. Express ve kapıda ödeme seçeneklerinde ek ücret
        uygulanabilir.
      </p>
      <h2>3. Teslimat Adresi ve Takip</h2>
      <p>
        Sipariş verirken girdiğiniz adresin eksiksiz ve doğru olması önemlidir.
        Kargo firması tarafından size iletilen takip numarası ile kargoyu takip
        edebilirsiniz. Takip linki sipariş onay e-postanızda da yer alır.
      </p>
      <h2>4. Teslim Alma ve Kontrol</h2>
      <p>
        Kargo teslim edilirken paketin hasarlı veya ıslak görünmesi halinde
        tutanak tutturmanızı öneririz. Teslim aldıktan sonra hasar veya ürün
        hatası tespit ederseniz{' '}
        <Link href='/iade-degisim'>İade ve Değişim</Link> sayfamızdaki süreci
        takip ederek bize bildirin.
      </p>
      <h2>5. Yurt Dışı Teslimat</h2>
      <p>
        Şu an yurt içi teslimat yapılmaktadır. Yurt dışı gönderim talepleri için
        <Link href='/contact'> iletişim</Link> sayfamızdan bilgi alabilirsiniz.
      </p>
      <p className='legal-contact'>
        Kargo ile ilgili sorularınız için <Link href='/contact'>İletişim</Link>{' '}
        sayfamızı kullanabilirsiniz.
      </p>
    </LegalLayout>
  );
}
