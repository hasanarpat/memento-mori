import LegalLayout from '@/app/(app)/legal/LegalLayout';
import Link from 'next/link';
import { buildPageMetadata } from '@/app/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'İade ve Değişim',
  description:
    'Memento Mori iade ve değişim koşulları. 30 gün içinde iade, süreç ve kargo. Cayma hakkı.',
  path: '/iade-degisim',
  keywords: [
    'iade',
    'değişim',
    'iade koşulları',
    'cayma hakkı',
    'memento mori',
  ],
});

export default function IadeDegisimPage() {
  return (
    <LegalLayout title='İade ve Değişim' updated='Şubat 2024'>
      <p>
        Memento Mori olarak alışverişinizin güvenle tamamlanmasını ve
        memnuniyetinizi ön planda tutuyoruz. Aşağıdaki koşullar çerçevesinde
        iade ve değişim kabul edilmektedir.
      </p>
      <h2>1. İade / Değişim Süresi</h2>
      <p>
        Ürünü teslim aldığınız tarihten itibaren <strong>30 gün</strong> içinde
        iade veya değişim talebinde bulunabilirsiniz. Bu süre, 6502 sayılı
        Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği
        kapsamındaki yasal haklarınızı tamamlar.
      </p>
      <h2>2. Koşullar</h2>
      <p>
        İade veya değişim için ürünün kullanılmamış, etiketleri ve orijinal
        ambalajı yerinde olmalıdır. Kişisel hijyen ve kozmetik ürünlerde yasal
        istisnalar uygulanabilir. Aksesuar ve takılarımızda kullanım izi
        olmamalıdır.
      </p>
      <h2>3. Nasıl İade / Değişim Yapılır?</h2>
      <p>
        <strong>Adım 1:</strong> <Link href='/contact'>İletişim</Link> veya
        hesabınız üzerinden iade/değişim talebini bildirin; sipariş numaranızı
        ve ürün bilgisini belirtin.
        <br />
        <strong>Adım 2:</strong> Onay sonrası size iletilen iade kargo bilgisi
        veya kargo etiketini kullanarak ürünü bize ulaştırın.
        <br />
        <strong>Adım 3:</strong> Ürün kontrolümüzde uygun bulunduğunda ödeme,
        aynı ödeme yönteminize iade edilir veya değişim ürünü kargoya verilir.
      </p>
      <h2>4. Kargo Ücreti</h2>
      <p>
        Cayma hakkı kapsamındaki iadelerde, ürün bedeli iade edilir. Yasal
        düzenlemelere uygun olarak kargo ücreti iadeye dahil edilmeyebilir;
        değişimde ikinci kargo ücreti tarafınıza ait olabilir. Detaylar
        talebiniz sırasında bildirilir.
      </p>
      <h2>5. Hasarlı veya Hatalı Ürün</h2>
      <p>
        Teslimatta hasarlı veya hatalı ürün tespit ederseniz, kargo tutanağını
        düzenleyerek teslim almayı reddedebilir veya teslim aldıktan sonra en
        kısa sürede bize bildirin. Bu durumda kargo ücreti tarafımızdan
        karşılanır ve ürün yenisiyle değiştirilir veya bedeli iade edilir.
      </p>
      <p className='legal-contact'>
        Sorularınız için <Link href='/contact'>İletişim</Link> sayfamızdan bize
        ulaşın.
      </p>
    </LegalLayout>
  );
}
