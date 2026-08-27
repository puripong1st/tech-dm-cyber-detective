# SEO audit and redesign requirements (2026-08-23)

## ข้อค้นพบสำคัญ

1. หน้าแรกมี title, description, canonical, robots directives, sitemap และ verification แล้ว พื้นฐานการ crawl ไม่ได้ขาดทั้งหมด
2. หน้าแรกยาวและทำหลายหน้าที่เกินไป: product hub + documentation + law reference + FAQ ส่งผลให้ intent ของหน้าไม่คม และผู้ใช้ต้องผ่านลิงก์ 58 จุด/หัวข้อ 36 หัวข้อ
3. `meta keywords` ปัจจุบันยาวแต่ Google Search ไม่ใช้เพื่อ indexing หรือ ranking ควรถอดออกเพื่อลดความเข้าใจผิดในการดูแล SEO
4. title ปัจจุบันมีรายละเอียดมากเกินไป ควรย่อให้คำค้นหลักและแบรนด์อ่านจบง่าย เช่น `เกม พ.ร.บ.คอมพิวเตอร์และ PDPA สำหรับ ม.3 | Cyber Shield Detective`
5. meta description ปัจจุบันพยายามบรรจุทุกฟีเจอร์ ควรเขียนเป็นคำเชิญที่ตรง intent และเป็นภาษาคน
6. JSON-LD BreadcrumbList ปัจจุบันสร้างลำดับหลายหน้าเหมือนทุกเครื่องมือเป็น breadcrumb ต่อกัน ทั้งที่หน้าเหล่านั้นเป็นพี่น้องใน hub นี่ไม่ใช่โครงสร้าง breadcrumb ที่ถูกต้อง ควรเอาออกจาก homepage
7. FAQPage schema ตรงกับ FAQ ที่มองเห็น แต่ Google จำกัด FAQ rich results ไว้กับเว็บไซต์รัฐบาลและสุขภาพที่มีอำนาจเป็นหลัก จึงไม่ควรถือเป็นยุทธศาสตร์อันดับต้น ๆ จะเก็บ FAQ visible เพื่อผู้ใช้ได้แต่ schema ไม่จำเป็น
8. `EducationalOrganization` ต้องมีหลักฐานว่าองค์กรดังกล่าวมีตัวตนตามชื่อ หากเป็นเพียงทีมโครงการควรใช้ `Organization` ที่ระบุข้อมูลจริง หรือคงเฉพาะ `WebSite` จนกว่าจะมีหน้า About/ผู้จัดทำชัดเจน
9. `og:image` ใช้ favicon สี่เหลี่ยมขนาดเล็ก ไม่เหมาะกับ social share ควรมีภาพ 1200×630 ที่เป็นตัวแทนหน้าเว็บในรอบ production
10. หน้าแรกมี Font Awesome จาก CDN และ Google Fonts สองครอบครัว แม้โหลดแบบ non-blocking แต่ยังเพิ่ม dependency; การออกแบบใหม่ควรลดหรือเลิก Font Awesome และใช้ฟอนต์ไทยเท่าที่จำเป็น
11. Sitemap มี lastmod แบบคงที่และทุกหน้าระบุ changefreq/priority ซึ่ง Google อาจไม่ใช้เป็นหลัก สิ่งสำคัญกว่าคือ lastmod ต้องสะท้อนการเปลี่ยนสาระจริง และส่ง sitemap/ตรวจ URL ผ่าน Search Console
12. robots.txt บล็อกหน้า teacher tools ซึ่งสมเหตุผลด้านความเป็นส่วนตัว แต่หน้าแรกยังลิงก์ไปหลายหน้าที่ไม่ต้องการ index; ลิงก์สำหรับครูควรจัดเป็น utilities และตรวจว่าการบล็อกสอดคล้องกับเป้าหมายทางธุรกิจ
13. หน้าแรกยังขาดหน้า/ส่วนที่สร้าง trust: ผู้เขียนหรือผู้ตรวจทาน, เกี่ยวกับโครงการ, แหล่งอ้างอิงกฎหมาย, วันที่ตรวจสอบสาระ และวิธีรายงานข้อผิดพลาด ทั้งหมดสำคัญกว่าการเพิ่มคำค้นซ้ำ โดยเฉพาะเนื้อหากฎหมาย

## เป้าหมายหน้าแรกใหม่

- หน้าแรกควรจัดอันดับความตั้งใจค้นหลักหนึ่งเรื่อง: “เกมและสื่อการสอน พ.ร.บ.คอมพิวเตอร์/PDPA สำหรับ ม.3”
- keyword clusters รองควรลงหน้าปลายทางเฉพาะ: เกม พ.ร.บ.คอมพิวเตอร์ → หน้าเกมหลัก; สไลด์ พ.ร.บ.คอมพิวเตอร์ → `presentation.html`; สื่อ PDPA ม.3 → `pdpa_presentation.html`; ใบงาน PDPA → `pdpa_assignment_board.html`
- คงเนื้อหาความรู้สั้นที่ช่วยตอบ “เว็บไซต์นี้เกี่ยวกับอะไร” แล้วลิงก์ไปเนื้อหาลึก อย่านำสาระ 12 มาตราเต็มชุดมาชนกับ product navigation
- เพิ่ม internal links แบบอธิบายปลายทางและเส้นทางสอน 3 ขั้น
- สร้างหน้า About/Editorial policy/References ในรอบ production หากผู้ใช้ให้ข้อมูลผู้จัดทำและแหล่งอ้างอิงที่แม่นยำ
- วัดผลจริงใน Search Console: indexed pages, queries, CTR, average position และ Core Web Vitals; ไม่มีการแก้ HTML ครั้งเดียวที่รับประกันอันดับท็อป

## เกณฑ์เทคนิคสำหรับต้นแบบและรอบ production

- H1 เดียวและลำดับ heading ไม่ข้ามอย่างไม่มีเหตุผล
- HTML links ใช้งานได้แม้ JavaScript ปิด
- mobile-first 390px, tap target 44px, focus visible, contrast ระดับใช้งานจริง
- LCP target ไม่เกิน 2.5s, INP ต่ำกว่า 200ms, CLS ต่ำกว่า 0.1 ตามแนวทาง Google แต่ต้องวัด field data หลัง deploy
- ลดภาพเหนือรอยพับ; หากใช้โลโก้กำหนด width/height; lazy-load ภาพนอกจอ
- structured data ต้องสะท้อน main content ที่ผู้ใช้มองเห็นและต้องผ่าน Rich Results Test/Schema validator
- หลังเลือก direction และนำไปใช้จริง ควรตรวจ Lighthouse/PageSpeed, Search Console URL Inspection, sitemap response, canonical และ 404 links
