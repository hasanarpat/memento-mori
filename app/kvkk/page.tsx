import LegalLayout from "@/app/legal/LegalLayout";
import { buildPageMetadata } from "@/app/lib/metadata";

export const metadata = buildPageMetadata({
  title: "KVKK Aydınlatma Metni",
  description:
    "6698 sayılı KVKK kapsamında kişisel verilerinizin işlenmesine ilişkin aydınlatma metni. Memento Mori.",
  path: "/kvkk",
  keywords: ["KVKK", "aydınlatma metni", "kişisel veri", "gizlilik", "memento mori"],
});

export default function KvkkPage() {
  return (
    <LegalLayout title="KVKK Aydınlatma Metni" updated="Şubat 2024">
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında, kişisel verileriniz
         Veri Sorumlusu sıfatıyla Memento Mori (“Şirket”) tarafından aşağıda açıklanan çerçevede
         işlenebilecektir.
      </p>
      <h2>1. İşlenen Kişisel Veriler</h2>
      <p>
        Kimlik (ad, soyadı, T.C. kimlik no vb.), iletişim (e-posta, telefon, adres), müşteri işlem
        bilgileri, sipariş ve ödeme bilgileri, çerez ve log kayıtları ile talep ve şikayet
        kapsamında ilettiğiniz verileriniz işlenebilir.
      </p>
      <h2>2. İşleme Amaçları</h2>
      <p>
        Sipariş ve sözleşme süreçlerinin yürütülmesi, müşteri hizmetleri, yasal yükümlülüklerin
        yerine getirilmesi, pazarlama ve iletişim faaliyetleri (açık rıza ile), web sitesi
        güvenliği ve performansının iyileştirilmesi amaçlarıyla işlenebilir.
      </p>
      <h2>3. Veri Aktarımı</h2>
      <p>
        Kişisel verileriniz, yukarıdaki amaçlarla yurt içi ve yurt dışındaki iş ortakları, ödeme
        kuruluşları, kargo firmaları ve hukuken yetkili kamu kurumları ile paylaşılabilir.
      </p>
      <h2>4. Toplama Yöntemi</h2>
      <p>
        Verileriniz, web sitemiz, sipariş formları, e-posta, telefon ve fiziksel kanallar
        aracılığıyla otomatik veya otomatik olmayan yöntemlerle toplanabilir.
      </p>
      <h2>5. Haklarınız</h2>
      <p>
        KVKK md. 11 uyarınca kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse
        buna ilişkin bilgi talep etme, işlenme amacını ve amaca uygun kullanılıp kullanılmadığını
        öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya
        yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme,
        otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun
        ortaya çıkmasına itiraz etme ve kanuna aykırı işlenmesi sebebiyle zarara uğramanız
        hâlinde tazminat talep etme haklarına sahipsiniz. Başvurularınızı veri sorumlusuna
        yazılı veya kayıtlı elektronik ortamdan iletebilirsiniz.
      </p>
      <p className="legal-contact">
        İletişim: <a href="/contact">İletişim</a> sayfamızdan bize ulaşabilirsiniz.
      </p>
    </LegalLayout>
  );
}
