import LegalLayout from '@/app/(app)/legal/LegalLayout';
import Link from 'next/link';
import { buildPageMetadata } from '@/app/lib/metadata';

export const metadata = buildPageMetadata({
  title: 'Gizlilik Politikası',
  description:
    'Memento Mori gizlilik politikası. Kişisel verilerin toplanması, kullanımı ve korunması. Çerezler ve haklarınız.',
  path: '/gizlilik-politikasi',
  keywords: [
    'gizlilik politikası',
    'kişisel veri',
    'çerez',
    'KVKK',
    'memento mori',
  ],
});

export default function GizlilikPolitikasiPage() {
  return (
    <LegalLayout title='Gizlilik Politikası' updated='Şubat 2024'>
      <p>
        Memento Mori olarak gizliliğinize saygı duyuyoruz. Bu politika, web
        sitemizi ve hizmetlerimizi kullanırken kişisel verilerinizin nasıl
        toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.
      </p>
      <h2>1. Topladığımız Bilgiler</h2>
      <p>
        Hesap oluşturma, sipariş verme, bülten aboneliği ve iletişim formu
        aracılığıyla ad, e-posta, adres, telefon numarası ve ödeme bilgileri
        gibi verileri toplayabiliriz. Ziyaret sırasında çerezler ve benzeri
        teknolojilerle teknik veriler (IP adresi, tarayıcı türü, cihaz bilgisi)
        de toplanabilir.
      </p>
      <h2>2. Kullanım Amaçları</h2>
      <p>
        Toplanan veriler siparişlerinizi işlemek, müşteri hizmeti sunmak, web
        sitesi güvenliğini ve deneyimini iyileştirmek, yasal yükümlülükleri
        yerine getirmek ve (onayınız dahilinde) kampanya ve bülten göndermek
        için kullanılır.
      </p>
      <h2>3. Veri Paylaşımı</h2>
      <p>
        Ödeme işlemcileri, kargo firmaları ve hizmet sağlayıcılarımızla yalnızca
        hizmet sunumu için gerekli ölçüde paylaşım yapılır. Verileriniz satış
        amacıyla üçüncü taraflara devredilmez.
      </p>
      <h2>4. Çerezler</h2>
      <p>
        Sitemiz, oturum yönetimi, tercihlerinizi hatırlama ve site analizi için
        çerez kullanabilir. Tarayıcı ayarlarınızdan çerezleri
        kısıtlayabilirsiniz; bu durumda bazı özellikler kısıtlanabilir.
      </p>
      <h2>5. Güvenlik ve Saklama</h2>
      <p>
        Verileriniz teknik ve idari tedbirlerle korunur. Yasal saklama süreleri
        ve işleme amaçları gerektirdiği sürece muhafaza edilir; sonrasında
        silinir veya anonimleştirilir.
      </p>
      <h2>6. Haklarınız</h2>
      <p>
        KVKK kapsamında erişim, düzeltme, silme ve itiraz haklarınızı kullanmak
        için
        <Link href='/contact'> iletişim</Link> sayfamızdan bize yazabilirsiniz.
        Ayrıntılı bilgi için <Link href='/kvkk'>KVKK Aydınlatma Metni</Link>ni
        inceleyebilirsiniz.
      </p>
    </LegalLayout>
  );
}
